import React from 'react';
import { Sun, Moon, Contrast } from 'lucide-react';
import { Tooltip } from './Tooltip';

export type Theme = 'light' | 'dark' | 'high-contrast';

interface Props {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeSwitcher: React.FC<Props> = ({ currentTheme, setTheme }) => {
  return (
    <div className="flex items-center gap-1 border border-tuc-gold/30 rounded-sm p-1 bg-tuc-gold/5 backdrop-blur-sm">
      <Tooltip content="Day Mode">
        <button
          onClick={() => setTheme('light')}
          className={`p-1.5 rounded-sm transition-all ${
            currentTheme === 'light' 
              ? 'bg-tuc-gold text-tuc-ink shadow-sm' 
              : 'text-tuc-gold/50 hover:text-tuc-gold hover:bg-tuc-gold/10'
          }`}
          aria-label="Switch to Day Mode"
        >
          <Sun size={14} />
        </button>
      </Tooltip>
      <Tooltip content="Night Mode">
        <button
          onClick={() => setTheme('dark')}
          className={`p-1.5 rounded-sm transition-all ${
            currentTheme === 'dark' 
              ? 'bg-tuc-gold text-tuc-ink shadow-sm' 
              : 'text-tuc-gold/50 hover:text-tuc-gold hover:bg-tuc-gold/10'
          }`}
          aria-label="Switch to Night Mode"
        >
          <Moon size={14} />
        </button>
      </Tooltip>
      <Tooltip content="High Contrast">
        <button
          onClick={() => setTheme('high-contrast')}
          className={`p-1.5 rounded-sm transition-all ${
            currentTheme === 'high-contrast' 
              ? 'bg-white text-black border border-black' 
              : 'text-tuc-gold/50 hover:text-tuc-gold hover:bg-tuc-gold/10'
          }`}
          aria-label="Switch to High Contrast Mode"
        >
          <Contrast size={14} />
        </button>
      </Tooltip>
    </div>
  );
};
