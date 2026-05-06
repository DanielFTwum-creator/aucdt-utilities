
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

type Theme = 'light' | 'dark' | 'high-contrast';
const THEME_STORAGE_KEY = 'ai-scene-visualizer-theme';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        try {
            const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
            return (storedTheme as Theme) || 'dark';
        } catch {
            return 'dark';
        }
    });

    useEffect(() => {
        const root = window.document.documentElement;
        const isDark = theme === 'dark';
        const isHc = theme === 'high-contrast';
        
        root.classList.remove('light', 'dark', 'hc');
        
        if (theme === 'light') {
            root.classList.add('light');
        } else if (isHc) {
            root.classList.add('hc', 'dark'); // High contrast builds on dark
        } else {
            root.classList.add('dark');
        }
        
        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch (e) {
            console.error('Failed to save theme to localStorage', e);
        }
    }, [theme]);
    
    // FIX: Changed `newTheme` type from `string` to `Theme` to match the `ThemeContextType` interface.
    // This resolves a type inconsistency that was causing the strange JSX parsing errors.
    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const value = useMemo(() => ({ theme, setTheme }), [theme]);

    // FIX: Replaced JSX with React.createElement to resolve parsing errors in this .ts file.
    // The TypeScript compiler was misinterpreting JSX syntax as operators because the file doesn't have a .tsx extension.
    return React.createElement(ThemeContext.Provider, { value: value }, children);
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
