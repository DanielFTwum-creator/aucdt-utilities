import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

type Theme = 'light' | 'dark' | 'high-contrast';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// A key to track if the user has manually changed the theme during the current session.
const MANUAL_THEME_SESSION_KEY = 'msee-manual-theme-set';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      // Priority 1: Check if user has already made a choice in this session.
      // If so, their choice (saved in localStorage) is respected above all.
      if (sessionStorage.getItem(MANUAL_THEME_SESSION_KEY)) {
        return (localStorage.getItem('app-theme') as Theme) || 'light';
      }

      // Priority 2: If no manual choice this session, check the time for an automatic switch.
      const currentHour = new Date().getHours();
      if (currentHour >= 18) {
          return 'dark'; // Automatic dark mode after 6 PM.
      }
      
      // Priority 3: Fallback to the last manually saved theme or default to light.
      return (localStorage.getItem('app-theme') as Theme) || 'light';
    } catch {
      return 'light'; // Failsafe.
    }
  });

  // Effect for dynamic, time-based theme switching during the session.
  useEffect(() => {
    const checkTimeInterval = setInterval(() => {
      // This automatic switch only runs if the user has NOT manually picked a theme.
      if (!sessionStorage.getItem(MANUAL_THEME_SESSION_KEY)) {
        const currentHour = new Date().getHours();
        if (currentHour >= 18) {
          setThemeState(current => (current !== 'dark' ? 'dark' : current));
        } else {
          // If it's before 6 PM, revert to the last saved preference or light mode.
          const lastSavedTheme = (localStorage.getItem('app-theme') as Theme) || 'light';
          setThemeState(current => (current !== lastSavedTheme ? lastSavedTheme : current));
        }
      }
    }, 60000); // Check every minute.

    return () => clearInterval(checkTimeInterval);
  }, []); // Run only once on mount.

  // Effect to apply the current theme class to the HTML element.
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(theme);
  }, [theme]);

  // Exposed function for the user to manually set their theme.
  const setTheme = (newTheme: Theme) => {
    try {
        // Flag that the user has made a choice in this session.
        sessionStorage.setItem(MANUAL_THEME_SESSION_KEY, 'true');
        // Persist their choice for future visits.
        localStorage.setItem('app-theme', newTheme);
    } catch (e) {
        console.warn("Could not save theme preference to storage.", e);
    }
    setThemeState(newTheme);
  };
  
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return React.createElement(ThemeContext.Provider, { value }, children);
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};