import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export function AdminGuard() {
  const isAuthenticated = localStorage.getItem('tuc_admin_auth') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <header className="bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center">
        <h1 className="font-bold text-[#C8A84B] font-['Playfair_Display']">TUC Admin Portal</h1>
        <nav className="flex gap-4">
          <a href="/admin/dashboard" className="text-sm hover:text-[#C8A84B] transition">Dashboard</a>
          <a href="/admin/logs" className="text-sm hover:text-[#C8A84B] transition">Audit Logs</a>
          <a href="/admin/testing" className="text-sm hover:text-[#C8A84B] transition">Testing</a>
          <button 
            onClick={() => {
              localStorage.removeItem('tuc_admin_auth');
              window.location.href = '/login';
            }}
            className="text-sm text-red-400 hover:text-red-300 transition"
          >
            Logout
          </button>
        </nav>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
