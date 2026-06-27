import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig(() => {
    return {
  base: './',
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
      // SECURITY: the Gemini key is NEVER injected into the client bundle. Gemini
      // calls go through this app's server.ts relay -> WMS /api/gemini/generate.
      // (Removed the former define: process.env.API_KEY / GEMINI_API_KEY that baked
      // the secret into the public bundle — exposed keys get auto-revoked.)
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
