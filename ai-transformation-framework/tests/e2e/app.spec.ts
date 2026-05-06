import { test, expect } from '@playwright/test';

test.describe('AI Transformation Framework', () => {
  test('should load home page and display hero title', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('STRATEGIC MANDATE');
  });

  test('should have chapter navigation links', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('a[href^="#"]');
    await expect(links.first()).toBeVisible();
  });

  test('should show admin login form at /admin/login', async ({ page }) => {
    await page.goto('/admin/login');
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
  });

  test('should redirect to admin diagnostics after login', async ({ page }) => {
    await page.goto('/admin/login');
    await page.locator('input[type="password"]').fill('admin');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/admin\/diagnostics/, { timeout: 10000 });
  });
});
