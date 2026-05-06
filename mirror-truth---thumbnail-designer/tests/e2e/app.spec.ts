import { test, expect } from '@playwright/test';

test.describe('Mirror Truth - Thumbnail Designer', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#thumbnail-canvas')).toBeVisible();
  });

  test('should have theme toggle button', async ({ page }) => {
    await page.goto('/');
    const themeBtn = page.locator('button[aria-label="Toggle Theme"]');
    await expect(themeBtn).toBeVisible();
  });

  test('should switch theme when toggle is clicked', async ({ page }) => {
    await page.goto('/');
    const classBeforeClick = await page.locator('html').getAttribute('class');
    await page.locator('button[aria-label="Toggle Theme"]').click();
    await page.waitForTimeout(500);
    const classAfterClick = await page.locator('html').getAttribute('class');
    expect(classBeforeClick).not.toBe(classAfterClick);
  });

  test('should display admin panel button', async ({ page }) => {
    await page.goto('/');
    const adminBtn = page.locator('button[aria-label="Admin Panel"]');
    await expect(adminBtn).toBeVisible();
  });

  test('should open admin modal with password field', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Admin Panel"]').click();
    await page.waitForTimeout(300);
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
  });
});
