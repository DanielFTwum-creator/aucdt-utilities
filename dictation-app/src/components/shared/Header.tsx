import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';
import { Menu, LogOut, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onLogout?: () => void;
  actions?: React.ReactNode;
}

export function Header({
  title,
  subtitle,
  icon,
  onLogout,
  actions,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Logo & Title */}
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right: Actions & Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="p-2"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-slate-600" />
              ) : (
                <Sun className="w-5 h-5 text-slate-400" />
              )}
            </Button>

            {/* Logout Button */}
            {onLogout && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                title="Sign out"
                aria-label="Sign out"
                icon={<LogOut className="w-4 h-4" />}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
