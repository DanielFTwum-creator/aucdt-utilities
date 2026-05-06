// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#1D9E75',
          dark:    '#0F6E56',
          light:   '#E1F5EE',
          text:    '#085041',
        },
        surface: {
          primary:   '#ffffff',
          secondary: '#f5f5f3',
          tertiary:  '#efede8',
        },
        ink: {
          primary:   '#1a1a18',
          secondary: '#5f5e5a',
          tertiary:  '#88877f',
        },
        // legacy — keep for StreamPlayer / TrackLibrary
        brand: {
          50:  '#edfaf7', 100: '#d0f4eb', 200: '#a4e8d8',
          300: '#6dd5be', 400: '#3bbda3', 500: '#1D9E75',
          600: '#0F6E56', 700: '#084f47', 800: '#063c37', 900: '#042a27',
        },
        navy: {
          50:  '#e8ecf2', 100: '#c5cedf', 200: '#96a9c7',
          500: '#1e3a5f', 700: '#0d2137', 900: '#060f1a',
        },
      },
      fontFamily: {
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:  ['"Space Mono"', 'monospace'],
      },
      borderRadius: {
        md: '8px',
        lg: '12px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'waveform':   'waveform 1.2s ease-in-out infinite',
        'fade-in':    'fadeIn 0.3s ease-in-out',
        'slide-up':   'slideUp 0.4s ease-out',
      },
      keyframes: {
        waveform: { '0%,100%': { transform: 'scaleY(0.3)' }, '50%': { transform: 'scaleY(1)' } },
        fadeIn:   { from: { opacity: '0' },                   to:   { opacity: '1' } },
        slideUp:  { from: { transform: 'translateY(12px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
} satisfies Config
