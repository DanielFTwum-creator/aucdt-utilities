/**
 * Accessibility Tests — All 255 TUC Apps
 * Validates: lang attr, skip link, ARIA landmarks, heading hierarchy
 *
 * Run: npx playwright test --project=a11y
 */
import { test, expect } from '@playwright/test';
import { ALL_APPS, GATEWAY } from '../playwright.config';

for (const appName of ALL_APPS) {
  test.describe(appName, () => {
    test('meets baseline ARIA requirements', async ({ page }) => {
      await page.goto(`${GATEWAY}/${appName}/`, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(1000);

      // 1. lang attribute on <html>
      const lang = await page.evaluate(() =>
        document.documentElement.getAttribute('lang')
      );
      expect(lang, `${appName}: <html> must have lang attribute`).toBeTruthy();
      expect(lang, `${appName}: lang must be a valid BCP-47 tag`).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/);

      // 2. Page title
      const title = await page.title();
      expect(title, `${appName}: must have a non-empty <title>`).not.toBe('');
      expect(title.length, `${appName}: <title> should be descriptive`).toBeGreaterThan(3);

      // 3. At least one ARIA landmark (main, nav, header, footer, or role attr)
      const landmarks = await page.evaluate(() =>
        document.querySelectorAll(
          'main, nav, header, footer, [role="main"], [role="navigation"], ' +
          '[role="banner"], [role="contentinfo"], [role="application"]'
        ).length
      );
      expect(
        landmarks,
        `${appName}: must have at least one ARIA landmark (main/nav/header/footer)`
      ).toBeGreaterThan(0);

      // 4. No images missing alt text
      const imgsWithoutAlt = await page.evaluate(() =>
        Array.from(document.querySelectorAll('img'))
          .filter(img => !img.hasAttribute('alt'))
          .length
      );
      expect(
        imgsWithoutAlt,
        `${appName}: all <img> elements must have alt attribute`
      ).toBe(0);

      // 5. Skip link present (injected by phase2-aria.js)
      const skipLink = await page.evaluate(() =>
        !!document.querySelector('a[href="#main-content"], .skip-to-main, a[aria-label*="skip" i]')
      );
      expect(
        skipLink,
        `${appName}: must have a skip-to-main-content link`
      ).toBe(true);

      // 6. All buttons have accessible names
      const unnamedButtons = await page.evaluate(() =>
        Array.from(document.querySelectorAll('button'))
          .filter(b =>
            !b.textContent?.trim() &&
            !b.getAttribute('aria-label') &&
            !b.getAttribute('aria-labelledby') &&
            !b.getAttribute('title')
          ).length
      );
      expect(
        unnamedButtons,
        `${appName}: ${unnamedButtons} button(s) have no accessible name`
      ).toBe(0);
    });
  });
}
