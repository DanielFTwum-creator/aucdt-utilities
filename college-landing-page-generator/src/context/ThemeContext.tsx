import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'high-contrast';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark'); // default to dark per existing UI

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-high-contrast');
    document.documentElement.classList.add(`theme-${theme}`);
    
    if (theme === 'high-contrast') {
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#FFFF00';
    } else if (theme === 'light') {
      document.body.style.backgroundColor = '#f3f4f6';
      document.body.style.color = '#111827';
    } else {
      document.body.style.backgroundColor = '#030305';
      document.body.style.color = '#ffffff';
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
