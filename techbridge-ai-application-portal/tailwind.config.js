/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-gold': 'var(--color-brand-gold)',
        'brand-gold-light': 'var(--color-brand-gold-light)',
        'brand-gold-pale': 'var(--color-brand-gold-pale)',
        'brand-ink': 'var(--color-brand-ink)',
        'brand-cream': 'var(--color-brand-cream)',
        'brand-paper': 'var(--color-brand-paper)',
        'brand-card-bg': 'var(--color-brand-paper)', // Alias for backward compat
        'brand-input-bg': 'var(--color-brand-paper)', // Alias
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'bebas': ['"Bebas Neue"', 'sans-serif'],
        'cormorant': ['"Cormorant Garamond"', 'serif'],
        'dm-sans': ['"DM Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'grain': "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\" opacity=\"0.05\"/%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
}
