import React from 'react';
import './Header.css';

function Header({ theme, onThemeChange }) {
  const themes = [
    { name: 'light', label: 'Light' },
    { name: 'dark', label: 'Dark' },
    { name: 'high-contrast', label: 'High Contrast' },
  ];

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h2>LEMS</h2>
        </div>

        <div className="theme-switcher">
          <label htmlFor="theme-select">Theme:</label>
          <select
            id="theme-select"
            value={theme}
            onChange={(e) => onThemeChange(e.target.value)}
            className="theme-select"
          >
            {themes.map((t) => (
              <option key={t.name} value={t.name}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}

export default Header;

