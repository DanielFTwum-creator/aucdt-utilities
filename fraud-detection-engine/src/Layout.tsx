import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Outlet } from 'react-router-dom';
import { useThemeStore } from './themeStore';
import { Sun, Moon, Contrast } from 'lucide-react';
import { clsx } from 'clsx';

const themeLabels = {
  light: 'Light',
  dark: 'Dark',
  'high-contrast': 'High Contrast',
} as const;

const themeIcons = {
  light: Moon,
  dark: Contrast,
  'high-contrast': Sun,
} as const;

export function Layout() {
  const { mode, isDark, isHighContrast, cycleTheme } = useThemeStore();

  const bg = isHighContrast ? 'bg-black text-white' : isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900';
  const headerBg = isHighContrast ? 'bg-black border-yellow-400' : isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const NextIcon = themeIcons[mode];
  const nextIdx = (['light', 'dark', 'high-contrast'] as const).indexOf(mode);
  const nextLabel = themeLabels[(['light', 'dark', 'high-contrast'] as const)[(nextIdx + 1) % 3]];

  return (
    <div className={clsx("flex h-screen font-sans transition-colors duration-300", bg)}>
      <Sidebar />
      <main className="flex-1 overflow-auto" id="main-content">
        <header className={clsx("h-16 border-b flex items-center justify-between px-8 sticky top-0 z-10 transition-colors duration-300", headerBg)}>
          <div className="flex items-center gap-4">
            <span className={clsx(
              "px-2 py-1 text-xs font-medium rounded-full border",
              isHighContrast ? "bg-yellow-400 text-black border-yellow-400" : "bg-emerald-100 text-emerald-700 border-emerald-200"
            )}>
              System Operational
            </span>
            <span className={clsx("text-sm", isHighContrast ? "text-yellow-300" : isDark ? "text-slate-400" : "text-slate-500")}>
              Last updated: {new Date().toLocaleTimeString()} • v3.0.0
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={cycleTheme}
              className={clsx(
                "p-2 rounded-lg transition-colors flex items-center gap-2",
                isHighContrast ? "text-yellow-400 hover:bg-yellow-400/20 border border-yellow-400" : isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )}
              aria-label={`Switch to ${nextLabel} theme`}
              title={`Switch to ${nextLabel} theme`}
            >
              <NextIcon size={20} aria-hidden="true" />
              <span className="text-xs font-medium sr-only sm:not-sr-only">{themeLabels[mode]}</span>
            </button>
            <span className={clsx("text-sm font-semibold", isHighContrast ? "text-yellow-400" : isDark ? "text-slate-300" : "text-slate-700")}>
              Fraud Detection Engine
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
