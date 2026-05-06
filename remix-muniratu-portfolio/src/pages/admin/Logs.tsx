import { useState } from 'react';
import { Logger } from '../../services/logger';
import { Trash2, Search } from 'lucide-react';

export default function Logs() {
  const [logs, setLogs] = useState(Logger.getLogs());
  const [filter, setFilter] = useState('');

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all logs?')) {
      Logger.clearLogs();
      setLogs([]);
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(filter.toLowerCase()) ||
      log.details.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
          <p className="text-gray-500 dark:text-gray-400">Track system events and user actions.</p>
        </div>
        <button
          onClick={handleClear}
          className="flex items-center px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Logs
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search logs..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-orange-500 transition-all dark:text-white"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Timestamp</th>
              <th className="px-6 py-4 font-medium">Action</th>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{log.user}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{log.details}</td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  No logs found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
