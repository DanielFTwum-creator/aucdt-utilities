import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// SPA served at the wms.techbridge.edu.gh root; '/api/*' is reverse-proxied to
// the Spring Boot backend (port 8081) by nginx — see tuc-wms/docs/DEPLOYMENT.md.
// In dev, proxy /api to the local backend so the same relative fetches work.
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5174,
    proxy: {
      '/api': { target: 'http://localhost:8081', changeOrigin: true },
    },
  },
});
