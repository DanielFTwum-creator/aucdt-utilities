import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import type { Theme, ThemeContextType } from '../types';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const storedTheme = window.localStorage.getItem('theme') as Theme;
      if (['light', 'dark', 'high-contrast'].includes(storedTheme)) {
        return storedTheme;
      }
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    } catch (e) {
      return 'dark'; // Fallback to dark theme
    }
  });

  useEffect(() => {
    const body = window.document.body;
    body.classList.remove('dark', 'high-contrast');
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (theme === 'high-contrast') {
      body.classList.add('high-contrast');
    }
    
    try {
      window.localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn('Could not save theme preference to localStorage.');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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