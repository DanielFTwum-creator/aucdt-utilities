import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Bell, BellOff, Crown } from 'lucide-react';
import type { Alert, User } from '../types';
import { TIER_LIMITS } from '../types';

interface Props { user: User | null; authFetch: (url: string, options?: RequestInit) => Promise<Response>; onLoginClick: () => void; onUpgrade: () => void; }

export default function AlertsPanel({ user, authFetch, onLoginClick, onUpgrade }: Props) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [form, setForm] = useState({ ticker: '', condition: 'above', target_value: '', alert_type: 'price' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const limit = TIER_LIMITS[user?.tier ?? 'free'].alerts;
  const activeCount = alerts.filter(a => a.active === 1).length;

  const fetchAlerts = useCallback(async () => {
    if (!user) return;
    const r = await authFetch('/api/alerts');
    if (r.ok) setAlerts(await r.json());
  }, [user, authFetch]);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  const addAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const r = await authFetch('/api/alerts', {
        method: 'POST',
        body: JSON.stringify({
          ticker: form.ticker.toUpperCase(),
          alert_type: form.alert_type,
          condition: form.condition,
          target_value: parseFloat(form.target_value),
        }),
      });
      const data = await r.json();
      if (!r.ok) {
        if (data.upgrade) { onUpgrade(); return; }
        setError(data.error);
        return;
      }
      setForm({ ticker: '', condition: 'above', target_value: '', alert_type: 'price' });
      fetchAlerts();
    } finally { setLoading(false); }
  };

  const deleteAlert = async (id: number) => {
    await authFetch(`/api/alerts/${id}`, { method: 'DELETE' });
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Bell size={48} className="text-indigo-200 dark:text-indigo-800 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Price Alerts</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-sm">Sign in to set price alerts and never miss a move.</p>
        <button onClick={onLoginClick} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm">Sign in free</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alerts</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {activeCount}/{limit} active alerts
            {user.tier === 'free' && activeCount >= limit && (
              <button onClick={onUpgrade} className="ml-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline inline-flex items-center gap-1 text-xs">
                <Crown size={11} />Upgrade for 100 alerts
              </button>
            )}
          </p>
        </div>
      </div>

      {/* Add alert form */}
      <form onSubmit={addAlert} className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-1.5">
          <Plus size={15} /> New Alert
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label htmlFor="alert-ticker" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Ticker</label>
            <input id="alert-ticker" data-cy="alert-ticker-input" type="text" value={form.ticker} onChange={e => setForm(f => ({ ...f, ticker: e.target.value }))} required placeholder="AAPL" className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 uppercase" />
          </div>
          <div>
            <label htmlFor="alert-type" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Type</label>
            <select id="alert-type" data-cy="alert-type-select" value={form.alert_type} onChange={e => setForm(f => ({ ...f, alert_type: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none">
              <option value="price">Price</option>
              <option value="percent_change">% Change</option>
            </select>
          </div>
          <div>
            <label htmlFor="alert-condition" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Condition</label>
            <select id="alert-condition" data-cy="alert-condition-select" value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none">
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
          </div>
          <div>
            <label htmlFor="alert-value" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{form.alert_type === 'price' ? 'Price ($)' : 'Change (%)'}</label>
            <input id="alert-value" data-cy="alert-value-input" type="number" step="0.01" value={form.target_value} onChange={e => setForm(f => ({ ...f, target_value: e.target.value }))} required placeholder={form.alert_type === 'price' ? '150.00' : '5'} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        {error && <p role="alert" className="text-red-500 text-xs mt-2">{error}</p>}
        <button type="submit" data-cy="alert-submit-btn" disabled={loading} className="mt-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg">
          {loading ? 'Adding…' : 'Set Alert'}
        </button>
      </form>

      {/* Alert list */}
      {alerts.length === 0 ? (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">No alerts configured. Add one above.</div>
      ) : (
        <div className="space-y-2">
          {alerts.map(a => (
            <div key={a.id} className={`bg-white dark:bg-gray-900 px-4 py-3 rounded-xl border flex items-center justify-between ${a.active ? 'border-gray-100 dark:border-gray-800' : 'border-gray-100 dark:border-gray-800 opacity-50'}`}>
              <div className="flex items-center gap-3">
                {a.active ? <Bell size={16} className="text-indigo-500" /> : <BellOff size={16} className="text-gray-400" />}
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{a.ticker}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">
                    {a.alert_type === 'price' ? 'Price' : '% Change'} {a.condition} {a.alert_type === 'price' ? `$${a.target_value}` : `${a.target_value}%`}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {a.triggered_at && (
                  <span className="text-xs text-amber-500 dark:text-amber-400">
                    Triggered {new Date(a.triggered_at).toLocaleDateString()}
                  </span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.active ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                  {a.active ? 'Active' : 'Inactive'}
                </span>
                <button onClick={() => deleteAlert(a.id)} aria-label={`Delete alert for ${a.ticker}`} className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-xs text-amber-700 dark:text-amber-400">
        <strong>Note:</strong> Alert triggering requires the background service to be running. Alerts are checked against live market data every 60 seconds during market hours.
      </div>
    </div>
  );
}
