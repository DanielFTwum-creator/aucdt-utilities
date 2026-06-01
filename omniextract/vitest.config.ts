import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import type { PluginOption } from 'vite';

// Vitest unit test configuration — omniextract
// TUC coverage target: >70% for core utilities
export default defineConfig({
  plugins: [react() as unknown as PluginOption],
  test: {
    environment: 'jsdom',
    pool: 'threads',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['src/**/*.e2e.{ts,tsx}', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec,e2e}.{ts,tsx}', 'src/__tests__/**'],
      thresholds: {
        branches:   70,
        functions:  70,
        lines:      70,
        statements: 70,
      },
    },
  },
});
