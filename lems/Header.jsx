import React from 'react';
import { User, Sun, Moon, Contrast } from 'lucide-react';
import './Header.css';

const ENABLE_ENHANCED_UI = true;

const THEMES = [
  { name: 'light',         label: 'Light',        Icon: Sun      },
  { name: 'dark',          label: 'Dark',          Icon: Moon     },
  { name: 'high-contrast', label: 'High Contrast', Icon: Contrast },
];

function ThemeCycleButton({ theme, onThemeChange }) {
  const idx   = THEMES.findIndex((t) => t.name === theme);
  const cur   = THEMES[idx] ?? THEMES[0];
  const next  = THEMES[(idx + 1) % THEMES.length];
  const { Icon } = cur;

  return (
    <button
      type="button"
      className="theme-cycle-btn"
      onClick={() => onThemeChange(next.name)}
      aria-label={`Theme: ${cur.label} — click for ${next.label}`}
      title={`Theme: ${cur.label}`}
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  );
}

function Header({ theme, onThemeChange, onAdminClick, showAdmin = false }) {
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
            <select
              id="theme-select"
              value={theme}
              onChange={(e) => onThemeChange(e.target.value)}
              className="theme-select"
            >
              {THEMES.map((t) => <option key={t.name} value={t.name}>{t.label}</option>)}
            </select>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="header header-expanded">
      <div className="header-content header-content-expanded">
        {/* Left: crest + wordmark + theme icon */}
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
          <ThemeCycleButton theme={theme} onThemeChange={onThemeChange} />
        </div>

        {/* Centre: portal title */}
        <div className="header-centre">
          <h2 className="header-title">Lecturer Evaluation &amp; Management System</h2>
        </div>

        {/* Right: Admin only */}
        <div className="header-actions">
          {showAdmin && (
            <button className="admin-btn" onClick={onAdminClick} aria-label="Admin panel">
              <User size={15} aria-hidden="true" />
              Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
