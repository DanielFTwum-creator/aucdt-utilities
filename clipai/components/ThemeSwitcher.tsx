import React from 'react';
import { Theme } from '../types';

interface ThemeSwitcherProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
    const themes: Theme[] = ['light', 'dark', 'high-contrast'];

    return (
        <div className="flex items-center space-x-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-full">
            {themes.map((t) => (
                <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                        theme === t
                            ? 'bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-300 shadow-sm'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
                    }`}
                    aria-pressed={theme === t}
                    title={`Switch to ${t.charAt(0).toUpperCase() + t.slice(1)} theme`}
                >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
            ))}
        </div>
    );
};

export default ThemeSwitcher;
