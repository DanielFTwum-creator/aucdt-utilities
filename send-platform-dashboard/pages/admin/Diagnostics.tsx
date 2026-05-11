import React from 'react';
import { Activity, Server, Database, ShieldCheck, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const Diagnostics: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Diagnostics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Component Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
              <Server className="mr-2" size={18} aria-hidden="true" /> Component Health
            </h3>
          </div>
          <div className="p-4 space-y-4" role="list" aria-label="Component Health Status">
             {[
               { name: 'API Gateway', status: 'OK', ping: '12ms' },
               { name: 'Job Scheduler', status: 'OK', ping: '5ms' },
               { name: 'Worker Pool A', status: 'OK', ping: '45ms' },
               { name: 'Notification Service', status: 'WARNING', ping: '120ms', msg: 'High Latency' },
               { name: 'Report Engine (Jasper)', status: 'OK', ping: '200ms' },
             ].map((c, i) => (
               <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded" role="listitem">
                  <div className="flex items-center space-x-3">
                    {c.status === 'OK' && <CheckCircle className="text-green-500" size={20} aria-label="Status: OK" />}
                    {c.status === 'WARNING' && <AlertTriangle className="text-yellow-500" size={20} aria-label="Status: Warning" />}
                    <span className="font-medium text-gray-700 dark:text-gray-200">{c.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">{c.status}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{c.ping}</span>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* External Connectivity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <Activity className="mr-2" size={18} /> Connectivity Checks
            </h3>
          </div>
          <div className="p-4 space-y-4">
             {[
               { name: 'Primary Database (MySQL)', status: 'Connected' },
               { name: 'Google Calendar API', status: 'Authenticated (OAuth)' },
               { name: 'SharePoint Graph API', status: 'Authenticated (OAuth)' },
               { name: 'SMTP Relay', status: 'Connected' },
               { name: 'Redis Cache', status: 'Connected' },
             ].map((c, i) => (
               <div key={i} className="flex items-center justify-between p-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-700">{c.name}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">{c.status}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diagnostics;