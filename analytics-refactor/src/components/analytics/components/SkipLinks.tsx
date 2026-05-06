import React from 'react';

/**
 * Skip Links Component
 * Provides keyboard navigation shortcuts to main content areas
 * Essential for WCAG 2.1 AA compliance
 * 
 * Features:
 * - Skip to main content
 * - Skip to navigation
 * - Skip to charts
 * - Visible only on keyboard focus
 */
const SkipLinks = () => {
  const skipToContent = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.tabIndex = -1; // Make it focusable
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      className="skip-links"
      aria-label="Skip links"
      role="navigation"
    >
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          skipToContent('main-content');
        }}
      >
        Skip to main content
      </a>
      <a
        href="#dashboard-header"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          skipToContent('dashboard-header');
        }}
      >
        Skip to header
      </a>
      <a
        href="#charts-section"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          skipToContent('charts-section');
        }}
      >
        Skip to charts
      </a>
      <a
        href="#a11y-toolbar"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          skipToContent('a11y-toolbar');
        }}
      >
        Skip to accessibility settings
      </a>
    </nav>
  );
};

export default SkipLinks;
