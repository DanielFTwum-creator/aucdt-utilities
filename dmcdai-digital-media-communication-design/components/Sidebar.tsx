import React from 'react';
import { MODULES } from '../constants';
import type { ModuleId } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  activeModuleId: ModuleId | 'admin' | null;
  setActiveModuleId: (id: ModuleId | 'admin' | null) => void;
  onAdminClick: () => void;
  /** Mobile drawer open state. */
  isOpen?: boolean;
  /** Close the mobile drawer (backdrop tap / nav). */
  onClose?: () => void;
}

const AdminIcon: React.FC = () => (
    <div className="w-6 h-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
        </svg>
    </div>
);


export const Sidebar: React.FC<SidebarProps> = ({ activeModuleId, setActiveModuleId, onAdminClick, isOpen = false, onClose }) => {
  const { theme, setTheme } = useTheme();

  return (
    <>
    {/* Mobile backdrop — only when the drawer is open, below md */}
    {isOpen && (
      <div
        className="fixed inset-0 z-30 bg-black/50 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
    )}
    <aside
      className={`w-64 bg-[var(--color-background-card)] md:bg-[var(--color-background-card)]/50 backdrop-blur-lg flex-shrink-0 flex flex-col border-r border-[var(--color-border-card)]/50
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 md:static md:z-auto md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="h-20 flex items-center px-6 border-b border-[var(--color-border-card)]/50">
        <h1 className="text-2xl font-bold tracking-tighter text-[var(--color-foreground)] font-playfair">
          dmcd<span className="text-[var(--color-primary)]">AI</span>
        </h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {MODULES.map((module) => (
          <button
            key={module.id}
            onClick={() => setActiveModuleId(module.id)}
            aria-label={`Open ${module.title}`}
            title={`Navigate to ${module.title}`}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-left ${
              activeModuleId === module.id
                ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold'
                : 'text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-card-hover)] hover:text-[var(--color-foreground)]'
            }`}
          >
            <span className={module.color}>{module.icon}</span>
            <span className="text-sm">{module.title}</span>
          </button>
        ))}
        <div className="!mt-6 pt-4 border-t border-[var(--color-border-card)]/50">
             <button
                onClick={onAdminClick}
                aria-label="Access Admin Panel"
                title="Go to Admin Section"
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-left ${
                activeModuleId === 'admin'
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold'
                    : 'text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-card-hover)] hover:text-[var(--color-foreground)]'
                }`}
            >
                <span className="text-gray-400"><AdminIcon /></span>
                <span className="text-sm">Admin Panel</span>
            </button>
        </div>
      </nav>
      <div className="p-4 border-t border-[var(--color-border-card)]/50">
        <label htmlFor="theme-switcher" className="text-xs text-[var(--color-foreground-muted)] mb-2 block font-medium">Display Theme</label>
        <select
            id="theme-switcher"
            value={theme}
            onChange={(e) => setTheme(e.target.value as any)}
            className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-2 text-xs text-[var(--color-foreground)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
            aria-label="Select a display theme"
        >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="high-contrast">High Contrast</option>
        </select>
      </div>
      <div className="p-4 border-t border-[var(--color-border-card)]/50 text-xs text-gray-500 font-inter">
        <p>&copy; 2026 Techbridge University College</p>
        <p>Institutional Sandbox</p>
      </div>
    </aside>
    </>
  );
};
