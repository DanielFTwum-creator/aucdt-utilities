import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss()],
    // NOTE: the Gemini key is intentionally NOT exposed to the client bundle.
    // AI lyrics are served by the server-side /api/lyrics route (see server.ts),
    // which resolves the key via the WMS proxy (PATTERNS.md #11). Never re-add a
    // `define` for GEMINI_API_KEY — that bakes the secret into public JS.
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
