import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build Configuration for Production
  build: {
    // Output directory (where dist/ will be generated)
    outDir: 'dist',
    
    // Remove console logs in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    
    // Generate source maps for error tracking (can be uploaded to Sentry)
    sourcemap: false,  // Set to true if using Sentry or similar error tracking
    
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
    
    // Rollup options for code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'axios'
          ]
        }
      }
    }
  },
  
  // Server Configuration (for local development)
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
