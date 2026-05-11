import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Eye } from 'lucide-react';
import { cn } from '../lib/utils';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'high-contrast', icon: Eye, label: 'Contrast' },
  ];

  return (
    <div className="flex items-center bg-brand-leaf p-1 rounded-full border border-brand-linen">
      {themes.map(t => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id as any)}
          className={cn(
            "p-2 rounded-full transition-all flex items-center space-x-2",
            theme === t.id ? "bg-white shadow-sm text-tuc-gold" : "text-brand-stone hover:text-brand-charcoal"
          )}
          aria-label={`Switch to ${t.label} theme`}
          title={`${t.label} Mode`}
        >
          <t.icon className="w-4 h-4" />
          {theme === t.id && <span className="text-[10px] font-bold uppercase tracking-wider pr-1">{t.label}</span>}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
