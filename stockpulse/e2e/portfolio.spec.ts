import { test, expect } from './screenshot';
import { registerViaApi, seedAuth } from './helpers';

test.describe('Portfolio', () => {
  let tu: Awaited<ReturnType<typeof registerViaApi>>;

  test.beforeAll(async ({ request }) => {
    tu = await registerViaApi(request);
  });

  test.beforeEach(async ({ page }) => {
    await seedAuth(page, tu);
    await page.goto('/#/portfolio');
    await expect(page.getByRole('heading', { name: 'Portfolio' })).toBeVisible({ timeout: 10_000 });
  });

  // ─── Unauthenticated ─────────────────────────────────────────────────────────

  test('shows sign-in prompt when logged out', async ({ page }) => {
    // Navigate without auth seed
    await page.evaluate(() => { localStorage.clear(); });
    await page.goto('/#/portfolio');
    await expect(page.getByText('Track your real portfolio')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in free' })).toBeVisible();
  });

  // ─── Empty state ─────────────────────────────────────────────────────────────

  test('fresh account shows Add Position button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Add Position' })).toBeVisible();
  });

  test('summary cards render with zero values on empty portfolio', async ({ page }) => {
    await expect(page.getByText('Total Value')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Invested')).toBeVisible();
    await expect(page.getByText(/Unrealized P&L/i)).toBeVisible();
  });

  // ─── Add position ────────────────────────────────────────────────────────────

  test('can add a position and it appears in the Holdings table', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Position' }).click();
    await expect(page.getByRole('form', { name: 'Add position form' })).toBeVisible();

    await page.fill('#pos-ticker', 'AAPL');
    await page.fill('#pos-shares', '5');
    await page.fill('#pos-purchase_price', '150.00');
    // purchase_date defaults to today — leave it

    await page.getByRole('button', { name: /save|add/i }).click();

    // Holdings tab should now show AAPL
    const table = page.getByRole('table', { name: 'Portfolio holdings' });
    await expect(table.getByText('AAPL')).toBeVisible({ timeout: 15_000 });
  });

  test('Holdings tab shows all expected columns', async ({ page }) => {
    const headers = ['Ticker', 'Shares', 'Avg Cost', 'Current', 'Value', 'P&L', 'Return'];
    for (const h of headers) {
      await expect(page.getByRole('columnheader', { name: h })).toBeVisible({ timeout: 8_000 });
    }
  });

  test('Day Gain column never shows NaN', async ({ page }) => {
    const tableText = await page.getByRole('table').textContent();
    expect(tableText).not.toContain('NaN');
  });

  // ─── Summary cards ───────────────────────────────────────────────────────────

  test('summary cards update after adding a position', async ({ page }) => {
    // Add a position first
    await page.getByRole('button', { name: 'Add Position' }).click();
    await page.fill('#pos-ticker', 'MSFT');
    await page.fill('#pos-shares', '2');
    await page.fill('#pos-purchase_price', '300.00');
    await page.getByRole('button', { name: /save|add/i }).click();

    // Invested should not be $0.00 anymore
    const investedCard = page.locator('text=Invested').locator('..').locator('p').last();
    await expect(investedCard).not.toHaveText('$0.00', { timeout: 15_000 });
  });

  // ─── Tabs ────────────────────────────────────────────────────────────────────

  test('Performance and Dividends tabs are visible after adding a position', async ({ page }) => {
    // Add a position if not already there
    const table = page.getByRole('table', { name: 'Portfolio holdings' });
    const hasRows = await table.getByRole('row').count();
    if (hasRows <= 1) {
      await page.getByRole('button', { name: 'Add Position' }).click();
      await page.fill('#pos-ticker', 'NVDA');
      await page.fill('#pos-shares', '1');
      await page.fill('#pos-purchase_price', '500.00');
      await page.getByRole('button', { name: /save|add/i }).click();
      await expect(table.getByText('NVDA')).toBeVisible({ timeout: 12_000 });
    }

    await expect(page.getByRole('tab', { name: 'Performance' }).or(
      page.getByRole('button', { name: 'Performance' })
    )).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Dividends' }).or(
      page.getByRole('button', { name: 'Dividends' })
    )).toBeVisible();
  });

  // ─── Export ──────────────────────────────────────────────────────────────────

  test('Export button appears when portfolio has positions', async ({ page }) => {
    const table = page.getByRole('table', { name: 'Portfolio holdings' });
    const rowCount = await table.getByRole('row').count();
    if (rowCount > 1) {
      await expect(page.getByRole('button', { name: /export/i })).toBeVisible({ timeout: 8_000 });
    }
  });

  // ─── Delete position ─────────────────────────────────────────────────────────

  test('deleting a position removes it from the table', async ({ page }) => {
    // Ensure a position exists
    await page.getByRole('button', { name: 'Add Position' }).click();
    await page.fill('#pos-ticker', 'AMD');
    await page.fill('#pos-shares', '3');
    await page.fill('#pos-purchase_price', '100.00');
    await page.getByRole('button', { name: /save|add/i }).click();

    const table = page.getByRole('table', { name: 'Portfolio holdings' });
    await expect(table.getByText('AMD')).toBeVisible({ timeout: 12_000 });

    // Click delete for AMD row
    const amdRow = page.getByRole('row').filter({ hasText: 'AMD' });
    await amdRow.getByRole('button', { name: /remove amd/i }).click();

    await expect(table.getByText('AMD')).not.toBeVisible({ timeout: 8_000 });
  });
});
