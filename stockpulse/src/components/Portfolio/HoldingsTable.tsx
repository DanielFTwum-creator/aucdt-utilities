import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import type { PortfolioPosition } from '../../types';
import { isAddedToday } from '../../utils/marketTime';

interface RawPosition {
  id: number;
  ticker: string;
}

interface Props {
  positions: PortfolioPosition[];
  rawPositions: RawPosition[];
  onDelete: (id: number) => void;
}

function fmt2(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function DayGainCell({ pos }: { pos: PortfolioPosition }) {
  if (isAddedToday(pos.createdAt)) {
    return (
      <td className="px-4 py-3 text-right" colSpan={2}>
        <span className="text-xs font-medium text-indigo-400 dark:text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full">
          Added today
        </span>
      </td>
    );
  }
  if (pos.dayGain === null || pos.dayGain === undefined || isNaN(pos.dayGain)) {
    return (
      <>
        <td className="px-4 py-3 text-right font-mono text-gray-400">—</td>
        <td className="px-4 py-3 text-right font-mono text-gray-400">—</td>
      </>
    );
  }
  const up = pos.dayGain >= 0;
  return (
    <>
      <td className={`px-4 py-3 text-right font-mono font-semibold ${up ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
        {up ? '+' : ''}${fmt2(Math.abs(pos.dayGain))}
      </td>
      <td className={`px-4 py-3 text-right font-medium ${up ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
        <span className="flex items-center justify-end gap-1">
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {up ? '+' : ''}{(pos.dayGainPercent ?? 0).toFixed(2)}%
        </span>
      </td>
    </>
  );
}

export default function HoldingsTable({ positions, rawPositions, onDelete }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" aria-label="Portfolio holdings">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-500 font-medium">
              {['Ticker', 'Shares', 'Avg Cost', 'Current', 'Value', 'P&L', 'Return', 'Day Gain', 'Day %', 'Alloc', ''].map((h, i) => (
                <th
                  key={`${h}-${i}`}
                  scope="col"
                  className={`px-4 py-3 whitespace-nowrap ${h === '' || i === 0 ? '' : 'text-right'} ${i === 0 ? 'text-left' : ''}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positions.map(pos => {
              const up = pos.unrealizedPL >= 0;
              const rawPos = rawPositions.find(r => r.ticker === pos.ticker);
              return (
                <tr
                  key={pos.ticker}
                  className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{pos.ticker}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">{pos.shares.toFixed(4)}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-500 dark:text-gray-400">${fmt2(pos.avgCost)}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-white">${fmt2(pos.currentPrice)}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-white">${fmt2(pos.value)}</td>
                  <td className={`px-4 py-3 text-right font-mono font-semibold ${up ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                    {up ? '+' : ''}${fmt2(Math.abs(pos.unrealizedPL))}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${up ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                    <span className="flex items-center justify-end gap-1">
                      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {up ? '+' : ''}{pos.unrealizedPLPercent.toFixed(2)}%
                    </span>
                  </td>

                  <DayGainCell pos={pos} />

                  <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="w-12 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden" aria-hidden="true">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(pos.allocation ?? 0, 100)}%` }} />
                      </div>
                      <span className="tabular-nums">{(pos.allocation ?? 0).toFixed(1)}%</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right">
                    {rawPos && (
                      <button
                        onClick={() => onDelete(rawPos.id)}
                        aria-label={`Remove ${pos.ticker} position`}
                        className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
