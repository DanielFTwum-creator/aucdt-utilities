import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeMode } from '../types';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  font: string;
  setFont: (font: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from localStorage or default to 'light'
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tmcp-theme');
      return (saved as ThemeMode) || 'light';
    }
    return 'light';
  });

  const [font, setFont] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tmcp-font') || 'Inter';
    }
    return 'Inter';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all previous classes
    root.classList.remove('dark', 'high-contrast');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'high-contrast') {
      root.classList.add('dark'); // Base on dark mode
      root.classList.add('high-contrast'); // Add specific high contrast overrides via CSS
    }

    // Persist to localStorage
    localStorage.setItem('tmcp-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Apply font to CSS variable
    document.documentElement.style.setProperty('--font-main', font);
    localStorage.setItem('tmcp-font', font);
  }, [font]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, font, setFont }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};