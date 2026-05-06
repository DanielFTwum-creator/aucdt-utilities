import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  ShieldCheck,
  Activity,
  ScrollText
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Pipeline', path: '/pipeline' },
    { icon: Users, label: 'Candidates', path: '/candidates' },
    { icon: FileText, label: 'Assessments', path: '/assessments' },
  ];

  const adminItems = [
    { icon: ShieldCheck, label: 'Diagnostics', path: '/admin/diagnostics' },
    { icon: ScrollText, label: 'Audit Logs', path: '/admin/logs' },
    { icon: Activity, label: 'Testing Suite', path: '/admin/testing' },
  ];

  return (
    <div className="min-h-screen bg-bg-warm flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-bg-card border-r border-border-color fixed h-full z-10 flex flex-col transition-colors duration-300">
        <div className="p-6 border-b border-border-color">
          <h1 className="text-2xl font-bold text-brand-primary flex items-center gap-2 font-display">
            <Activity className="w-6 h-6" />
            TalentVerify
          </h1>
        </div>
        
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          <div className="mb-2 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
            Recruitment
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors font-body ${
                  isActive 
                    ? 'bg-brand-primary/10 text-brand-primary' 
                    : 'text-text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-primary'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}

          {user?.role === 'admin' && (
            <>
              <div className="mt-6 mb-2 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                System Admin
              </div>
              {adminItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors font-body ${
                      isActive 
                        ? 'bg-brand-primary/10 text-brand-primary' 
                        : 'text-text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-primary'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-border-color">
          <div className="flex justify-center mb-4">
            <ThemeSwitcher />
          </div>
          
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xs">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate font-body">{user?.name}</p>
              <p className="text-xs text-text-muted truncate capitalize font-body">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-body"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 font-body">
        <Outlet />
      </main>
    </div>
  );
}
