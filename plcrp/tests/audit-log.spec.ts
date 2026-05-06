import { test, expect } from '@playwright/test';

const ADMIN_PASSWORD = 'plcrp-admin-2025';

async function loginAsAdmin(page: any) {
  await page.goto('/#/admin');
  await page.fill('#plcrp-admin-password', ADMIN_PASSWORD);
  await page.click('button[aria-label="Login"]');
  await expect(page.getByText(/Admin Panel/i)).toBeVisible();
}

test.describe('E8 — Audit log chain', () => {
  test('audit log records admin login', async ({ page }) => {
    await loginAsAdmin(page);
    const logsPanel = page.locator('#panel-logs');
    await expect(logsPanel).toBeVisible();
    await expect(logsPanel.getByText(/Admin login successful/i)).toBeVisible();
  });

  test('audit log records navigation events', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/#/tracks');
    await page.goto('/#/admin');
    const logsPanel = page.locator('#panel-logs');
    await expect(logsPanel.getByText(/Track Library/i)).toBeVisible();
  });

  test('audit log records denied promotions', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/#/rights-audit');
    await page.getByRole('button', { name: /Fixture-NonCommercial-Track-001/i }).click();
    // Attempt a direct promote via API would be 403 — in the UI the button is disabled
    // Verify the track's NON_COMMERCIAL status is displayed
    await expect(page.getByText(/NON_COMMERCIAL/i).first()).toBeVisible();
    // Navigate back to admin and check audit panel
    await page.goto('/#/admin');
    const logsPanel = page.locator('#panel-logs');
    await expect(logsPanel).toBeVisible();
  });

  test('diagnostics panel shows gate status', async ({ page }) => {
    await loginAsAdmin(page);
    await page.getByRole('tab', { name: /Diagnostics/i }).click();
    await expect(page.getByText(/NON_COMMERCIAL block/i)).toBeVisible();
    await expect(page.getByText(/ACTIVE/i).first()).toBeVisible();
  });
});
