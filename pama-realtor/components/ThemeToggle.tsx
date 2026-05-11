import React from 'react';
import { Sun, Moon, Eye } from 'lucide-react';
import { ThemeMode } from '../types';

interface ThemeToggleProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, onThemeChange }) => {
  const toggleTheme = () => {
    if (currentTheme === 'light') onThemeChange('dark');
    else if (currentTheme === 'dark') onThemeChange('high-contrast');
    else onThemeChange('light');
  };

  const getLabel = () => {
    switch (currentTheme) {
      case 'light': return 'Switch to Dark Mode';
      case 'dark': return 'Switch to High Contrast Mode';
      case 'high-contrast': return 'Switch to Light Mode';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-emerald-100 dark:hover:bg-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 active:scale-95 group relative"
      aria-label={getLabel()}
      title={getLabel()}
    >
      <div className="relative w-5 h-5">
         <span className={`absolute inset-0 transform transition-transform duration-500 ${currentTheme === 'light' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'}`}>
            <Sun size={20} />
         </span>
         <span className={`absolute inset-0 transform transition-transform duration-500 ${currentTheme === 'dark' ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}>
            <Moon size={20} />
         </span>
         <span className={`absolute inset-0 transform transition-transform duration-500 ${currentTheme === 'high-contrast' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'}`}>
            <Eye size={20} />
         </span>
      </div>
    </button>
  );
};

export default ThemeToggle;