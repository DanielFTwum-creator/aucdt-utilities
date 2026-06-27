import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: './', // Add this line - ensures absolute paths from root
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      define: {
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Optional: explicitly set output directory
        outDir: 'dist',
        // Optional: ensure assets use absolute paths
        assetsDir: 'assets',
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
    };
});