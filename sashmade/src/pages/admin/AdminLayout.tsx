import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Activity, LogOut, ShieldCheck, TestTube, PackageSearch } from 'lucide-react';
import { cn } from '../../lib/utils';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { name: 'Dashboard',   path: '/admin/dashboard',   icon: LayoutDashboard },
    { name: 'Inventory',   path: '/admin/inventory',   icon: PackageSearch   },
    { name: 'Diagnostics', path: '/admin/diagnostics', icon: Activity        },
    { name: 'Testing',     path: '/admin/testing',     icon: TestTube        },
    { name: 'Audit Logs',  path: '/admin/audit',       icon: ShieldCheck     },
  ];

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#4A5340] text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-blue-800">
          <h2 className="font-serif font-bold text-xl text-[#D97706]">SashMade Admin</h2>
          <p className="text-xs text-blue-200 mt-1">Logged in as {user.username}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-[#D97706] text-[#4A5340]"
                  : "text-blue-100 hover:bg-white/10"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-300 hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
