import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'high-contrast';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('aucdt-theme') : null;
    if (stored && ['light', 'dark', 'high-contrast'].includes(stored)) {
      return stored as Theme;
    }

    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;

    // Remove previous theme classes
    root.classList.remove('light', 'dark', 'high-contrast');

    // Add new theme class
    root.classList.add(theme);

    // Set CSS variables based on theme
    const themeVars = {
      'light': {
        '--background': '#ffffff',
        '--foreground': '#000000',
        '--card': '#f5f5f5',
        '--card-foreground': '#000000',
        '--primary': '#3b82f6',
        '--primary-foreground': '#ffffff',
        '--secondary': '#64748b',
        '--secondary-foreground': '#ffffff',
        '--accent': '#f97316',
        '--accent-foreground': '#ffffff',
        '--muted': '#e2e8f0',
        '--muted-foreground': '#64748b',
        '--destructive': '#ef4444',
        '--destructive-foreground': '#ffffff',
        '--border': '#e2e8f0',
        '--input': '#e2e8f0',
        '--ring': '#3b82f6',
      },
      'dark': {
        '--background': '#0f172a',
        '--foreground': '#f1f5f9',
        '--card': '#1e293b',
        '--card-foreground': '#f1f5f9',
        '--primary': '#3b82f6',
        '--primary-foreground': '#0f172a',
        '--secondary': '#94a3b8',
        '--secondary-foreground': '#0f172a',
        '--accent': '#f97316',
        '--accent-foreground': '#0f172a',
        '--muted': '#334155',
        '--muted-foreground': '#94a3b8',
        '--destructive': '#f87171',
        '--destructive-foreground': '#0f172a',
        '--border': '#334155',
        '--input': '#1e293b',
        '--ring': '#3b82f6',
      },
      'high-contrast': {
        '--background': '#ffffff',
        '--foreground': '#000000',
        '--card': '#f0f0f0',
        '--card-foreground': '#000000',
        '--primary': '#0000ee',
        '--primary-foreground': '#ffffff',
        '--secondary': '#000000',
        '--secondary-foreground': '#ffffff',
        '--accent': '#ff0000',
        '--accent-foreground': '#ffffff',
        '--muted': '#cccccc',
        '--muted-foreground': '#000000',
        '--destructive': '#ff0000',
        '--destructive-foreground': '#ffffff',
        '--border': '#000000',
        '--input': '#f0f0f0',
        '--ring': '#0000ee',
      }
    };

    const vars = themeVars[theme];
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Save to localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('aucdt-theme', theme);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => {
      const themes: Theme[] = ['light', 'dark', 'high-contrast'];
      const currentIndex = themes.indexOf(prev);
      return themes[(currentIndex + 1) % themes.length];
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
