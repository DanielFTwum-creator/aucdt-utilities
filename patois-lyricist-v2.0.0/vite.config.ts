import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // Absolute base: the app is served under the /patois/ sub-path and has a nested OAuth
      // callback route (/patois/auth/callback). A relative base ('./') resolves asset URLs
      // against the current route, so on the deeper callback path the bundles were requested
      // from /patois/auth/assets/... (404 -> SPA fallback -> text/html -> module MIME error,
      // app never boots). An absolute base pins assets to /patois/assets/... at any depth.
      base: '/patois/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: (id) => {
              if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('node_modules/lucide-react')) {
                return 'vendor-ui';
              }
              if (id.includes('node_modules/@google')) {
                return 'vendor-gemini';
              }
            }
          }
        },
        chunkSizeWarningLimit: 600
      }
    };
});
