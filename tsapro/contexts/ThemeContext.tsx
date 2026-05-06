
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { addLog } from '../services/auditLogService';
import { AuditLogEvent, Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Determine a smart default based on system preference or time of day
  // This runs only if no value is found in localStorage
  const getSmartDefault = (): Theme => {
    // 1. Check System Preference (OS Level)
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    // 2. Check Time (Fallback logic for devices without clear system pref)
    const currentHour = new Date().getHours();
    if (currentHour >= 18 || currentHour < 6) { // Dark mode between 6 PM and 6 AM
      return 'dark';
    }
    // 3. Default to Light
    return 'light';
  };

  // Initialize with smart default. useLocalStorage will use this value only if the key is missing.
  const [theme, setThemeRaw] = useLocalStorage<Theme>('tuc-salary-theme', getSmartDefault());
  const previousThemeRef = useRef<Theme>(theme);

  useEffect(() => {
    const root = window.document.documentElement;
    // This single attribute drives all theme changes via the global stylesheet.
    root.setAttribute('data-app-theme', theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    if (newTheme !== previousThemeRef.current) {
      addLog(AuditLogEvent.THEME_CHANGE, `Theme changed from '${previousThemeRef.current}' to '${newTheme}'.`);
      previousThemeRef.current = newTheme;
    }
    setThemeRaw(newTheme);
  }, [setThemeRaw]);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
