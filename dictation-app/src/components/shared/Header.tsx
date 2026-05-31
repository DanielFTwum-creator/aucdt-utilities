import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';
import { LogOut, Sun, Moon, Radio } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onLogout?: () => void;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, icon, onLogout, actions }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      {/* Left: Brand */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Signal dot */}
        <span className="signal-dot flex-shrink-0" title="System online" />

        {/* Icon */}
        {icon && (
          <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              background: 'rgba(0,212,255,0.08)',
              border: '1px solid rgba(0,212,255,0.18)',
              color: 'var(--cyan)',
            }}
          >
            {icon}
          </div>
        )}

        {/* Title / subtitle */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1
              className="text-sm font-mono font-bold uppercase tracking-[0.12em] truncate"
              style={{ color: 'var(--cyan)', textShadow: '0 0 12px rgba(0,212,255,0.3)' }}
            >
              {title}
            </h1>
            {/* Broadcast-style channel label */}
            <span
              className="hidden sm:inline-flex text-[9px] font-mono font-bold tracking-widest uppercase px-1.5 py-0.5 rounded"
              style={{
                background: 'rgba(0,212,255,0.08)',
                border: '1px solid rgba(0,212,255,0.15)',
                color: 'var(--text-secondary)',
              }}
            >
              AI-01
            </span>
          </div>
          {subtitle && (
            <p className="text-[10px] font-mono truncate" style={{ color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {actions}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
          style={{
            background: 'rgba(0,212,255,0.05)',
            border: '1px solid rgba(0,212,255,0.1)',
            color: 'var(--text-secondary)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,212,255,0.3)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--cyan)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,212,255,0.1)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
          }}
        >
          {theme === 'dark'
            ? <Sun className="w-3.5 h-3.5" />
            : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* Logout */}
        {onLogout && (
          <button
            onClick={onLogout}
            title="Sign out"
            aria-label="Sign out"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              background: 'rgba(0,212,255,0.05)',
              border: '1px solid rgba(0,212,255,0.1)',
              color: 'var(--text-secondary)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,45,85,0.3)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--rec-red)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,212,255,0.1)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
            }}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
}
