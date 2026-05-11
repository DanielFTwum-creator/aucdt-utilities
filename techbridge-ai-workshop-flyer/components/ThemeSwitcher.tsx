import React from 'react';
    import { ThemeMode } from '../types';
    import { auditLogger } from '../utils/audit';

    interface ThemeSwitcherProps {
      currentTheme: ThemeMode;
      onThemeChange: (theme: ThemeMode) => void;
    }

    export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
      const handleThemeChange = (theme: ThemeMode) => {
        onThemeChange(theme);
        auditLogger.log('Theme Changed', `Switched to ${theme}`);
      };

      return (
        <div 
          role="region" 
          aria-label="Accessibility Controls"
          className="fixed top-4 right-4 z-50 flex gap-2 p-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10 shadow-xl"
        >
          <button
            onClick={() => handleThemeChange('light')}
            className={`p-2 rounded-full transition-colors ${currentTheme === 'light' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}
            aria-label="Switch to Light Theme"
            title="Light Theme"
          >
            ☀️
          </button>
          <button
            onClick={() => handleThemeChange('dark')}
            className={`p-2 rounded-full transition-colors ${currentTheme === 'dark' ? 'bg-orange-500 text-white' : 'text-white hover:bg-white/10'}`}
            aria-label="Switch to Dark Theme"
            title="Dark Theme"
          >
            🌙
          </button>
          <button
            onClick={() => handleThemeChange('high-contrast')}
            className={`p-2 rounded-full transition-colors ${currentTheme === 'high-contrast' ? 'bg-yellow-400 text-black font-bold' : 'text-white hover:bg-white/10'}`}
            aria-label="Switch to High Contrast Theme"
            title="High Contrast"
          >
            👁️‍🗨️
          </button>
        </div>
      );
    };