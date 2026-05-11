import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-white p-6">
        <h1 className="text-xl font-bold mb-8">Admin Panel</h1>
        <nav className="space-y-2">
          <Link to="/admin/dashboard" className="block py-2 px-4 hover:bg-slate-800 rounded">Dashboard</Link>
          <Link to="/admin/diagnostics" className="block py-2 px-4 hover:bg-slate-800 rounded">Diagnostics</Link>
          <Link to="/admin/testing" className="block py-2 px-4 hover:bg-slate-800 rounded">Testing Suite</Link>
          <Link to="/admin/logs" className="block py-2 px-4 hover:bg-slate-800 rounded">System Logs</Link>
          <button 
            onClick={() => {
              localStorage.removeItem('isAdmin');
              navigate('/admin/login');
            }}
            className="block w-full text-left py-2 px-4 hover:bg-slate-800 rounded text-red-400 mt-8"
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
