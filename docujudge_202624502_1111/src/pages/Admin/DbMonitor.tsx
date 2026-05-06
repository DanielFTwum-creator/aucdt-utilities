import { Database } from 'lucide-react';

export default function DbMonitor() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Database className="text-blue-600" size={32} />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Database Monitor</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</h3>
          <p className="mt-2 text-3xl font-bold text-green-500">HEALTHY</p>
          <p className="text-xs text-gray-400 mt-1">Uptime: 99.99%</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Connections</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">12</p>
          <p className="text-xs text-gray-400 mt-1">Active Sessions</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Storage</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">45 MB</p>
          <p className="text-xs text-gray-400 mt-1">Used of 512 MB</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Recent Queries</h3>
        </div>
        <div className="p-6">
          <div className="font-mono text-sm space-y-2 text-gray-600 dark:text-gray-300">
            <p><span className="text-green-600">[SUCCESS]</span> SELECT * FROM evaluations WHERE id = 'APP-2024-001' (12ms)</p>
            <p><span className="text-green-600">[SUCCESS]</span> UPDATE settings SET theme = 'dark' (45ms)</p>
            <p><span className="text-green-600">[SUCCESS]</span> INSERT INTO logs (type, message) VALUES ('audit', 'Login') (8ms)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
