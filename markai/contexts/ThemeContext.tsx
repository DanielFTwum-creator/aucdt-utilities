
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Theme } from '../types';
import { storageService } from '../services/storageService';

interface ThemeContextType { 
  theme: Theme; 
  setTheme: (theme: Theme) => void; 
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(Theme.Light);

  useEffect(() => { 
    (async () => setThemeState(await storageService.getTheme()))(); 
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(Theme.Light, Theme.Dark, Theme.HighContrast);
    root.classList.add(theme);
    storageService.setTheme(theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => setThemeState(newTheme), []);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};
