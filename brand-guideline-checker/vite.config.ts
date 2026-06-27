import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
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
      define: {
        'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(env.VITE_GOOGLE_CLIENT_ID),
        'import.meta.env.VITE_GOOGLE_REDIRECT_URI': JSON.stringify(env.VITE_GOOGLE_REDIRECT_URI),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
