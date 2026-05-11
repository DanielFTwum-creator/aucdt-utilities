import React, { useState } from 'react';
import { Sun, Moon, Contrast, Loader2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [loadingTheme, setLoadingTheme] = useState<'light' | 'dark' | 'high-contrast' | null>(null);

  const themes = [
    { name: 'light', icon: Sun },
    { name: 'dark', icon: Moon },
    { name: 'high-contrast', icon: Contrast },
  ] as const;

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'high-contrast') => {
    // No action if the theme is already active or another theme change is in progress
    if (newTheme === theme || loadingTheme) return;

    setLoadingTheme(newTheme);
    // This brief delay ensures the loading indicator is perceptible. The actual theme
    // application is nearly instantaneous, but this simulates a scenario where it might
    // be an asynchronous operation, providing immediate feedback to the user.
    setTimeout(() => {
      setTheme(newTheme);
      setLoadingTheme(null);
    }, 300);
  };

  return (
    <div className="flex items-center space-x-1 p-1 rounded-full bg-[var(--card-background)] border border-[var(--card-border-color)] shadow-sm">
      {themes.map((t) => {
        const isLoading = loadingTheme === t.name;
        const isActive = theme === t.name;

        return (
          <button
            key={t.name}
            onClick={() => handleThemeChange(t.name)}
            disabled={isLoading || isActive}
            className={`w-9 h-9 p-2 rounded-full transition-colors duration-200 flex items-center justify-center disabled:opacity-[var(--button-disabled-opacity)] disabled:cursor-not-allowed ${
              isActive ? 'theme-btn-active' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            aria-label={`Switch to ${t.name} mode`}
            aria-pressed={isActive}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <t.icon size={18} />}
          </button>
        );
      })}
    </div>
  );
};
