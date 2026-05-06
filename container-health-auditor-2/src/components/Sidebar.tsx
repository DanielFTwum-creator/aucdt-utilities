import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Server, Settings, ShieldAlert, FileText, Database, Terminal, Shield } from 'lucide-react';
import { clsx } from 'clsx';

export function Sidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
    { icon: Server, label: 'Containers', to: '/containers' },
    { icon: Activity, label: 'Health', to: '/health' },
    { icon: ShieldAlert, label: 'Alerts', to: '/alerts' },
  ];

  const adminItems = [
    { icon: Terminal, label: 'Diagnostics', to: '/admin/diagnostics' },
    { icon: Shield, label: 'Sentinel Interface', to: '/admin/sentinel' },
    { icon: Database, label: 'DB Monitor', to: '/admin/db-monitor' },
    { icon: FileText, label: 'Logs', to: '/admin/logs' },
    { icon: Activity, label: 'Performance', to: '/admin/performance' },
    { icon: Settings, label: 'Testing', to: '/admin/testing' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          CHA-110
        </h1>
        <p className="text-xs text-slate-400 mt-1 flex justify-between">
          <span>Container Health Auditor</span>
          <span className="text-slate-600">v2.0</span>
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-8">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
            Monitoring
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    )
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
            Admin
          </p>
          <ul className="space-y-1">
            {adminItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-800'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    )
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">
            S
          </div>
          <div>
            <p className="text-sm font-medium">Sentinel AI</p>
            <p className="text-xs text-slate-500">Orchestrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
