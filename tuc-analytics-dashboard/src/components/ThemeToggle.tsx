import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun, Contrast } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={theme === 'light' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setTheme('light')}
        title="Light theme"
        className="px-2"
      >
        <Sun className="w-4 h-4" />
      </Button>
      <Button
        variant={theme === 'dark' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setTheme('dark')}
        title="Dark theme"
        className="px-2"
      >
        <Moon className="w-4 h-4" />
      </Button>
      <Button
        variant={theme === 'high-contrast' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setTheme('high-contrast')}
        title="High contrast theme"
        className="px-2"
      >
        <Contrast className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ThemeToggle;
