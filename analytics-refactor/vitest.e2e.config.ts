/// <reference types="vitest" />
import { defineConfig } from 'vite'

/**
 * Vitest configuration for E2E tests (Puppeteer).
 * Runs in Node environment — no DOM, no happy-dom.
 * Usage: npm run test:e2e
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['e2e/**/*.test.{js,ts}'],
    testTimeout: 30000,
    hookTimeout: 15000,
    reporters: ['verbose'],
  },
})
