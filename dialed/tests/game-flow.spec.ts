import { test, expect } from '@playwright/test';

test.describe('Dialed Game Flows', () => {
  test('should load the intro screen', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('DIALED');
    await expect(page.getByLabel('Start a solo color memory game')).toBeVisible();
  });

  test('should enter solo play and show countdown', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Start a solo color memory game').click();
    await expect(page.locator('h2')).toContainText('GET READY');
  });

  test('should access admin portal with correct credentials', async ({ page }) => {
    await page.goto('/');
    // Click version tag to enter admin
    await page.getByLabel('Access administrative console').click();
    
    // Check if on admin login screen
    await expect(page.locator('h2')).toContainText('SYSTEM SECURITY');
    
    // Fill credentials (assuming mock auth allows this in test environment)
    await page.getByLabel('System Key password').fill('TUC_ADMIN_2026');
    await page.getByLabel('Submit password and access diagnostics').click();
    
    // Verify we are in the console
    await expect(page.locator('h2')).toContainText('ADMINISTRATIVE CONSOLE');
  });
});
