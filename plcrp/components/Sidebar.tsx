import React from 'react';
import { MODULES } from '../constants';
import type { ModuleId } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  activeModuleId: ModuleId | 'admin' | null;
  setActiveModuleId: (id: ModuleId | 'admin' | null) => void;
  onAdminClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeModuleId, setActiveModuleId, onAdminClick }) => {
  const { theme, setTheme } = useTheme();

  return (
    <aside aria-label="Main navigation" className="w-64 bg-[var(--color-background-card)]/50 backdrop-blur-lg flex-shrink-0 flex flex-col border-r border-[var(--color-border-card)]/50">
      <div className="h-20 flex items-center px-6 border-b border-[var(--color-border-card)]/50">
        <h1 className="text-2xl font-bold tracking-tighter text-[var(--color-foreground)] font-playfair">
          PLC<span className="text-[var(--color-primary)]">RP</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        <button
          onClick={() => setActiveModuleId(null)}
          aria-label="Go to dashboard"
          aria-current={activeModuleId === null ? 'page' : undefined}
          className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-left text-sm ${
            activeModuleId === null
              ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold'
              : 'text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-card-hover)] hover:text-[var(--color-foreground)]'
          }`}
        >
          <span aria-hidden="true" className="w-6 h-6 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </span>
          <span>Dashboard</span>
        </button>

        {MODULES.map(module => (
          <button
            key={module.id}
            onClick={() => setActiveModuleId(module.id)}
            aria-label={`Open ${module.title}`}
            aria-current={activeModuleId === module.id ? 'page' : undefined}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-left text-sm ${
              activeModuleId === module.id
                ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold'
                : 'text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-card-hover)] hover:text-[var(--color-foreground)]'
            }`}
          >
            <span aria-hidden="true" className={`flex-shrink-0 ${module.color}`}>{module.icon}</span>
            <span>{module.title}</span>
          </button>
        ))}

        <div className="pt-4 mt-4 border-t border-[var(--color-border-card)]/50">
          <button
            onClick={onAdminClick}
            aria-label="Access Admin Panel"
            aria-current={activeModuleId === 'admin' ? 'page' : undefined}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-left text-sm ${
              activeModuleId === 'admin'
                ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold'
                : 'text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-card-hover)] hover:text-[var(--color-foreground)]'
            }`}
          >
            <span aria-hidden="true" className="w-6 h-6 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
              </svg>
            </span>
            <span>Admin Panel</span>
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-[var(--color-border-card)]/50">
        <label htmlFor="plcrp-theme-switcher" className="text-xs text-[var(--color-foreground-muted)] mb-2 block font-medium">Display Theme</label>
        <select
          id="plcrp-theme-switcher"
          value={theme}
          onChange={e => setTheme(e.target.value as any)}
          aria-label="Select a display theme"
          className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-2 text-xs text-[var(--color-foreground)] focus:ring-1 focus:ring-[var(--color-primary)] transition"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="high-contrast">High Contrast</option>
        </select>
      </div>

      <div className="p-4 border-t border-[var(--color-border-card)]/50 text-xs text-[var(--color-foreground-muted)]">
        <p>&copy; 2026 Techbridge University College</p>
        <p>Institutional Sandbox — PLCRP v1.0</p>
      </div>
    </aside>
  );
};
