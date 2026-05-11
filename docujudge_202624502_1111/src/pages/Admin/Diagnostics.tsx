import { useEffect, useState } from 'react';
import { auditService, AuditLog } from '@/services/auditService';

export default function Diagnostics() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [systemInfo, setSystemInfo] = useState<any>(null);

  useEffect(() => {
    setLogs(auditService.getLogs());
    
    // Mock system info
    setSystemInfo({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      memory: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'Unknown',
      connection: (navigator as any).connection ? (navigator as any).connection.effectiveType : 'Unknown',
      timestamp: new Date().toISOString(),
    });
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">System Diagnostics</h2>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Environment Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {systemInfo && Object.entries(systemInfo).map(([key, value]) => (
            <div key={key} className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
              <span className="font-medium text-gray-600 dark:text-gray-400 capitalize">{key}</span>
              <span className="text-gray-900 dark:text-gray-200 font-mono">{String(value)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Audit Logs</h3>
          <button 
            onClick={() => { auditService.clearLogs(); setLogs([]); }}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Clear Logs
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="p-3 rounded-tl-lg">Timestamp</th>
                <th className="p-3">Action</th>
                <th className="p-3">User</th>
                <th className="p-3 rounded-tr-lg">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">No logs found</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="p-3 text-gray-500 dark:text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 font-medium text-blue-600 dark:text-blue-400">{log.action}</td>
                    <td className="p-3 text-gray-900 dark:text-gray-200">{log.user}</td>
                    <td className="p-3 text-gray-600 dark:text-gray-300">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
