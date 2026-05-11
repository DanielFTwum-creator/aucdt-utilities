/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'grief-blue': '#2C3E50',
        'memory-gold': '#F39C12',
        'dream-white': '#ECF0F1',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['Fira Code', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
