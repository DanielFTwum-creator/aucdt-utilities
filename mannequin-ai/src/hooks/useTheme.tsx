import React, { createContext, useContext, useEffect, useState } from "react";
import { THEMES } from "../constants";
import type { ColorPalette, ThemeType } from "../types";

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: ColorPalette;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem("mannequin-theme");
    return (saved as ThemeType) || "dark";
  });

  const colors = THEMES[theme];

  useEffect(() => {
    localStorage.setItem("mannequin-theme", theme);
    
    // Inject CSS variables into :root
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      // Convert camelCase to kebab-case (e.g., surfaceAlt to --surface-alt)
      const cssVar = `--${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;
      root.style.setProperty(cssVar, value);
    });
    
    // Set data-theme attribute for high-level selectors if needed
    root.setAttribute("data-theme", theme);
  }, [theme, colors]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
