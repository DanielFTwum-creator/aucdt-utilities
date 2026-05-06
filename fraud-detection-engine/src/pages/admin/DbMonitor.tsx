import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useThemeStore } from '../../themeStore';
import { Database, Table, HardDrive, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

interface DbStats {
  tables: Record<string, { count: number }>;
  db_size_mb: string;
  db_size_bytes: number;
  recent_entities: { id: string; name: string; status: string; updated_at: string }[];
  recent_metrics: { entity_id: string; metric_type: string; value: number; timestamp: string }[];
}

export function DbMonitor() {
  const { isDark, isHighContrast } = useThemeStore();
  const [stats, setStats] = useState<DbStats | null>(null);

  const cardCls = clsx("p-5 rounded-xl border transition-colors",
    isHighContrast ? "bg-black border-yellow-400" : isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-100 shadow-sm"
  );
  const headCls = clsx("text-2xl font-bold", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900");
  const subCls = clsx("text-sm", isHighContrast ? "text-yellow-300" : isDark ? "text-slate-400" : "text-slate-500");
  const labelCls = clsx("text-xs font-medium uppercase tracking-wider", isHighContrast ? "text-yellow-500" : isDark ? "text-slate-500" : "text-slate-400");
  const valCls = clsx("text-2xl font-bold tabular-nums", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900");

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/v1/admin/db-stats');
      setStats(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const tableColors: Record<string, string> = {
    entities: 'text-blue-500',
    metrics: 'text-emerald-500',
    health_scores: 'text-yellow-500',
    audit_logs: 'text-purple-500',
  };

  return (
    <div className="space-y-8" role="region" aria-label="Database Monitor">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={headCls}><Database className="inline mr-2" size={24} aria-hidden="true" />Database Monitor</h2>
          <p className={subCls}>SQLite database status and statistics</p>
        </div>
        <button onClick={fetchStats} aria-label="Refresh database stats" title="Refresh" className={clsx("p-2 rounded-lg transition-colors focus:outline-none focus:ring-2", isHighContrast ? "text-yellow-400 hover:bg-yellow-400/20 focus:ring-yellow-400" : isDark ? "text-slate-400 hover:bg-slate-700 focus:ring-slate-500" : "text-slate-500 hover:bg-slate-100 focus:ring-slate-400")}>
          <RefreshCw size={20} aria-hidden="true" />
        </button>
      </div>

      {stats && (
        <>
          {/* DB Size */}
          <div className={clsx(cardCls, "flex items-center justify-between")}>
            <div className="flex items-center gap-3">
              <HardDrive className={isHighContrast ? "text-yellow-400" : "text-blue-500"} size={24} aria-hidden="true" />
              <div>
                <div className={labelCls}>Database Size</div>
                <div className={valCls}>{stats.db_size_mb} MB</div>
              </div>
            </div>
            <span className={subCls}>fde.db</span>
          </div>

          {/* Table Row Counts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.tables).map(([table, data]) => (
              <div key={table} className={cardCls}>
                <div className="flex items-center gap-2 mb-2">
                  <Table size={14} className={tableColors[table] || 'text-slate-400'} aria-hidden="true" />
                  <span className={labelCls}>{table.replace('_', ' ')}</span>
                </div>
                <div className={valCls}>{data.count.toLocaleString()}</div>
              </div>
            ))}
          </div>

          {/* Recent Entities */}
          <div className={cardCls}>
            <h3 className={clsx("font-bold mb-4", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>Recent Entities</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table" aria-label="Recent entities">
                <thead>
                  <tr className={clsx("border-b", isHighContrast ? "border-yellow-400/30" : isDark ? "border-slate-700" : "border-slate-200")}>
                    <th className={clsx("text-left py-2 pr-4", labelCls)} scope="col">ID</th>
                    <th className={clsx("text-left py-2 pr-4", labelCls)} scope="col">Name</th>
                    <th className={clsx("text-left py-2 pr-4", labelCls)} scope="col">Status</th>
                    <th className={clsx("text-left py-2", labelCls)} scope="col">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_entities.map(e => (
                    <tr key={e.id} className={clsx("border-b", isHighContrast ? "border-yellow-400/10" : isDark ? "border-slate-700/50" : "border-slate-100")}>
                      <td className={clsx("py-2 pr-4 font-mono text-xs", isHighContrast ? "text-yellow-300" : isDark ? "text-slate-300" : "text-slate-600")}>{e.id}</td>
                      <td className={clsx("py-2 pr-4 font-medium", isHighContrast ? "text-yellow-300" : isDark ? "text-slate-200" : "text-slate-800")}>{e.name}</td>
                      <td className="py-2 pr-4"><span className="text-emerald-500 text-xs font-medium">{e.status}</span></td>
                      <td className={clsx("py-2 text-xs", subCls)}>{e.updated_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Metrics */}
          <div className={cardCls}>
            <h3 className={clsx("font-bold mb-4", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>Recent Metrics</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table" aria-label="Recent metrics">
                <thead>
                  <tr className={clsx("border-b", isHighContrast ? "border-yellow-400/30" : isDark ? "border-slate-700" : "border-slate-200")}>
                    <th className={clsx("text-left py-2 pr-4", labelCls)} scope="col">Entity</th>
                    <th className={clsx("text-left py-2 pr-4", labelCls)} scope="col">Type</th>
                    <th className={clsx("text-left py-2 pr-4", labelCls)} scope="col">Value</th>
                    <th className={clsx("text-left py-2", labelCls)} scope="col">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_metrics.map((m, i) => (
                    <tr key={i} className={clsx("border-b", isHighContrast ? "border-yellow-400/10" : isDark ? "border-slate-700/50" : "border-slate-100")}>
                      <td className={clsx("py-2 pr-4 font-mono text-xs", isHighContrast ? "text-yellow-300" : isDark ? "text-slate-300" : "text-slate-600")}>{m.entity_id}</td>
                      <td className={clsx("py-2 pr-4 text-xs", subCls)}>{m.metric_type}</td>
                      <td className={clsx("py-2 pr-4 font-bold tabular-nums text-xs", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>{m.value.toFixed(2)}</td>
                      <td className={clsx("py-2 text-xs", subCls)}>{new Date(m.timestamp).toLocaleTimeString()}</td>
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
