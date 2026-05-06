import { test, expect } from '@playwright/test';

test.describe('CreoAI Flyer Generator', () => {
  test('should load and display app heading', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1');
    await expect(heading).toHaveText('CreoAI');
  });

  test('should display theme switcher button', async ({ page }) => {
    await page.goto('/');
    const themeBtn = page.locator('button[title^="Switch to"]');
    await expect(themeBtn).toBeVisible();
  });

  test('should switch theme when theme button is clicked', async ({ page }) => {
    await page.goto('/');
    const bodyClassBefore = await page.locator('body').getAttribute('class');
    await page.locator('button[title^="Switch to"]').click();
    const bodyClassAfter = await page.locator('body').getAttribute('class');
    expect(bodyClassBefore).not.toBe(bodyClassAfter);
  });

  test('should display admin login button in footer', async ({ page }) => {
    await page.goto('/');
    const adminBtn = page.getByRole('button', { name: /admin/i });
    await expect(adminBtn).toBeVisible();
  });

  test('should show admin password input when admin button is clicked', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /admin/i }).click();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});
