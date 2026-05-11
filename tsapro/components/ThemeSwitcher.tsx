
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../types';

const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
);
const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
);
const ContrastIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>
);

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes: { name: Theme; icon: React.ReactNode; label: string }[] = [
    { name: 'light', icon: <SunIcon className="w-4 h-4" />, label: 'Light' },
    { name: 'dark', icon: <MoonIcon className="w-4 h-4" />, label: 'Dark' },
    { name: 'high-contrast', icon: <ContrastIcon className="w-4 h-4" />, label: 'Contrast' },
  ];

  return (
    <div 
      data-component="theme-switcher-bg" 
      className="inline-flex rounded-lg p-1 border border-transparent transition-colors duration-200"
      role="radiogroup"
      aria-label="Theme Selection"
    >
      {themes.map((t) => {
         const isActive = theme === t.name;
         return (
            <button
              key={t.name}
              onClick={() => setTheme(t.name)}
              role="radio"
              aria-checked={isActive}
              data-component="theme-switcher-button"
              data-active={isActive}
              className={`
                flex items-center justify-center px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)]
                ${isActive ? 'shadow-sm transform scale-105' : 'hover:bg-white/10'}
              `}
              title={`Switch to ${t.label} theme`}
              aria-label={`Switch to ${t.label} theme`}
            >
              {t.icon}
              <span className="ml-2 hidden md:inline">{t.label}</span>
            </button>
         );
      })}
    </div>
  );
};

export default ThemeSwitcher;
