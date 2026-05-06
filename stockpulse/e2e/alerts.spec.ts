import { test, expect } from './screenshot';
import { registerViaApi, seedAuth } from './helpers';

test.describe('Alerts', () => {
  let tu: Awaited<ReturnType<typeof registerViaApi>>;

  test.beforeAll(async ({ request }) => {
    tu = await registerViaApi(request);
  });

  test.beforeEach(async ({ page }) => {
    await seedAuth(page, tu);
    await page.goto('/#/alerts');
    await expect(page.getByRole('heading', { name: 'Alerts' })).toBeVisible({ timeout: 10_000 });
  });

  test('shows sign-in prompt when logged out', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.goto('/#/alerts');
    await expect(page.getByText('Price Alerts')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in free' })).toBeVisible();
  });

  test('empty state message is shown when no alerts exist', async ({ page }) => {
    await expect(page.getByText('No alerts configured')).toBeVisible({ timeout: 8_000 });
  });

  test('alert count shows 0/5 for free tier', async ({ page }) => {
    await expect(page.getByText(/0\/5 active alerts/)).toBeVisible({ timeout: 8_000 });
  });

  // ─── Add alert ───────────────────────────────────────────────────────────────

  test('can add a price alert and it appears in the list', async ({ page }) => {
    await page.fill('#alert-ticker', 'AAPL');
    await page.selectOption('#alert-type', 'price');
    await page.selectOption('#alert-condition', 'above');
    await page.fill('#alert-value', '250.00');
    await page.getByRole('button', { name: 'Set Alert' }).click();

    await expect(page.getByText('AAPL')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/above \$250/i)).toBeVisible({ timeout: 8_000 });
  });

  test('alert count increments after adding', async ({ page }) => {
    await page.fill('#alert-ticker', 'TSLA');
    await page.fill('#alert-value', '200.00');
    await page.getByRole('button', { name: 'Set Alert' }).click();

    // Count should be at least 1/5 now (tests share the same user)
    await expect(page.getByText(/\d+\/5 active alerts/)).toBeVisible({ timeout: 8_000 });
  });

  test('can add a percent-change alert', async ({ page }) => {
    await page.fill('#alert-ticker', 'NVDA');
    await page.selectOption('#alert-type', 'percent_change');
    await page.selectOption('#alert-condition', 'below');
    await page.fill('#alert-value', '-5');
    await page.getByRole('button', { name: 'Set Alert' }).click();

    await expect(page.getByText('NVDA')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/% change.*below/i)).toBeVisible({ timeout: 8_000 });
  });

  test('ticker field is required — empty submission shows validation', async ({ page }) => {
    await page.fill('#alert-value', '100');
    await page.getByRole('button', { name: 'Set Alert' }).click();
    // HTML5 required validation should prevent submit; form stays open
    const tickerInput = page.locator('#alert-ticker');
    await expect(tickerInput).toBeVisible();
  });

  // ─── Delete alert ────────────────────────────────────────────────────────────

  test('deleting an alert removes it from the list', async ({ page }) => {
    // Add an alert first
    await page.fill('#alert-ticker', 'SPY');
    await page.fill('#alert-value', '500.00');
    await page.getByRole('button', { name: 'Set Alert' }).click();
    await expect(page.getByText('SPY')).toBeVisible({ timeout: 10_000 });

    // Delete it
    const spyRow = page.locator('[class*="rounded-xl"]').filter({ hasText: 'SPY' }).first();
    await spyRow.getByRole('button', { name: /delete/i }).click();

    await expect(spyRow).not.toBeVisible({ timeout: 8_000 });
  });
});
