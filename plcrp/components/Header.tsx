import React from 'react';
import type { Module } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  module: Partial<Module> | null | undefined;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ module, onHomeClick }) => {
  const { userEmail, logout } = useAuth();
  const displayName = userEmail ? userEmail.split('@')[0] : 'Student';

  return (
    <header
      role="banner"
      aria-label="Application header"
      className="h-20 flex-shrink-0 flex items-center justify-between px-6 lg:px-8 border-b border-[var(--color-border-card)]/50 bg-[var(--color-background-main)]"
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={onHomeClick}
          aria-label="Return to dashboard"
          className="text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition"
        >
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        <div className="h-6 w-px bg-[var(--color-border-card)]" aria-hidden="true" />
        {module ? (
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">{module.title}</h2>
            <p className="text-sm text-[var(--color-foreground-muted)]">{module.description}</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)] font-playfair">Dashboard</h2>
            <p className="text-sm text-[var(--color-foreground-muted)]">Production-Level Content Rights Platform</p>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right hidden md:block">
          <p className="font-semibold text-sm text-[var(--color-foreground)]">{displayName}</p>
          <p className="text-xs text-[var(--color-foreground-muted)]">PLCRP User</p>
        </div>
        <button
          onClick={logout}
          aria-label="Sign out"
          className="text-xs text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] border border-[var(--color-border-input)] rounded-md px-3 py-1.5 transition hover:bg-[var(--color-background-card-hover)]"
        >
          Sign out
        </button>
      </div>
    </header>
  );
};
