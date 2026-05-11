import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import StockChart, { type ChartDataPoint } from './StockChart';
import { mergeData, type OhlcvBar } from '../utils/vwap';

interface Props {
  ticker1: string;
  ticker2: string;
}

const PERIOD_CONFIG: Record<string, { period: string; interval: string }> = {
  '1m':  { period: '1d',  interval: '1m'  },
  '5m':  { period: '1d',  interval: '5m'  },
  '15m': { period: '2d',  interval: '15m' },
  '1h':  { period: '5d',  interval: '1h'  },
  '1d':  { period: '3mo', interval: '1d'  },
};

export default function ComparativeChart({ ticker1, ticker2 }: Props) {
  const [period, setPeriod] = useState('15m');
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!ticker1 || !ticker2) return;
    const { period: p, interval } = PERIOD_CONFIG[period] ?? PERIOD_CONFIG['15m'];
    setLoading(true);
    setError(false);

    Promise.all([
      fetch(`/api/market/history/${ticker1}?period=${p}&interval=${interval}`).then(r => r.ok ? r.json() : []),
      fetch(`/api/market/history/${ticker2}?period=${p}&interval=${interval}`).then(r => r.ok ? r.json() : []),
    ])
      .then(([bars1, bars2]: [OhlcvBar[], OhlcvBar[]]) => {
        if (!bars1.length || !bars2.length) { setError(true); return; }
        setData(mergeData(ticker1, bars1, ticker2, bars2));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [ticker1, ticker2, period]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 h-[500px] flex items-center justify-center">
        <RefreshCw size={24} className="animate-spin text-gray-300 dark:text-gray-600" aria-label="Loading chart" />
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 h-[500px] flex flex-col items-center justify-center gap-2">
        <p className="text-sm text-gray-400 dark:text-gray-500">No comparative data available for {ticker1} / {ticker2}</p>
        <button
          type="button"
          onClick={() => setPeriod(p => p)}
          className="text-xs text-indigo-500 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <StockChart
      ticker1={ticker1}
      ticker2={ticker2}
      data={data}
      activePeriod={period}
      onPeriodChange={setPeriod}
    />
  );
}
