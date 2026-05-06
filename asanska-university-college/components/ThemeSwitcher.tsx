import React from 'react';
import { useTheme } from './ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center">
      <label htmlFor="theme-select" className="sr-only">Select Theme</label>
      <select
        id="theme-select"
        value={theme}
        onChange={(e) => setTheme(e.target.value as any)}
        className="bg-gray-100 dark:bg-gray-700 theme-high-contrast:bg-black theme-high-contrast:text-white theme-high-contrast:border-yellow-300 border border-gray-300 dark:border-gray-600 text-aucdt-dark-text dark:text-white text-sm rounded-lg focus:ring-aucdt-secondary focus:border-aucdt-secondary p-2"
        aria-label="Select a color theme"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="high-contrast">High Contrast</option>
      </select>
    </div>
  );
};

export default ThemeSwitcher;
