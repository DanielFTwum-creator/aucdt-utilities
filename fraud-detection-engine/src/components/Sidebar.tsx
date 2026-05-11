import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Database, Activity, Bell, Settings, Shield } from 'lucide-react';
import { useThemeStore } from '../themeStore';
import { clsx } from 'clsx';

export function Sidebar() {
  const location = useLocation();
  const { isDark, isHighContrast } = useThemeStore();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/entities', label: 'Entities', icon: Database },
    { path: '/health', label: 'Health', icon: Activity },
    { path: '/alerts', label: 'Alerts', icon: Bell },
    { path: '/admin/diagnostics', label: 'Admin', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path.replace('/diagnostics', ''));
  };

  const sidebarBg = isHighContrast ? 'bg-black border-yellow-400' : isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const logoBg = isHighContrast ? 'text-yellow-400' : 'text-blue-600';
  const logoText = isHighContrast ? 'text-yellow-400' : isDark ? 'text-white' : 'text-slate-900';

  return (
    <aside
      className={clsx("w-64 border-r flex flex-col transition-colors duration-300", sidebarBg)}
      role="navigation"
      aria-label="Primary navigation"
    >
      <div className={clsx("h-16 flex items-center px-6 border-b", isHighContrast ? "border-yellow-400" : "border-inherit")}>
        <Shield className={clsx(logoBg, "mr-3")} size={24} aria-hidden="true" />
        <span className={clsx("font-bold text-lg", logoText)}>THE AGENT</span>
      </div>
      <nav className="flex-1 p-4 space-y-1" aria-label="Main navigation">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={active ? 'page' : undefined}
              aria-label={`Navigate to ${item.label}`}
              title={item.label}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2",
                isHighContrast
                  ? active
                    ? "bg-yellow-400 text-black font-bold focus:ring-yellow-400"
                    : "text-yellow-300 hover:bg-yellow-400/20 hover:text-yellow-400 focus:ring-yellow-400"
                  : active
                    ? isDark ? "bg-blue-600 text-white focus:ring-blue-500" : "bg-blue-50 text-blue-700 focus:ring-blue-500"
                    : isDark ? "text-slate-400 hover:bg-slate-800 hover:text-white focus:ring-slate-600" : "text-slate-600 hover:bg-slate-100 focus:ring-slate-400"
              )}
            >
              <Icon size={20} aria-hidden="true" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className={clsx("p-4 border-t text-xs", isHighContrast ? "border-yellow-400 text-yellow-600" : isDark ? "border-slate-800 text-slate-600" : "border-slate-200 text-slate-400")}>
        App ID 137 &bull; v3.0.0
      </div>
    </aside>
  );
}
