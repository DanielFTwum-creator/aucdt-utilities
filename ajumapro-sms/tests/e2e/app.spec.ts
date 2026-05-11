import { test, expect } from '@playwright/test';

test.describe('Ajumapro SMS', () => {
  test('should load the cover page and display correct branding', async ({ page }) => {
    await page.goto('/#/');
    const heading = page.locator('h1');
    await expect(heading).toHaveText('Ajumapro');
  });

  test('should navigate to admin portal and require authentication', async ({ page }) => {
    await page.goto('/#/admin');
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    const heading = page.locator('h1');
    await expect(heading).toHaveText('ADMIN ACCESS');
  });

  test('should authenticate successfully with correct credentials', async ({ page }) => {
    await page.goto('/#/admin');
    await page.locator('#password').fill('admin123');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('nav')).toBeVisible({ timeout: 10000 });
    const dashboardTitle = page.locator('h1');
    await expect(dashboardTitle).toHaveText('ADMIN PORTAL');
  });

  test('should toggle theme successfully', async ({ page }) => {
    await page.goto('/#/admin');
    await page.locator('#password').fill('admin123');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('nav')).toBeVisible({ timeout: 10000 });
    await page.locator('button[title="Toggle Theme"]').click();
    const themeClass = await page.locator('html').getAttribute('class');
    expect(themeClass).toContain('theme-light');
  });
});
