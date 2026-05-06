import { test, expect } from '@playwright/test';

test.describe('TechBridge Pottery Archive - Navigation', () => {
  test('should load home page and display hero heading', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('h2#hero-heading');
    await expect(hero).toContainText('Mastery in');
  });

  test('should navigate to collection page', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[href="/collection"]').click();
    const collectionHeading = page.locator('h2#collection-heading');
    await expect(collectionHeading).toContainText('The Archive');
  });
});

test.describe('TechBridge Pottery Archive - Admin', () => {
  test('should show login form at /admin', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show error with wrong password', async ({ page }) => {
    await page.goto('/admin');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('#login-error')).toBeVisible();
  });

  test('should authenticate and show dashboard with correct password', async ({ page }) => {
    await page.goto('/admin');
    await page.locator('input[type="password"]').fill('admin123');
    await page.locator('button[type="submit"]').click();
    const heading = page.locator('h1');
    await expect(heading).toContainText('Dashboard');
  });
});

test.describe('TechBridge Pottery Archive - Collection Filtering', () => {
  test('should display collection filter buttons', async ({ page }) => {
    await page.goto('/collection');
    const filterBtn = page.locator('button[aria-label="Filter by 1990s"]');
    await expect(filterBtn).toBeVisible();
  });

  test('should activate filter on click', async ({ page }) => {
    await page.goto('/collection');
    const filterBtn = page.locator('button[aria-label="Filter by 1990s"]');
    await filterBtn.click();
    await expect(filterBtn).toHaveAttribute('aria-pressed', 'true');
  });
});
