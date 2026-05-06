// This file is conceptually part of the project setup.
// In a real project, this would be `tailwind.config.js` or `tailwind.config.ts`
// at the root, generating the CSS output. For this environment,
// the configuration is embedded directly in `index.html`.
// The content below reflects what would be in a `tailwind.config.ts` file.

// Fix: Change module.exports to export default for TypeScript compatibility
export default {
  darkMode: 'class', // Enable dark mode based on 'class'
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // Add other file paths where Tailwind classes are used
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        background: {
          light: 'var(--color-background-light)',
          dark: 'var(--color-background-dark)',
        },
        // Add text colors that contrast well with both themes
        'text-light': '#333',
        'text-dark': '#eee',
        'subtle-text-light': '#666',
        'subtle-text-dark': '#bbb',
        'border-light': '#e0e0e0',
        'border-dark': '#444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '8px': '8px',
        '16px': '16px',
        '24px': '24px',
        '32px': '32px',
        '4px': '4px', // Added for 8px grid system increments
        '12px': '12px',
        '20px': '20px',
        '28px': '28px',
      },
      // Breakpoints from SRS
      screens: {
        'sm': '320px', // Mobile
        'md': '641px', // Tablet
        'lg': '1025px', // Desktop
      }
    },
  },
  plugins: [],
};