import { test, expect } from '@playwright/test';

const USERNAME = process.env.REACT_APP_ADMIN_USERNAME || 'admin';
const PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'analytics2024';

test.describe('Advanced Analytics Dashboard - Authentication', () => {
  test('should display login screen on initial load', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    const heading = page.locator('h1');
    await expect(heading).toContainText('Analytics Portal');
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await page.goto('/');
    await page.locator('input[type="text"]').fill(USERNAME);
    await page.locator('input[type="password"]').fill(PASSWORD);
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('h1', { hasText: /Advanced Analytics Suite/i })).toBeVisible({ timeout: 10000 });
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/');
    await page.locator('input[type="text"]').fill('wronguser');
    await page.locator('input[type="password"]').fill('wrongpass');
    await page.locator('button[type="submit"]').click();
    const errorEl = page.locator('[class*="red"]').first();
    await expect(errorEl).toBeVisible({ timeout: 5000 });
    await expect(errorEl).toContainText(/invalid/i);
  });
});

test.describe('Advanced Analytics Dashboard - Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('input[type="text"]').fill(USERNAME);
    await page.locator('input[type="password"]').fill(PASSWORD);
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  });

  test('should load charts section after login', async ({ page }) => {
    await expect(page.locator('#charts-section')).toBeVisible({ timeout: 15000 });
  });

  test('should display All-Time Stats banner', async ({ page }) => {
    await expect(page.locator('#all-time-stats')).toBeVisible({ timeout: 15000 });
    const bannerText = await page.locator('#all-time-stats').textContent();
    expect(bannerText).toMatch(/All-Time Performance|Registration Rate/i);
  });

  test('should navigate with Tab key', async ({ page }) => {
    await page.keyboard.press('Tab');
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT']).toContain(focusedTag);
  });
});
