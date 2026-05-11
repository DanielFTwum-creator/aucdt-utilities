/**
 * Playwright global fixture that captures a full-page screenshot after every test.
 * Import this file in your spec files to activate it, or add it to the test setup.
 *
 * Usage: imported automatically via the fixtures export below.
 */
import { test as base } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const SCREENSHOT_DIR = path.join(process.cwd(), 'test-results', 'screenshots');

export const test = base.extend({
  // Automatically-used fixture: runs for every test
  page: async ({ page }, use, testInfo) => {
    await use(page);

    // Capture after the test body completes (pass or fail)
    try {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

      const safeName = testInfo.title
        .replace(/[^a-z0-9]+/gi, '-')
        .toLowerCase()
        .slice(0, 80);

      const file = path.join(
        SCREENSHOT_DIR,
        `${testInfo.titlePath.slice(0, -1).map(s => s.replace(/[^a-z0-9]+/gi, '-').toLowerCase()).join('__')}__${safeName}.png`,
      );

      await page.screenshot({ path: file, fullPage: true });
    } catch {
      // Never fail a test because screenshot failed
    }
  },
});

export { expect } from '@playwright/test';
