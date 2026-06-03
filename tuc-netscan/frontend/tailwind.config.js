/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:  { DEFAULT: '#0D1B2E', 50: '#1B3A6B', 100: '#152d57', 200: '#0f2140', 300: '#0D1B2E' },
        gold:  { DEFAULT: '#C8920A', light: '#E5A812', dark: '#9E7208' },
        scan:  { green: '#00FF87', amber: '#FFB800', red: '#FF4444', blue: '#00CFFF' },
      },
      fontFamily: {
        display: ['"Share Tech Mono"', 'monospace'],
        mono:    ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'ping-slow':  'ping 2s cubic-bezier(0,0,0.2,1) infinite',
        'scan-line':  'scanLine 3s linear infinite',
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-in':   'slideIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        scanLine: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn: { from: { transform: 'translateX(-8px)', opacity: 0 }, to: { transform: 'translateX(0)', opacity: 1 } }
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(200,146,10,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,146,10,0.03) 1px, transparent 1px)',
      },
      backgroundSize: { 'grid': '40px 40px' },
    }
  },
  plugins: []
}
