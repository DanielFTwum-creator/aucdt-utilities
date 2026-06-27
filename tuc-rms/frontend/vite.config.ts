import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Single source of truth for the tuc-rms frontend build.
// (Previously split across vite.config.js / vite.config.ts / vite.config.production.js —
//  the production settings never shipped because `vite build` only ever loaded the
//  minimal .js, and the prod config required terser, which was not installed.)
// Vite 8 (Rolldown + oxc): manualChunks must be the FUNCTION form — the object
// form is a Rollup-ism that Rolldown rejects.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    outDir: 'dist',
    sourcemap: false,            // set true if wiring up Sentry or similar
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // Split stable third-party libs into a single long-cached vendor chunk.
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },

  // Local development: proxy API calls to the co-located backend on :5000.
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
