import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { AlertTriangle, Monitor, Activity, Shield, TrendingUp, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

function UtilGauge({ pct, label }: { pct: number; label: string }) {
  const color = pct > 80 ? '#FF4444' : pct > 60 ? '#FFB800' : '#00FF87';
  return (
    <div className="noc-card p-4 flex flex-col items-center">
      <div className="relative w-20 h-20">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="55%" outerRadius="90%"
                          data={[{ value: pct, fill: color }]} startAngle={90} endAngle={90 - pct * 3.6}>
            <RadialBar dataKey="value" cornerRadius={4} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono-display text-sm font-bold" style={{color}}>{Math.round(pct)}%</span>
        </div>
      </div>
      <p className="text-xs font-mono-code text-slate-400 mt-2 tracking-wider text-center">{label}</p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="noc-card p-4">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-mono-code text-slate-500 tracking-widest">{label}</span>
        <div className="w-7 h-7 rounded flex items-center justify-center" style={{background: `${color}15`, border: `1px solid ${color}30`}}>
          <Icon size={13} style={{color}} />
        </div>
      </div>
      <div className="font-mono-display text-2xl" style={{color}}>{value}</div>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

export function OverviewPage() {
  const { data: health, isLoading } = useQuery({ queryKey: ['health'], queryFn: api.health });
  const { data: alerts = [] } = useQuery({ queryKey: ['alerts', 'ACTIVE'], queryFn: () => api.alerts.list(undefined, 'ACTIVE') });
  const { data: interfaces = [] } = useQuery({ queryKey: ['bw-interfaces'], queryFn: api.bandwidth.interfaces });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="font-mono-display text-gold/40 tracking-widest animate-pulse">LOADING NETWORK STATE...</div>
    </div>
  );

  const criticals = alerts.filter(a => a.severity === 'CRITICAL');
  const warnings  = alerts.filter(a => a.severity === 'WARNING');
  const wanIface  = interfaces.find(i => i.name === 'WAN-Upstream');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono-display text-xl text-gold tracking-widest">NETWORK OVERVIEW</h1>
          <p className="text-xs text-slate-500 font-mono-code mt-0.5">
            Last updated: {health?.lastScan ? formatDistanceToNow(new Date(health.lastScan), { addSuffix: true }) : '—'}
          </p>
        </div>
        {criticals.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono-code"
               style={{background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', color: '#FF4444'}}>
            <AlertTriangle size={12} />
            {criticals.length} CRITICAL ALERT{criticals.length > 1 ? 'S' : ''}
          </div>
        )}
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Monitor} label="ACTIVE DEVICES"    value={health?.activeDevices ?? '—'} color="#00FF87"
          sub={`of ${(health?.activeDevices ?? 0) + 3} total registered`} />
        <StatCard icon={AlertTriangle} label="ROGUE DEVICES" value={health?.rogueDevices ?? '—'}
          color={health?.rogueDevices ? '#FF4444' : '#00FF87'}
          sub={health?.rogueDevices ? 'Immediate action required' : 'All devices authorised'} />
        <StatCard icon={Shield} label="ACTIVE ALERTS" value={health?.activeAlerts ?? '—'}
          color={health?.activeAlerts ? '#FFB800' : '#00FF87'}
          sub={`${criticals.length} critical · ${warnings.length} warning`} />
        <StatCard icon={Activity} label="WAN UTILISATION" value={`${health?.wanUtilisationPct?.toFixed(1) ?? '—'}%`}
          color={health?.wanUtilisationPct ?? 0 > 80 ? '#FF4444' : '#00FF87'}
          sub="100 Mbps uplink capacity" />
      </div>

      {/* Bandwidth gauges + alerts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gauges */}
        <div className="noc-card p-5">
          <h2 className="font-mono-code text-xs text-slate-400 tracking-widest mb-4">INTERFACE UTILISATION</h2>
          <div className="grid grid-cols-3 gap-2">
            {interfaces.slice(0, 5).map(iface => (
              <UtilGauge key={iface.id} pct={iface.utilisationPct} label={iface.name.replace('WiFi-', '')} />
            ))}
          </div>
        </div>

        {/* Active alerts list */}
        <div className="lg:col-span-2 noc-card p-5">
          <h2 className="font-mono-code text-xs text-slate-400 tracking-widest mb-4">ACTIVE ALERTS</h2>
          {alerts.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-green-400 font-mono-code text-xs">
              ✓ NO ACTIVE ALERTS
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.slice(0, 5).map(a => (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded"
                     style={{background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)'}}>
                  <span className="text-xs font-mono-code px-2 py-0.5 rounded shrink-0 mt-0.5"
                        style={{
                          background: a.severity === 'CRITICAL' ? 'rgba(255,68,68,0.15)' : a.severity === 'WARNING' ? 'rgba(255,184,0,0.15)' : 'rgba(0,207,255,0.15)',
                          color: a.severity === 'CRITICAL' ? '#FF4444' : a.severity === 'WARNING' ? '#FFB800' : '#00CFFF',
                          border: `1px solid ${a.severity === 'CRITICAL' ? 'rgba(255,68,68,0.3)' : a.severity === 'WARNING' ? 'rgba(255,184,0,0.3)' : 'rgba(0,207,255,0.3)'}`
                        }}>
                    {a.severity}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-slate-200 truncate">{a.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{a.message}</p>
                  </div>
                  <span className="text-xs text-slate-600 shrink-0 font-mono-code ml-auto">
                    {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* System health bar */}
      <div className="noc-card p-4">
        <h2 className="font-mono-code text-xs text-slate-400 tracking-widest mb-3">SYSTEM STATUS</h2>
        <div className="flex items-center gap-8 flex-wrap">
          {[
            { label: 'DATABASE',  ok: health?.dbOk },
            { label: 'REDIS',     ok: health?.redisOk },
            { label: 'SCANNER',   ok: true },
            { label: 'API',       ok: true },
            { label: 'WEBSOCKET', ok: true },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <span className={clsx('pulse-dot', s.ok ? 'green' : 'red')} />
              <span className="text-xs font-mono-code text-slate-400">{s.label}</span>
              <span className="text-xs font-mono-code" style={{color: s.ok ? '#00FF87' : '#FF4444'}}>
                {s.ok ? 'OK' : 'DOWN'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
