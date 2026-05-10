import React, { useState, useEffect } from 'react';
import { LogOut, Download, Trash2, Eye, EyeOff } from 'lucide-react';
import { get, set } from 'idb-keyval';

interface AuditLog {
  id: string;
  timestamp: number;
  action: 'design_save' | 'design_export' | 'design_delete' | 'export_format_png' | 'export_format_pdf' | 'export_format_jpg' | 'export_format_json';
  details: string;
  ipMetadata?: string;
}

interface AdminPanelProps {
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      const logs = await get('luxthumb_audit_logs');
      if (logs && Array.isArray(logs)) {
        setAuditLogs(logs.sort((a, b) => b.timestamp - a.timestamp));
      }
    } catch (err) {
      console.error('Failed to load audit logs', err);
    }
  };

  const clearAllLogs = async () => {
    if (confirm('Clear all audit logs? This action cannot be undone.')) {
      try {
        await set('luxthumb_audit_logs', []);
        setAuditLogs([]);
      } catch (err) {
        console.error('Failed to clear logs', err);
      }
    }
  };

  const exportLogsAsJson = () => {
    const dataStr = JSON.stringify(auditLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.download = `luxthumb_audit_logs_${new Date().toISOString().split('T')[0]}.json`;
    link.href = dataUri;
    link.click();
  };

  const exportLogsAsCsv = () => {
    const headers = ['Timestamp', 'Action', 'Details'];
    const rows = auditLogs.map(log => [
      new Date(log.timestamp).toLocaleString(),
      log.action,
      log.details
    ]);
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    const link = document.createElement('a');
    link.download = `luxthumb_audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    link.href = dataUri;
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] text-[#F5F5F5]">
      {/* Header */}
      <div className="p-6 border-b border-[#2A2A2A] flex justify-between items-center">
        <div>
          <div className="text-[10px] tracking-[0.2em] text-[#C9A84C] uppercase font-bold mb-1">ADMIN CONSOLE</div>
          <h2 className="text-xl font-serif italic text-white">Audit Dashboard</h2>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/50 rounded text-red-500 hover:bg-red-500/20 transition-colors text-[10px] uppercase font-bold tracking-wider"
          aria-label="Logout from admin panel"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Control Buttons */}
      <div className="p-6 border-b border-[#2A2A2A] flex flex-wrap gap-3">
        <button
          onClick={exportLogsAsJson}
          disabled={auditLogs.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C]/10 border border-[#C9A84C]/50 rounded text-[#C9A84C] hover:bg-[#C9A84C]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[10px] uppercase font-bold tracking-wider"
          aria-label="Export audit logs as JSON"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </button>
        <button
          onClick={exportLogsAsCsv}
          disabled={auditLogs.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C]/10 border border-[#C9A84C]/50 rounded text-[#C9A84C] hover:bg-[#C9A84C]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[10px] uppercase font-bold tracking-wider"
          aria-label="Export audit logs as CSV"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <button
          onClick={clearAllLogs}
          disabled={auditLogs.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/50 rounded text-red-500 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[10px] uppercase font-bold tracking-wider"
          aria-label="Clear all audit logs"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>

      {/* Stats */}
      <div className="p-6 border-b border-[#2A2A2A] grid grid-cols-4 gap-4">
        <div className="bg-[#111] border border-[#222] rounded p-4">
          <div className="text-[9px] uppercase tracking-widest text-white/40 mb-2">Total Entries</div>
          <div className="text-2xl font-bold text-[#C9A84C]">{auditLogs.length}</div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded p-4">
          <div className="text-[9px] uppercase tracking-widest text-white/40 mb-2">Design Saves</div>
          <div className="text-2xl font-bold text-white">{auditLogs.filter(l => l.action === 'design_save').length}</div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded p-4">
          <div className="text-[9px] uppercase tracking-widest text-white/40 mb-2">Exports</div>
          <div className="text-2xl font-bold text-white">{auditLogs.filter(l => l.action.includes('export')).length}</div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded p-4">
          <div className="text-[9px] uppercase tracking-widest text-white/40 mb-2">Last Activity</div>
          <div className="text-[11px] font-mono text-white/60">
            {auditLogs.length > 0 ? new Date(auditLogs[0].timestamp).toLocaleTimeString() : 'None'}
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        {auditLogs.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded">
            <div className="text-[10px] uppercase tracking-widest text-white/40">No audit logs yet</div>
          </div>
        ) : (
          <div className="space-y-2">
            {auditLogs.map(log => (
              <div
                key={log.id}
                className="bg-[#111] border border-white/5 rounded hover:border-white/10 transition-colors"
              >
                <button
                  onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                  aria-expanded={expandedLog === log.id}
                  aria-controls={`log-${log.id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[9px] font-mono bg-[#222] px-2 py-1 rounded text-[#C9A84C] uppercase tracking-wider">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-white/60">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[11px] text-white/70 truncate">{log.details}</div>
                  </div>
                  {expandedLog === log.id ? (
                    <Eye className="w-4 h-4 text-white/40 ml-2 flex-shrink-0" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-white/40 ml-2 flex-shrink-0" />
                  )}
                </button>

                {expandedLog === log.id && (
                  <div
                    id={`log-${log.id}`}
                    className="px-4 pb-4 border-t border-white/5 animate-slide-in"
                  >
                    <div className="space-y-2 text-[9px] text-white/50 font-mono">
                      <div>
                        <span className="text-white/70">ID:</span> {log.id}
                      </div>
                      <div>
                        <span className="text-white/70">Action:</span> {log.action}
                      </div>
                      <div>
                        <span className="text-white/70">Details:</span> {log.details}
                      </div>
                      <div>
                        <span className="text-white/70">Timestamp:</span> {new Date(log.timestamp).toISOString()}
                      </div>
                      {log.ipMetadata && (
                        <div>
                          <span className="text-white/70">Metadata:</span> {log.ipMetadata}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const recordAuditLog = async (
  action: AuditLog['action'],
  details: string
): Promise<void> => {
  try {
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      action,
      details,
      ipMetadata: navigator.userAgent.substring(0, 100)
    };

    const logs = (await get('luxthumb_audit_logs')) || [];
    if (!Array.isArray(logs)) {
      return;
    }

    logs.unshift(newLog);
    const recentLogs = logs.slice(0, 1000);
    await set('luxthumb_audit_logs', recentLogs);
  } catch (err) {
    console.error('Failed to record audit log', err);
  }
};
