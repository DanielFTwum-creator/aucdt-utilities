import { test, expect } from '@playwright/test';

test.describe('SEND Platform Dashboard', () => {
  test('should load and display main navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1').or(page.locator('nav'))).toBeVisible();
  });

  test('should display Active Jobs section', async ({ page }) => {
    await page.goto('/#/login');
    await page.locator('#username').fill('admin');
    await page.locator('#password').fill('password');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('h1', { hasText: /Active Jobs/i })).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to diagnostics page', async ({ page }) => {
    await page.goto('/#/admin/diagnostics');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display testing framework page', async ({ page }) => {
    await page.goto('/#/admin/testing');
    await expect(page.locator('h1', { hasText: /Testing Framework/i })).toBeVisible({ timeout: 10000 });
  });

  test('should display E2E Scenarios tab', async ({ page }) => {
    await page.goto('/#/admin/testing');
    await expect(page.locator('h1', { hasText: /Testing Framework/i })).toBeVisible({ timeout: 10000 });
    const e2eTab = page.getByRole('tab', { name: /E2E Scenarios/i });
    await expect(e2eTab).toBeVisible();
  });
});
