import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const GATEWAY = process.env.GATEWAY || 'http://localhost:8080';

/**
 * Discover all apps with a package.json at root level.
 * Exported for use in test files.
 */
const SKIP = new Set([
  'node_modules', '.git', 'dist', 'build', 'scripts', 'templates',
  'thumbnail-generator', 'backend', 'aucdt-portal-tests', 'tuc-portal-tests',
  'docker', 'docs', 'archive', 'catalogue', 'project-screenshots',
  'project-screenshots-real', 'monitoring', 'reports', 'build-validation-reports',
  'proof-of-concept-screenshots', 'master-thumbnail-catalog', 'playwright',
  'src', 'gemini', 'genai', 'sync-from-d-drive', 'tests',
]);

export const ALL_APPS: string[] = fs
  .readdirSync(path.resolve(__dirname), { withFileTypes: true })
  .filter(e => e.isDirectory() && !SKIP.has(e.name) && !e.name.startsWith('.'))
  .filter(e => fs.existsSync(path.join(__dirname, e.name, 'package.json')))
  .map(e => e.name)
  .sort();

export { GATEWAY };

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 1,
  workers: process.env.CI ? 4 : 6,
  timeout: 30_000,
  expect: { timeout: 8_000 },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'catalogue/playwright-report', open: 'never' }],
    ['json', { outputFile: 'catalogue/playwright-results.json' }],
  ],

  use: {
    baseURL: GATEWAY,
    headless: true,
    viewport: { width: 1280, height: 800 },
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'smoke',
      testMatch: '**/app.smoke.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'a11y',
      testMatch: '**/app.a11y.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'auth',
      testMatch: '**/app.auth.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
