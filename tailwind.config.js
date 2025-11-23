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
        }
      }
    },
  },
  plugins: [],
}
