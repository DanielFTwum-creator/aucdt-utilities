import React from 'react';
import { Theme } from '../types';
import { Sun, Moon, Contrast } from './icons';

interface ThemeSwitcherProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
  // FIX: Replaced JSX.Element with React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
  const themes: { name: Theme; icon: React.ReactNode; label: string }[] = [
    { name: 'light', icon: <Sun className="w-5 h-5" />, label: 'Light Theme' },
    { name: 'dark', icon: <Moon className="w-5 h-5" />, label: 'Dark Theme' },
    { name: 'high-contrast', icon: <Contrast className="w-5 h-5" />, label: 'High Contrast Theme' },
  ];

  return (
    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-slate-700 p-1 rounded-full hc-bg hc-border">
      {themes.map(({ name, icon, label }) => (
        <button
          key={name}
          onClick={() => setTheme(name)}
          className={`p-2 rounded-full transition-colors duration-200 ${
            theme === name
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 hc-bg hc-border hc-text-yellow'
              : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hc-text'
          }`}
          aria-pressed={theme === name}
          aria-label={`Switch to ${label}`}
          title={label}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
