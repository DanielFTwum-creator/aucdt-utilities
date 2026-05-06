import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Accessibility Settings Context
 * Manages theme, font size, motion preferences, and other accessibility settings
 * 
 * @context AccessibilityContext
 */

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  // Load saved settings from localStorage or use defaults
  const loadSetting = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // Theme: 'light', 'dark', 'high-contrast'
  const [theme, setTheme] = useState(() => loadSetting('theme', 'light'));
  
  // Font size: 'small', 'medium', 'large', 'extra-large'
  const [fontSize, setFontSize] = useState(() => loadSetting('fontSize', 'medium'));
  
  // Reduce motion for animations
  const [reduceMotion, setReduceMotion] = useState(() => loadSetting('reduceMotion', false));
  
  // High contrast mode for better visibility
  const [highContrast, setHighContrast] = useState(() => loadSetting('highContrast', false));
  
  // Focus indicators (always on for accessibility)
  const [focusIndicators, setFocusIndicators] = useState(true);

  // Keyboard navigation mode
  const [keyboardMode, setKeyboardMode] = useState(false);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('fontSize', JSON.stringify(fontSize));
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('reduceMotion', JSON.stringify(reduceMotion));
  }, [reduceMotion]);

  useEffect(() => {
    localStorage.setItem('highContrast', JSON.stringify(highContrast));
  }, [highContrast]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-font-size', fontSize);
    document.documentElement.setAttribute('data-reduce-motion', reduceMotion);
    document.documentElement.setAttribute('data-high-contrast', highContrast);
  }, [theme, fontSize, reduceMotion, highContrast]);

  // Detect keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        setKeyboardMode(true);
      }
    };

    const handleMouseDown = () => {
      setKeyboardMode(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Font size helpers
  const increaseFontSize = () => {
    const sizes = ['small', 'medium', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const sizes = ['small', 'medium', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1]);
    }
  };

  const resetFontSize = () => {
    setFontSize('medium');
  };

  // Theme helpers
  const cycleTheme = () => {
    const themes = ['light', 'dark', 'high-contrast'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // Reset all settings
  const resetSettings = () => {
    setTheme('light');
    setFontSize('medium');
    setReduceMotion(false);
    setHighContrast(false);
  };

  const value = {
    // Current settings
    theme,
    fontSize,
    reduceMotion,
    highContrast,
    focusIndicators,
    keyboardMode,

    // Setters
    setTheme,
    setFontSize,
    setReduceMotion,
    setHighContrast,

    // Helpers
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    cycleTheme,
    resetSettings,

    // Computed values
    isLightTheme: theme === 'light',
    isDarkTheme: theme === 'dark',
    isHighContrastTheme: theme === 'high-contrast',
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};
