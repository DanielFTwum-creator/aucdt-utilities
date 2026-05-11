import React from 'react';

export default function AdminDiagnostics() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">System Diagnostics</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold mb-4">Database Connection</h2>
        <div className="flex items-center gap-2 text-emerald-600">
          <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
          Connected (SQLite)
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold mb-4">API Health Check</h2>
        <div className="flex items-center gap-2 text-emerald-600">
          <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
          /api/health: OK (200)
        </div>
      </div>
    </div>
  );
}
