import React from 'react';
import { FileText, Download, Filter } from 'lucide-react';

export function Logs() {
  const logs = [
    { id: 1, timestamp: new Date().toISOString(), level: 'INFO', message: 'Metrics collection cycle started', source: 'MetricsCollector' },
    { id: 2, timestamp: new Date(Date.now() - 1000).toISOString(), level: 'INFO', message: 'Database backup completed successfully', source: 'System' },
    { id: 3, timestamp: new Date(Date.now() - 5000).toISOString(), level: 'WARN', message: 'High latency detected on container app-45-pod-1', source: 'AnomalyDetector' },
    { id: 4, timestamp: new Date(Date.now() - 10000).toISOString(), level: 'INFO', message: 'Health scores updated for 109 containers', source: 'HealthScorer' },
    { id: 5, timestamp: new Date(Date.now() - 15000).toISOString(), level: 'ERROR', message: 'Failed to connect to Prometheus endpoint (retry 1/3)', source: 'MetricsCollector' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">System Logs</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-800">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-slate-400 text-xs font-mono">/var/log/cha-system.log</span>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
        </div>
        <div className="p-4 font-mono text-sm h-[500px] overflow-y-auto">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-4 py-1 hover:bg-slate-800/50 px-2 rounded">
              <span className="text-slate-500 shrink-0">{log.timestamp}</span>
              <span className={`shrink-0 w-16 font-bold ${
                log.level === 'INFO' ? 'text-blue-400' :
                log.level === 'WARN' ? 'text-yellow-400' :
                log.level === 'ERROR' ? 'text-red-400' : 'text-slate-400'
              }`}>[{log.level}]</span>
              <span className="text-purple-400 shrink-0 w-32">{log.source}:</span>
              <span className="text-slate-300">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
