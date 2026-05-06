import React from 'react';

/**
 * Skip Links Component
 * 
 * Provides keyboard navigation shortcuts to main content areas
 * WCAG 2.1 Success Criterion 2.4.1 (Bypass Blocks)
 * 
 * Skip links allow keyboard users to jump to important sections
 * without tabbing through all navigation elements
 */

function SkipLinks() {
  const skipLinks = [
    {
      href: '#main-content',
      label: 'Skip to main content',
      key: 'main'
    },
    {
      href: '#dashboard-header',
      label: 'Skip to dashboard controls',
      key: 'header'
    },
    {
      href: '#all-time-stats',
      label: 'Skip to statistics',
      key: 'stats'
    },
    {
      href: '#year-over-year-chart',
      label: 'Skip to year-over-year chart',
      key: 'yoy'
    },
    {
      href: '#funnel-chart',
      label: 'Skip to conversion funnel',
      key: 'funnel'
    }
  ];

  const handleSkipClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Announce to screen readers
      const label = skipLinks.find(link => link.href === href)?.label;
      if (label) {
        announceToScreenReader(`Navigated to ${label}`);
      }
    }
  };

  const announceToScreenReader = (message) => {
    const announcement = document.getElementById('skip-links-announcer');
    if (announcement) {
      announcement.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        announcement.textContent = '';
      }, 1000);
    }
  };

  return (
    <>
      {/* Screen reader announcer */}
      <div
        id="skip-links-announcer"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Skip Links Navigation */}
      <nav
        aria-label="Skip links"
        className="skip-links-container"
      >
        <ul className="skip-links-list">
          {skipLinks.map((link) => (
            <li key={link.key} className="skip-links-item">
              <a
                href={link.href}
                className="skip-link"
                onClick={(e) => handleSkipClick(e, link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <style jsx>{`
        .skip-links-container {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 10000;
        }

        .skip-links-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .skip-links-item {
          margin: 0;
          padding: 0;
        }

        .skip-link {
          position: absolute;
          top: -100px;
          left: 0;
          background: var(--color-primary);
          color: var(--color-text-inverse);
          padding: 12px 24px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1rem;
          border-radius: 0 0 8px 0;
          box-shadow: var(--shadow-lg);
          transition: top 0.3s ease;
          z-index: 10000;
          white-space: nowrap;
        }

        .skip-link:focus {
          top: 0;
          outline: 3px solid var(--color-border-focus);
          outline-offset: 0;
        }

        .skip-link:hover {
          background: var(--color-primary-dark);
        }

        /* High contrast mode */
        [data-theme="high-contrast"] .skip-link {
          border: 3px solid var(--color-border-focus);
        }

        [data-theme="high-contrast"] .skip-link:focus {
          outline: 4px solid var(--color-border-focus);
          outline-offset: 2px;
        }

        /* Print: Hide skip links */
        @media print {
          .skip-links-container {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default SkipLinks;
