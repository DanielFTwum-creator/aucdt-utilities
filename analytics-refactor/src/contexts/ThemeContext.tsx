import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Theme Context for managing application themes and accessibility preferences
 * 
 * Supports:
 * - Light, Dark, and High-Contrast themes
 * - Font size adjustment (small, medium, large, extra-large)
 * - Reduced motion preference
 * - Colour-blind friendly modes
 * 
 * All preferences are persisted to localStorage
 */

const ThemeContext = createContext();

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  HIGH_CONTRAST: 'high-contrast'
};

export const FONT_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  EXTRA_LARGE: 'extra-large'
};

const STORAGE_KEYS = {
  THEME: 'dashboard-theme',
  FONT_SIZE: 'dashboard-font-size',
  REDUCED_MOTION: 'dashboard-reduced-motion',
  COLORBLIND_MODE: 'dashboard-colorblind-mode'
};

export function ThemeProvider({ children }) {
  // Initialize from localStorage or defaults
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || THEMES.LIGHT;
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.FONT_SIZE) || FONT_SIZES.MEDIUM;
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.REDUCED_MOTION);
    return stored ? JSON.parse(stored) : false;
  });

  const [colorblindMode, setColorblindMode] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.COLORBLIND_MODE);
    return stored ? JSON.parse(stored) : false;
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    console.log(`🎨 Theme changed to: ${theme}`);
  }, [theme]);

  // Apply font size to document
  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, fontSize);
    console.log(`📏 Font size changed to: ${fontSize}`);
  }, [fontSize]);

  // Apply reduced motion preference
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    localStorage.setItem(STORAGE_KEYS.REDUCED_MOTION, JSON.stringify(reducedMotion));
    console.log(`🎬 Reduced motion: ${reducedMotion ? 'enabled' : 'disabled'}`);
  }, [reducedMotion]);

  // Apply colorblind mode
  useEffect(() => {
    if (colorblindMode) {
      document.documentElement.classList.add('colorblind-mode');
    } else {
      document.documentElement.classList.remove('colorblind-mode');
    }
    localStorage.setItem(STORAGE_KEYS.COLORBLIND_MODE, JSON.stringify(colorblindMode));
    console.log(`👁️ Colorblind mode: ${colorblindMode ? 'enabled' : 'disabled'}`);
  }, [colorblindMode]);

  // Cycle through themes
  const cycleTheme = () => {
    const themes = Object.values(THEMES);
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // Cycle through font sizes
  const cycleFontSize = (direction = 'up') => {
    const sizes = Object.values(FONT_SIZES);
    const currentIndex = sizes.indexOf(fontSize);
    
    let nextIndex;
    if (direction === 'up') {
      nextIndex = Math.min(currentIndex + 1, sizes.length - 1);
    } else {
      nextIndex = Math.max(currentIndex - 1, 0);
    }
    
    setFontSize(sizes[nextIndex]);
  };

  // Increase font size
  const increaseFontSize = () => {
    cycleFontSize('up');
  };

  // Decrease font size
  const decreaseFontSize = () => {
    cycleFontSize('down');
  };

  // Reset font size
  const resetFontSize = () => {
    setFontSize(FONT_SIZES.MEDIUM);
  };

  // Toggle reduced motion
  const toggleReducedMotion = () => {
    setReducedMotion(prev => !prev);
  };

  // Toggle colorblind mode
  const toggleColorblindMode = () => {
    setColorblindMode(prev => !prev);
  };

  // Reset all preferences
  const resetPreferences = () => {
    setTheme(THEMES.LIGHT);
    setFontSize(FONT_SIZES.MEDIUM);
    setReducedMotion(false);
    setColorblindMode(false);
    console.log('🔄 All accessibility preferences reset to defaults');
  };

  const value = {
    // Current state
    theme,
    fontSize,
    reducedMotion,
    colorblindMode,
    
    // Theme controls
    setTheme,
    cycleTheme,
    isLightTheme: theme === THEMES.LIGHT,
    isDarkTheme: theme === THEMES.DARK,
    isHighContrastTheme: theme === THEMES.HIGH_CONTRAST,
    
    // Font size controls
    setFontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    canIncreaseFontSize: fontSize !== FONT_SIZES.EXTRA_LARGE,
    canDecreaseFontSize: fontSize !== FONT_SIZES.SMALL,
    
    // Accessibility controls
    toggleReducedMotion,
    toggleColorblindMode,
    
    // Reset
    resetPreferences,
    
    // Constants
    THEMES,
    FONT_SIZES
  };

  return (
    <ThemeContext.Provider value={value}>
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

export default ThemeContext;
