import React, { useEffect, useState } from 'react';

interface LogEntry {
  timestamp: string;
  action: string;
  actor: string;
  details: string;
}

export function AuditLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const storedLogs = localStorage.getItem('audit_log');
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs).reverse());
    }
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-serif font-bold text-stone-900 dark:text-white">Audit Logs</h1>
      
      <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 dark:bg-stone-900/50 border-b border-stone-200 dark:border-stone-700">
            <tr>
              <th className="p-4 font-semibold text-stone-900 dark:text-white">Timestamp</th>
              <th className="p-4 font-semibold text-stone-900 dark:text-white">Actor</th>
              <th className="p-4 font-semibold text-stone-900 dark:text-white">Action</th>
              <th className="p-4 font-semibold text-stone-900 dark:text-white">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-stone-500">No audit logs found.</td>
              </tr>
            ) : (
              logs.map((log, i) => (
                <tr key={i} className="hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors">
                  <td className="p-4 text-stone-600 dark:text-stone-300 font-mono text-xs">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 text-stone-900 dark:text-white font-medium">{log.actor}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md text-xs font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-stone-600 dark:text-stone-300">{log.details}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
