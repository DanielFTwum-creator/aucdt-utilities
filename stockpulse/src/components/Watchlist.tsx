import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, RefreshCw, TrendingUp, TrendingDown, Crown, GitCompare } from 'lucide-react';
import ComparativeChart from './ComparativeChart';
import {
  AreaChart, Area, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { WatchlistItem, Quote, User } from '../types';
import { TIER_LIMITS } from '../types';

interface Props {
  user: User | null;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
  onUpgrade: () => void;
  onLoginClick: () => void;
}

function formatMktCap(n: number) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${n.toFixed(0)}`;
}

// --- Sub-components ---

function DayRangeBar({ low, high, current }: { low: number; high: number; current: number }) {
  const range = high - low || 1;
  const pct = Math.max(0, Math.min(100, ((current - low) / range) * 100));
  return (
    <div className="flex items-center gap-1.5 w-full">
      <span className="text-[11px] text-gray-400 dark:text-gray-600 tabular-nums w-8 text-right shrink-0">
        {low.toFixed(0)}
      </span>
      <div className="relative flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full min-w-[36px]">
        <div
          className="absolute top-1/2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-gray-900 shadow-sm"
          style={{ left: `${pct}%`, transform: 'translate(-50%,-50%)' }}
          aria-label={`Price at ${pct.toFixed(0)}% of 52W range`}
        />
      </div>
      <span className="text-[11px] text-gray-400 dark:text-gray-600 tabular-nums w-8 shrink-0">
        {high.toFixed(0)}
      </span>
    </div>
  );
}

function MiniSparkline({ prices }: { prices: number[] }) {
  if (prices.length < 2) return <span className="text-gray-300 dark:text-gray-700 text-xs">—</span>;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const W = 52, H = 20;
  const pts = prices
    .map((v, i) => `${(i / (prices.length - 1)) * W},${H - ((v - min) / range) * (H - 4) - 2}`)
    .join(' ');
  const trending = prices[prices.length - 1] >= prices[0];
  return (
    <svg width={W} height={H} aria-hidden="true" className="overflow-visible">
      <polyline
        points={pts}
        fill="none"
        stroke={trending ? '#2E8B5A' : '#D94F4F'}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

type HistoryPoint = { date: string; close: number; volume: number };

function TickerChartPanel({ ticker }: { ticker: string }) {
  const [data, setData] = useState<HistoryPoint[]>([]);
  const [period, setPeriod] = useState('1mo');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const interval = period === '1d' ? '5m' : period === '5d' ? '15m' : '1d';
    fetch(`/api/market/history/${ticker}?period=${period}&interval=${interval}`)
      .then(r => r.ok ? r.json() : [])
      .then((raw: HistoryPoint[]) => setData(raw))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [ticker, period]);

  const formatLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    if (period === '1d') return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (period === '5d') return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const minVal = data.length ? Math.min(...data.map(d => d.close)) * 0.998 : 0;
  const maxVal = data.length ? Math.max(...data.map(d => d.close)) * 1.002 : 0;
  const trending = data.length >= 2 ? data[data.length - 1].close >= data[0].close : true;
  const color = trending ? '#2E8B5A' : '#D94F4F';
  const pctChange = data.length >= 2
    ? ((data[data.length - 1].close - data[0].close) / data[0].close) * 100
    : 0;

  const PERIODS = ['1d', '5d', '1mo', '3mo', '6mo', '1y'];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex flex-col h-full min-h-[420px]">
      <div className="flex items-start justify-between mb-4 shrink-0">
        <div>
          <h3 className="text-[20px] font-semibold text-gray-900 dark:text-white">{ticker}</h3>
          {data.length > 0 && (
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
                ${data[data.length - 1].close.toFixed(2)}
              </span>
              <span
                className="text-sm font-medium tabular-nums"
                style={{ color }}
              >
                {pctChange >= 0 ? '+' : ''}{pctChange.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5" role="group" aria-label="Chart timeframe">
          {PERIODS.map(p => (
            <button
              type="button"
              key={p}
              onClick={() => setPeriod(p)}
              aria-pressed={period === p ? 'true' : 'false'}
              className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
                period === p
                  ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 bg-transparent'
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-300">
          <RefreshCw size={22} className="animate-spin" aria-label="Loading chart data" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
          No data available
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-2 min-h-0">
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`grad-${ticker}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.12} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#F3F4F6" className="dark:opacity-10" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatLabel}
                  interval="preserveStartEnd"
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={60}
                />
                <YAxis
                  domain={[minVal, maxVal]}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickFormatter={v => `$${(v as number).toFixed(0)}`}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', fontSize: 12, padding: '6px 10px' }}
                  formatter={(v: unknown) => [`$${(v as number).toFixed(2)}`, '']}
                  labelFormatter={formatLabel}
                />
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke={color}
                  strokeWidth={1.5}
                  fill={`url(#grad-${ticker})`}
                  dot={false}
                  activeDot={{ r: 3, fill: color, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="h-[72px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', fontSize: 12, padding: '4px 8px' }}
                  formatter={(v: unknown) => [`${((v as number) / 1e6).toFixed(1)}M`, 'Vol']}
                  labelFormatter={formatLabel}
                />
                <Bar dataKey="volume" radius={[2, 2, 0, 0]}>
                  {data.map((entry, i) => (
                    <Cell
                      key={`vol-${i}`}
                      fill={i > 0 && entry.close < data[i - 1].close
                        ? 'rgba(217,79,79,0.35)'
                        : 'rgba(46,139,90,0.35)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Main component ---

export default function Watchlist({ user, authFetch, onUpgrade, onLoginClick }: Props) {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [sparklines, setSparklines] = useState<Record<string, number[]>>({});
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<{ ticker: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [chartMode, setChartMode] = useState<'chart' | 'compare'>('chart');

  const limit = TIER_LIMITS[user?.tier ?? 'free'].watchlist;

  const fetchWatchlist = useCallback(async () => {
    if (!user) return;
    const r = await authFetch('/api/watchlist');
    if (r.ok) {
      const data = await r.json() as WatchlistItem[];
      setItems(data);
      if (data.length > 0) {
        fetchQuotes(data.map(d => d.ticker));
        if (!selectedTicker && data.length > 0) setSelectedTicker(data[0].ticker);
      }
    }
  }, [user, authFetch, selectedTicker]);

  const fetchQuotes = async (tickers: string[]) => {
    setRefreshing(true);
    try {
      const r = await fetch(`/api/market/quotes?symbols=${tickers.join(',')}`);
      if (r.ok) {
        const data = await r.json() as Quote[];
        const map: Record<string, Quote> = {};
        data.forEach(q => { if (!('error' in q)) map[q.ticker] = q; });
        setQuotes(map);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const fetchSparklines = useCallback(async (tickers: string[]) => {
    const results = await Promise.allSettled(
      tickers.map(ticker =>
        fetch(`/api/market/history/${ticker}?period=5d&interval=1d`)
          .then(r => r.ok ? r.json() : [])
          .then((data: HistoryPoint[]) => ({ ticker, prices: data.map(d => d.close) }))
          .catch(() => ({ ticker, prices: [] as number[] }))
      )
    );
    const map: Record<string, number[]> = {};
    results.forEach(r => {
      if (r.status === 'fulfilled') map[r.value.ticker] = r.value.prices;
    });
    setSparklines(map);
  }, []);

  useEffect(() => { fetchWatchlist(); }, [fetchWatchlist]);

  useEffect(() => {
    if (items.length === 0) return;
    fetchSparklines(items.map(i => i.ticker));
    const timer = setInterval(() => fetchQuotes(items.map(i => i.ticker)), 15000);
    return () => clearInterval(timer);
  }, [items, fetchSparklines]);

  const handleSearch = async (q: string) => {
    setSearch(q);
    if (q.length < 1) { setSearchResults([]); return; }
    const r = await fetch(`/api/market/search?q=${encodeURIComponent(q)}`);
    if (r.ok) setSearchResults(await r.json());
  };

  const addTicker = async (ticker: string) => {
    if (!user) { onLoginClick(); return; }
    if (items.length >= limit) { onUpgrade(); return; }
    setLoading(true);
    setError(null);
    try {
      const r = await authFetch('/api/watchlist', { method: 'POST', body: JSON.stringify({ ticker }) });
      const data = await r.json();
      if (!r.ok) {
        if (data.upgrade) { onUpgrade(); return; }
        setError(data.error);
        return;
      }
      setSearch('');
      setSearchResults([]);
      await fetchWatchlist();
    } finally {
      setLoading(false);
    }
  };

  const removeTicker = async (ticker: string) => {
    await authFetch(`/api/watchlist/${ticker}`, { method: 'DELETE' });
    setItems(prev => prev.filter(i => i.ticker !== ticker));
    if (selectedTicker === ticker) {
      const remaining = items.filter(i => i.ticker !== ticker);
      setSelectedTicker(remaining.length > 0 ? remaining[0].ticker : null);
    }
  };

  // Summary stats
  const allQuotes = Object.values(quotes) as Quote[];
  const bestGainer = allQuotes.reduce<Quote | null>((best, q) =>
    !best || q.changePercent > best.changePercent ? q : best, null);
  const worstLoser = allQuotes.reduce<Quote | null>((worst, q) =>
    !worst || q.changePercent < worst.changePercent ? q : worst, null);
  const isMarketOpen = (() => {
    try {
      const et = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const h = et.getHours(), m = et.getMinutes(), dow = et.getDay();
      return dow >= 1 && dow <= 5 && (h > 9 || (h === 9 && m >= 30)) && h < 16;
    } catch { return false; }
  })();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <TrendingUp size={48} className="text-indigo-200 dark:text-indigo-800 mb-4" aria-hidden="true" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Track your stocks</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-sm text-sm">
          Sign in to build your personalised watchlist with real-time quotes and AI signals.
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

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-[20px] font-semibold text-gray-900 dark:text-white">Watchlist</h1>
          <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-0.5">
            {items.length}/{limit} stocks
            {user.tier === 'free' && items.length >= limit && (
              <button
                type="button"
                onClick={onUpgrade}
                className="ml-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline inline-flex items-center gap-1"
              >
                <Crown size={11} aria-hidden="true" /> Upgrade for more
              </button>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => fetchQuotes(items.map(i => i.ticker))}
          aria-label="Refresh quotes"
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <RefreshCw size={17} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Summary stats bar */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3">
            <p className="text-[12px] text-gray-400 dark:text-gray-500 font-medium">Tracking</p>
            <p className="text-[20px] font-bold text-gray-900 dark:text-white leading-tight mt-0.5">
              {items.length}
              <span className="text-[13px] font-normal text-gray-400 ml-1">stocks</span>
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3">
            <p className="text-[12px] text-gray-400 dark:text-gray-500 font-medium">Top Gainer</p>
            {bestGainer ? (
              <p className="text-[20px] font-bold leading-tight mt-0.5 flex items-baseline gap-1.5">
                <span className="text-gray-900 dark:text-white">{bestGainer.ticker}</span>
                <span className="text-[13px] font-semibold tabular-nums" style={{ color: '#2E8B5A' }}>
                  +{bestGainer.changePercent.toFixed(2)}%
                </span>
              </p>
            ) : <p className="text-[13px] text-gray-300 dark:text-gray-700 mt-1">—</p>}
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3">
            <p className="text-[12px] text-gray-400 dark:text-gray-500 font-medium">Top Loser</p>
            {worstLoser ? (
              <p className="text-[20px] font-bold leading-tight mt-0.5 flex items-baseline gap-1.5">
                <span className="text-gray-900 dark:text-white">{worstLoser.ticker}</span>
                <span className="text-[13px] font-semibold tabular-nums" style={{ color: '#D94F4F' }}>
                  {worstLoser.changePercent.toFixed(2)}%
                </span>
              </p>
            ) : <p className="text-[13px] text-gray-300 dark:text-gray-700 mt-1">—</p>}
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3">
            <p className="text-[12px] text-gray-400 dark:text-gray-500 font-medium">Market</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: isMarketOpen ? '#2E8B5A' : '#9CA3AF' }}
                aria-hidden="true"
              />
              <span className="text-[13px] font-semibold text-gray-800 dark:text-gray-200">
                {isMarketOpen ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4 shrink-0">
        <input
          type="text"
          role="combobox"
          aria-label="Search for a stock ticker"
          aria-autocomplete="list"
          aria-expanded={searchResults.length > 0}
          aria-controls="ticker-search-results"
          value={search}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search tickers to add (e.g. AAPL, Tesla)…"
          className="w-full px-4 py-2.5 pr-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {loading && <RefreshCw size={15} className="absolute right-3 top-3 text-gray-400 animate-spin" aria-hidden="true" />}
        {searchResults.length > 0 && (
          <ul
            id="ticker-search-results"
            className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden max-h-48 overflow-y-auto"
          >
            {searchResults.map(r => (
              <li key={r.ticker}>
                <button
                  type="button"
                  onClick={() => addTicker(r.ticker)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
                >
                  <span className="font-semibold text-gray-900 dark:text-white text-sm w-16 shrink-0">{r.ticker}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{r.name}</span>
                  <Plus size={14} className="ml-auto text-indigo-500 shrink-0" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p role="alert" className="text-[#D94F4F] text-sm mb-3">{error}</p>}

      {/* Main: two-column */}
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
          <p className="text-base mb-1">Your watchlist is empty.</p>
          <p className="text-sm">Search above to add your first stock.</p>
        </div>
      ) : (
        <div className="flex-1 flex gap-5 min-h-0 overflow-hidden">
          {/* Left: table (40%) */}
          <div className="w-full lg:w-[40%] flex flex-col min-h-0 overflow-hidden">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col flex-1 min-h-0">
              <div className="overflow-y-auto flex-1">
                <table className="w-full text-sm" role="table" aria-label="Watchlist">
                  <thead className="sticky top-0 bg-white dark:bg-gray-900 z-10">
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th scope="col" className="text-left px-4 py-3 text-[11px] font-medium text-gray-400 dark:text-gray-500">Ticker</th>
                      <th scope="col" className="text-right px-3 py-3 text-[11px] font-medium text-gray-400 dark:text-gray-500">Price</th>
                      <th scope="col" className="text-right px-3 py-3 text-[11px] font-medium text-gray-400 dark:text-gray-500">Chg%</th>
                      <th scope="col" className="text-center px-3 py-3 text-[11px] font-medium text-gray-400 dark:text-gray-500 hidden md:table-cell">5D</th>
                      <th scope="col" className="px-3 py-3 text-[11px] font-medium text-gray-400 dark:text-gray-500 hidden lg:table-cell">52W Range</th>
                      <th scope="col" className="text-right px-3 py-3 text-[11px] font-medium text-gray-400 dark:text-gray-500 hidden lg:table-cell">Score</th>
                      <th scope="col" className="px-3 py-3 w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => {
                      const q = quotes[item.ticker];
                      const up = (q?.changePercent ?? 0) >= 0;
                      const isSelected = selectedTicker === item.ticker;
                      const spark = sparklines[item.ticker] ?? [];
                      return (
                        <tr
                          key={item.ticker}
                          onClick={() => setSelectedTicker(item.ticker)}
                          className={`border-b border-gray-50 dark:border-gray-800/50 cursor-pointer transition-colors h-12 ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-indigo-900/20'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
                          }`}
                          aria-selected={isSelected}
                        >
                          <td className="px-4 py-0">
                            <div className="text-[13px] font-semibold text-gray-900 dark:text-white leading-tight">{item.ticker}</div>
                            <div className="text-[11px] text-gray-400 dark:text-gray-500 truncate max-w-[90px] leading-tight">{q?.name ?? '—'}</div>
                          </td>
                          <td className="px-3 py-0 text-right">
                            <span className="text-[14px] font-semibold tabular-nums text-gray-900 dark:text-white">
                              {q ? `$${q.price.toFixed(2)}` : <span className="text-gray-300 dark:text-gray-600">—</span>}
                            </span>
                          </td>
                          <td className="px-3 py-0 text-right">
                            {q ? (
                              <span
                                className="inline-flex items-center gap-0.5 text-[12px] font-semibold tabular-nums"
                                style={{ color: up ? '#2E8B5A' : '#D94F4F' }}
                              >
                                {up ? <TrendingUp size={11} aria-hidden="true" /> : <TrendingDown size={11} aria-hidden="true" />}
                                {up ? '+' : ''}{q.changePercent.toFixed(2)}%
                              </span>
                            ) : <span className="text-gray-300 dark:text-gray-700 text-sm">—</span>}
                          </td>
                          <td className="px-3 py-0 hidden md:table-cell">
                            <div className="flex justify-center">
                              <MiniSparkline prices={spark} />
                            </div>
                          </td>
                          <td className="px-3 py-0 hidden lg:table-cell">
                            {q && q.fiftyTwoWeekLow && q.fiftyTwoWeekHigh ? (
                              <DayRangeBar low={q.fiftyTwoWeekLow} high={q.fiftyTwoWeekHigh} current={q.price} />
                            ) : <span className="text-gray-300 dark:text-gray-700 text-xs">—</span>}
                          </td>
                          <td className="px-3 py-0 text-right hidden lg:table-cell">
                            <span className="inline-flex items-center justify-center text-[11px] font-semibold w-8 h-6 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
                              —
                            </span>
                          </td>
                          <td className="px-3 py-0">
                            <button
                              type="button"
                              onClick={e => { e.stopPropagation(); removeTicker(item.ticker); }}
                              aria-label={`Remove ${item.ticker}`}
                              className="text-gray-300 dark:text-gray-700 hover:text-[#D94F4F] dark:hover:text-[#D94F4F] transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-3 text-center shrink-0">
              Yahoo Finance · 15-min delay · Not investment advice
            </p>
          </div>

          {/* Right: chart (60%) */}
          <div className="hidden lg:flex lg:flex-1 flex-col min-h-0 gap-3">
            {/* Chart mode tabs */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5" role="group" aria-label="Chart mode">
                <button
                  type="button"
                  onClick={() => setChartMode('chart')}
                  aria-pressed={(chartMode === 'chart') as unknown as boolean}
                  className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
                    chartMode === 'chart'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <TrendingUp size={11} aria-hidden="true" /> Chart
                </button>
                {items.length >= 2 && (
                  <button
                    type="button"
                    onClick={() => setChartMode('compare')}
                    aria-pressed={(chartMode === 'compare') as unknown as boolean}
                    className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
                      chartMode === 'compare'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <GitCompare size={11} aria-hidden="true" /> Compare
                  </button>
                )}
              </div>
              {chartMode === 'compare' && items.length >= 2 && (
                <span className="text-[11px] text-gray-400 dark:text-gray-500">
                  {items[0].ticker} vs {items[1].ticker}
                </span>
              )}
            </div>

            <div className="flex-1 min-h-0">
              {chartMode === 'compare' && items.length >= 2 ? (
                <ComparativeChart ticker1={items[0].ticker} ticker2={items[1].ticker} />
              ) : selectedTicker ? (
                <TickerChartPanel ticker={selectedTicker} />
              ) : (
                <div className="flex-1 h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
                  Select a stock to view chart
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
