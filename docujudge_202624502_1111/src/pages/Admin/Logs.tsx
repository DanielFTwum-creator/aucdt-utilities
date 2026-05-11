import { FileText, AlertCircle, Info, CheckCircle } from 'lucide-react';

export default function Logs() {
  const logs = [
    { id: 1, type: 'info', message: 'System started successfully', timestamp: '2024-02-24 08:00:00' },
    { id: 2, type: 'success', message: 'Database connection established', timestamp: '2024-02-24 08:00:01' },
    { id: 3, type: 'warning', message: 'High memory usage detected (85%)', timestamp: '2024-02-24 10:15:23' },
    { id: 4, type: 'info', message: 'User admin logged in', timestamp: '2024-02-24 10:20:00' },
    { id: 5, type: 'error', message: 'Failed to sync with external API (Timeout)', timestamp: '2024-02-24 11:05:45' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="text-red-500" size={18} />;
      case 'warning': return <AlertCircle className="text-yellow-500" size={18} />;
      case 'success': return <CheckCircle className="text-green-500" size={18} />;
      default: return <Info className="text-blue-500" size={18} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="text-blue-600" size={32} />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">System Logs</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 uppercase font-medium">
              <tr>
                <th className="px-6 py-3">Level</th>
                <th className="px-6 py-3">Message</th>
                <th className="px-6 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-2">
                    {getIcon(log.type)}
                    <span className="uppercase text-xs font-bold text-gray-600 dark:text-gray-300">{log.type}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-mono">{log.message}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
