import React from 'react';
import { User } from 'lucide-react';
import './Header.css';

// Set to false to revert to the slim navbar (no centre title, no Admin button).
const ENABLE_ENHANCED_UI = true;

function Header({ theme, onThemeChange, onAdminClick, showAdmin = false }) {
  const themes = [
    { name: 'light', label: 'Light' },
    { name: 'dark', label: 'Dark' },
    { name: 'high-contrast', label: 'High Contrast' },
  ];

  if (!ENABLE_ENHANCED_UI) {
    return (
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h2>LEMS</h2>
            <span className="logo-subtitle">Techbridge University College</span>
          </div>
          <div className="theme-switcher">
            <label htmlFor="theme-select">Theme:</label>
            <select id="theme-select" value={theme} onChange={(e) => onThemeChange(e.target.value)} className="theme-select">
              {themes.map((t) => <option key={t.name} value={t.name}>{t.label}</option>)}
            </select>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="header header-expanded">
      <div className="header-content header-content-expanded">
        {/* Left: crest + wordmark */}
        <div className="logo">
          <img
            src="https://techbridge.edu.gh/static/TUC_LOGO_small.png"
            alt="TUC"
            className="header-crest"
          />
          <div className="logo-text">
            <span className="logo-wordmark">LEMS</span>
            <span className="logo-subtitle">TECHBRIDGE UNIVERSITY COLLEGE</span>
          </div>
        </div>

        {/* Centre: portal title */}
        <div className="header-centre">
          <h2 className="header-title">Lecturer Evaluation &amp; Management System</h2>
          {!ENABLE_ENHANCED_UI && (
            <p className="header-subtitle">Please provide your honest feedback about your lecturer and course experience</p>
          )}
        </div>

        {/* Right: Admin + Theme */}
        <div className="header-actions">
          {showAdmin && (
            <button className="admin-btn" onClick={onAdminClick} aria-label="Admin panel">
              <User size={15} aria-hidden="true" />
              Admin
            </button>
          )}
          <div className="theme-switcher">
            <label htmlFor="theme-select">Theme:</label>
            <select id="theme-select" value={theme} onChange={(e) => onThemeChange(e.target.value)} className="theme-select">
              {themes.map((t) => <option key={t.name} value={t.name}>{t.label}</option>)}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
