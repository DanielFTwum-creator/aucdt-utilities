import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { Sun, Moon, Contrast } from 'lucide-react';

const THEMES = ['dark', 'light', 'high-contrast'] as const;
type Theme = typeof THEMES[number];

export default function ThemeSwitcher() {
  const applyTheme = (theme: Theme) => {
    document.documentElement.classList.remove(...THEMES);
    document.documentElement.classList.add(theme);
    localStorage.setItem('flydee_theme', theme);
  };

  useEffect(() => {
    const saved = localStorage.getItem('flydee_theme') as Theme | null;
    applyTheme(saved ?? 'dark');
  }, []);

  return (
    <div className="flex gap-2">
      {THEMES.map((theme) => (
        <Button
          key={theme}
          variant="outline"
          size="icon"
          onClick={() => applyTheme(theme)}
          className="capitalize"
        >
          {theme === 'dark' && <Moon className="w-4 h-4" />}
          {theme === 'light' && <Sun className="w-4 h-4" />}
          {theme === 'high-contrast' && <Contrast className="w-4 h-4" />}
        </Button>
      ))}
    </div>
  );
}
