import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('app_theme') as Theme) || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'theme-high-contrast');
    root.classList.add(`theme-${theme}`);
    localStorage.setItem('app_theme', theme);
    
    // Apply body styles for comprehensive theme coverage
    if (theme === 'light') {
        document.body.style.backgroundColor = '#f1f5f9'; // Slate-100
        document.body.style.color = '#0f172a'; // Slate-900
    } else if (theme === 'high-contrast') {
        document.body.style.backgroundColor = '#000000';
        document.body.style.color = '#ffffff';
    } else {
        document.body.style.backgroundColor = '#0f0f23'; // Brand Dark
        document.body.style.color = '#f8fafc'; // Slate-50
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};