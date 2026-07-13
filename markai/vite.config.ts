import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
  plugins: [
    react(),
    // Coverage instrumentation — only active for the Cypress e2e coverage build
    istanbul({
      include: ['components/**', 'contexts/**', 'services/**', 'App.tsx', 'index.tsx'],
      exclude: ['node_modules', 'cypress', 'tests', 'dist', 'src/__tests__'],
      extension: ['.ts', '.tsx'],
      requireEnv: true,
      forceBuildInstrument: process.env.VITE_COVERAGE === 'true',
    }),
  ],
  // Absolute base (not './') so assets resolve on nested routes like
  // /markai/auth/callback. With a relative base the callback route requests
  // /markai/auth/assets/*.js (404 -> SPA serves index.html -> MIME error) and
  // the OAuth callback JS never runs (Pattern 29).
  base: '/markai/',
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      },
      output: {
        manualChunks: (id) => {
          if (id.includes('react')) {
            return 'vendor-react';
          }
          if (id.includes('framer-motion')) {
            return 'vendor-motion';
          }
          if (id.includes('lucide-react')) {
            return 'vendor-lucide';
          }
        },
      },
    },
  },
});
