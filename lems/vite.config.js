import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  // The components use JSX inside .js files (flattened CRA heritage).
  esbuild: { loader: 'jsx', include: /\.(js|jsx)$/ },
  optimizeDeps: { esbuildOptions: { loader: { '.js': 'jsx' } } },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // pdf.js is only used by the admin curriculum import — keep it out
            // of the eager vendor chunk so it loads on demand (dynamic import).
            if (id.includes('pdfjs-dist')) return 'vendor-pdfjs';
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
