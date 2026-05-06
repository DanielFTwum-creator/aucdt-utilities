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
      },
      colors: {
        academic: {
          navy: '#1e3a5f',
          blue: '#2563eb',
          amber: '#f59e0b',
          gold: '#fbbf24',
          slate: '#475569',
        },
        ghana: {
          red: '#CE1126',
          gold: '#FCD116',
          green: '#006B3F',
          black: '#000000',
        },
        techbridge: {
          navy: '#0f2545',
          blue: '#1a4b8c',
          gold: '#FCD116',
          green: '#006B3F',
          light: '#f0f4fa',
        }
      }
    },
  },
  plugins: [],
}
