/**
 * Smoke Tests — All 255 TUC Apps
 * Validates: loads, renders content, no console errors, title present
 *
 * Run: npx playwright test --project=smoke
 */
import { test, expect } from '@playwright/test';
import { ALL_APPS, GATEWAY } from '../playwright.config';

const CONSOLE_IGNORE = [
  /favicon/i,
  /net::ERR_/,
  /ResizeObserver/,
  /Non-passive event/,
];

for (const appName of ALL_APPS) {
  test.describe(appName, () => {
    test('loads and renders content', async ({ page }) => {
      const errors: string[] = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          const text = msg.text();
          if (!CONSOLE_IGNORE.some(r => r.test(text))) {
            errors.push(text);
          }
        }
      });

      page.on('pageerror', err => {
        errors.push(`JS Error: ${err.message}`);
      });

      const url = `${GATEWAY}/${appName}/`;
      const res = await page.goto(url, { waitUntil: 'domcontentloaded' });

      // App must respond
      expect(res?.status(), `${appName}: HTTP status`).toBeLessThan(500);

      // Wait for React to hydrate
      await page.waitForLoadState('networkidle').catch(() => {/* timeout OK */});
      await page.waitForTimeout(1500);

      // Must have a title
      const title = await page.title();
      expect(title, `${appName}: page title`).not.toBe('');

      // Must have visible body content (not blank white page)
      const bodyText = await page.evaluate(() => document.body.innerText.trim());
      const visibleNodes = await page.evaluate(() =>
        document.querySelectorAll('h1,h2,h3,p,button,input,canvas,svg,img,[role]').length
      );
      expect(
        visibleNodes,
        `${appName}: has visible UI elements (got 0 — blank render)`
      ).toBeGreaterThan(0);

      // Screenshot for gallery (only when running full harvest)
      if (process.env.HARVEST_SCREENSHOTS === '1') {
        await page.screenshot({
          path: `catalogue/project-screenshots/${appName}.png`,
          clip: { x: 0, y: 0, width: 1280, height: 800 },
        });
      }

      // No JS errors
      expect(
        errors,
        `${appName}: console errors — ${errors.join(', ')}`
      ).toHaveLength(0);
    });
  });
}
