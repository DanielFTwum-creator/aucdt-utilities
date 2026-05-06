import React from 'react';
import { Theme } from '../types';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md p-1 rounded-full border border-white/30" role="radiogroup" aria-label="Theme Selection">
      {(['light', 'dark', 'high-contrast'] as Theme[]).map((theme) => (
        <button
          key={theme}
          onClick={() => onThemeChange(theme)}
          role="radio"
          aria-checked={currentTheme === theme}
          className={`
            px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300
            ${currentTheme === theme 
              ? 'bg-white text-indigo-900 shadow-md transform scale-105' 
              : 'text-white/80 hover:bg-white/10 hover:text-white'}
          `}
        >
          {theme.replace('-', ' ')}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
