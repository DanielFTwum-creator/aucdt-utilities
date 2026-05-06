import { test, expect } from '@playwright/test';

test.describe('Academic Performance Dashboard', () => {
  test('should load the homepage and display heading', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('should display Admin Login button', async ({ page }) => {
    await page.goto('/');
    const adminBtn = page.getByRole('button', { name: /admin login/i });
    await expect(adminBtn).toBeVisible();
  });

  test('should show admin password prompt when Admin Login is clicked', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /admin login/i }).click();
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
  });

  test('should authenticate admin and show admin section', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /admin login/i }).click();
    await page.locator('input[type="password"]').fill('admin123');
    await page.locator('button[type="submit"]').click();
    const adminSection = page.locator('h2', { hasText: /admin/i });
    await expect(adminSection).toBeVisible({ timeout: 10000 });
  });
});
