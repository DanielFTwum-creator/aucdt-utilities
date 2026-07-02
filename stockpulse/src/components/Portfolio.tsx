import React, { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, Download, TrendingUp, Link2 } from 'lucide-react';
import type { PortfolioSummary as PortfolioSummaryType, User } from '../types';
import PortfolioSummaryCards from './Portfolio/PortfolioSummary';
import HoldingsTable from './Portfolio/HoldingsTable';
import AllocationChart from './Portfolio/AllocationChart';
import PerformanceChart from './Portfolio/PerformanceChart';
import MetricsPanel from './Portfolio/MetricsPanel';
import DividendLog from './Portfolio/DividendLog';
import { exportPortfolioCsv } from '../utils/exportCsv';
import { generateStatement } from '../utils/pdfGenerator';
import BrokerSyncModal from './Portfolio/BrokerSyncModal';

type Tab = 'holdings' | 'performance' | 'dividends';
interface Props {
  user: User | null;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
  onLoginClick: () => void;
}

interface AddForm {
  ticker: string;
  shares: string;
  purchase_price: string;
  purchase_date: string;
}

interface RawPosition {
  id: number;
  ticker: string;
  shares: number;
  purchase_price: number;
  purchase_date: string;
  notes?: string;
}

export default function Portfolio({ user, authFetch, onLoginClick }: Props) {
  const [summary, setSummary] = useState<PortfolioSummaryType | null>(null);
  const [rawPositions, setRawPositions] = useState<RawPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showBrokerSync, setShowBrokerSync] = useState(false);
  const [tab, setTab] = useState<Tab>('holdings');
  const [form, setForm] = useState<AddForm>({
    ticker: '',
    shares: '',
    purchase_price: '',
    purchase_date: new Date().toISOString().slice(0, 10),
  });

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [summaryR, posR] = await Promise.all([
        authFetch('/api/portfolio/summary'),
        authFetch('/api/portfolio'),
      ]);
      if (summaryR.ok) setSummary(await summaryR.json());
      if (posR.ok) setRawPositions(await posR.json());
    } finally {
      setLoading(false);
    }
  }, [user, authFetch]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const exportPdf = async () => {
    if (!summary || !user) return;
    try {
      setIsExporting(true);
      document.body.classList.add('pdf-export-mode');
      await generateStatement(summary, user, 'allocation-chart', 'performance-chart');
    } catch (err) {
      console.error('Failed to export PDF', err);
    } finally {
      document.body.classList.remove('pdf-export-mode');
      setIsExporting(false);
    }
  };

  const addPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await authFetch('/api/portfolio/position', {
      method: 'POST',
      body: JSON.stringify({
        ticker: form.ticker.toUpperCase(),
        shares: parseFloat(form.shares),
        purchase_price: parseFloat(form.purchase_price),
        purchase_date: form.purchase_date,
      }),
    });
    if (r.ok) {
      setShowAdd(false);
      setForm({ ticker: '', shares: '', purchase_price: '', purchase_date: new Date().toISOString().slice(0, 10) });
      fetchData();
    }
  };

  const deletePosition = async (id: number) => {
    await authFetch(`/api/portfolio/position/${id}`, { method: 'DELETE' });
    fetchData();
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <TrendingUp size={48} className="text-indigo-200 dark:text-indigo-800 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Track your real portfolio</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-sm">
          Sign in to log positions, track P&amp;L, and analyse allocation.
        </p>
        <button
          type="button"
          onClick={onLoginClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm"
        >
          Sign in free
        </button>
      </div>
    );
  }

  const hasPositions = (summary?.positions.length ?? 0) > 0;
  const connectedBroker = rawPositions.find(p => p.notes?.startsWith('Imported from '))?.notes?.replace('Imported from ', '');

  return (
    <div className="p-6 max-w-6xl mx-auto" id="portfolio-dashboard-content">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio</h1>
        <div className="flex gap-2 no-export">
          <button
            type="button"
            onClick={fetchData}
            aria-label="Refresh portfolio"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          {hasPositions && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => exportPortfolioCsv(summary!.positions)}
                aria-label="Export portfolio as CSV"
                className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Download size={14} />
                CSV
              </button>
              <button
                type="button"
                onClick={exportPdf}
                disabled={isExporting}
                aria-label="Export portfolio as PDF"
                className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isExporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                PDF
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowBrokerSync(true)}
            className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              connectedBroker 
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50' 
                : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'
            }`}
          >
            <Link2 size={15} /> {connectedBroker ? `${connectedBroker} Connected` : 'Connect Broker'}
          </button>
          <button
            type="button"
            onClick={() => setShowAdd(s => !s)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-3 py-1.5 rounded-lg"
          >
            <Plus size={15} /> Add Position
          </button>
        </div>
      </div>

      <div>

      {/* Summary cards */}
      {summary && <PortfolioSummaryCards summary={summary} />}

      {/* Add position form */}
      {showAdd && (
        <form
          onSubmit={addPosition}
          className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 mb-6"
          aria-label="Add position form"
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Add Position</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['ticker', 'shares', 'purchase_price', 'purchase_date'] as const).map(field => (
              <div key={field}>
                <label
                  htmlFor={`pos-${field}`}
                  className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
                >
                  {field.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
                </label>
                <input
                  id={`pos-${field}`}
                  type={field === 'purchase_date' ? 'date' : field === 'ticker' ? 'text' : 'number'}
                  step={field !== 'ticker' && field !== 'purchase_date' ? '0.0001' : undefined}
                  value={form[field]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  required
                  placeholder={field === 'ticker' ? 'AAPL' : field === 'shares' ? '10' : '150.00'}
                  className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="text-gray-500 dark:text-gray-400 text-sm px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Empty state */}
      {!hasPositions && !loading && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <p className="text-lg mb-2">No positions yet.</p>
          <p className="text-sm">Click "Add Position" to log your first holding.</p>
        </div>
      )}

      {/* Tab bar */}
      {hasPositions && (
        <div className="flex gap-1 mb-5 border-b border-gray-200 dark:border-gray-800" role="tablist">
          {([
            { id: 'holdings', label: 'Holdings' },
            { id: 'performance', label: 'Performance' },
            { id: 'dividends', label: 'Dividends' },
          ] as { id: Tab; label: string }[]).map(t => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id ? 'true' : 'false'}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                tab === t.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Tab panels */}
      {hasPositions && summary && tab === 'holdings' && (
        <div className="space-y-5">
          <HoldingsTable
            positions={summary.positions}
            rawPositions={rawPositions}
            onDelete={deletePosition}
          />
          <AllocationChart positions={summary.positions} />
        </div>
      )}

      {hasPositions && tab === 'performance' && (
        <div className="space-y-5">
          <PerformanceChart authFetch={authFetch} />
          <MetricsPanel authFetch={authFetch} />
        </div>
      )}

      {hasPositions && tab === 'dividends' && (
        <DividendLog authFetch={authFetch} />
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
        Prices from Yahoo Finance · 15-min delay · Not investment advice
      </p>
      </div>

      {showBrokerSync && (
        <BrokerSyncModal
          authFetch={authFetch}
          onClose={() => setShowBrokerSync(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
