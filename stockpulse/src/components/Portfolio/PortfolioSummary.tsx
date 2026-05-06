import type { PortfolioSummary } from '../../types';

interface Props {
  summary: PortfolioSummary;
}

function fmt(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function SignedValue({ value, prefix = '$' }: { value: number; prefix?: string }) {
  const positive = value >= 0;
  return (
    <span className={positive ? 'text-green-600 dark:text-green-400' : 'text-red-500'}>
      {positive ? '+' : ''}{prefix}{fmt(Math.abs(value))}
    </span>
  );
}

function SignedPct({ value }: { value: number | undefined | null }) {
  if (value === undefined || value === null || isNaN(value)) {
    return <span className="text-gray-400">—</span>;
  }
  const positive = value >= 0;
  return (
    <span className={positive ? 'text-green-600 dark:text-green-400' : 'text-red-500'}>
      {positive ? '+' : ''}{value.toFixed(2)}%
    </span>
  );
}

export default function PortfolioSummaryCards({ summary }: Props) {
  const totalDayGain = summary.totalDayGain ?? 0;
  const totalDayGainPercent = summary.totalDayGainPercent ?? 0;
  const allNoData = summary.positions.every(p => p.dayGain === null);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Value</p>
        <p className="text-xl font-bold font-mono text-gray-900 dark:text-white">
          ${fmt(summary.totalValue)}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Invested</p>
        <p className="text-xl font-bold font-mono text-gray-900 dark:text-white">
          ${fmt(summary.totalCost)}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Unrealized P&amp;L</p>
        <p className="text-xl font-bold font-mono">
          <SignedValue value={summary.unrealizedPL} />
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Return</p>
        <p className="text-xl font-bold font-mono">
          <SignedPct value={summary.unrealizedPLPercent} />
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Day Change</p>
        {allNoData ? (
          <p className="text-xl font-bold font-mono text-gray-400 dark:text-gray-600">—</p>
        ) : (
          <p className="text-xl font-bold font-mono">
            <SignedValue value={totalDayGain} />
            <span className="text-sm font-normal ml-1">
              (<SignedPct value={totalDayGainPercent} />)
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
