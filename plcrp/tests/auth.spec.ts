import { test, expect } from '@playwright/test';

const ADMIN_PASSWORD = 'plcrp-admin-2025';

test.describe('PLCRP Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows login modal on initial load', async ({ page }) => {
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/Techbridge 2FA Login/i)).toBeVisible();
  });

  test('admin login via #/admin route', async ({ page }) => {
    await page.goto('/#/admin');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.fill('#plcrp-admin-password', ADMIN_PASSWORD);
    await page.click('button[aria-label="Login"]');
    await expect(page.getByText(/Admin Panel/i)).toBeVisible();
  });

  test('rejects wrong admin password', async ({ page }) => {
    await page.goto('/#/admin');
    await page.fill('#plcrp-admin-password', 'wrong-password');
    await page.click('button[aria-label="Login"]');
    await expect(page.getByRole('alert')).toContainText(/Incorrect password/i);
  });

  test('rejects non-Techbridge email for access login', async ({ page }) => {
    await page.fill('#plcrp-email', 'user@gmail.com');
    await page.click('button[aria-label="Send code"]');
    await expect(page.getByRole('alert')).toContainText(/techbridge/i);
  });
});
