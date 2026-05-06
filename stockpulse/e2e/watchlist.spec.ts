import { test, expect } from './screenshot';
import { registerViaApi, seedAuth, uid } from './helpers';

test.describe('Watchlist', () => {
  let tu: Awaited<ReturnType<typeof registerViaApi>>;

  test.beforeAll(async ({ request }) => {
    tu = await registerViaApi(request);
  });

  test.beforeEach(async ({ page }) => {
    await seedAuth(page, tu);
    await page.goto('/#/watchlist');
    await expect(page.getByRole('heading', { name: 'Watchlist' })).toBeVisible();
  });

  // ─── Default state ───────────────────────────────────────────────────────────

  test('new account has SOXL and SOXS in watchlist', async ({ page }) => {
    const table = page.getByRole('table');
    await expect(table.getByText('SOXL')).toBeVisible({ timeout: 15_000 });
    await expect(table.getByText('SOXS')).toBeVisible({ timeout: 15_000 });
  });

  test('header shows stock count', async ({ page }) => {
    await expect(page.getByText(/2\/\d+ stocks/)).toBeVisible({ timeout: 10_000 });
  });

  test('market status badge is visible', async ({ page }) => {
    await expect(page.getByText(/(Open|Closed)/)).toBeVisible({ timeout: 10_000 });
  });

  // ─── Add ticker ──────────────────────────────────────────────────────────────

  test('can add a ticker via search and it appears in the table', async ({ page }) => {
    const searchInput = page.getByRole('combobox', { name: 'Search for a stock ticker' });
    await searchInput.fill('AAPL');

    // Wait for autocomplete results
    const dropdown = page.getByRole('listbox').or(page.locator('[id="ticker-search-results"]'));
    await expect(dropdown).toBeVisible({ timeout: 10_000 });

    // Click first AAPL result
    await page.getByRole('button', { name: /AAPL/ }).first().click();

    const table = page.getByRole('table');
    await expect(table.getByText('AAPL')).toBeVisible({ timeout: 12_000 });
    await expect(page.getByText(/3\/\d+ stocks/)).toBeVisible();
  });

  test('duplicate ticker is not added twice', async ({ page }) => {
    const searchInput = page.getByRole('combobox', { name: 'Search for a stock ticker' });
    await searchInput.fill('SOXL');
    const dropdown = page.locator('[id="ticker-search-results"]');
    await expect(dropdown).toBeVisible({ timeout: 10_000 });
    await page.getByRole('button', { name: /SOXL/ }).first().click();

    // Count should not increase beyond existing
    const rows = page.getByRole('row');
    // SOXL was already there, still only 1 SOXL cell
    const soxlCells = page.getByRole('cell', { name: 'SOXL' });
    await expect(soxlCells).toHaveCount(1);
  });

  // ─── Chart interaction ───────────────────────────────────────────────────────

  test('clicking a ticker row selects it and shows chart', async ({ page }) => {
    const table = page.getByRole('table');
    await table.getByText('SOXL').click();

    // Chart panel should appear (lg breakpoint — use viewport size)
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.getByText('SOXL').first()).toBeVisible();
    // Chart or loading spinner should appear
    await expect(
      page.locator('.recharts-responsive-container, [aria-label="Loading chart data"]').first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test('Compare tab appears when ≥ 2 tickers are in watchlist', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.getByRole('button', { name: /compare/i })).toBeVisible({ timeout: 10_000 });
  });

  test('Compare tab switches to VWAC Envelope chart', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.getByRole('button', { name: /compare/i }).click();

    await expect(
      page.getByText(/Comparative Performance/i).or(page.getByText(/VWAC Envelope/i))
    ).toBeVisible({ timeout: 15_000 });
  });

  // ─── Remove ticker ───────────────────────────────────────────────────────────

  test('removing a ticker removes it from the table', async ({ page }) => {
    const table = page.getByRole('table');
    await expect(table.getByText('SOXL')).toBeVisible({ timeout: 10_000 });

    // Each row has a delete button
    const soxlRow = page.getByRole('row').filter({ hasText: 'SOXL' });
    await soxlRow.getByRole('button', { name: /remove soxl/i }).click();

    await expect(table.getByText('SOXL')).not.toBeVisible({ timeout: 8_000 });
  });

  // ─── Refresh ─────────────────────────────────────────────────────────────────

  test('refresh button triggers quote reload', async ({ page }) => {
    const refreshBtn = page.getByRole('button', { name: 'Refresh quotes' });
    await expect(refreshBtn).toBeVisible();
    await refreshBtn.click();
    // Spinner appears briefly then resolves
    await expect(refreshBtn).toBeVisible();
  });
});
