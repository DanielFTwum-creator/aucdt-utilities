import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useThemeStore } from '../../themeStore';
import { FileText, Filter, RefreshCw, Shield, AlertTriangle, Info, Bug } from 'lucide-react';
import { clsx } from 'clsx';

interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  category: string;
  details: string | null;
  severity: string;
}

const CATEGORIES = ['all', 'system', 'auth', 'sentinel', 'diagnostics', 'general'];
const severityIcons: Record<string, React.ReactNode> = {
  info: <Info size={14} className="text-blue-500" aria-hidden="true" />,
  warning: <AlertTriangle size={14} className="text-yellow-500" aria-hidden="true" />,
  error: <Bug size={14} className="text-red-500" aria-hidden="true" />,
};

export function Logs() {
  const { isDark, isHighContrast } = useThemeStore();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [category, setCategory] = useState('all');

  const cardCls = clsx("p-5 rounded-xl border transition-colors",
    isHighContrast ? "bg-black border-yellow-400" : isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-100 shadow-sm"
  );
  const headCls = clsx("text-2xl font-bold", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900");
  const subCls = clsx("text-sm", isHighContrast ? "text-yellow-300" : isDark ? "text-slate-400" : "text-slate-500");
  const labelCls = clsx("text-xs font-medium uppercase tracking-wider", isHighContrast ? "text-yellow-500" : isDark ? "text-slate-500" : "text-slate-400");

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`/api/v1/admin/audit-logs?category=${category}&limit=100`);
      setLogs(res.data);
    } catch {}
  };

  useEffect(() => { fetchLogs(); }, [category]);

  return (
    <div className="space-y-6" role="region" aria-label="Audit Logs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={headCls}><FileText className="inline mr-2" size={24} aria-hidden="true" />Audit Logs</h2>
          <p className={subCls}>{logs.length} log entries</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className={isHighContrast ? "text-yellow-400" : isDark ? "text-slate-400" : "text-slate-500"} aria-hidden="true" />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              aria-label="Filter logs by category"
              className={clsx("text-sm rounded-lg px-3 py-1.5 border focus:outline-none focus:ring-2",
                isHighContrast ? "bg-black border-yellow-400 text-yellow-300 focus:ring-yellow-400"
                  : isDark ? "bg-slate-800 border-slate-700 text-slate-300 focus:ring-slate-500"
                  : "bg-white border-slate-200 text-slate-700 focus:ring-blue-500"
              )}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <button onClick={fetchLogs} aria-label="Refresh logs" title="Refresh" className={clsx("p-2 rounded-lg transition-colors focus:outline-none focus:ring-2", isHighContrast ? "text-yellow-400 hover:bg-yellow-400/20 focus:ring-yellow-400" : isDark ? "text-slate-400 hover:bg-slate-700 focus:ring-slate-500" : "text-slate-500 hover:bg-slate-100 focus:ring-slate-400")}>
            <RefreshCw size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={cardCls}>
        {logs.length === 0 ? (
          <div className="text-center py-12">
            <Shield className={clsx("mx-auto mb-3", isHighContrast ? "text-yellow-600" : "text-slate-300")} size={40} aria-hidden="true" />
            <p className={clsx("font-medium", isHighContrast ? "text-yellow-400" : isDark ? "text-slate-300" : "text-slate-600")}>No audit logs found</p>
            <p className={subCls}>Logs will appear as actions are performed</p>
          </div>
        ) : (
          <div className="space-y-1 max-h-[600px] overflow-y-auto" role="log" aria-label="Audit log entries" aria-live="polite">
            {logs.map(log => (
              <div key={log.id} className={clsx("flex items-start gap-3 p-3 rounded-lg transition-colors",
                isHighContrast ? "hover:bg-yellow-400/10 border-b border-yellow-400/10"
                  : isDark ? "hover:bg-slate-700/30" : "hover:bg-slate-50"
              )}>
                <div className="mt-0.5">{severityIcons[log.severity] || severityIcons.info}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={clsx("font-medium text-sm", isHighContrast ? "text-yellow-300" : isDark ? "text-slate-200" : "text-slate-800")}>{log.action}</span>
                    <span className={clsx("text-xs px-2 py-0.5 rounded-full",
                      isHighContrast ? "bg-yellow-400/20 text-yellow-400"
                        : isDark ? "bg-slate-700 text-slate-400"
                        : "bg-slate-100 text-slate-500"
                    )}>{log.category}</span>
                  </div>
                  {log.details && <p className={clsx("text-xs mt-1 truncate", subCls)}>{log.details}</p>}
                </div>
                <div className="text-right shrink-0">
                  <div className={clsx("text-xs font-medium", isHighContrast ? "text-yellow-400" : isDark ? "text-slate-300" : "text-slate-600")}>{log.user}</div>
                  <div className={clsx("text-xs", subCls)}>{new Date(log.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
