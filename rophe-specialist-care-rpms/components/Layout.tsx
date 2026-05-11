import React, { useState } from 'react';
import { ThemeType, User } from '../types';

interface SidebarItemProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: (id: string) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ id, label, icon, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    aria-current={active ? 'page' : undefined}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
      active ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-500/20' : 'text-emerald-100 hover:bg-emerald-700/50 hover:text-white'
    }`}
  >
    <span aria-hidden="true">{icon}</span>
    <span className="font-semibold">{label}</span>
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: User;
  theme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, user, theme, onThemeChange, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> },
    { id: 'patients', label: 'Patient Registry', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg> },
    { id: 'clinical-notes', label: 'New Encounter', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> },
    { id: 'admin', label: 'System Admin', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> },
  ];

  const ThemeToggle = () => (
    <div className="flex items-center space-x-1 p-1 bg-emerald-950/50 rounded-xl" role="group" aria-label="Visual Theme">
      {(['light', 'dark', 'high-contrast'] as ThemeType[]).map((t) => (
        <button
          key={t}
          onClick={() => onThemeChange(t)}
          aria-label={`Set theme to ${t}`}
          aria-pressed={theme === t}
          className={`p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-white ${theme === t ? 'bg-emerald-500 text-white shadow' : 'text-emerald-300 hover:text-white hover:bg-emerald-800'}`}
        >
          {t === 'light' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>}
          {t === 'dark' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>}
          {t === 'high-contrast' && <span className="text-[10px] font-bold" aria-hidden="true">HC</span>}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <nav aria-label="Main Navigation" className="hidden md:flex flex-col w-72 bg-emerald-900 p-6 fixed h-full z-20">
        <header className="mb-10 flex items-center space-x-3">
          <div className="bg-white p-2 rounded-2xl shadow-emerald-900/50 shadow-lg">
             <svg className="w-8 h-8 text-emerald-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.89,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19M10,17H14V13H17V9H14V5H10V9H7V13H10V17Z"/></svg>
          </div>
          <div>
            <h1 className="text-white font-black text-2xl tracking-tighter leading-none">ROPHE</h1>
            <span className="text-emerald-300 text-[10px] uppercase font-black tracking-widest">Clinical HUB</span>
          </div>
        </header>
        
        <div className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              {...item}
              active={activeTab === item.id}
              onClick={onTabChange}
            />
          ))}
        </div>

        <div className="mt-auto space-y-6">
          <section aria-label="Display Settings">
            <h2 className="text-emerald-300 text-[10px] uppercase font-black tracking-widest mb-2 px-2">Visual Theme</h2>
            <ThemeToggle />
          </section>

          <section aria-label="User Profile" className="p-5 bg-emerald-950/30 rounded-2xl border border-emerald-800/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-black shadow-lg">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-white font-bold truncate leading-tight">{user.name}</p>
                <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider truncate">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full py-2.5 bg-emerald-800 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all border border-emerald-700/50 focus:ring-2 focus:ring-white"
            >
              Sign Out
            </button>
          </section>
        </div>
      </nav>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 md:ml-72 p-6 md:p-12 min-h-screen" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
};

export default Layout;