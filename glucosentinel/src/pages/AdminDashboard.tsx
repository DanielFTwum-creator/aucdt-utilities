import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-700">System Status</h2>
          <div className="mt-2 text-2xl font-bold text-emerald-600">Healthy</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-700">Active Users</h2>
          <div className="mt-2 text-2xl font-bold text-blue-600">1</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-700">Pending Alerts</h2>
          <div className="mt-2 text-2xl font-bold text-amber-600">0</div>
        </div>
      </div>
    </div>
  );
}
