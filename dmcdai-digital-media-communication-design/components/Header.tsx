import React from 'react';
import type { Module } from '../types';

interface HeaderProps {
  module: Partial<Module> | null | undefined;
  onHomeClick: () => void;
  /** Open the mobile sidebar drawer. */
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ module, onHomeClick, onMenuClick }) => {
  return (
    <header className="h-20 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-[var(--color-border-card)]/50 bg-[var(--color-background-main)]">
      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors flex-shrink-0"
          aria-label="Open menu"
          title="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button onClick={onHomeClick} className="text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors" aria-label="Go to dashboard" title="Return to Dashboard">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        </button>
        <div className="h-6 w-px bg-[var(--color-border-card)]"></div>
        {module ? (
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-foreground)] truncate">{module.title}</h2>
            <p className="text-xs sm:text-sm text-[var(--color-foreground-muted)] truncate">{module.description}</p>
          </div>
        ) : (
          <div className="min-w-0">
             <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-foreground)] font-playfair truncate">Dashboard</h2>
            <p className="text-xs sm:text-sm text-[var(--color-foreground-muted)] font-inter truncate">Welcome to the dmcdAI Learning Sandbox</p>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
        <div className="text-right hidden sm:block">
            <p className="font-semibold text-sm">Ama (Student)</p>
            <p className="text-xs text-gray-500">BTech DMCD</p>
        </div>
        <img src="https://picsum.photos/seed/student/40/40" alt="User Avatar" className="w-10 h-10 rounded-full" />
      </div>
    </header>
  );
};
