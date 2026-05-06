import React from 'react';
import { Database, HardDrive, Activity } from 'lucide-react';

export function DbMonitor() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Database Monitor</h2>
      <p className="text-slate-500">Real-time monitoring of the internal SQLite database.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Database size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Database Size</p>
              <p className="text-2xl font-bold text-slate-900">4.2 MB</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '15%' }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">15% of allocated quota</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Query Latency</p>
              <p className="text-2xl font-bold text-slate-900">0.8 ms</p>
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-medium">Optimal Performance</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
              <HardDrive size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Write Operations</p>
              <p className="text-2xl font-bold text-slate-900">120/sec</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">Peak: 450/sec at 10:00 AM</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Active Connections</h3>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-600">Connection ID</th>
              <th className="px-4 py-3 font-semibold text-slate-600">User</th>
              <th className="px-4 py-3 font-semibold text-slate-600">State</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Duration</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Query</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3 font-mono text-slate-500">#1024</td>
              <td className="px-4 py-3">system</td>
              <td className="px-4 py-3"><span className="text-emerald-600">Active</span></td>
              <td className="px-4 py-3">0.02s</td>
              <td className="px-4 py-3 font-mono text-xs text-slate-500">INSERT INTO metrics...</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono text-slate-500">#1025</td>
              <td className="px-4 py-3">dashboard</td>
              <td className="px-4 py-3"><span className="text-emerald-600">Active</span></td>
              <td className="px-4 py-3">0.05s</td>
              <td className="px-4 py-3 font-mono text-xs text-slate-500">SELECT * FROM containers...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
