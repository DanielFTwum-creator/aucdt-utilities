import { test, expect } from '@playwright/test';

test.describe('Dashboard and Core Flows', () => {
  test('should load the dashboard and display key metrics', async ({ page }) => {
    await page.goto('/');
    
    // Check main title
    await expect(page.getByRole('heading', { name: /Fraud Detection Engine/i })).toBeVisible();
    
    // Check metric cards exist
    await expect(page.getByText('Total Entities')).toBeVisible();
    await expect(page.getByText('Healthy')).toBeVisible();
    await expect(page.getByText('Warning')).toBeVisible();
    await expect(page.getByText('Critical')).toBeVisible();
  });

  test('should navigate to Entities page via sidebar', async ({ page }) => {
    await page.goto('/');
    
    // Click Entities in sidebar
    await page.getByRole('link', { name: 'Entities' }).click();
    
    // Check we are on entities page
    await expect(page).toHaveURL(/.*\/entities/);
    await expect(page.getByRole('heading', { name: 'Entities' })).toBeVisible();
  });

  test('should navigate to Health monitor page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: 'Health' }).click();
    await expect(page).toHaveURL(/.*\/health/);
    await expect(page.getByRole('heading', { name: 'System Health' })).toBeVisible();
  });
});
