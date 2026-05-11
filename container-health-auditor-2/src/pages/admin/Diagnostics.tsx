import React from 'react';

export function Diagnostics() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">System Diagnostics</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold mb-4">Self-Check Status</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <span className="text-slate-600">API Latency</span>
            <span className="text-emerald-600 font-mono">12ms</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <span className="text-slate-600">Database Connection</span>
            <span className="text-emerald-600 font-medium">Connected</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <span className="text-slate-600">Metric Ingestion Rate</span>
            <span className="text-blue-600 font-mono">450/sec</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-slate-600">Anomaly Detection Model</span>
            <span className="text-emerald-600 font-medium">Active (v1.2.4)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
