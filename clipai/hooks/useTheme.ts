import { useState, useEffect } from 'react';
import { Theme } from '../types';

export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('clipai-theme');
        return (savedTheme as Theme) || 'light';
    });

    useEffect(() => {
        localStorage.setItem('clipai-theme', theme);
        const root = document.documentElement;
        root.classList.remove('dark', 'theme-high-contrast');
        if (theme === 'dark') {
            root.classList.add('dark');
        } else if (theme === 'high-contrast') {
            root.classList.add('theme-high-contrast');
        }
    }, [theme]);

    return { theme, setTheme };
};