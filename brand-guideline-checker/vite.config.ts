import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig(() => {
    return {
      base: './',
      server: {
        allowedHosts: ['ai-tools.techbridge.edu.gh'],
      },
      preview: {
        allowedHosts: ['ai-tools.techbridge.edu.gh'],
      },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
