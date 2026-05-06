import { test, expect } from '@playwright/test';

test.describe('FashionPrompt AI', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1').or(page.locator('h2'))).toBeVisible();
  });

  test('should display garment selector', async ({ page }) => {
    await page.goto('/');
    const garmentSelect = page.locator('#garment');
    await expect(garmentSelect).toBeVisible();
  });

  test('should display generate button', async ({ page }) => {
    await page.goto('/');
    const generateBtn = page.locator('button.generate-btn').or(page.getByRole('button', { name: /generate/i }));
    await expect(generateBtn.first()).toBeVisible();
  });

  test('should display Admin navigation link', async ({ page }) => {
    await page.goto('/');
    const adminLink = page.getByText(/admin/i);
    await expect(adminLink.first()).toBeVisible();
  });

  test('should show admin password prompt when Admin is clicked', async ({ page }) => {
    await page.goto('/');
    await page.getByText(/admin/i).first().click();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});
