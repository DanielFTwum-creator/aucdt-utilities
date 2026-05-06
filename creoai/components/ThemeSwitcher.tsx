import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Contrast } from 'lucide-react';
import type { Theme } from '../types';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'high-contrast'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeInfo = () => {
    switch (theme) {
      case 'dark':
        return { icon: <Moon className="w-5 h-5 text-indigo-400" />, next: 'High-contrast' };
      case 'high-contrast':
        return { icon: <Contrast className="w-5 h-5 text-yellow-400" />, next: 'Light' };
      case 'light':
      default:
        return { icon: <Sun className="w-5 h-5 text-amber-500" />, next: 'Dark' };
    }
  };

  const { icon, next } = getThemeInfo();

  return (
    <button
      onClick={cycleTheme}
      className="p-2.5 rounded-xl bg-white/60 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-all duration-300 shadow-md border border-gray-200 dark:border-gray-700/50 hc-bg hc-border"
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      {icon}
    </button>
  );
};

export default ThemeSwitcher;