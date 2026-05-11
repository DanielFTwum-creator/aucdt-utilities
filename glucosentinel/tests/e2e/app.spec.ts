import { test, expect } from '@playwright/test';

test.describe('GlucoSentinel', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1').or(page.locator('h2'))).toBeVisible();
  });

  test('should display theme toggle button', async ({ page }) => {
    await page.goto('/');
    const themeBtn = page.locator('button[aria-label^="Current theme"]');
    await expect(themeBtn).toBeVisible();
  });

  test('should toggle theme when theme button is clicked', async ({ page }) => {
    await page.goto('/');
    const themeBtn = page.locator('button[aria-label^="Current theme"]');
    await themeBtn.click();
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });
  });

  test('should display settings configuration button', async ({ page }) => {
    await page.goto('/');
    const settingsBtn = page.locator('div[aria-label="Open configuration settings"]');
    await expect(settingsBtn).toBeVisible();
  });

  test('should navigate to admin login page', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});
