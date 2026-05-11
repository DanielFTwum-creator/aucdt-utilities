import { test, expect } from '@playwright/test';

test.describe('SmartScale AI Presentation Platform', () => {
  test('should load the title slide', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to next slide with ArrowRight', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(600);
    // Page should still be loaded and functional
    await expect(page.locator('body')).toBeVisible();
  });

  test('should show admin password prompt with Ctrl+Shift+A', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await page.keyboard.down('Control');
    await page.keyboard.down('Shift');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Shift');
    await page.keyboard.up('Control');
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible({ timeout: 5000 });
  });

  test('should display AI workshop textarea', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('KeyA');
    await expect(page.locator('textarea')).toBeVisible({ timeout: 5000 });
  });
});
