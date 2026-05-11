import { useState, useEffect, useCallback } from 'react';
import type { DividendEntry } from '../../types';

interface Props {
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

export default function DividendLog({ authFetch }: Props) {
  const [dividends, setDividends] = useState<DividendEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await authFetch('/api/portfolio/dividends');
      if (!r.ok) throw new Error('Failed to load dividend history');
      setDividends(await r.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => { load(); }, [load]);

  const total = dividends.reduce((s, d) => s + d.total, 0);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Dividend History</h3>
        <button
          type="button"
          onClick={load}
          className="text-xs text-indigo-500 hover:underline"
          aria-label="Refresh dividend data"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <p className="text-sm text-red-500">{error}</p>
          <button type="button" onClick={load} className="text-xs text-indigo-500 hover:underline">Retry</button>
        </div>
      )}

      {!loading && !error && dividends.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-gray-500 py-8 text-center">
          No dividend events found for your holdings.
        </p>
      )}

      {!loading && !error && dividends.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Dividend history">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-500 font-medium">
                  {['Ticker', 'Ex-Date', 'Per Share', 'Shares', 'Total'].map((h, i) => (
                    <th key={h} scope="col" className={`py-2 px-3 ${i === 0 ? 'text-left' : 'text-right'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dividends.map((d, i) => (
                  <tr
                    key={`${d.ticker}-${d.exDate}-${i}`}
                    className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30"
                  >
                    <td className="py-2.5 px-3 font-semibold text-gray-900 dark:text-white">{d.ticker}</td>
                    <td className="py-2.5 px-3 text-right text-gray-500 dark:text-gray-400 tabular-nums">{d.exDate}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300">
                      ${d.amount.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300">
                      {d.sharesHeld.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold tabular-nums text-green-600 dark:text-green-400">
                      +${d.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Total dividend income ({dividends.length} event{dividends.length !== 1 ? 's' : ''})
            </span>
            <span className="text-sm font-bold font-mono text-green-600 dark:text-green-400">
              +${total.toFixed(2)}
            </span>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Sourced from Yahoo Finance · Best-effort data — irregular and special dividends may be missing or delayed
          </p>
        </>
      )}
    </div>
  );
}
