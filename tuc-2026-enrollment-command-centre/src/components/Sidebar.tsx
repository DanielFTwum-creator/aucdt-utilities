import React from "react";
import { 
  Rows3, 
  UsersRound, 
  Filter, 
  CheckSquare, 
  Settings,
  HelpCircle,
  LogOut,
  ShieldAlert,
  Sun,
  Moon,
  Eye
} from "lucide-react";
import { motion } from "motion/react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

const navItems = [
  { id: 'timeline', label: 'Timeline', icon: Rows3 },
  { id: 'segments', label: 'By Segment', icon: UsersRound },
  { id: 'funnel', label: 'Funnel Fixes', icon: Filter },
  { id: 'week1', label: 'Week 1 Checklist', icon: CheckSquare },
  { id: 'admin', label: 'Admin Panel', icon: ShieldAlert },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, theme, setTheme }) => {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col border-r border-white/5 bg-sidebar md:flex" aria-label="Main Navigation">
      <div className="flex h-24 items-center px-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-500 shadow-lg shadow-indigo-500/20" />
          <div>
            <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Techbridge</div>
            <div className="font-serif text-lg text-slate-100 italic">Command</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8">
        <div className="mb-4 px-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Operational Modules</div>
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              aria-current={activeTab === item.id ? 'page' : undefined}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === item.id 
                  ? "bg-white/10 text-white" 
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 h-5 w-1 rounded-r-full bg-indigo-500"
                />
              )}
              <item.icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110`} aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-12 mb-4 px-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Accessibility & Theme</div>
        <div className="grid grid-cols-3 gap-2 px-2">
          {[
            { id: 'light', icon: Sun, label: 'Light' },
            { id: 'dark', icon: Moon, label: 'Dark' },
            { id: 'high-contrast', icon: Eye, label: 'Contrast' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              aria-label={`Switch to ${t.label} theme`}
              className={`flex flex-col items-center justify-center rounded-xl p-3 transition-all ${
                theme === t.id 
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" 
                  : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
              }`}
            >
              <t.icon className="h-4 w-4" />
              <span className="mt-1 text-[8px] font-bold uppercase tracking-tighter">{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="p-4">
        <button className="flex w-full items-center justify-between rounded-2xl bg-white/5 px-6 py-4 text-sm font-medium text-slate-300 transition-all hover:bg-white/10" aria-label="User profile">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">DT</div>
            <span>Daniel Twum</span>
          </div>
          <LogOut className="h-4 w-4 opacity-50" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
};
