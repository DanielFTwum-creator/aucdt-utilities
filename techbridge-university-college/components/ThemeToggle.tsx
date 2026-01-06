import React from 'react';
import { Sun, Moon, Eye } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700" role="group" aria-label="Theme Selection">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-full transition-all ${
          theme === 'light' 
            ? 'bg-white text-aucdt-maroon shadow-sm' 
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
        aria-label="Switch to Light Mode"
        title="Light Mode"
        aria-pressed={theme === 'light'}
      >
        <Sun size={16} aria-hidden="true" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-full transition-all ${
          theme === 'dark' 
            ? 'bg-gray-700 text-aucdt-gold shadow-sm' 
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
        aria-label="Switch to Dark Mode"
        title="Dark Mode"
        aria-pressed={theme === 'dark'}
      >
        <Moon size={16} aria-hidden="true" />
      </button>
      <button
        onClick={() => setTheme('high-contrast')}
        className={`p-1.5 rounded-full transition-all ${
          theme === 'high-contrast' 
            ? 'bg-black text-yellow-400 shadow-sm border border-yellow-400' 
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
        aria-label="Switch to High Contrast Mode"
        title="High Contrast Mode"
        aria-pressed={theme === 'high-contrast'}
      >
        <Eye size={16} aria-hidden="true" />
      </button>
    </div>
  );
};

export default ThemeToggle;