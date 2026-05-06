import { test, expect } from '@playwright/test';

test.describe('Compliance Workflow Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load the dashboard and display framework title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Compliance Workflow Dashboard');
  });

  test('should toggle phase expansion', async ({ page }) => {
    const phaseCard = page.locator('.phase-card').first();
    await phaseCard.click();
    await expect(phaseCard).toHaveClass(/expanded/);
  });

  test('should mark phase as complete', async ({ page }) => {
    const checkbox = page.locator('.phase-complete-checkbox').first();
    await checkbox.click();
    await expect(checkbox).toBeChecked();
  });

  test('should reset progress', async ({ page }) => {
    // Setup: Mark a phase complete
    await page.locator('.phase-complete-checkbox').first().click();
    
    // Act: Reset
    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: /Reset/i }).click();
    
    // Assert: Check progress bar or checkbox
    await expect(page.locator('.phase-complete-checkbox').first()).not.toBeChecked();
  });

  test('should open and close the help modal', async ({ page }) => {
    await page.getByRole('button', { name: /Help & Support/i }).click();
    await expect(page.getByText(/Help & Support/i)).toBeVisible();
    await page.getByRole('button', { name: /Close/i }).click();
    await expect(page.getByText(/Help & Support/i)).not.toBeVisible();
  });

  test('should navigate to admin panel and prompt for login', async ({ page }) => {
    await page.getByRole('button', { name: /Admin Security Panel/i }).click();
    await expect(page.locator('h2')).toContainText(/Admin Login/i);
  });
});
