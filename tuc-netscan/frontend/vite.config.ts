import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  server: {
    port: 3000,
    proxy: {
      // Phase 1 migration: /api now goes to WMS (Spring Boot, default port 8080).
      // Start WMS with: mvn -f tuc-wms\backend\pom.xml spring-boot:run
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          query: ['@tanstack/react-query']
        }
      }
    }
  }
})
