import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
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
  },
})
