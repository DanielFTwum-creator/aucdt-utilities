import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useThemeStore } from '../../themeStore';
import { Activity, Clock, Zap, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

interface PerfMetrics {
  recent_requests: { endpoint: string; method: string; duration: number; timestamp: string; status: number }[];
  endpoint_summary: { endpoint: string; count: number; avg_ms: number; min_ms: number; max_ms: number }[];
  memory: { heap_used_mb: number; heap_total_mb: number; rss_mb: number };
  total_requests_tracked: number;
}

export function Performance() {
  const { isDark, isHighContrast } = useThemeStore();
  const [metrics, setMetrics] = useState<PerfMetrics | null>(null);

  const cardCls = clsx("p-5 rounded-xl border transition-colors",
    isHighContrast ? "bg-black border-yellow-400" : isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-100 shadow-sm"
  );
  const headCls = clsx("text-2xl font-bold", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900");
  const subCls = clsx("text-sm", isHighContrast ? "text-yellow-300" : isDark ? "text-slate-400" : "text-slate-500");
  const labelCls = clsx("text-xs font-medium uppercase tracking-wider", isHighContrast ? "text-yellow-500" : isDark ? "text-slate-500" : "text-slate-400");
  const valCls = clsx("text-2xl font-bold tabular-nums", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900");

  const fetchMetrics = async () => {
    try {
      const res = await axios.get('/api/v1/admin/performance-metrics');
      setMetrics(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const chartData = metrics?.recent_requests.map((r, i) => ({
    name: i,
    duration: r.duration,
    endpoint: r.endpoint
  })) || [];

  return (
    <div className="space-y-8" role="region" aria-label="Performance Metrics">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={headCls}><Activity className="inline mr-2" size={24} aria-hidden="true" />Performance</h2>
          <p className={subCls}>API latency and memory profiling</p>
        </div>
        <button onClick={fetchMetrics} aria-label="Refresh metrics" title="Refresh" className={clsx("p-2 rounded-lg transition-colors focus:outline-none focus:ring-2", isHighContrast ? "text-yellow-400 hover:bg-yellow-400/20 focus:ring-yellow-400" : isDark ? "text-slate-400 hover:bg-slate-700 focus:ring-slate-500" : "text-slate-500 hover:bg-slate-100 focus:ring-slate-400")}>
          <RefreshCw size={20} aria-hidden="true" />
        </button>
      </div>

      {metrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={cardCls}>
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className={isHighContrast ? "text-yellow-400" : "text-amber-500"} aria-hidden="true" />
                <span className={labelCls}>Requests Tracked</span>
              </div>
              <div className={valCls}>{metrics.total_requests_tracked.toLocaleString()}</div>
            </div>
            <div className={cardCls}>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className={isHighContrast ? "text-yellow-400" : "text-blue-500"} aria-hidden="true" />
                <span className={labelCls}>Avg Latency (Global)</span>
              </div>
              <div className={valCls}>
                {metrics.endpoint_summary.length > 0 
                  ? Math.round(metrics.endpoint_summary.reduce((acc, curr) => acc + curr.avg_ms * curr.count, 0) / metrics.endpoint_summary.reduce((acc, curr) => acc + curr.count, 0))
                  : 0} ms
              </div>
            </div>
            <div className={cardCls}>
              <div className="flex items-center gap-2 mb-2">
                <Activity size={16} className={isHighContrast ? "text-yellow-400" : "text-emerald-500"} aria-hidden="true" />
                <span className={labelCls}>Memory Heap Used</span>
              </div>
              <div className={valCls}>{metrics.memory.heap_used_mb} <span className="text-sm font-medium text-slate-500">/ {metrics.memory.heap_total_mb} MB</span></div>
            </div>
          </div>

          {/* Response Time Chart */}
          <div className={cardCls}>
            <h3 className={clsx("font-bold mb-4", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>Recent Request Latency</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isHighContrast ? "#facc15" : "#8b5cf6"} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={isHighContrast ? "#facc15" : "#8b5cf6"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isHighContrast ? "#facc1540" : isDark ? "#334155" : "#e2e8f0"} vertical={false} />
                  <XAxis dataKey="name" tick={false} axisLine={false} />
                  <YAxis stroke={isHighContrast ? "#facc15" : isDark ? "#94a3b8" : "#64748b"} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: isHighContrast ? '#000' : isDark ? '#1e293b' : '#fff',
                      borderColor: isHighContrast ? '#facc15' : isDark ? '#334155' : '#e2e8f0',
                      color: isHighContrast ? '#facc15' : isDark ? '#f8fafc' : '#0f172a'
                    }}
                    labelFormatter={() => ''}
                    formatter={(value: number, name: string, props: any) => [`${value} ms`, props.payload.endpoint]}
                  />
                  <Area type="monotone" dataKey="duration" stroke={isHighContrast ? "#facc15" : "#8b5cf6"} strokeWidth={2} fillOpacity={1} fill="url(#colorDuration)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Endpoint Summary Table */}
          <div className={cardCls}>
            <h3 className={clsx("font-bold mb-4", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>Endpoint Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table" aria-label="Endpoint performance summary">
                <thead>
                  <tr className={clsx("border-b", isHighContrast ? "border-yellow-400/30" : isDark ? "border-slate-700" : "border-slate-200")}>
                    <th className={clsx("text-left py-2 pr-4", labelCls)} scope="col">Endpoint</th>
                    <th className={clsx("text-right py-2 pr-4", labelCls)} scope="col">Hits</th>
                    <th className={clsx("text-right py-2 pr-4", labelCls)} scope="col">Avg (ms)</th>
                    <th className={clsx("text-right py-2 pr-4", labelCls)} scope="col">Min (ms)</th>
                    <th className={clsx("text-right py-2", labelCls)} scope="col">Max (ms)</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.endpoint_summary.sort((a, b) => b.count - a.count).map((s, i) => (
                    <tr key={i} className={clsx("border-b", isHighContrast ? "border-yellow-400/10" : isDark ? "border-slate-700/50" : "border-slate-100")}>
                      <td className={clsx("py-2 pr-4 font-mono text-xs", isHighContrast ? "text-yellow-300" : isDark ? "text-slate-300" : "text-slate-700")}>{s.endpoint}</td>
                      <td className={clsx("py-2 pr-4 text-right font-medium", isHighContrast ? "text-yellow-400" : isDark ? "text-slate-200" : "text-slate-800")}>{s.count}</td>
                      <td className={clsx("py-2 pr-4 text-right font-medium", 
                        s.avg_ms > 100 ? "text-red-500" : s.avg_ms > 50 ? "text-yellow-500" : "text-emerald-500"
                      )}>{s.avg_ms}</td>
                      <td className={clsx("py-2 pr-4 text-right tabular-nums text-xs", subCls)}>{s.min_ms}</td>
                      <td className={clsx("py-2 text-right tabular-nums text-xs", subCls)}>{s.max_ms}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
