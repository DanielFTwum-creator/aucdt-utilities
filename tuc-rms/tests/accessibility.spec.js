import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Accessibility (WCAG 2.1 AA)', () => {
  test('should have skip to main content link', async ({ page }) => {
    await page.goto('/login');
    const skipLink = page.locator('[class*="skip-link"]');
    await expect(skipLink).toBeVisible();
    await skipLink.focus();
    const href = await skipLink.getAttribute('href');
    expect(href).toBe('#main-content');
  });

  test('should trap focus in login modal', async ({ page }) => {
    await page.goto('/login');
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    // Focus first input
    await emailInput.focus();
    let focused = await page.evaluate(() => document.activeElement?.getAttribute('type'));
    expect(focused).toBe('email');

    // Tab through focusable elements
    await page.keyboard.press('Tab');
    focused = await page.evaluate(() => document.activeElement?.getAttribute('type'));
    expect(focused).toBe('password');

    await page.keyboard.press('Tab');
    focused = await page.evaluate(() => document.activeElement?.tagName?.toLowerCase());
    expect(focused).toBe('button');
  });

  test('should pass axe accessibility audit on login page', async ({ page }) => {
    await page.goto('/login');
    await injectAxe(page);
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  });
});
