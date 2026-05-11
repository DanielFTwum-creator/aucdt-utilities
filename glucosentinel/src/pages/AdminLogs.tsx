import React from 'react';

export default function AdminLogs() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">System Logs</h1>
      <div className="bg-slate-900 text-slate-300 p-6 rounded-xl shadow-sm font-mono text-sm h-96 overflow-y-auto">
        <div>[INFO] 2026-03-01 09:00:00 - Server started on port 3000</div>
        <div>[INFO] 2026-03-01 09:00:01 - Database connected successfully</div>
        <div>[INFO] 2026-03-01 09:05:23 - GET /api/readings 200 OK</div>
        <div>[INFO] 2026-03-01 09:10:45 - POST /api/readings 201 Created</div>
        <div>[WARN] 2026-03-01 09:15:12 - Slow query detected on /api/patterns (150ms)</div>
      </div>
    </div>
  );
}
