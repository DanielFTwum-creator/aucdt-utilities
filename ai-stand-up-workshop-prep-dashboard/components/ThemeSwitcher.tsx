import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Theme } from '../types';

const ThemeSwitcher: React.FC = () => {
    const { theme, setTheme } = useAppContext();

    const themes: { id: Theme; label: string }[] = [
        { id: 'light', label: 'Light' },
        { id: 'dark', label: 'Dark' },
        { id: 'high-contrast', label: 'Contrast' },
    ];

    return (
        <div className="flex items-center space-x-2 p-1 rounded-full border border-[var(--color-border)] bg-[var(--color-background)]">
            {themes.map((t) => (
                <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    aria-pressed={theme === t.id}
                    className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                        theme === t.id
                            ? 'bg-[var(--color-accent)] text-[var(--color-text-inverted)]'
                            : 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                    }`}
                >
                    {t.label}
                </button>
            ))}
        </div>
    );
};

export default ThemeSwitcher;
