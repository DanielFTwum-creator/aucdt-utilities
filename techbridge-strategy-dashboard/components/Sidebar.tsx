import React from 'react';
import { LayoutDashboard, PieChart, TrendingUp, AlertTriangle, FileText, Settings, Sun, Moon, Contrast, TestTube2, Bot } from 'lucide-react';
import { Theme } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isAuthenticated: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, theme, setTheme, isAuthenticated }) => {
  const menuItems = [
    { id: 'overview', label: 'Executive Briefing', icon: LayoutDashboard },
    { id: 'strategy', label: 'Strategic Plan', icon: FileText },
    { id: 'financials', label: 'Financial Projections', icon: TrendingUp },
    { id: 'marketing', label: 'Recruitment & Brand', icon: PieChart },
    { id: 'risks', label: 'Risk Assessment', icon: AlertTriangle },
  ];

  if (isAuthenticated) {
    menuItems.push({ id: 'agent', label: 'AI Data Agent', icon: Bot });
  }

  menuItems.push({ id: 'admin', label: 'Admin Settings', icon: Settings });

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 shadow-xl z-50 border-r border-slate-800">
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="bg-white p-1 rounded-lg w-10 h-10 flex items-center justify-center">
            <img 
                src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" 
                alt="TechBridge Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-xs font-bold text-slate-900">TUC</span>';
                }}
            />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">TECHBRIDGE</h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest">University College</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-4" aria-label="Main Navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-slate-800 bg-slate-900">
        <div className="mb-6">
           <p className="text-xs font-bold text-slate-500 uppercase mb-3">Accessibility Mode</p>
           <div className="flex bg-slate-800 rounded-lg p-1">
             <button 
                onClick={() => setTheme('light')}
                className={`flex-1 p-2 rounded-md flex justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
                aria-label="Light Mode"
                title="Light Mode"
             >
               <Sun size={16} />
             </button>
             <button 
                onClick={() => setTheme('dark')}
                className={`flex-1 p-2 rounded-md flex justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                aria-label="Dark Mode"
                title="Dark Mode"
             >
               <Moon size={16} />
             </button>
             <button 
                onClick={() => setTheme('contrast')}
                className={`flex-1 p-2 rounded-md flex justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'contrast' ? 'bg-white text-black font-bold border-2 border-white' : 'text-slate-400 hover:text-white'}`}
                aria-label="High Contrast Mode"
                title="High Contrast Mode"
             >
               <Contrast size={16} />
             </button>
           </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold border border-slate-700">DT</div>
          <div>
            <p className="text-sm font-medium">Daniel F. Twum</p>
            <p className="text-xs text-slate-400">Head of ICT</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;