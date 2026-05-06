import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  History, 
  Settings, 
  ShieldAlert, 
  Database, 
  Activity, 
  Terminal,
  Server,
  Network,
  Sun,
  Moon,
  LogOut,
  User,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SidebarItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }`
      }
      aria-label={label}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

const Layout: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('high-contrast');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (theme === 'dark') return <Moon size={20} />;
    if (theme === 'high-contrast') return <Eye size={20} />;
    return <Sun size={20} />;
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-xl">S</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">SEND Platform</h1>
              <p className="text-xs text-gray-400">v1.0.0 (Stable)</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto" role="navigation" aria-label="Main Navigation">
          <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider" id="nav-core-modules">
            Core Modules
          </div>
          <div role="group" aria-labelledby="nav-core-modules">
            <SidebarItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <SidebarItem to="/jobs" icon={<FileText size={20} />} label="Report Jobs" />
            <SidebarItem to="/schedules" icon={<Calendar size={20} />} label="Schedules" />
            <SidebarItem to="/executions" icon={<History size={20} />} label="Execution Log" />
          </div>
          
          <div className="mt-8 px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider" id="nav-admin-console">
            Admin Console
          </div>
          <div role="group" aria-labelledby="nav-admin-console">
            <SidebarItem to="/admin/api-gateway" icon={<Network size={20} />} label="API Gateway" />
            <SidebarItem to="/admin/diagnostics" icon={<ShieldAlert size={20} />} label="Diagnostics" />
            <SidebarItem to="/admin/db-monitor" icon={<Database size={20} />} label="DB Monitor" />
            <SidebarItem to="/admin/performance" icon={<Activity size={20} />} label="Performance" />
            <SidebarItem to="/admin/logs" icon={<Terminal size={20} />} label="System Logs" />
            <SidebarItem to="/admin/testing" icon={<Server size={20} />} label="Test Suites" />
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-green-400 flex items-center justify-center text-xs font-bold text-white">
              {user?.username.substring(0,2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-green-400">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-8 shadow-sm transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {isAdmin ? 'System Administration' : 'Report Management'}
          </h2>
          <div className="flex items-center space-x-4">
             <button 
               onClick={toggleTheme}
               className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
               aria-label="Toggle Theme"
               title={`Current theme: ${theme}`}
             >
               {getThemeIcon()}
             </button>
             
             <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>

             <button 
                onClick={logout}
                className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Logout"
                title="Logout"
             >
               <LogOut size={20} />
             </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;