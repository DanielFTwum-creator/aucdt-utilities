import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun, Eye } from 'lucide-react';
import { motion } from 'motion/react';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 p-1 bg-black/5 dark:bg-white/10 rounded-full backdrop-blur-sm">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-full transition-colors ${
          theme === 'light' ? 'bg-white shadow-sm text-brand-primary' : 'text-text-muted hover:text-text-primary'
        }`}
        aria-label="Switch to Light Theme"
      >
        <Sun size={16} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-full transition-colors ${
          theme === 'dark' ? 'bg-bg-card shadow-sm text-brand-primary' : 'text-text-muted hover:text-text-primary'
        }`}
        aria-label="Switch to Dark Theme"
      >
        <Moon size={16} />
      </button>
      <button
        onClick={() => setTheme('high-contrast')}
        className={`p-2 rounded-full transition-colors ${
          theme === 'high-contrast' ? 'bg-white border-2 border-black text-black' : 'text-text-muted hover:text-text-primary'
        }`}
        aria-label="Switch to High Contrast Theme"
      >
        <Eye size={16} />
      </button>
    </div>
  );
}
