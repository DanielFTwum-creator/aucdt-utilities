import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      <nav className="w-64 border-r border-zinc-800 p-4">
        <h1 className="font-bold mb-8">Admin Panel</h1>
        <ul className="space-y-2">
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/logs">Audit Logs</Link></li>
          <li><Link to="/admin/diagnostics">Diagnostics</Link></li>
          <li><Link to="/admin/testing">Testing Suite</Link></li>
        </ul>
      </nav>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
