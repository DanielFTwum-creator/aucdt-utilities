import { useState, useEffect, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts';
import type { PerformanceHistory } from '../../types';

interface Props {
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

type Period = '1y' | '2y';

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-3 py-2 text-xs shadow-lg">
      <p className="text-gray-400 mb-1.5">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 leading-5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-gray-500 w-20">{p.name}</span>
          <span className="font-semibold tabular-nums text-gray-900 dark:text-white">
            {p.value.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PerformanceChart({ authFetch }: Props) {
  const [period, setPeriod] = useState<Period>('1y');
  const [data, setData] = useState<PerformanceHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (p: Period) => {
    setLoading(true);
    setError(null);
    try {
      const r = await authFetch(`/api/portfolio/performance?period=${p}`);
      if (!r.ok) throw new Error('Failed to load performance data');
      setData(await r.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => { fetch(period); }, [period, fetch]);

  const hasData = data && data.portfolio.length >= 5;

  // Merge portfolio + benchmark into a single series keyed by date
  const chartData = hasData
    ? data!.portfolio.map((p, i) => ({
        date: p.date,
        Portfolio: parseFloat(p.indexedValue.toFixed(2)),
        'S&P 500': parseFloat((data!.benchmark[i]?.indexedValue ?? p.indexedValue).toFixed(2)),
      }))
    : [];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Performance vs S&amp;P 500 <span className="font-normal text-gray-400">(indexed to 100)</span>
        </h3>
        <div className="flex gap-1" role="group" aria-label="Period selector">
          {(['1y', '2y'] as Period[]).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                period === p
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-pressed={period === p}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="h-56 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" aria-label="Loading" />
        </div>
      )}

      {error && !loading && (
        <div className="h-56 flex flex-col items-center justify-center gap-2">
          <p className="text-sm text-red-500">{error}</p>
          <button
            type="button"
            onClick={() => fetch(period)}
            className="text-xs text-indigo-500 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && !hasData && (
        <div className="h-56 flex items-center justify-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Not enough history yet — add positions with older purchase dates to see performance.
          </p>
        </div>
      )}

      {!loading && !error && hasData && (
        <div className="h-56" aria-label="Portfolio performance chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickFormatter={d => {
                  const dt = new Date(d);
                  return isNaN(dt.getTime()) ? d : dt.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
                }}
                interval="preserveStartEnd"
                className="text-gray-400"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={v => `${v.toFixed(0)}`}
                className="text-gray-400"
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <ReferenceLine y={100} stroke="#9ca3af" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="Portfolio"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="S&P 500"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                strokeDasharray="5 3"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
