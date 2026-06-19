import React from 'react';
import { TrendingUp, Star, BarChart2, Activity, Bell, Brain, Newspaper, Search, ShieldCheck, Lock, BookOpen } from 'lucide-react';
import type { View, User } from '../../types';

interface SidebarProps {
  activeView: View;
  onViewChange: (v: View) => void;
  user: User | null;
  onLoginClick: () => void;
}

const NAV_ITEMS: { view: View; label: string; icon: React.ReactNode; premiumOnly?: boolean }[] = [
  { view: 'watchlist', label: 'Watchlist', icon: <Star size={15} /> },
  { view: 'portfolio', label: 'Portfolio', icon: <BarChart2 size={15} /> },
  { view: 'paper', label: 'Paper Trade', icon: <Activity size={15} /> },
  { view: 'alerts', label: 'Alerts', icon: <Bell size={15} /> },
  { view: 'ai', label: 'AI Signals', icon: <Brain size={15} /> },
  { view: 'news', label: 'News', icon: <Newspaper size={15} /> },
  { view: 'screener', label: 'Screener', icon: <Search size={15} />, premiumOnly: true },
  { view: 'guide', label: 'User Guide', icon: <BookOpen size={15} /> },
];

export default function Sidebar({ activeView, onViewChange, user, onLoginClick }: SidebarProps) {
  const isPremium = user?.tier === 'premium';

  const handleNav = (item: typeof NAV_ITEMS[0]) => {
    if (!user) { onLoginClick(); return; }
    if (item.premiumOnly && !isPremium) { onLoginClick(); return; }
    onViewChange(item.view);
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : null;

  return (
    <aside
      className="w-[200px] bg-[#F7F7F6] dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shrink-0"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div className="px-5 py-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-800">
        <TrendingUp className="text-indigo-600" size={20} aria-hidden="true" />
        <span className="text-[15px] font-bold text-gray-900 dark:text-white tracking-tight">StockPulse</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-2.5 space-y-0.5">
        {NAV_ITEMS.map(item => {
          const locked = item.premiumOnly && !isPremium;
          const active = activeView === item.view;
          return (
            <button
              type="button"
              key={item.view}
              onClick={() => handleNav(item)}
              aria-current={active ? 'page' : undefined}
              aria-label={`${item.label}${locked ? ' (Premium)' : ''}`}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors text-left ${
                active
                  ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className={active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-600'} aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
              {locked && <Lock size={10} className="ml-auto text-amber-500" aria-label="Premium feature" />}
            </button>
          );
        })}
      </nav>

      {/* Footer: admin + user card */}
      <div className="p-2.5 border-t border-gray-200 dark:border-gray-800 space-y-1">
        {user && (
          <button
            type="button"
            onClick={() => onViewChange('admin')}
            aria-current={activeView === 'admin' ? 'page' : undefined}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors text-left ${
              activeView === 'admin'
                ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-500 dark:text-gray-500 hover:bg-gray-200/60 dark:hover:bg-gray-800'
            }`}
          >
            <ShieldCheck size={15} aria-hidden="true" /> Admin
          </button>
        )}

        {/* User card */}
        <div className="px-3 py-2.5">
          {user ? (
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 text-[11px] font-bold shrink-0"
                aria-hidden="true"
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-gray-800 dark:text-gray-200 truncate leading-tight">{user.name}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate leading-tight">{user.email}</p>
                <p className="text-[11px] mt-0.5">
                  <span className={`font-semibold ${user.tier === 'premium' ? 'text-amber-500' : 'text-gray-400'}`}>
                    {user.tier === 'premium' ? '★ Premium' : 'Free Plan'}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onLoginClick}
              className="text-[12px] text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              Sign in to get started →
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
