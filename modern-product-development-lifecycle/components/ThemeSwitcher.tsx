import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { SunIcon, MoonIcon, EyeDropperIcon } from './icons';

const ThemeSwitcher: React.FC = () => {
    const { theme, setTheme } = useTheme();

    const themes = [
        { name: 'light', icon: SunIcon, label: 'Light Mode' },
        { name: 'dark', icon: MoonIcon, label: 'Dark Mode' },
        { name: 'hc', icon: EyeDropperIcon, label: 'High Contrast' },
    ];

    return (
        <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 hc:text-yellow-300/80 mb-2">Theme</label>
            <div className="flex items-center space-x-2 rounded-lg p-1 bg-slate-200 dark:bg-slate-700/50 hc:bg-black hc:border hc:border-yellow-300/50">
                {themes.map((t) => (
                    <button
                        key={t.name}
                        onClick={() => setTheme(t.name as 'light' | 'dark' | 'hc')}
                        className={`flex-1 flex justify-center items-center p-2 rounded-md text-sm font-semibold transition-colors ${
                            theme === t.name
                                ? 'bg-white dark:bg-slate-900 hc:bg-yellow-300 hc:text-black text-sky-500 shadow'
                                : 'text-slate-500 dark:text-slate-400 hc:text-yellow-300/70 hover:bg-slate-300/50 dark:hover:bg-slate-600/50'
                        }`}
                        aria-pressed={theme === t.name}
                        aria-label={t.label}
                    >
                        <t.icon className="w-5 h-5" />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ThemeSwitcher;
