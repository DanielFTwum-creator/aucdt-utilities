import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Outlet } from 'react-router-dom';
import { useThemeStore } from './themeStore';
import { Sun, Moon } from 'lucide-react';
import { clsx } from 'clsx';

export function Layout() {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <div className={clsx("flex h-screen font-sans transition-colors duration-300", isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900")}>
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <header className={clsx("h-16 border-b flex items-center justify-between px-8 sticky top-0 z-10 transition-colors duration-300", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
          <div className="flex items-center gap-4">
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
              System Operational
            </span>
            <span className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
              Last updated: {new Date().toLocaleTimeString()} • v2.0.0
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={clsx("p-2 rounded-lg transition-colors", isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100")}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <span className={clsx("text-sm font-semibold", isDark ? "text-slate-300" : "text-slate-700")}>
              Societal Impact Simulator
            </span>
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
