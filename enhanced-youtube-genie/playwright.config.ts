import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration — YouTube Description Genie
 * TUC-ICT standard. Run against the local dev server (port 3028).
 *
 * Usage:
 *   pnpm test:e2e            # headless, single run
 *   pnpm test:e2e:ui         # interactive Playwright UI
 *   pnpm test:e2e:report     # open last HTML report
 *
 * The dev server must be running: pnpm dev (port 5173) or pnpm start (port 3028).
 * Tests use port 5173 (Vite dev) so OAuth redirect is not required.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // sequential — server has limited resources
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['line'],
  ],
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    video:      'off',
    trace:      'on-first-retry',
    // Inject auth bypass before each page load so tests don't need Google OAuth
    storageState: undefined,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Start Vite dev server automatically before the test run
  webServer: {
    command: 'pnpm dev',
    url:     'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
