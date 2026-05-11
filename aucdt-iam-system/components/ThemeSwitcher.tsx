import React from 'react';
import { Theme } from '../types';

interface ThemeSwitcherProps {
    onThemeChange: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ onThemeChange }) => {
    return (
        <div className="flex items-center space-x-2 bg-white dark:bg-darkcard p-1.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
            <button 
                title="Dark Theme" 
                onClick={() => onThemeChange('dark')} 
                className="w-6 h-6 rounded-full bg-gray-900 border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary transition-transform hover:scale-110"
                aria-label="Dark Mode"
            />
            <button 
                title="Light Theme" 
                onClick={() => onThemeChange('light')} 
                className="w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary transition-transform hover:scale-110"
                aria-label="Light Mode"
            />
            <button 
                title="High Contrast" 
                onClick={() => onThemeChange('high-contrast')} 
                className="w-6 h-6 rounded-full bg-black border-2 border-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-400 transition-transform hover:scale-110"
                aria-label="High Contrast Mode"
            />
        </div>
    );
};

export default ThemeSwitcher;