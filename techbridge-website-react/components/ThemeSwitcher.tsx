import { Eye, Moon, Sun } from 'lucide-react';
import React from 'react';

interface ThemeSwitcherProps {
  theme: 'light' | 'dark' | 'high-contrast';
  setTheme: (theme: 'light' | 'dark' | 'high-contrast') => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
  return (
    <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1" role="group" aria-label="Theme Switcher">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-full transition-colors ${
          theme === 'light' ? 'bg-white shadow text-tuc-maroon' : 'text-gray-500 dark:text-gray-400 hover:text-tuc-maroon'
        }`}
        aria-label="Light Mode"
        title="Light Mode"
      >
        <Sun size={16} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-full transition-colors ${
          theme === 'dark' ? 'bg-gray-600 text-tuc-gold shadow' : 'text-gray-500 dark:text-gray-400 hover:text-tuc-gold'
        }`}
        aria-label="Dark Mode"
        title="Dark Mode"
      >
        <Moon size={16} />
      </button>
      <button
        onClick={() => setTheme('high-contrast')}
        className={`p-1.5 rounded-full transition-colors ${
          theme === 'high-contrast' ? 'bg-black text-yellow-400 shadow border border-yellow-400' : 'text-gray-500 dark:text-gray-400 hover:text-black'
        }`}
        aria-label="High Contrast Mode"
        title="High Contrast Mode"
      >
        <Eye size={16} />
      </button>
    </div>
  );
};

export default ThemeSwitcher;