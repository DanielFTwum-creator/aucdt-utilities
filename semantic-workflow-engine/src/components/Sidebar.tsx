import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Database, Activity, Bell, Settings, Shield } from 'lucide-react';
import { useThemeStore } from '../themeStore';
import { clsx } from 'clsx';

export function Sidebar() {
  const location = useLocation();
  const { isDark } = useThemeStore();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/entities', label: 'Entities', icon: Database },
    { path: '/health', label: 'Health', icon: Activity },
    { path: '/alerts', label: 'Alerts', icon: Bell },
    { path: '/admin/diagnostics', label: 'Admin', icon: Settings },
  ];

  return (
    <aside className={clsx("w-64 border-r flex flex-col transition-colors duration-300", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
      <div className="h-16 flex items-center px-6 border-b border-inherit">
        <Shield className="text-blue-600 mr-3" size={24} />
        <span className={clsx("font-bold text-lg", isDark ? "text-white" : "text-slate-900")}>
          THE AGENT
        </span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? (isDark ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700")
                  : (isDark ? "text-slate-400 hover:bg-slate-800 hover:text-white" : "text-slate-600 hover:bg-slate-100")
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
