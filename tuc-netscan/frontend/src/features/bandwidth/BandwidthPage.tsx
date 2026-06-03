import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';

const IFACE_COLOURS = ['#00FF87', '#C8920A', '#00CFFF', '#FFB800', '#B87FFF'];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

function IfaceBar({ name, pct, colour, capacityMbps, bytesIn, bytesOut }: {
  name: string; pct: number; colour: string; capacityMbps: number; bytesIn: number; bytesOut: number;
}) {
  return (
    <div className="noc-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono-code text-xs text-slate-300 tracking-wide">{name}</span>
        <span className="font-mono-display text-sm" style={{color: pct > 80 ? '#FF4444' : pct > 60 ? '#FFB800' : colour}}>
          {pct.toFixed(1)}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-black/40 overflow-hidden mb-2">
        <div className="h-full rounded-full transition-all duration-500"
             style={{width: `${pct}%`, background: pct > 80 ? '#FF4444' : pct > 60 ? '#FFB800' : colour}} />
      </div>
      <div className="flex justify-between text-xs font-mono-code text-slate-500">
        <span>↓ {formatBytes(bytesIn)}/s</span>
        <span>{capacityMbps} Mbps cap</span>
        <span>↑ {formatBytes(bytesOut)}/s</span>
      </div>
    </div>
  );
}

const PERIODS = [
  { label: '1H', seconds: 3600 },
  { label: '6H', seconds: 21600 },
  { label: '24H', seconds: 86400 },
  { label: '7D', seconds: 604800 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="noc-card p-3 text-xs font-mono-code">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{color: p.color}}>{p.name}: {p.value?.toFixed(1)}%</p>
      ))}
    </div>
  );
};

export function BandwidthPage() {
  const [period, setPeriod] = useState(PERIODS[2]);
  const [selectedIface, setSelectedIface] = useState('');

  const { data: interfaces = [] } = useQuery({ queryKey: ['bw-interfaces'], queryFn: api.bandwidth.interfaces, refetchInterval: 15_000 });
  const { data: history = [] }    = useQuery({
    queryKey: ['bw-history', selectedIface, period.seconds],
    queryFn: () => api.bandwidth.history(selectedIface || undefined, period.seconds),
    refetchInterval: 30_000,
  });
  const { data: topN = [] } = useQuery({ queryKey: ['bw-top'], queryFn: () => api.bandwidth.topConsumers(10) });

  // Pivot history data for Recharts (one row per timestamp, columns per interface)
  const chartData = (() => {
    const grouped: Record<string, Record<string, number>> = {};
    history.forEach(s => {
      const t = format(new Date(s.sampledAt), 'HH:mm');
      if (!grouped[t]) grouped[t] = { time: t as any };
      grouped[t][s.interfaceName] = s.utilisationPct;
    });
    return Object.values(grouped).slice(-120); // last 120 points
  })();

  const ifaceNames = [...new Set(history.map(s => s.interfaceName))];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-mono-display text-xl text-gold tracking-widest">BANDWIDTH MONITOR</h1>
        <p className="text-xs text-slate-500 font-mono-code mt-0.5">SNMP polling · 30s intervals · {interfaces.length} interfaces</p>
      </div>

      {/* Interface utilisation bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {interfaces.map((iface, i) => (
          <IfaceBar key={iface.id} name={iface.name} pct={iface.utilisationPct}
            colour={IFACE_COLOURS[i % IFACE_COLOURS.length]}
            capacityMbps={iface.capacityMbps} bytesIn={iface.bytesIn} bytesOut={iface.bytesOut} />
        ))}
      </div>

      {/* Time series chart */}
      <div className="noc-card p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-mono-code text-xs text-slate-400 tracking-widest">UTILISATION HISTORY</h2>
          <div className="flex items-center gap-3">
            <select value={selectedIface} onChange={e => setSelectedIface(e.target.value)}
              className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs font-mono-code text-slate-300 focus:outline-none">
              <option value="">ALL INTERFACES</option>
              {interfaces.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
            </select>
            <div className="flex gap-1">
              {PERIODS.map(p => (
                <button key={p.label} onClick={() => setPeriod(p)}
                  className="px-2.5 py-1 rounded text-xs font-mono-code transition-all"
                  style={period === p
                    ? {background: 'rgba(200,146,10,0.15)', border: '1px solid rgba(200,146,10,0.4)', color: '#C8920A'}
                    : {border: '1px solid rgba(255,255,255,0.08)', color: '#64748b'}}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{top: 0, right: 0, left: -20, bottom: 0}}>
              <defs>
                {ifaceNames.map((name, i) => (
                  <linearGradient key={name} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={IFACE_COLOURS[i % IFACE_COLOURS.length]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={IFACE_COLOURS[i % IFACE_COLOURS.length]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="time" tick={{fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono'}} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis domain={[0, 100]} tick={{fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono'}} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              {ifaceNames.map((name, i) => (
                <Area key={name} type="monotone" dataKey={name} stroke={IFACE_COLOURS[i % IFACE_COLOURS.length]}
                  strokeWidth={1.5} fill={`url(#grad-${i})`} dot={false} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top consumers */}
      <div className="noc-card p-5">
        <h2 className="font-mono-code text-xs text-slate-400 tracking-widest mb-4">TOP BANDWIDTH CONSUMERS</h2>
        <div className="space-y-2">
          {topN.map((c: any, i: number) => (
            <div key={c.deviceId} className="flex items-center gap-4">
              <span className="text-xs font-mono-code text-slate-600 w-4">{i + 1}</span>
              <span className="font-mono-code text-xs text-scan-blue w-28">{c.ip}</span>
              <span className="text-xs text-slate-400 flex-1 truncate">{c.label || c.hostname || 'Unknown device'}</span>
              <div className="flex items-center gap-2 w-40">
                <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{
                    width: `${Math.min(100, (c.estimatedMbps / 20) * 100)}%`,
                    background: c.estimatedMbps > 15 ? '#FF4444' : c.estimatedMbps > 8 ? '#FFB800' : '#00FF87'
                  }} />
                </div>
                <span className="font-mono-code text-xs text-slate-300 w-16 text-right">{c.estimatedMbps} Mbps</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
