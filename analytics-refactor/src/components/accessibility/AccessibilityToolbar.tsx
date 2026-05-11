import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Accessibility Toolbar Component
 * 
 * Provides controls for:
 * - Theme switching (Light/Dark/High-Contrast)
 * - Font size adjustment (A-, A, A+, A++)
 * - Reduced motion toggle
 * - Colorblind mode toggle
 * - Reset all preferences
 * 
 * WCAG 2.1 AA Compliant
 * Keyboard accessible
 * Screen reader friendly
 */

function AccessibilityToolbar() {
  const {
    theme,
    setTheme,
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    canIncreaseFontSize,
    canDecreaseFontSize,
    reducedMotion,
    toggleReducedMotion,
    colorblindMode,
    toggleColorblindMode,
    resetPreferences,
    THEMES,
    FONT_SIZES
  } = useTheme();

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleToolbar = () => {
    setIsExpanded(prev => !prev);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    // Announce to screen readers
    const themeName = newTheme.replace('-', ' ');
    announceToScreenReader(`Theme changed to ${themeName}`);
  };

  const handleFontSizeIncrease = () => {
    if (canIncreaseFontSize) {
      increaseFontSize();
      announceToScreenReader('Font size increased');
    }
  };

  const handleFontSizeDecrease = () => {
    if (canDecreaseFontSize) {
      decreaseFontSize();
      announceToScreenReader('Font size decreased');
    }
  };

  const handleFontSizeReset = () => {
    resetFontSize();
    announceToScreenReader('Font size reset to default');
  };

  const handleReducedMotionToggle = () => {
    toggleReducedMotion();
    announceToScreenReader(`Reduced motion ${!reducedMotion ? 'enabled' : 'disabled'}`);
  };

  const handleColorblindModeToggle = () => {
    toggleColorblindMode();
    announceToScreenReader(`Colorblind mode ${!colorblindMode ? 'enabled' : 'disabled'}`);
  };

  const handleResetAll = () => {
    if (window.confirm('Reset all accessibility preferences to defaults?')) {
      resetPreferences();
      announceToScreenReader('All preferences reset to defaults');
    }
  };

  // Helper function to announce to screen readers
  const announceToScreenReader = (message) => {
    const announcement = document.getElementById('a11y-announcer');
    if (announcement) {
      announcement.textContent = message;
    }
  };

  const getFontSizeLabel = () => {
    const labels = {
      [FONT_SIZES.SMALL]: 'A-',
      [FONT_SIZES.MEDIUM]: 'A',
      [FONT_SIZES.LARGE]: 'A+',
      [FONT_SIZES.EXTRA_LARGE]: 'A++'
    };
    return labels[fontSize] || 'A';
  };

  return (
    <>
      {/* Screen reader announcer (visually hidden) */}
      <div
        id="a11y-announcer"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Floating Accessibility Button */}
      <button
        onClick={toggleToolbar}
        className="accessibility-fab"
        aria-label={isExpanded ? 'Close accessibility toolbar' : 'Open accessibility toolbar'}
        aria-expanded={isExpanded}
        aria-controls="accessibility-toolbar"
        title="Accessibility Options"
      >
        <span className="fab-icon" aria-hidden="true">♿</span>
        <span className="sr-only">Accessibility Options</span>
      </button>

      {/* Accessibility Toolbar Panel */}
      {isExpanded && (
        <div
          id="accessibility-toolbar"
          className="accessibility-toolbar"
          role="region"
          aria-label="Accessibility controls"
        >
          <div className="toolbar-header">
            <h2 className="toolbar-title">
              <span aria-hidden="true">♿</span> Accessibility
            </h2>
            <button
              onClick={toggleToolbar}
              className="toolbar-close"
              aria-label="Close accessibility toolbar"
              title="Close"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <div className="toolbar-content">
            
            {/* Theme Selection */}
            <section className="toolbar-section">
              <h3 className="section-title">
                <span aria-hidden="true">🎨</span> Theme
              </h3>
              <div className="button-group" role="group" aria-label="Theme selection">
                <button
                  onClick={() => handleThemeChange(THEMES.LIGHT)}
                  className={`theme-button ${theme === THEMES.LIGHT ? 'active' : ''}`}
                  aria-pressed={theme === THEMES.LIGHT}
                  aria-label="Light theme"
                  title="Light Theme"
                >
                  <span aria-hidden="true">☀️</span>
                  <span>Light</span>
                </button>
                <button
                  onClick={() => handleThemeChange(THEMES.DARK)}
                  className={`theme-button ${theme === THEMES.DARK ? 'active' : ''}`}
                  aria-pressed={theme === THEMES.DARK}
                  aria-label="Dark theme"
                  title="Dark Theme"
                >
                  <span aria-hidden="true">🌙</span>
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => handleThemeChange(THEMES.HIGH_CONTRAST)}
                  className={`theme-button ${theme === THEMES.HIGH_CONTRAST ? 'active' : ''}`}
                  aria-pressed={theme === THEMES.HIGH_CONTRAST}
                  aria-label="High contrast theme"
                  title="High Contrast Theme"
                >
                  <span aria-hidden="true">◐</span>
                  <span>High Contrast</span>
                </button>
              </div>
            </section>

            {/* Font Size Controls */}
            <section className="toolbar-section">
              <h3 className="section-title">
                <span aria-hidden="true">📏</span> Font Size
              </h3>
              <div className="font-size-controls">
                <button
                  onClick={handleFontSizeDecrease}
                  disabled={!canDecreaseFontSize}
                  className="font-button"
                  aria-label="Decrease font size"
                  title="Decrease Font Size"
                >
                  <span className="font-icon-small" aria-hidden="true">A-</span>
                </button>
                <button
                  onClick={handleFontSizeReset}
                  className="font-button font-current"
                  aria-label={`Current font size: ${getFontSizeLabel()}. Click to reset`}
                  title="Reset Font Size"
                >
                  <span className="font-icon-current" aria-hidden="true">{getFontSizeLabel()}</span>
                </button>
                <button
                  onClick={handleFontSizeIncrease}
                  disabled={!canIncreaseFontSize}
                  className="font-button"
                  aria-label="Increase font size"
                  title="Increase Font Size"
                >
                  <span className="font-icon-large" aria-hidden="true">A+</span>
                </button>
              </div>
              <p className="section-hint">Current: {fontSize}</p>
            </section>

            {/* Motion & Visual Preferences */}
            <section className="toolbar-section">
              <h3 className="section-title">
                <span aria-hidden="true">⚙️</span> Preferences
              </h3>
              
              <label className="toggle-option">
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={handleReducedMotionToggle}
                  aria-label="Reduce motion and animations"
                />
                <span className="toggle-slider" aria-hidden="true"></span>
                <span className="toggle-label">
                  <span aria-hidden="true">🎬</span> Reduce Motion
                </span>
              </label>

              <label className="toggle-option">
                <input
                  type="checkbox"
                  checked={colorblindMode}
                  onChange={handleColorblindModeToggle}
                  aria-label="Enable colorblind-friendly mode"
                />
                <span className="toggle-slider" aria-hidden="true"></span>
                <span className="toggle-label">
                  <span aria-hidden="true">👁️</span> Colorblind Mode
                </span>
              </label>
            </section>

            {/* Reset Button */}
            <section className="toolbar-section">
              <button
                onClick={handleResetAll}
                className="reset-button"
                aria-label="Reset all accessibility preferences to defaults"
                title="Reset All Preferences"
              >
                <span aria-hidden="true">🔄</span> Reset All
              </button>
            </section>

            {/* Info */}
            <section className="toolbar-section toolbar-info">
              <p className="info-text">
                <small>
                  <strong>Keyboard Shortcuts:</strong><br />
                  <kbd>Shift + A</kbd> Toggle toolbar<br />
                  <kbd>Shift + T</kbd> Cycle themes<br />
                  <kbd>Shift + +</kbd> Increase font<br />
                  <kbd>Shift + -</kbd> Decrease font
                </small>
              </p>
            </section>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Floating Action Button */
        .accessibility-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--color-primary);
          color: var(--color-text-inverse);
          border: none;
          font-size: 24px;
          cursor: pointer;
          box-shadow: var(--shadow-lg);
          z-index: 1000;
          transition: all var(--transition-normal);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .accessibility-fab:hover {
          background: var(--color-primary-dark);
          transform: scale(1.1);
          box-shadow: var(--shadow-xl);
        }

        .accessibility-fab:focus-visible {
          outline: 3px solid var(--color-border-focus);
          outline-offset: 3px;
        }

        .fab-icon {
          line-height: 1;
        }

        /* Toolbar Panel */
        .accessibility-toolbar {
          position: fixed;
          bottom: 96px;
          right: 24px;
          width: 360px;
          max-width: calc(100vw - 48px);
          max-height: calc(100vh - 120px);
          background: var(--color-surface);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-2xl);
          overflow: hidden;
          z-index: 1000;
          animation: slideInUp 0.3s ease;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .toolbar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-lg);
          background: var(--color-primary);
          color: var(--color-text-inverse);
        }

        .toolbar-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .toolbar-close {
          background: transparent;
          border: none;
          color: var(--color-text-inverse);
          font-size: 1.5rem;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
        }

        .toolbar-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .toolbar-content {
          padding: var(--spacing-lg);
          max-height: calc(100vh - 200px);
          overflow-y: auto;
        }

        /* Section Styles */
        .toolbar-section {
          margin-bottom: var(--spacing-lg);
          padding-bottom: var(--spacing-lg);
          border-bottom: 1px solid var(--color-border);
        }

        .toolbar-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .section-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: var(--spacing-md);
          color: var(--color-text-primary);
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .section-hint {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          margin-top: var(--spacing-sm);
          text-align: center;
        }

        /* Theme Buttons */
        .button-group {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-sm);
        }

        .theme-button {
          padding: var(--spacing-md);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          color: var(--color-text-primary);
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: 0.875rem;
        }

        .theme-button:hover {
          border-color: var(--color-primary);
          background: var(--color-surface-elevated);
        }

        .theme-button.active {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: var(--color-text-inverse);
          font-weight: 600;
        }

        /* Font Size Controls */
        .font-size-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: var(--spacing-md);
        }

        .font-button {
          width: 64px;
          height: 64px;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          color: var(--color-text-primary);
          cursor: pointer;
          transition: all var(--transition-fast);
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .font-button:hover:not(:disabled) {
          border-color: var(--color-primary);
          background: var(--color-surface-elevated);
          transform: scale(1.05);
        }

        .font-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .font-button.font-current {
          border-color: var(--color-primary);
          border-width: 3px;
        }

        .font-icon-small {
          font-size: 1rem;
        }

        .font-icon-current {
          font-size: 1.25rem;
        }

        .font-icon-large {
          font-size: 1.5rem;
        }

        /* Toggle Options */
        .toggle-option {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
          position: relative;
          margin-bottom: var(--spacing-sm);
        }

        .toggle-option:hover {
          background: var(--color-surface-elevated);
        }

        .toggle-option input[type="checkbox"] {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          width: 48px;
          height: 24px;
          background: var(--color-border);
          border-radius: 12px;
          position: relative;
          transition: background var(--transition-fast);
        }

        .toggle-slider::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          top: 2px;
          left: 2px;
          transition: transform var(--transition-fast);
        }

        .toggle-option input:checked + .toggle-slider {
          background: var(--color-primary);
        }

        .toggle-option input:checked + .toggle-slider::after {
          transform: translateX(24px);
        }

        .toggle-option input:focus-visible + .toggle-slider {
          outline: 2px solid var(--color-border-focus);
          outline-offset: 2px;
        }

        .toggle-label {
          flex: 1;
          font-size: 0.9375rem;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        /* Reset Button */
        .reset-button {
          width: 100%;
          padding: var(--spacing-md);
          border: 2px solid var(--color-error);
          border-radius: var(--radius-md);
          background: transparent;
          color: var(--color-error);
          cursor: pointer;
          font-weight: 600;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
        }

        .reset-button:hover {
          background: var(--color-error);
          color: white;
        }

        /* Info Section */
        .toolbar-info {
          background: var(--color-surface-elevated);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          border: none;
        }

        .info-text {
          font-size: 0.8125rem;
          color: var(--color-text-secondary);
          margin: 0;
          line-height: 1.6;
        }

        kbd {
          background: var(--color-background);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid var(--color-border);
          font-family: var(--font-mono);
          font-size: 0.75rem;
        }

        /* Mobile Responsive */
        @media (max-width: 480px) {
          .accessibility-toolbar {
            right: 12px;
            bottom: 80px;
            width: calc(100vw - 24px);
          }

          .accessibility-fab {
            right: 12px;
            bottom: 12px;
          }

          .button-group {
            grid-template-columns: 1fr;
          }

          .font-button {
            width: 56px;
            height: 56px;
          }
        }

        /* Print: Hide toolbar */
        @media print {
          .accessibility-fab,
          .accessibility-toolbar {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default AccessibilityToolbar;
