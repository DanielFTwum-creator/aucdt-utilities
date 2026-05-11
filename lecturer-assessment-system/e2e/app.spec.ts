import { test, expect } from '@playwright/test';

test.describe('Lecturer Assessment System', () => {
  test('should display header and home tab content on load', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1', { hasText: /University College/i })).toBeVisible();
    await expect(page.locator('h2', { hasText: /Student Dashboard/i })).toBeVisible();
  });

  test('should display Submit Assessment tab', async ({ page }) => {
    await page.goto('/');
    const assessmentTab = page.getByRole('button', { name: /Submit Assessment/i });
    await expect(assessmentTab).toBeVisible();
  });

  test('should display View Results tab', async ({ page }) => {
    await page.goto('/');
    const resultsTab = page.getByRole('button', { name: /View Results/i });
    await expect(resultsTab).toBeVisible();
  });

  test('should navigate to assessment form', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Submit Assessment/i }).click();
    const formContainer = page.locator('.assessment-form-container');
    await expect(formContainer).toBeVisible();
  });

  test('should show admin password input when Admin tab is clicked', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Admin/i }).click();
    const passwordInput = page.locator('#admin-password');
    await expect(passwordInput).toBeVisible();
  });
});
