import { test, expect } from '@playwright/test';

// Helper: log in as admin
async function adminLogin(page: import('@playwright/test').Page) {
  await page.goto('/admin/login');
  await page.fill('input[type="text"], input[name="username"]', 'admin');
  await page.fill('input[type="password"]', 'sashmade2026');
  await page.getByRole('button', { name: /login|sign in/i }).click();
  await page.waitForURL(/\/admin/);
}

test.describe('E2E-05: Admin Console', () => {
  test('login page is accessible', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('unauthenticated access to /admin redirects to login', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test.describe('authenticated', () => {
    test.beforeEach(async ({ page }) => {
      await adminLogin(page);
    });

    test('dashboard loads KPI cards', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await expect(page.getByText(/total revenue/i)).toBeVisible();
      await expect(page.getByText(/active orders/i)).toBeVisible();
    });

    test('inventory manager is accessible', async ({ page }) => {
      await page.goto('/admin/inventory');
      await expect(page.getByRole('heading', { name: /inventory manager/i })).toBeVisible();
    });

    test('inventory shows all stole designs', async ({ page }) => {
      await page.goto('/admin/inventory');
      // All 5 designs from products.ts
      for (const name of ['Adehye Style', 'Nyonyo', 'Sophie', 'Daisy', 'My Becoming']) {
        await expect(page.getByText(name)).toBeVisible();
      }
    });

    test('download inventory button is present', async ({ page }) => {
      await page.goto('/admin/inventory');
      await expect(
        page.getByRole('button', { name: /download inventory/i })
      ).toBeVisible();
    });

    test('diagnostics page loads', async ({ page }) => {
      await page.goto('/admin/diagnostics');
      await expect(page.locator('h1')).toBeVisible();
    });

    test('audit logs page loads', async ({ page }) => {
      await page.goto('/admin/audit');
      await expect(page.locator('h1')).toBeVisible();
    });

    test('testing page shows Playwright label', async ({ page }) => {
      await page.goto('/admin/testing');
      await expect(page.getByText(/playwright e2e test suite/i)).toBeVisible();
    });
  });
});
