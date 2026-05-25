import { test, expect } from '@playwright/test';

test.describe('Critical User Journeys', () => {
  test('Home page loads and has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Drumming for SEL Success/);
    await expect(page.getByText('The Rhythm of Student Success')).toBeVisible();
  });

  test('Navigation works', async ({ page }) => {
    await page.goto('/');
    await page.click('text=About');
    await expect(page).toHaveURL(/\/about/);
    await expect(page.getByRole('heading', { name: 'Our Story' })).toBeVisible();
  });

  test('Admin login flow', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Enter Dashboard")');
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await expect(page.getByText('Admin Control Center')).toBeVisible();
  });

  test('Theme toggle works', async ({ page }) => {
    await page.goto('/');
    const themeToggle = page.getByRole('button', { name: 'Toggle theme' });
    await themeToggle.click();
    await page.click('text=Dark');
    // Check if html has dark class
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });
});
