import React, { createContext, useContext, useEffect } from 'react';

// The dictation app is a dark "broadcast studio" UI. The studio surfaces are dark-only
// (no light token set was ever authored), so the theme is pinned to dark — a togglable
// "light" mode left those surfaces dark while flipping component text to dark-on-dark,
// rendering the screen unreadable. See DESIGN_AUDIT_6R.md (6R enhancement, dark-only).
type Theme = 'dark';

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme: Theme = 'dark';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    // `.dark` on body keeps the shared components' Tailwind dark: variants active.
    document.body.classList.add('dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
