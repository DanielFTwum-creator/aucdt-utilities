import React from 'react';
import { Sun, Moon, Eye } from 'lucide-react';
import { useTheme, Theme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes: { id: Theme; icon: typeof Sun; label: string }[] = [
    { id: 'light', icon: Sun, label: 'Light Mode' },
    { id: 'dark', icon: Moon, label: 'Dark Mode' },
    { id: 'high-contrast', icon: Eye, label: 'High Contrast' },
  ];

  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700" role="radiogroup" aria-label="Select theme">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`p-2 rounded-lg transition-all flex items-center justify-center ${
              isActive 
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
            aria-checked={isActive}
            role="radio"
            aria-label={t.label}
            title={t.label}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}
