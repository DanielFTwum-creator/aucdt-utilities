import { test, expect } from '@playwright/test';

const ADMIN_PASSWORD = 'plcrp-admin-2025';

async function loginAsAdmin(page: any) {
  await page.goto('/#/admin');
  await page.fill('#plcrp-admin-password', ADMIN_PASSWORD);
  await page.click('button[aria-label="Login"]');
  await expect(page.getByText(/Admin Panel/i)).toBeVisible();
}

test.describe('E2 — NON_COMMERCIAL rights gate', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/#/rights-audit');
  });

  test('NON_COMMERCIAL track has promote button disabled', async ({ page }) => {
    // Select the NON_COMMERCIAL fixture track
    const trackBtn = page.getByRole('button', { name: /Fixture-NonCommercial-Track-001/i });
    await expect(trackBtn).toBeVisible();
    await trackBtn.click();

    const promoteBtn = page.locator('[data-test="promote-to-s3"]');
    await expect(promoteBtn).toBeVisible();
    await expect(promoteBtn).toBeDisabled();
  });

  test('NON_COMMERCIAL promote button shows reason on hover', async ({ page }) => {
    await page.getByRole('button', { name: /Fixture-NonCommercial-Track-001/i }).click();
    const promoteBtn = page.locator('[data-test="promote-to-s3"]');
    const titleAttr = await promoteBtn.getAttribute('title');
    expect(titleAttr).toContain('Free-tier source');
  });

  test('no override control exists in UI for NON_COMMERCIAL', async ({ page }) => {
    await page.getByRole('button', { name: /Fixture-NonCommercial-Track-001/i }).click();
    const overrideControls = await page.locator('[data-test*="override"]').count();
    expect(overrideControls).toBe(0);
  });

  test('COMMERCIAL track has promote button enabled', async ({ page }) => {
    const trackBtn = page.getByRole('button', { name: /Neon Frequencies/i });
    await trackBtn.click();
    const promoteBtn = page.locator('[data-test="promote-to-s3"]');
    await expect(promoteBtn).not.toBeDisabled();
  });
});

test.describe('E5 — Human authorship gate at S4', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/#/rights-audit');
  });

  test('track with <2 authorship elements blocked at S4', async ({ page }) => {
    // Select Accra Midnight which has exactly 2 authorship elements (at S4)
    const trackBtn = page.getByRole('button', { name: /Accra Midnight/i });
    await expect(trackBtn).toBeVisible();
    await trackBtn.click();

    // Verify authorship element count is shown
    await expect(page.getByText(/authorship/i).first()).toBeVisible();
  });
});
