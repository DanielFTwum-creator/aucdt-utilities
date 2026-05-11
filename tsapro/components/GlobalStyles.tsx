
import React from 'react';

const GlobalStyles: React.FC = () => {
  return (
    <style>{`
      /* Base styles (applied to all themes) */
      body {
        transition: background-color 0.3s ease, color 0.3s ease;
        font-family: 'Inter', sans-serif;
        background-color: var(--color-bg-primary);
        color: var(--color-text-primary);
      }

      /* Component Data Selectors */
      [data-component="title"] { color: var(--color-text-title); }
      [data-component="text-primary"] { color: var(--color-text-primary); }
      [data-component="text-secondary"] { color: var(--color-text-secondary); }
      [data-component="text-tertiary"] { color: var(--color-text-tertiary); }
      [data-component="text-accent"] { color: var(--color-accent-primary); }
      [data-component="text-success"] { color: var(--color-success); }
      [data-component="text-danger"] { color: var(--color-danger); }
      [data-component="text-danger-soft"] { color: var(--color-danger-soft); }
      [data-component="warning-text"] { color: var(--color-warning); }

      [data-component="card"] {
        background-color: var(--color-bg-card);
        border: 1px solid var(--color-border-primary);
        color: var(--color-text-primary);
        backdrop-filter: var(--blur-card, none);
        transition: background-color 0.3s, border-color 0.3s;
        border-radius: 0.75rem; /* Standard rounded corners */
      }

      [data-component="label"] { color: var(--color-text-secondary); font-weight: 600; }
      
      [data-component="input"], [data-component="select"] {
        background-color: var(--color-bg-input);
        color: var(--color-text-primary);
        border: 2px solid var(--color-border-primary); /* 2px solid per brand guide */
        border-radius: 0.5rem; /* 8px radius */
        transition: background-color 0.2s, border-color 0.2s, box-shadow 0.2s;
        padding: 0.75rem 1rem; /* Comfortable padding */
      }
      [data-component="input"]:focus, [data-component="select"]:focus {
        border-color: var(--color-accent-focus-border);
        outline: none;
        box-shadow: 0 0 0 3px var(--color-accent-primary-focus);
      }
      [data-component="input"][data-overridden="true"] {
        border-color: var(--color-warning);
      }
      [data-component="input"][data-overridden="true"]:focus {
        border-color: var(--color-warning);
        box-shadow: 0 0 0 3px var(--color-warning-focus);
      }
      
      [data-component="button"] {
        transition: background-color 0.2s, color 0.2s, transform 0.1s, box-shadow 0.2s;
        border-radius: 0.5rem; /* 8px radius */
        font-weight: 600;
        padding: 0.75rem 1.5rem; /* 12px 24px padding */
      }
      [data-component="button"]:active {
        transform: scale(0.98);
      }
      [data-component="button"][data-variant="primary"] {
        background-color: var(--color-btn-primary-bg);
        color: var(--color-btn-primary-text);
        border: 1px solid transparent;
      }
      [data-component="button"][data-variant="primary"]:hover {
        background-color: var(--color-btn-primary-bg-hover);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
       [data-component="button"][data-variant="secondary"] {
        background-color: var(--color-btn-secondary-bg);
        color: var(--color-btn-secondary-text);
        border: 1px solid transparent;
      }
      [data-component="button"][data-variant="secondary"]:hover {
        background-color: var(--color-btn-secondary-bg-hover);
        opacity: 0.9;
      }
      [data-component="button"][data-variant="danger"] {
        background-color: var(--color-danger);
        color: white;
      }
      [data-component="button"][data-variant="danger"]:hover {
        opacity: 0.9;
      }
      [data-component="button"]:focus-visible {
        box-shadow: 0 0 0 2px var(--color-bg-primary), 0 0 0 4px var(--color-accent-primary);
      }
      
      [data-component="toggle-switch"][data-state="off"] { background-color: var(--color-bg-toggle-off); }
      [data-component="toggle-switch"][data-state="on"] { background-color: var(--color-accent-primary); }
      [data-component="toggle-thumb"][class*="ring-2"] {
          box-shadow: 0 0 0 2px var(--color-bg-primary), 0 0 0 4px var(--color-accent-primary);
      }
      [data-component="toggle-switch"][data-overridden="true"] {
        outline: 2px solid var(--color-warning);
        outline-offset: 2px;
      }
      
      [data-component="segmented-control"] {
          background-color: var(--color-bg-tertiary);
          display: inline-flex;
          border: 1px solid var(--color-border-primary);
      }
      [data-component="segmented-control"] button {
          color: var(--color-text-secondary);
          padding: 0.25rem 1rem;
          border-radius: 9999px;
      }
       [data-component="segmented-control"] button:hover {
          color: var(--color-text-primary);
      }
      [data-component="segmented-control"] button[data-active="true"] {
          background-color: var(--color-bg-card);
          color: var(--color-text-primary);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border: 1px solid var(--color-border-secondary);
      }

      [data-component="divider"] { border-color: var(--color-border-primary); }
      [data-component="divider-dashed"] { border-color: var(--color-border-primary); }
      [data-component="breakdown-section"] { border-top: 1px solid var(--color-border-primary); }
      
      [data-component="header"] {
        background-color: var(--color-bg-header);
        border-bottom: 1px solid var(--color-border-header);
        color: var(--color-header-text);
      }
      [data-component="header-title-brand"] { color: var(--color-header-brand); }
      [data-component="header-title-app"] { color: var(--color-header-app); }
      
      .nav-inactive { color: var(--color-nav-text); opacity: 0.8; }
      .nav-inactive:hover { background-color: rgba(255,255,255,0.1); opacity: 1; }
      .nav-active {
        background-color: var(--color-nav-active-bg);
        color: var(--color-nav-active-text);
      }
      
      [data-component="theme-switcher-bg"] { background-color: rgba(255,255,255,0.1); }
      [data-component="theme-switcher-button"] { color: var(--color-header-text); opacity: 0.7; }
      [data-component="theme-switcher-button"]:hover { background-color: rgba(255,255,255,0.1); opacity: 1; }
      [data-component="theme-switcher-button"][data-active="true"] {
          background-color: var(--color-nav-active-bg);
          color: var(--color-nav-active-text);
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          opacity: 1;
      }
      
      [data-component="footer"] {
          color: var(--color-text-tertiary);
          border-top-color: var(--color-border-primary);
      }

      [data-component="table-container"] { border-color: var(--color-border-primary); }
      [data-component="table"] { divide-color: var(--color-border-primary); }
      [data-component="table-header"] { background-color: var(--color-bg-tertiary); }
      [data-component="table-header"] th { color: var(--color-text-secondary); }
      [data-component="table-body"] {
          background-color: var(--color-bg-card);
          divide-color: var(--color-border-primary);
      }
      
      [data-component="error-box"] {
        background-color: var(--color-bg-danger);
        border-color: var(--color-border-danger);
      }
      [data-component="warning-box"] {
        background-color: var(--color-bg-warning);
        border: 1px solid var(--color-border-warning);
        color: var(--color-text-warning);
      }
      [data-component="warning-box"] svg {
        stroke: var(--color-text-warning);
      }
      
      /* --- PAYSLIP STYLES --- */
      [data-component="payslip-summary"] {
        background-color: var(--color-bg-secondary);
        border-top: 4px solid var(--color-accent-primary);
      }

      [data-component="payslip-section-header"] {
          color: var(--color-text-primary);
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--color-border-primary);
      }
       [data-component="payslip-section-header"] svg { color: var(--color-text-secondary); }
      [data-component="payslip-row"] { border-bottom: 1px dashed var(--color-border-primary); }
      [data-component="payslip-summary"] .space-y-1 > div:last-child { border-bottom: none; }
      [data-component="payslip-row"]:last-of-type { border-bottom: none; }

      [data-component="payslip-final-total"] {
          background-color: var(--color-bg-tertiary);
          margin: 1.5rem -1.5rem -1.5rem -1.5rem; /* Extend to card edges */
          padding: 1.5rem;
          border-top: 2px solid var(--color-border-primary);
          border-bottom-left-radius: 0.5rem; /* Match card rounding */
          border-bottom-right-radius: 0.5rem;
      }
      
      /* --- LOGIN PAGE STYLES --- */
      [data-component="login-icon-wrapper"] { background-color: var(--color-accent-primary); }
      [data-component="login-icon"] { color: var(--color-btn-primary-text); }


      /* --- THEME DEFINITIONS --- */

      /* Light Theme (Strict Techbridge Branding) */
      [data-app-theme="light"] {
        /* Primary Palette */
        --color-bg-primary: #F8F6F0; /* Cream Background */
        --color-bg-secondary: #F4E4BC; /* Gold Light */
        --color-bg-tertiary: #E6D5C7; /* Warm Beige */
        --color-bg-card: #FFFFFF; /* Standard White Card */
        
        --color-bg-header: #8B1538; /* Burgundy Primary */
        --color-header-text: #FFFFFF;
        
        --color-bg-input: #FFFFFF;
        --color-bg-toggle-off: #cbd5e1;
        
        /* Text Colors */
        --color-text-title: #8B1538; /* Burgundy Primary for Titles */
        --color-text-primary: #1F2937; /* Dark Grey for readability */
        --color-text-secondary: #6B1028; /* Burgundy Dark for labels/secondary */
        --color-text-tertiary: #78909c;
        
        /* Borders */
        --color-border-primary: #E6D5C7; /* Warm Beige (2px inputs) */
        --color-border-secondary: #F4E4BC;
        --color-border-header: #6B1028;
        
        /* Accents & Focus */
        --color-accent-primary: #D4AF37; /* Gold Accent */
        --color-accent-primary-focus: rgba(212, 175, 55, 0.4);
        --color-accent-focus-border: #8B1538; /* Burgundy border on focus */
        
        /* Branding & Navigation */
        --color-header-brand: #D4AF37; /* Gold Logo */
        --color-header-app: #FFFFFF; /* White App Name */
        
        --color-nav-text: #FFFFFF;
        --color-nav-active-bg: #D4AF37; /* Gold Active */
        --color-nav-active-text: #8B1538; /* Burgundy Text on Gold */
        
        /* Buttons */
        /* Primary: Burgundy Bg, White Text */
        --color-btn-primary-bg: #8B1538;
        --color-btn-primary-text: #FFFFFF;
        --color-btn-primary-bg-hover: #6B1028;
        
        --color-btn-secondary-bg: #E6D5C7;
        --color-btn-secondary-text: #6B1028;
        --color-btn-secondary-bg-hover: #D4AF37;
        
        --color-success: #059669;
        --color-danger: #DC2626;
        --color-danger-soft: #FEE2E2;
        --color-warning: #D97706;
        --color-warning-focus: rgba(217, 119, 6, 0.4);
        --color-bg-warning: #FEF3C7;
        --color-border-warning: #FCD34D;
        --color-text-warning: #92400E;
        --color-bg-danger: #FEE2E2;
        --color-border-danger: #FCA5A5;
        
        --blur-card: none;
      }
      
      /* Dark Theme */
      [data-app-theme="dark"] {
        --color-bg-primary: #0F172A;
        --color-bg-secondary: #1E293B;
        --color-bg-tertiary: #334155;
        --color-bg-card: #1E293B;
        
        --color-bg-header: #0F172A;
        --color-header-text: #F1F5F9;
        
        --color-bg-input: #0F172A;
        --color-bg-toggle-off: #475569;
        
        --color-text-title: #F8FAFC;
        --color-text-primary: #F1F5F9;
        --color-text-secondary: #94A3B8;
        --color-text-tertiary: #64748B;
        
        --color-border-primary: #334155;
        --color-border-secondary: #475569;
        --color-border-header: #1E293B;
        
        --color-accent-primary: #3B82F6;
        --color-accent-primary-focus: rgba(59, 130, 246, 0.4);
        --color-accent-focus-border: #60A5FA;
        
        --color-header-brand: #60A5FA;
        --color-header-app: #F1F5F9;
        
        --color-nav-text: #94A3B8;
        --color-nav-active-bg: #334155;
        --color-nav-active-text: #F8FAFC;
        
        --color-btn-primary-bg: #3B82F6;
        --color-btn-primary-text: #FFFFFF;
        --color-btn-primary-bg-hover: #2563EB;
        
        --color-btn-secondary-bg: #334155;
        --color-btn-secondary-text: #F8FAFC;
        --color-btn-secondary-bg-hover: #475569;
        
        --color-success: #10B981;
        --color-danger: #EF4444;
        --color-danger-soft: #7F1D1D;
        --color-warning: #F59E0B;
        --color-warning-focus: rgba(245, 158, 11, 0.4);
        --color-bg-warning: #451a03;
        --color-border-warning: #78350f;
        --color-text-warning: #fbbf24;
        --color-bg-danger: #450a0a;
        --color-border-danger: #7f1d1d;
        
        --blur-card: none;
      }

      /* High Contrast Theme */
      [data-app-theme="high-contrast"] {
        --color-bg-primary: #000000;
        --color-bg-secondary: #000000;
        --color-bg-tertiary: #000000;
        --color-bg-card: #000000;
        
        --color-bg-header: #000000;
        --color-header-text: #FFFF00;
        
        --color-bg-input: #000000;
        --color-bg-toggle-off: #FFFFFF;
        
        --color-text-title: #FFFF00;
        --color-text-primary: #FFFFFF;
        --color-text-secondary: #00FF00;
        --color-text-tertiary: #00FFFF;
        
        --color-border-primary: #FFFFFF;
        --color-border-secondary: #FFFFFF;
        --color-border-header: #FFFFFF;
        
        --color-accent-primary: #FFFF00;
        --color-accent-primary-focus: rgba(255, 255, 0, 0.4);
        --color-accent-focus-border: #FFFF00;
        
        --color-header-brand: #FFFF00;
        --color-header-app: #FFFFFF;
        
        --color-nav-text: #FFFFFF;
        --color-nav-active-bg: #0000FF;
        --color-nav-active-text: #FFFFFF;
        
        --color-btn-primary-bg: #0000FF;
        --color-btn-primary-text: #FFFFFF;
        --color-btn-primary-bg-hover: #0000AA;
        
        --color-btn-secondary-bg: #FFFFFF;
        --color-btn-secondary-text: #000000;
        --color-btn-secondary-bg-hover: #CCCCCC;
        
        --color-success: #00FF00;
        --color-danger: #FF0000;
        --color-danger-soft: #330000;
        --color-warning: #FFFF00;
        --color-warning-focus: rgba(255, 255, 0, 0.4);
        --color-bg-warning: #000000;
        --color-border-warning: #FFFF00;
        --color-text-warning: #FFFF00;
        --color-bg-danger: #000000;
        --color-border-danger: #FF0000;
        
        --blur-card: none;
      }
       [data-app-theme="high-contrast"] [data-component="card"],
       [data-app-theme="high-contrast"] [data-component="input"],
       [data-app-theme="high-contrast"] [data-component="select"],
       [data-app-theme="high-contrast"] [data-component="button"],
       [data-app-theme="high-contrast"] [data-component="toggle-switch"],
       [data-app-theme="high-contrast"] [data-component="segmented-control"] button,
       [data-app-theme="high-contrast"] [data-component="theme-switcher-button"] {
          border: 2px solid #D4AF37 !important;
       }
       /* Specific active state for theme switcher buttons in high-contrast */
       [data-app-theme="high-contrast"] [data-component="theme-switcher-button"][data-active="true"] {
          background-color: #D4AF37 !important;
          color: black !important;
       }

       [data-app-theme="high-contrast"] [data-component="button"]:focus-visible,
       [data-app-theme="high-contrast"] [data-component="input"]:focus,
       [data-app-theme="high-contrast"] [data-component="select"]:focus,
       [data-app-theme="high-contrast"] [data-component="toggle-thumb"][class*="ring-2"] {
          outline: 3px solid white;
          outline-offset: 2px;
          box-shadow: none;
       }
    `}</style>
  );
};

export default GlobalStyles;