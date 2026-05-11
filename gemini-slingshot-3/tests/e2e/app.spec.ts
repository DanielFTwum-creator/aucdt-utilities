import { test, expect } from '@playwright/test';

test.describe('Gemini Slingshot', () => {
  test('should load the application and render canvas', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('canvas')).toBeVisible({ timeout: 15000 });
  });

  test('should have theme toggle button', async ({ page }) => {
    await page.goto('/');
    const themeBtn = page.locator('[aria-label="Switch to light mode"]');
    await expect(themeBtn).toBeVisible();
  });

  test('should switch theme when mode button is clicked', async ({ page }) => {
    await page.goto('/');
    const bgBefore = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    await page.locator('[aria-label="Switch to light mode"]').click();
    await page.waitForTimeout(500);
    const bgAfter = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bgBefore).not.toBe(bgAfter);
  });

  test('should show admin login prompt', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('canvas')).toBeVisible({ timeout: 15000 });
    await page.locator('[aria-label="Administrator Log-in"]').click();
    await expect(page.locator('#admin-pass')).toBeVisible();
  });

  test('should have Force Analysis button visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('canvas')).toBeVisible({ timeout: 15000 });
    const analysisBtn = page.getByRole('button', { name: /force analysis/i });
    await expect(analysisBtn).toBeVisible();
  });
});
