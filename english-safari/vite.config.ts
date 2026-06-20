import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  server: {
    port: 3000,
    open: true,
    // Proxy API calls to the Express backend during development
    proxy: {
      '/english-safari/api': {
        target: 'http://localhost:3010',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:3010',
        changeOrigin: true,
      },
    },
  },
  // SECURITY: do NOT inject GEMINI_API_KEY into the bundle. Gemini is
  // proxied through the backend (/english-safari/api/gemini/*); the key stays
  // server-side. Baking it here gets it auto-revoked by Google.
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom')) return 'vendor-react-dom';
            if (id.includes('react-router')) return 'vendor-router';
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
            if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-motion';
            if (id.includes('lucide') || id.includes('heroicons')) return 'vendor-icons';
            return 'vendor';
          }
        },
      },
    },
  }
})
