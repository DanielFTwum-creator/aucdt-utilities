import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

/**
 * Accessibility Toolbar Component
 * Provides controls for theme, font size, motion, and other accessibility settings
 * 
 * Features:
 * - Theme switcher (Light/Dark/High-Contrast)
 * - Font size controls (A- A A+)
 * - Reduce motion toggle
 * - Keyboard shortcuts
 * - Persistent across sessions
 */
const AccessibilityToolbar = () => {
  const {
    theme,
    fontSize,
    reduceMotion,
    setTheme,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    setReduceMotion,
    resetSettings,
  } = useAccessibility();

  const [isExpanded, setIsExpanded] = useState(false);

  const themes = [
    { value: 'light', label: 'Light', icon: '☀️', description: 'Light theme with bright background' },
    { value: 'dark', label: 'Dark', icon: '🌙', description: 'Dark theme for reduced eye strain' },
    { value: 'high-contrast', label: 'High Contrast', icon: '⚡', description: 'Maximum contrast for visibility' },
  ];

  const fontSizes = {
    'small': { label: 'Small', value: 'A-' },
    'medium': { label: 'Medium', value: 'A' },
    'large': { label: 'Large', value: 'A+' },
    'extra-large': { label: 'Extra Large', value: 'A++' },
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    // Announce to screen readers
    const announcement = `Theme changed to ${themes.find(t => t.value === newTheme)?.label}`;
    announceToScreenReader(announcement);
  };

  const handleFontIncrease = () => {
    increaseFontSize();
    announceToScreenReader('Font size increased');
  };

  const handleFontDecrease = () => {
    decreaseFontSize();
    announceToScreenReader('Font size decreased');
  };

  const handleFontReset = () => {
    resetFontSize();
    announceToScreenReader('Font size reset to default');
  };

  const handleMotionToggle = () => {
    const newValue = !reduceMotion;
    setReduceMotion(newValue);
    announceToScreenReader(newValue ? 'Motion reduced' : 'Motion enabled');
  };

  const handleReset = () => {
    resetSettings();
    announceToScreenReader('All accessibility settings reset to defaults');
  };

  // Helper to announce changes to screen readers
  const announceToScreenReader = (message) => {
    const announcement = document.getElementById('a11y-announcer');
    if (announcement) {
      announcement.textContent = message;
      setTimeout(() => {
        announcement.textContent = '';
      }, 1000);
    }
  };

  return (
    <>
      {/* Screen reader announcer */}
      <div
        id="a11y-announcer"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Accessibility toolbar */}
      <div
        className={`accessibility-toolbar ${isExpanded ? 'expanded' : 'collapsed'}`}
        role="toolbar"
        aria-label="Accessibility settings"
      >
        {/* Toggle button */}
        <button
          className="toolbar-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Close accessibility toolbar' : 'Open accessibility toolbar'}
          title={isExpanded ? 'Close accessibility settings' : 'Open accessibility settings (Ctrl+Shift+A)'}
        >
          <span className="icon" aria-hidden="true">♿</span>
          <span className="label">Accessibility</span>
        </button>

        {/* Toolbar content (shown when expanded) */}
        {isExpanded && (
          <div className="toolbar-content">
            {/* Theme selector */}
            <div className="toolbar-section">
              <h3 className="section-title">Theme</h3>
              <div className="theme-buttons" role="radiogroup" aria-label="Theme selection">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.value}
                    className={`theme-button ${theme === themeOption.value ? 'active' : ''}`}
                    onClick={() => handleThemeChange(themeOption.value)}
                    role="radio"
                    aria-checked={theme === themeOption.value}
                    aria-label={themeOption.description}
                    title={themeOption.description}
                  >
                    <span className="icon" aria-hidden="true">{themeOption.icon}</span>
                    <span className="label">{themeOption.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font size controls */}
            <div className="toolbar-section">
              <h3 className="section-title">Font Size</h3>
              <div className="font-controls">
                <button
                  className="font-button"
                  onClick={handleFontDecrease}
                  disabled={fontSize === 'small'}
                  aria-label="Decrease font size"
                  title="Decrease font size (Ctrl+-)"
                >
                  <span className="icon" aria-hidden="true">A-</span>
                </button>
                <button
                  className="font-button reset"
                  onClick={handleFontReset}
                  aria-label={`Current font size: ${fontSizes[fontSize].label}. Click to reset`}
                  title="Reset font size to default"
                >
                  <span className="icon" aria-hidden="true">{fontSizes[fontSize].value}</span>
                </button>
                <button
                  className="font-button"
                  onClick={handleFontIncrease}
                  disabled={fontSize === 'extra-large'}
                  aria-label="Increase font size"
                  title="Increase font size (Ctrl++)"
                >
                  <span className="icon" aria-hidden="true">A+</span>
                </button>
              </div>
            </div>

            {/* Motion settings */}
            <div className="toolbar-section">
              <h3 className="section-title">Animations</h3>
              <label className="toggle-control">
                <input
                  type="checkbox"
                  checked={reduceMotion}
                  onChange={handleMotionToggle}
                  aria-label="Reduce motion"
                />
                <span className="toggle-slider" aria-hidden="true"></span>
                <span className="toggle-label">Reduce Motion</span>
              </label>
              <p className="setting-description">
                Minimizes animations for reduced distraction
              </p>
            </div>

            {/* Reset button */}
            <div className="toolbar-section">
              <button
                className="reset-button"
                onClick={handleReset}
                aria-label="Reset all accessibility settings to defaults"
                title="Reset all settings"
              >
                <span className="icon" aria-hidden="true">↺</span>
                <span className="label">Reset All Settings</span>
              </button>
            </div>

            {/* Keyboard shortcuts reference */}
            <div className="toolbar-section shortcuts">
              <h3 className="section-title">Keyboard Shortcuts</h3>
              <ul className="shortcuts-list">
                <li><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd> - Toggle this toolbar</li>
                <li><kbd>Ctrl</kbd> + <kbd>+</kbd> - Increase font size</li>
                <li><kbd>Ctrl</kbd> + <kbd>-</kbd> - Decrease font size</li>
                <li><kbd>Ctrl</kbd> + <kbd>0</kbd> - Reset font size</li>
                <li><kbd>Tab</kbd> - Navigate through interactive elements</li>
                <li><kbd>Shift</kbd> + <kbd>Tab</kbd> - Navigate backwards</li>
                <li><kbd>Enter</kbd> / <kbd>Space</kbd> - Activate buttons</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Floating accessibility button (when collapsed) */}
      {!isExpanded && (
        <button
          className="floating-a11y-button"
          onClick={() => setIsExpanded(true)}
          aria-label="Open accessibility settings"
          title="Accessibility settings (Ctrl+Shift+A)"
        >
          <span aria-hidden="true">♿</span>
        </button>
      )}
    </>
  );
};

export default AccessibilityToolbar;
