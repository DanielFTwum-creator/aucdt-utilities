import React from 'react';
import { Theme } from '../types';
import { Sun, Moon, Contrast } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const THEMES: { value: Theme; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { value: Theme.Light,        label: 'Light mode',         Icon: Sun },
  { value: Theme.Dark,         label: 'Dark mode',          Icon: Moon },
  { value: Theme.HighContrast, label: 'High contrast mode', Icon: Contrast },
];

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="flex p-1 rounded-full border"
      style={{
        background: 'var(--bg-elevated)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {THEMES.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            role="radio"
            aria-checked={active}
            aria-label={label}
            onClick={() => setTheme(value)}
            onKeyDown={(e) => {
              const idx = THEMES.findIndex(t => t.value === value);
              if (e.key === 'ArrowRight') setTheme(THEMES[(idx + 1) % THEMES.length].value);
              if (e.key === 'ArrowLeft')  setTheme(THEMES[(idx + THEMES.length - 1) % THEMES.length].value);
            }}
            className="px-2.5 py-1.5 rounded-full transition-all duration-200 flex items-center justify-center"
            style={
              active
                ? { background: 'hsl(var(--brand-500))', color: '#fff' }
                : { color: 'var(--text-muted)' }
            }
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;
