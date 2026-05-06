import { test, expect } from '@playwright/test';

// Each registry card is a motion.div containing exactly one h3 with the
// venture name. Walk up from the heading to that ancestor card so we can
// scope queries (like the COMPARE button) to a single card.
const card = (page: import('@playwright/test').Page, name: RegExp) =>
  page.getByRole('heading', { level: 3, name }).locator('xpath=ancestor::div[contains(@class,"group")][1]');

test.describe('compare flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('selecting cards reveals the toolbar with count', async ({ page }) => {
    // The COMPARE button on each card stops propagation, so it does not open the modal.
    await card(page, /fraud detection engine/i).getByRole('button', { name: /compare/i }).click();
    const toolbar = page.getByRole('toolbar', { name: /compare selected ventures/i });
    await expect(toolbar).toBeVisible();
    await expect(toolbar.getByText('1 ASSETS_MAPPED')).toBeVisible();

    await card(page, /predictive disease risk model/i).getByRole('button', { name: /compare/i }).click();
    await expect(toolbar.getByText('2 ASSETS_MAPPED')).toBeVisible();
  });

  test('CLEAR_STACK empties the toolbar', async ({ page }) => {
    await card(page, /fraud detection engine/i).getByRole('button', { name: /compare/i }).click();
    const toolbar = page.getByRole('toolbar', { name: /compare selected ventures/i });
    await toolbar.getByRole('button', { name: /clear comparison selection/i }).click();
    await expect(toolbar).toHaveCount(0);
  });

  test('EXECUTE_COMPARE opens the comparison stream and RETURN closes it', async ({ page }) => {
    await card(page, /fraud detection engine/i).getByRole('button', { name: /compare/i }).click();
    await card(page, /predictive disease risk model/i).getByRole('button', { name: /compare/i }).click();

    await page.getByRole('button', { name: /compare 2 selected ventures/i }).click();

    await expect(page.getByText('RELATIVE_VENTURE_MATRIX.0x4')).toBeVisible();
    await expect(page.getByRole('heading', { name: /comparison/i })).toBeVisible();

    await page.getByRole('button', { name: /return_to_command_dashboard/i }).click();
    await expect(page.getByText('RELATIVE_VENTURE_MATRIX.0x4')).toHaveCount(0);
  });

  test('cap at 4 selections — a 5th click is ignored', async ({ page }) => {
    const targets = [
      /fraud detection engine/i,
      /predictive disease risk model/i,
      /academic integrity detector/i,
      /microcredit risk scorer/i,
      /ai exam generator/i,
    ];
    for (const t of targets) {
      await card(page, t).getByRole('button', { name: /compare|mapped/i }).click();
    }
    await expect(page.getByRole('toolbar').getByText(/4 ASSETS_MAPPED/)).toBeVisible();
  });
});
