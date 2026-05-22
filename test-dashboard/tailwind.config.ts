import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          '900': '#0f172a',
          '850': '#1a202c',
          '800': '#1e293b',
          '750': '#2a3a4a',
          '700': '#334155',
          '600': '#475569',
          '500': '#64748b',
          '400': '#94a3b8',
          '300': '#cbd5e1',
          '200': '#e2e8f0',
          '100': '#f1f5f9',
        },
        blue: {
          '700': '#1d4ed8',
          '600': '#2563eb',
          '500': '#3b82f6',
          '400': '#60a5fa',
        },
        green: {
          '500': '#10b981',
          '400': '#34d399',
        },
        red: {
          '500': '#ef4444',
          '400': '#f87171',
        },
        yellow: {
          '500': '#f59e0b',
          '400': '#fbbf24',
        },
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1a202c 50%, #1e293b 100%)',
        'gradient-header': 'linear-gradient(90deg, #1d4ed8 0%, #2563eb 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.4)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

export default config
