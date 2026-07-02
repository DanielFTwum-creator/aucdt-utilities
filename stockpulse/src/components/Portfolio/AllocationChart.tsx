import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { PortfolioPosition } from '../../types';

const PALETTE = [
  '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b',
  '#ef4444', '#ec4899', '#84cc16', '#f97316', '#14b8a6',
];

interface Props {
  positions: PortfolioPosition[];
}

interface TooltipPayload {
  name: string;
  value: number;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (!active || !payload?.length) return null;
  const item = payload[0] as TooltipPayload;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2 text-sm shadow">
      <span className="font-semibold text-gray-900 dark:text-white">{item.name}</span>
      <span className="ml-2 text-gray-500 dark:text-gray-400">{item.value.toFixed(1)}%</span>
    </div>
  );
}

export default function AllocationChart({ positions }: Props) {
  const data = positions
    .filter(p => (p.allocation ?? 0) > 0)
    .map(p => ({ name: p.ticker, value: p.allocation ?? 0 }));

  if (data.length === 0) return null;

  return (
    <div id="allocation-chart" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Allocation</h3>
      <div className="flex items-center gap-6">
        <div className="w-40 h-40 shrink-0" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={64}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="flex flex-col gap-2 min-w-0" aria-label="Allocation breakdown">
          {data.map((item, i) => (
            <li key={item.name} className="flex items-center gap-2 text-sm">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: PALETTE[i % PALETTE.length] }}
                aria-hidden="true"
              />
              <span className="font-semibold text-gray-900 dark:text-white">{item.name}</span>
              <span className="text-gray-500 dark:text-gray-400 tabular-nums ml-auto pl-4">
                {item.value.toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
