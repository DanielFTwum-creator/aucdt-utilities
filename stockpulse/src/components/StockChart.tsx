import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine, BarChart, Bar, Cell,
} from 'recharts';

export type ChartDataPoint = Record<string, number | string>;

interface StockChartProps {
  ticker1: string;
  ticker2: string;
  data: ChartDataPoint[];
  alerts?: { price: string }[];
  activePeriod?: string;
  onPeriodChange?: (period: string) => void;
}

const PERIODS = [
  { value: '1m', label: '1m' },
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '1h', label: '1H' },
  { value: '1d', label: '1D' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = new Date(label);
  const timeStr = isNaN(d.getTime()) ? label : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const shown = payload.filter((p: any) => !p.dataKey.startsWith('env'));
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 px-3 py-2 text-xs">
      <p className="text-gray-400 mb-1.5">{timeStr}</p>
      {shown.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 leading-5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-gray-500 w-12">{p.dataKey}</span>
          <span className="font-semibold tabular-nums text-gray-900 dark:text-white">
            {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function StockChart({ ticker1, ticker2, data, alerts = [], activePeriod, onPeriodChange }: StockChartProps) {
  const [localPeriod, setLocalPeriod] = useState('15m');
  const selected = activePeriod ?? localPeriod;

  const handlePeriod = (p: string) => {
    setLocalPeriod(p);
    onPeriodChange?.(p);
  };

  const renderDot = (ticker: string) => (props: any) => {
    const { cx, cy, index, payload } = props;
    if (index === 0 || index === undefined) return null;
    const prev = data[index - 1];
    if (!prev) return null;
    const cur = payload[ticker] as number;
    const prevVal = prev[ticker] as number;
    const deviation = (cur - prevVal) / (prevVal || 1);
    if (Math.abs(deviation) > 0.01) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={3}
          fill={deviation > 0 ? 'var(--color-gain, #2E8B5A)' : 'var(--color-loss, #D94F4F)'}
          stroke="white"
          strokeWidth={1}
        />
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white">
            Comparative Performance (VWAC Envelope)
          </h3>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
            {ticker1} vs {ticker2} · VWAP ±2% channels
          </p>
        </div>
        <div className="flex gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5" role="group" aria-label="Timeframe">
          {PERIODS.map((p) => (
            <button
              type="button"
              key={p.value}
              onClick={() => handlePeriod(p.value)}
              aria-pressed={selected === p.value ? 'true' : 'false'}
              className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
                selected === p.value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 bg-transparent'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2 min-h-0">
        <div className="h-[70%]">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" className="dark:opacity-10" />
              <XAxis dataKey="date" hide />
              <YAxis
                orientation="left"
                domain={['auto', 'auto']}
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
              {alerts.map((alert, i) => (
                <ReferenceLine
                  key={i}
                  y={parseFloat(alert.price)}
                  strokeDasharray="4 3"
                  stroke="#6366F1"
                  strokeWidth={1}
                />
              ))}
              {/* Envelope bands */}
              <Line type="step" dataKey={`envUpper${ticker1}`} stroke="#FED7AA" strokeWidth={1} dot={false} strokeDasharray="4 4" legendType="none" />
              <Line type="step" dataKey={`envLower${ticker1}`} stroke="#FED7AA" strokeWidth={1} dot={false} strokeDasharray="4 4" legendType="none" />
              <Line type="step" dataKey={`envUpper${ticker2}`} stroke="#C7D2FE" strokeWidth={1} dot={false} strokeDasharray="4 4" legendType="none" />
              <Line type="step" dataKey={`envLower${ticker2}`} stroke="#C7D2FE" strokeWidth={1} dot={false} strokeDasharray="4 4" legendType="none" />
              {/* Asset lines */}
              <Line
                type="monotone"
                dataKey={ticker1}
                stroke="#D97706"
                strokeWidth={2}
                dot={renderDot(ticker1)}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey={ticker2}
                stroke="#4F46E5"
                strokeWidth={2}
                dot={renderDot(ticker2)}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="h-[30%]">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <BarChart data={data} barCategoryGap="30%" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="date"
                tickFormatter={(v) => {
                  const d = new Date(v);
                  return isNaN(d.getTime()) ? v : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }}
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                minTickGap={50}
              />
              <YAxis hide />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const d = new Date(label);
                  const t = isNaN(d.getTime()) ? label : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 px-3 py-2 text-xs">
                      <p className="text-gray-400 mb-1">{t}</p>
                      <p className="font-semibold tabular-nums text-gray-900 dark:text-white">
                        Vol: {((payload[0]?.value as number) / 1e6).toFixed(2)}M
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="volume" radius={[2, 2, 0, 0]}>
                {data.map((entry, index) => {
                  const cur = (entry[ticker1] as number ?? 0) + (entry[ticker2] as number ?? 0);
                  const prev = index > 0 ? ((data[index - 1][ticker1] as number ?? 0) + (data[index - 1][ticker2] as number ?? 0)) : cur;
                  return (
                    <Cell
                      key={`vol-${index}`}
                      fill={cur < prev ? 'rgba(217,79,79,0.4)' : 'rgba(46,139,90,0.4)'}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
