import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Raise limit to silence warnings from unavoidably large vendor chunks
        chunkSizeWarningLimit: 600,
        // Manual chunk splitting — groups heavy vendors into separate files
        rollupOptions: {
          output: {
            manualChunks(id: string) {
              // Google GenAI SDK goes into its own chunk (~400 kB minified)
              if (id.includes('@google/genai') || id.includes('google/genai')) {
                return 'vendor-genai';
              }
              // React runtime together (they're always co-loaded)
              if (id.includes('node_modules/react-dom')) {
                return 'vendor-react-dom';
              }
              if (id.includes('node_modules/react/') || id.includes('node_modules/react-is')) {
                return 'vendor-react';
              }
            },
          },
        },
      },
    };
});
