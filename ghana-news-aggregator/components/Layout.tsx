import React from 'react';
import { LayoutDashboard, Activity, FileText, Settings as SettingsIcon, Radio, LogOut, ShieldCheck, Sun, Moon, Eye, RefreshCw } from 'lucide-react';
import { Theme } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  username: string;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange, 
  onLogout, 
  username,
  currentTheme,
  onThemeChange
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agent', label: 'Agent Monitor', icon: Activity },
    { id: 'feed', label: 'News Feed', icon: Radio },
    { id: 'refresh', label: 'Refresh Protocol', icon: RefreshCw },
    { id: 'test', label: 'Self-Test', icon: ShieldCheck },
    { id: 'docs', label: 'Documentation', icon: FileText },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const toggleTheme = () => {
    if (currentTheme === 'light') onThemeChange('dark');
    else if (currentTheme === 'dark') onThemeChange('high-contrast');
    else onThemeChange('light');
  };

  const getThemeLabel = () => {
    switch (currentTheme) {
      case 'light': return 'Light Mode';
      case 'dark': return 'Dark Mode';
      case 'high-contrast': return 'High Contrast Mode';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar */}
      <aside 
        className="w-64 bg-slate-900 dark:bg-black text-white flex flex-col shadow-xl z-20 transition-colors duration-300 no-print"
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="p-6 border-b border-slate-700 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <span className="font-bold text-lg text-white" aria-hidden="true">G</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight">Ghana News</h1>
              <p className="text-xs text-slate-400">Auto-Poster System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                activeTab === item.id
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50 font-medium'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
              aria-current={activeTab === item.id ? 'page' : undefined}
              aria-label={`Navigate to ${item.label}`}
            >
              <item.icon size={20} className={`transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700 dark:border-slate-800 space-y-4">
          <div className="bg-slate-800 dark:bg-slate-900 rounded-lg p-3 border border-slate-700 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SYSTEM STATUS</span>
              <span className="w-2 h-2 rounded-full bg-[#C8A84B] animate-pulse" aria-label="System Online"></span>
            </div>
            <p className="text-xs text-slate-300 font-mono text-[#C8A84B]">v3.0.0-core</p>
          </div>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Logout"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative flex flex-col" role="main">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-8 sticky top-0 z-10 transition-colors duration-300 no-print">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white capitalize tracking-tight font-serif">
            {menuItems.find(m => m.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700 shadow-inner">
              <button
                onClick={() => onThemeChange('light')}
                className={`p-1.5 rounded-full transition-all ${currentTheme === 'light' ? 'bg-white dark:bg-slate-700 text-brand-500 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                title="Light Mode"
                aria-label="Switch to light mode"
              >
                <Sun size={16} />
              </button>
              <button
                onClick={() => onThemeChange('dark')}
                className={`p-1.5 rounded-full transition-all ${currentTheme === 'dark' ? 'bg-white dark:bg-slate-700 text-brand-500 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                title="Dark Mode"
                aria-label="Switch to dark mode"
              >
                <Moon size={16} />
              </button>
              <button
                onClick={() => onThemeChange('high-contrast')}
                className={`p-1.5 rounded-full transition-all ${currentTheme === 'high-contrast' ? 'bg-white dark:bg-slate-700 text-brand-500 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                title="High Contrast Mode"
                aria-label="Switch to high contrast mode"
              >
                <Eye size={16} />
              </button>
            </div>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

            <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:inline">
                Logged in as <span className="font-semibold text-slate-700 dark:text-slate-200">{username}</span>
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-purple-500 border-2 border-white dark:border-slate-600 shadow-sm" aria-hidden="true"></div>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto w-full flex-1" id="main-content">
          {children}
        </div>
      </main>
    </div>
  );
};