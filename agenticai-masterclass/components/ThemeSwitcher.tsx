import React from 'react';
import { Sun, Moon, Contrast } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Theme } from '../types';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-1 shadow-lg" role="group" aria-label="Theme selection">
      <button
        onClick={() => handleThemeChange('light')}
        className={`p-2 rounded-full transition-all ${theme === 'light' ? 'bg-white text-yellow-600 shadow-sm' : 'text-slate-400 hover:text-white'}`}
        aria-label="Switch to Light Theme"
        aria-pressed={theme === 'light'}
      >
        <Sun className="w-5 h-5" />
      </button>
      <button
        onClick={() => handleThemeChange('dark')}
        className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-slate-800 text-blue-400 shadow-sm' : 'text-slate-400 hover:text-white'}`}
        aria-label="Switch to Dark Theme"
        aria-pressed={theme === 'dark'}
      >
        <Moon className="w-5 h-5" />
      </button>
      <button
        onClick={() => handleThemeChange('high-contrast')}
        className={`p-2 rounded-full transition-all ${theme === 'high-contrast' ? 'bg-black text-white border border-white' : 'text-slate-400 hover:text-white'}`}
        aria-label="Switch to High Contrast Theme"
        aria-pressed={theme === 'high-contrast'}
      >
        <Contrast className="w-5 h-5" />
      </button>
    </div>
  );
};