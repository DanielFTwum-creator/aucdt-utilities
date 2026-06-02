import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig(() => {
    return {
      base: './',
      plugins: [tailwindcss()],
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
            manualChunks(id) {
              if (id.includes('node_modules/react')) return 'react-vendor';
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
