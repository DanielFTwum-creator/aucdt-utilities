import { test, expect } from '@playwright/test';

test.describe('Ghana News Aggregator - Authentication', () => {
  test('should display secure admin access heading on initial load', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1');
    await expect(heading).toContainText('Secure Admin Access');
  });

  test('should show login form with username and password fields', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should unlock dashboard after successful admin login', async ({ page }) => {
    await page.goto('/');
    await page.locator('input[type="text"]').fill('admin');
    await page.locator('input[type="password"]').fill('admin123');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('h2', { hasText: 'Dashboard' })).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Ghana News Aggregator - Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('input[type="text"]').fill('admin');
    await page.locator('input[type="password"]').fill('admin123');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('h2', { hasText: 'Dashboard' })).toBeVisible({ timeout: 10000 });
  });

  test('should display KPI cards on dashboard', async ({ page }) => {
    const kpiCards = page.locator('div[role="region"] > div');
    await expect(kpiCards.first()).toBeVisible();
  });

  test('should have settings navigation', async ({ page }) => {
    const settingsNav = page.getByRole('button', { name: /settings/i });
    await expect(settingsNav).toBeVisible();
  });

  test('should switch to dark mode in settings', async ({ page }) => {
    await page.getByRole('button', { name: /navigate to settings/i }).click();
    const darkModeBtn = page.locator('button[role="radio"][aria-label*="Dark Mode"]');
    await darkModeBtn.click();
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(isDark).toBe(true);
  });
});
