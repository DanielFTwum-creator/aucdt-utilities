import React from 'react';
import type { Theme } from '../App';

interface ThemeSwitcherProps {
    onThemeChange: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ onThemeChange }) => {
    return (
        <div className="flex items-center space-x-2 bg-card p-1 rounded-full border border-primary">
            <button title="Dark Theme" onClick={() => onThemeChange('dark')} className="w-6 h-6 rounded-full bg-gray-800 border-2 border-primary focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary ring-title"></button>
            <button title="Light Theme" onClick={() => onThemeChange('light')} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-primary focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary ring-title"></button>
            <button title="High Contrast" onClick={() => onThemeChange('high-contrast')} className="w-6 h-6 rounded-full bg-black border-2 border-yellow-300 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary ring-title"></button>
        </div>
    );
};

export default ThemeSwitcher;