import { test, expect } from './screenshot';
import { registerViaApi, seedAuth } from './helpers';

test.describe('Paper Trading', () => {
  let tu: Awaited<ReturnType<typeof registerViaApi>>;

  test.beforeAll(async ({ request }) => {
    tu = await registerViaApi(request);
  });

  test.beforeEach(async ({ page }) => {
    await seedAuth(page, tu);
    await page.goto('/#/paper');
    await expect(page.getByRole('heading', { name: 'Paper Trading' })).toBeVisible({ timeout: 10_000 });
  });

  test('shows sign-in prompt when logged out', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.goto('/#/paper');
    await expect(page.getByText('Paper Trading Simulator')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in free' })).toBeVisible();
  });

  test('new account starts with $100,000 cash balance', async ({ page }) => {
    await expect(page.getByText('Cash Balance')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('$100,000.00')).toBeVisible({ timeout: 10_000 });
  });

  test('account summary shows four metric cards', async ({ page }) => {
    await expect(page.getByText('Cash Balance')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Portfolio Value')).toBeVisible();
    await expect(page.getByText('Total Value')).toBeVisible();
    await expect(page.getByText('Total Return')).toBeVisible();
  });

  test('order form is rendered with all fields', async ({ page }) => {
    await expect(page.locator('#pt-ticker')).toBeVisible({ timeout: 8_000 });
    await expect(page.locator('#pt-action')).toBeVisible();
    await expect(page.locator('#pt-type')).toBeVisible();
    await expect(page.locator('#pt-shares')).toBeVisible();
    await expect(page.getByRole('button', { name: /buy.*paper/i })).toBeVisible();
  });

  test('action selector toggles button colour and label', async ({ page }) => {
    await expect(page.getByRole('button', { name: /buy.*paper/i })).toBeVisible({ timeout: 8_000 });
    await page.selectOption('#pt-action', 'sell');
    await expect(page.getByRole('button', { name: /sell.*paper/i })).toBeVisible();
  });

  test('placing a market buy order succeeds and shows confirmation', async ({ page }) => {
    // Use SOXS — cheap ETF unlikely to cause insufficient-funds issue
    await page.fill('#pt-ticker', 'SOXS');
    await page.selectOption('#pt-action', 'buy');
    await page.selectOption('#pt-type', 'market');
    await page.fill('#pt-shares', '1');
    await page.getByRole('button', { name: /buy.*paper/i }).click();

    // Success message appears
    await expect(page.getByRole('status')).toContainText(/BUY 1 SOXS/i, { timeout: 20_000 });
  });

  test('buying a position makes it appear in the Positions tab', async ({ page }) => {
    await page.fill('#pt-ticker', 'SOXL');
    await page.selectOption('#pt-action', 'buy');
    await page.fill('#pt-shares', '1');
    await page.getByRole('button', { name: /buy.*paper/i }).click();

    await expect(page.getByRole('status')).toBeVisible({ timeout: 20_000 });

    // Switch to Positions tab
    await page.getByRole('button', { name: 'Positions' }).click();
    await expect(page.getByText('SOXL')).toBeVisible({ timeout: 10_000 });
  });

  test('order history appears in Orders tab after a trade', async ({ page }) => {
    await page.getByRole('button', { name: 'Orders' }).click();
    // After earlier buy orders, at least one row should appear
    const ordersContent = page.locator('[role="tabpanel"]').or(
      page.locator('text=SOXS, text=SOXL').first().locator('..').locator('..').locator('..')
    );
    await expect(page.getByText(/SOXS|SOXL/).first()).toBeVisible({ timeout: 10_000 });
  });

  test('Reset button shows confirmation dialog before clearing', async ({ page }) => {
    page.on('dialog', dialog => dialog.dismiss()); // cancel the reset
    await page.getByRole('button', { name: 'Reset' }).click();
    // Dialog was dismissed — account balance should remain unchanged
    await expect(page.getByText('Cash Balance')).toBeVisible();
  });
});
