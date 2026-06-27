import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify — file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
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
              if (id.includes('exceljs') || id.includes('jszip') || id.includes('archiver') || id.includes('fflate')) return 'vendor-exceljs';
              return 'vendor';
            }
          },
        },
      },
    },
  };
});
