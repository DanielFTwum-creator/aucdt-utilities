import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
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
      plugins: [react(), tailwindcss()],
      base: "./",
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './'),
        },
      },
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
    };
});
