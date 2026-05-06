import React from 'react';
import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
  currentUser: string | null;
  onLogout: () => void;
  onShowGallery: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, onShowGallery }) => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('high-contrast');
    else setTheme('light');
  };

  const themeIcon = {
    light: '☀️',
    dark: '🌙',
    'high-contrast': '◐'
  }[theme];

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center mb-10 sm:mb-16 py-4">
      <div className="text-center sm:text-left mb-4 sm:mb-0">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent mb-1">
          AI Scene Visualizer
        </h1>
        <p className="text-slate-400 text-base sm:text-lg">
          Turn imagination into imagery with AI-powered scene generation.
        </p>
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        <span className="text-slate-300 text-sm hidden md:block">Welcome, <strong className="font-semibold text-amber-400">{currentUser}</strong></span>
        <button 
            onClick={onLogout} 
            aria-label="Logout"
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-slate-200 text-sm transition-colors hover:bg-white/20"
        >
            Logout
        </button>
        <button onClick={onShowGallery} aria-label="View Gallery" className="w-11 h-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-xl transition-transform hover:scale-105">🖼️</button>
        <button onClick={cycleTheme} aria-label={`Toggle Theme (Current: ${theme})`} className="w-11 h-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-xl transition-transform hover:scale-105">{themeIcon}</button>
      </div>
    </header>
  );
};

export default Header;
