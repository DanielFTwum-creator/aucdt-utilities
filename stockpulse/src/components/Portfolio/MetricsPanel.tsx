import { useState, useEffect, useCallback } from 'react';
import type { PerformanceMetrics } from '../../types';

interface Props {
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

type Period = '1y' | '2y';

function sharpeColor(v: number) {
  if (v >= 1) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
  if (v >= 0) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20';
  return 'text-red-500 bg-red-50 dark:bg-red-900/20';
}

interface MetricCard {
  label: string;
  value: string;
  description: string;
  badge?: string;
  badgeClass?: string;
}

function buildCards(m: PerformanceMetrics): MetricCard[] {
  const pct = (v: number) => `${v >= 0 ? '+' : ''}${(v * 100).toFixed(2)}%`;
  return [
    {
      label: 'Annualised Return',
      value: pct(m.annualizedReturn),
      description: 'Compound annual growth rate over the selected period',
    },
    {
      label: '30D Volatility',
      value: `${(m.volatility30d * 100).toFixed(2)}%`,
      description: 'Annualised standard deviation of daily returns over the last 30 trading days',
    },
    {
      label: 'Sharpe Ratio',
      value: m.sharpeRatio.toFixed(2),
      description: 'Risk-adjusted return per unit of volatility. >1 is good, >2 is excellent.',
      badge: m.sharpeRatio >= 1 ? 'Good' : m.sharpeRatio >= 0 ? 'Fair' : 'Poor',
      badgeClass: sharpeColor(m.sharpeRatio),
    },
    {
      label: 'Beta',
      value: m.beta.toFixed(2),
      description: `Sensitivity to S&P 500 movements. ${m.beta > 1 ? 'More volatile than the market.' : m.beta < 1 ? 'Less volatile than the market.' : 'Moves with the market.'}`,
    },
    {
      label: 'Alpha',
      value: pct(m.alpha),
      description: 'Excess return over what the market exposure alone would predict (CAPM)',
    },
    {
      label: 'Max Drawdown',
      value: `-${(m.maxDrawdown * 100).toFixed(2)}%`,
      description: 'Largest peak-to-trough decline over the selected period',
    },
  ];
}

export default function MetricsPanel({ authFetch }: Props) {
  const [period, setPeriod] = useState<Period>('1y');
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (p: Period) => {
    setLoading(true);
    setError(null);
    try {
      const r = await authFetch(`/api/portfolio/metrics?period=${p}`);
      if (!r.ok) {
        const body = await r.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? 'Failed to compute metrics');
      }
      setMetrics(await r.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => { load(period); }, [period, load]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Risk &amp; Return Metrics</h3>
        <div className="flex gap-1" role="group" aria-label="Metrics period selector">
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <p className="text-sm text-gray-400 dark:text-gray-500">{error}</p>
          <button
            type="button"
            onClick={() => load(period)}
            className="text-xs text-indigo-500 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && metrics && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {buildCards(metrics).map(card => (
              <div
                key={card.label}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4"
                title={card.description}
                aria-label={`${card.label}: ${card.value}`}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{card.label}</p>
                <div className="flex items-center gap-2">
                  <p className={`text-lg font-bold font-mono tabular-nums ${
                    card.label === 'Annualised Return' || card.label === 'Alpha'
                      ? parseFloat(card.value) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {card.value}
                  </p>
                  {card.badge && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${card.badgeClass}`}>
                      {card.badge}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Risk-free rate: {(metrics.riskFreeRate * 100).toFixed(2)}%
            {' '}({metrics.riskFreeRateSource === 'fred' ? 'FRED 3-month T-bill' : 'fallback rate'})
            · Benchmark: S&amp;P 500 · Period: {metrics.period.toUpperCase()}
          </p>
        </>
      )}
    </div>
  );
}
