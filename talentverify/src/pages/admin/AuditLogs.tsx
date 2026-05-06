import { useEffect, useState } from 'react';
import { AuditLogService, AuditLogEntry } from '@/services/auditLog';
import { Shield, Search, RefreshCw } from 'lucide-react';

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filter, setFilter] = useState('');

  const loadLogs = async () => {
    const fetchedLogs = await AuditLogService.getLogs();
    setLogs(fetchedLogs);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(filter.toLowerCase()) ||
    log.userName.toLowerCase().includes(filter.toLowerCase()) ||
    log.details.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-text-primary flex items-center gap-2">
          <Shield className="text-brand-primary" />
          System Audit Logs
        </h1>
        <button 
          onClick={loadLogs}
          className="p-2 hover:bg-black/5 rounded-full transition-colors"
          aria-label="Refresh Logs"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="bg-bg-card rounded-xl shadow-sm border border-border-color p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Search logs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg-warm rounded-lg border border-border-color focus:outline-none focus:ring-2 focus:ring-brand-primary"
            aria-label="Search audit logs"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-color text-text-muted text-sm font-medium">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Action</th>
                <th className="p-3">User</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border-color last:border-0 hover:bg-black/5 transition-colors">
                    <td className="p-3 text-sm font-mono text-text-muted">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-sm">{log.userName}</td>
                    <td className="p-3 text-sm text-text-muted">{log.details}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-text-muted">
                    No logs found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
