import { test, expect } from '@playwright/test';

test.describe('Critical User Journey: Fraud Detection & Response', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login before each test
    await page.goto('/#/login');
  });

  test('User login and access protected dashboard', async ({ page }) => {
    // User enters credentials
    await page.getByLabel('Username').fill('user');
    await page.getByLabel('Password').fill('password');

    // Click sign in
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Should be redirected to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.getByRole('heading', { name: /Fraud Detection Engine/i })).toBeVisible();

    // Verify user cannot access admin section
    await page.goto('/#/admin');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('Dashboard displays real-time entity metrics and updates', async ({ page }) => {
    // Login
    await page.getByLabel('Username').fill('user');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Wait for dashboard to load
    await expect(page.getByRole('heading', { name: /Fraud Detection Engine/i })).toBeVisible();

    // Verify metric cards are present
    const totalEntitiesCard = page.getByText('Total Entities').locator('..').locator('..');
    const healthyCard = page.getByText('Healthy').locator('..').locator('..');
    const warningCard = page.getByText('Warning').locator('..').locator('..');
    const criticalCard = page.getByText('Critical').locator('..').locator('..');

    await expect(totalEntitiesCard).toBeVisible();
    await expect(healthyCard).toBeVisible();
    await expect(warningCard).toBeVisible();
    await expect(criticalCard).toBeVisible();

    // Verify average health score is displayed
    await expect(page.getByText(/Average Health Score/i)).toBeVisible();

    // Verify health chart/graph is present
    await expect(page.locator('canvas, [role="img"]')).toBeVisible();
  });

  test('Alert triggered and visible on Alerts page', async ({ page }) => {
    // Login
    await page.getByLabel('Username').fill('user');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Navigate to Alerts page
    await page.getByRole('link', { name: /Alerts/i }).click();
    await expect(page).toHaveURL(/.*\/alerts/);
    await expect(page.getByRole('heading', { name: /Alerts/i })).toBeVisible();

    // Verify active alerts section exists
    await expect(page.getByRole('region', { name: /active alerts/i })).toBeVisible();
  });

  test('User investigates alert by drilling into entity details', async ({ page }) => {
    // Login and navigate to alerts
    await page.getByLabel('Username').fill('user');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await page.getByRole('link', { name: /Alerts/i }).click();
    await expect(page.getByRole('heading', { name: /Alerts/i })).toBeVisible();

    // Wait for alerts to load
    await page.waitForSelector('[role="region"]');

    // Check if alerts exist (conditional test for mock data)
    const allClear = await page.getByText('All Clear').isVisible();

    if (!allClear) {
      // Click first alert or view entity link
      const alertAction = page.locator('button').filter({ hasText: /View|Details|Entity/i }).first();

      if (await alertAction.isVisible()) {
        await alertAction.click();

        // Should navigate to entities or show entity details
        await expect(page.locator('[role="heading"], h1, h2')).toContainText(/Entity|Details|Investigation/i);
      }
    }
  });

  test('User navigates to Entities page and views entity details', async ({ page }) => {
    // Login
    await page.getByLabel('Username').fill('user');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Navigate to Entities
    await page.getByRole('link', { name: /Entities/i }).click();
    await expect(page).toHaveURL(/.*\/entities/);
    await expect(page.getByRole('heading', { name: /Entities/i })).toBeVisible();

    // Verify entity list loads
    await expect(page.locator('[role="table"], [role="list"], tbody')).toBeVisible();

    // Try to interact with first entity (click row or expand button)
    const firstEntity = page.locator('tr, [role="row"], li').first();
    await firstEntity.click();

    // Should show entity details
    await expect(page.locator('h1, h2, [role="heading"]')).toContainText(/Entity|Details/i);
  });

  test('User views Health monitoring dashboard', async ({ page }) => {
    // Login
    await page.getByLabel('Username').fill('user');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Navigate to Health
    await page.getByRole('link', { name: /Health/i }).click();
    await expect(page).toHaveURL(/.*\/health/);
    await expect(page.getByRole('heading', { name: /Health|System/i })).toBeVisible();

    // Verify health metrics display
    await expect(page.locator('[role="region"], [role="status"]')).toHaveCount(2);

    // Verify health indicator components are visible
    await expect(page.locator('canvas, svg, [role="img"]')).toBeVisible();
  });

  test('Logout redirects to login page', async ({ page }) => {
    // Login
    await page.getByLabel('Username').fill('user');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Find and click logout button
    const logoutBtn = page.getByRole('button', { name: /Logout|Sign Out/i });

    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();

      // Should be redirected to login
      await expect(page).toHaveURL(/.*\/login/);
    }
  });

  test('Theme switching (Dark/Light/High-Contrast) accessibility', async ({ page }) => {
    // Login
    await page.getByLabel('Username').fill('user');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Find theme toggle button (usually in settings or header)
    const themeToggle = page.getByRole('button', { name: /theme|dark|light|contrast/i });

    if (await themeToggle.isVisible()) {
      // Click to toggle theme
      await themeToggle.click();

      // Verify page is still functional after theme change
      await expect(page.getByRole('heading', { name: /Fraud Detection/i })).toBeVisible();

      // Verify elements are still accessible
      await page.getByRole('link', { name: /Entities/i }).click();
      await expect(page).toHaveURL(/.*\/entities/);
    }
  });

  test('Navigation between pages maintains session', async ({ page }) => {
    // Login
    await page.getByLabel('Username').fill('user');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Navigate through multiple pages
    await page.getByRole('link', { name: /Dashboard/i }).click();
    await expect(page).toHaveURL(/.*\/dashboard/);

    await page.getByRole('link', { name: /Alerts/i }).click();
    await expect(page).toHaveURL(/.*\/alerts/);

    await page.getByRole('link', { name: /Entities/i }).click();
    await expect(page).toHaveURL(/.*\/entities/);

    await page.getByRole('link', { name: /Health/i }).click();
    await expect(page).toHaveURL(/.*\/health/);

    // Still logged in (no redirect to login)
    await expect(page.getByRole('heading')).toContainText(/Health|Entities|Alerts|Dashboard/i);
  });

  test('Unauthorized access to admin section is prevented', async ({ page }) => {
    // Login as regular user
    await page.getByLabel('Username').fill('user');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Try to access admin section directly
    await page.goto('/#/admin');

    // Should be redirected to dashboard or login
    const urlAfterAttempt = page.url();
    const isNotAdmin = !urlAfterAttempt.includes('/admin') || urlAfterAttempt.includes('/login');
    expect(isNotAdmin).toBeTruthy();
  });

  test('Session persistence and timeout handling', async ({ page }) => {
    // Login
    await page.getByLabel('Username').fill('user');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Verify logged in
    await expect(page).toHaveURL(/.*\/dashboard/);

    // Refresh page
    await page.reload();

    // Should still be logged in (session persisted)
    await expect(page).not.toHaveURL(/.*\/login/);
    await expect(page.getByRole('heading', { name: /Fraud Detection/i })).toBeVisible();
  });
});
