import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, RotateCcw, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import type { PaperAccount, PaperPosition, PaperOrder, User } from '../types';

interface Props { user: User | null; authFetch: (url: string, options?: RequestInit) => Promise<Response>; onLoginClick: () => void; }

type OrderType = 'market' | 'limit' | 'stop';

export default function PaperTrading({ user, authFetch, onLoginClick }: Props) {
  const [account, setAccount] = useState<PaperAccount | null>(null);
  const [positions, setPositions] = useState<PaperPosition[]>([]);
  const [orders, setOrders] = useState<PaperOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'positions' | 'orders'>('positions');
  const [orderForm, setOrderForm] = useState({ ticker: '', action: 'buy' as 'buy' | 'sell', shares: '', order_type: 'market' as OrderType, limit_price: '' });
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [accR, posR, ordR] = await Promise.all([
        authFetch('/api/paper/account'),
        authFetch('/api/paper/positions'),
        authFetch('/api/paper/orders'),
      ]);
      if (accR.ok) setAccount(await accR.json());
      if (posR.ok) setPositions(await posR.json());
      if (ordR.ok) setOrders(await ordR.json());
    } finally { setLoading(false); }
  }, [user, authFetch]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError(null);
    setOrderSuccess(null);
    const r = await authFetch('/api/paper/order', {
      method: 'POST',
      body: JSON.stringify({
        ticker: orderForm.ticker.toUpperCase(),
        action: orderForm.action,
        shares: parseFloat(orderForm.shares),
        order_type: orderForm.order_type,
        ...(orderForm.limit_price ? { limit_price: parseFloat(orderForm.limit_price) } : {}),
      }),
    });
    const data = await r.json();
    if (!r.ok) { setOrderError(data.error); return; }
    setOrderSuccess(`${orderForm.action.toUpperCase()} ${orderForm.shares} ${orderForm.ticker.toUpperCase()} @ $${data.fillPrice.toFixed(2)}`);
    setOrderForm(f => ({ ...f, ticker: '', shares: '', limit_price: '' }));
    fetchAll();
  };

  const resetAccount = async () => {
    if (!confirm('Reset paper account to $100,000? All positions and history will be cleared.')) return;
    await authFetch('/api/paper/reset', { method: 'POST' });
    fetchAll();
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Activity size={48} className="text-indigo-200 dark:text-indigo-800 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Paper Trading Simulator</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-sm">Practice trading with $100,000 virtual capital. Risk-free, real market prices.</p>
        <button onClick={onLoginClick} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm">Sign in free</button>
      </div>
    );
  }

  const totalReturn = account ? account.totalValue - account.initialCapital : 0;
  const totalReturnPct = account ? (totalReturn / account.initialCapital) * 100 : 0;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Paper Trading</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Practice with $100K virtual capital · Real market prices</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAll} aria-label="Refresh" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={resetAccount} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg" aria-label="Reset paper account">
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Account summary */}
      {account && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Cash Balance', value: `$${account.cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: '' },
            { label: 'Portfolio Value', value: `$${account.portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: '' },
            { label: 'Total Value', value: `$${account.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: '' },
            { label: 'Total Return', value: `${totalReturn >= 0 ? '+' : ''}$${totalReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${totalReturnPct.toFixed(2)}%)`, color: totalReturn >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500' },
          ].map(m => (
            <div key={m.label} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{m.label}</p>
              <p className={`text-lg font-bold font-mono ${m.color || 'text-gray-900 dark:text-white'}`}>{m.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Form */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Place Order</h2>
          <form onSubmit={placeOrder} className="space-y-3">
            <div>
              <label htmlFor="pt-ticker" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Ticker</label>
              <input id="pt-ticker" type="text" value={orderForm.ticker} onChange={e => setOrderForm(f => ({ ...f, ticker: e.target.value }))} required placeholder="AAPL" className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 uppercase" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="pt-action" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Action</label>
                <select id="pt-action" value={orderForm.action} onChange={e => setOrderForm(f => ({ ...f, action: e.target.value as 'buy' | 'sell' }))} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none">
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
              </div>
              <div>
                <label htmlFor="pt-type" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Order Type</label>
                <select id="pt-type" value={orderForm.order_type} onChange={e => setOrderForm(f => ({ ...f, order_type: e.target.value as OrderType }))} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none">
                  <option value="market">Market</option>
                  <option value="limit">Limit</option>
                  <option value="stop">Stop</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="pt-shares" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Shares</label>
              <input id="pt-shares" type="number" step="0.001" min="0.001" value={orderForm.shares} onChange={e => setOrderForm(f => ({ ...f, shares: e.target.value }))} required placeholder="10" className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            {orderForm.order_type !== 'market' && (
              <div>
                <label htmlFor="pt-limit" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{orderForm.order_type === 'limit' ? 'Limit Price' : 'Stop Price'}</label>
                <input id="pt-limit" type="number" step="0.01" value={orderForm.limit_price} onChange={e => setOrderForm(f => ({ ...f, limit_price: e.target.value }))} placeholder="150.00" className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            )}
            {orderError && <p role="alert" className="text-red-500 text-xs">{orderError}</p>}
            {orderSuccess && <p role="status" className="text-green-600 dark:text-green-400 text-xs">{orderSuccess}</p>}
            <button type="submit" className={`w-full text-white text-sm font-semibold py-2.5 rounded-xl transition-colors ${orderForm.action === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'}`}>
              {orderForm.action === 'buy' ? 'Buy' : 'Sell'} (Paper)
            </button>
          </form>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">0.1% simulated slippage. Market orders fill instantly.</p>
        </div>

        {/* Positions / Orders */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="flex border-b border-gray-100 dark:border-gray-800">
            {(['positions', 'orders'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === t ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {tab === 'positions' ? (
            positions.length === 0 ? (
              <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">No open positions. Place an order to get started.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" aria-label="Paper trading positions">
                  <thead>
                    <tr className="text-xs text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
                      {['Ticker', 'Shares', 'Avg Cost', 'Current', 'P&L', 'Return'].map(h => (
                        <th key={h} scope="col" className={`px-4 py-2.5 ${h === 'Ticker' ? 'text-left' : 'text-right'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map(p => {
                      const up = p.unrealizedPL >= 0;
                      return (
                        <tr key={p.ticker} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                          <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{p.ticker}</td>
                          <td className="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">{p.shares.toFixed(3)}</td>
                          <td className="px-4 py-3 text-right font-mono text-gray-500 dark:text-gray-400">${p.avgCost.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-white">${p.currentPrice.toFixed(2)}</td>
                          <td className={`px-4 py-3 text-right font-mono font-semibold ${up ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                            {up ? '+' : ''}${p.unrealizedPL.toFixed(2)}
                          </td>
                          <td className={`px-4 py-3 text-right flex items-center justify-end gap-1 ${up ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                            {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {up ? '+' : ''}{p.unrealizedPLPercent.toFixed(2)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            orders.length === 0 ? (
              <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">No order history yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" aria-label="Paper order history">
                  <thead>
                    <tr className="text-xs text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
                      {['Date', 'Ticker', 'Action', 'Shares', 'Fill Price', 'Total', 'Status'].map(h => (
                        <th key={h} scope="col" className={`px-4 py-2.5 ${h === 'Date' ? 'text-left' : 'text-right'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 20).map(o => (
                      <tr key={o.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-2.5 text-right font-semibold text-gray-900 dark:text-white">{o.ticker}</td>
                        <td className={`px-4 py-2.5 text-right font-semibold ${o.action === 'buy' ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>{o.action.toUpperCase()}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-gray-700 dark:text-gray-300">{o.shares}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-gray-700 dark:text-gray-300">${o.fill_price?.toFixed(2) ?? '—'}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-gray-700 dark:text-gray-300">${(o.shares * (o.fill_price ?? 0)).toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-right"><span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
