/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Crimson Text', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Courier New', 'monospace'],
      },
      colors: {
        crimson: '#8b1a2e',
        cream: '#faf7f2',
        parchment: '#f2ede4',
        ink: '#1a0a0a',
        gold: '#c9a84c',
        academic: {
          navy: '#1e3a5f',
          blue: '#2563eb',
          amber: '#f59e0b',
          gold: '#fbbf24',
          slate: '#475569',
        },
      },
    },
  },
  plugins: [],
}
