import React, { createContext, useContext, useEffect, useState } from "react";
import type { ColorPalette, ThemeType } from "../types";

const THEMES: Record<ThemeType, ColorPalette> = {
  dark: {
    bg: "#0b0b1a",
    surface: "#0e0e24",
    surfaceAlt: "#16162a",
    border: "#1e1e3a",
    text: "#e2e8f0",
    textMuted: "#94a3b8",
    textDim: "#475569",
    primary: "#6c63ff",
    secondary: "#00b894",
    accent: "#a78bfa",
    success: "#34d399",
    warning: "#fb923c",
    error: "#f87171",
  },
  light: {
    bg: "#f8fafc",
    surface: "#ffffff",
    surfaceAlt: "#f1f5f9",
    border: "#e2e8f0",
    text: "#0f172a",
    textMuted: "#475569",
    textDim: "#94a3b8",
    primary: "#4f46e5",
    secondary: "#059669",
    accent: "#7c3aed",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  },
  highContrast: {
    bg: "#000000",
    surface: "#000000",
    surfaceAlt: "#111111",
    border: "#ffffff",
    text: "#ffffff",
    textMuted: "#cccccc",
    textDim: "#888888",
    primary: "#ffff00",
    secondary: "#00ff00",
    accent: "#ff00ff",
    success: "#00ff00",
    warning: "#ffff00",
    error: "#ff0000",
  },
};

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: ColorPalette;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem("directive-theme");
    return (saved as ThemeType) || "dark";
  });

  const colors = THEMES[theme];

  useEffect(() => {
    localStorage.setItem("directive-theme", theme);
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;
      root.style.setProperty(cssVar, value);
    });
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
