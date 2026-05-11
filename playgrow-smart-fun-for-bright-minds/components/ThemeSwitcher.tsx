import React from 'react';
import { Theme } from '../App';
import { SunIcon, MoonIcon, ContrastIcon } from './icons';

interface ThemeSwitcherProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
  const themes: { name: Theme; Icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { name: 'light', Icon: SunIcon },
    { name: 'dark', Icon: MoonIcon },
    { name: 'high-contrast', Icon: ContrastIcon },
  ];

  return (
    <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-700/50 p-1 rounded-full shadow-md hc-bg-secondary hc-border">
      {themes.map(({ name, Icon }) => (
        <button
          key={name}
          onClick={() => setTheme(name)}
          className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-blue-400 ${
            theme === name ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          } hc-bg-primary ${theme === name ? 'hc-accent' : 'hc-text-primary'}`}
          aria-pressed={theme === name}
          aria-label={`Switch to ${name} theme`}
        >
          <Icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
