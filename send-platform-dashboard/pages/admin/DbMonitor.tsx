import React from 'react';
import { Database, HardDrive, RefreshCw } from 'lucide-react';

const DbMonitor: React.FC = () => {
  const handleRefresh = () => {
    // In a real app, this would re-fetch data
    const btn = document.getElementById('refresh-btn');
    if (btn) {
      btn.classList.add('animate-spin');
      setTimeout(() => btn.classList.remove('animate-spin'), 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Database Monitor</h1>
         <button 
           onClick={handleRefresh}
           className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
           aria-label="Refresh database metrics"
         >
           <RefreshCw size={14} className="mr-1" id="refresh-btn" /> Refresh
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <Database className="mx-auto text-indigo-500 mb-2" size={32} />
            <h3 className="text-2xl font-bold text-gray-800">45</h3>
            <p className="text-gray-500 text-sm">Active Connections</p>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <HardDrive className="mx-auto text-emerald-500 mb-2" size={32} />
            <h3 className="text-2xl font-bold text-gray-800">12.4 GB</h3>
            <p className="text-gray-500 text-sm">Storage Used</p>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <ActivityIcon />
            <h3 className="text-2xl font-bold text-gray-800">98%</h3>
            <p className="text-gray-500 text-sm">Cache Hit Ratio</p>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 font-semibold text-gray-800">Slow Queries Log</div>
        <table className="w-full text-left text-sm">
           <thead className="bg-gray-50 text-gray-500">
             <tr>
               <th className="px-6 py-3">Timestamp</th>
               <th className="px-6 py-3">Duration</th>
               <th className="px-6 py-3">Query Snippet</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-100">
             <tr>
               <td className="px-6 py-3 text-gray-600">2026-02-14 08:01:22</td>
               <td className="px-6 py-3 text-red-600 font-medium">1205ms</td>
               <td className="px-6 py-3 font-mono text-gray-700">SELECT * FROM execution_logs WHERE output_content LIKE...</td>
             </tr>
             <tr>
               <td className="px-6 py-3 text-gray-600">2026-02-14 07:55:01</td>
               <td className="px-6 py-3 text-red-600 font-medium">850ms</td>
               <td className="px-6 py-3 font-mono text-gray-700">UPDATE send_jobs SET status='LOCKED' WHERE...</td>
             </tr>
           </tbody>
        </table>
      </div>
    </div>
  );
};

const ActivityIcon = () => (
  <svg className="mx-auto text-blue-500 mb-2 w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export default DbMonitor;