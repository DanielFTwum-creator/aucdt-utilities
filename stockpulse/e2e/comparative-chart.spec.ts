/**
 * Critical path: Comparative Performance (VWAC Envelope) chart.
 * This feature is marked critical — any regression here must block a release.
 *
 * Prerequisites: the test user's watchlist has ≥ 2 tickers (SOXL + SOXS seeded
 * by default at registration), and the backend market service is running.
 */
import { test, expect } from './screenshot';
import { registerViaApi, seedAuth } from './helpers';

const WIDE = { width: 1280, height: 800 }; // chart panel only visible at lg breakpoint

test.describe('Comparative Chart – VWAC Envelope [critical]', () => {
  let tu: Awaited<ReturnType<typeof registerViaApi>>;

  test.beforeAll(async ({ request }) => {
    tu = await registerViaApi(request);
  });

  test.beforeEach(async ({ page }) => {
    await seedAuth(page, tu);
    await page.setViewportSize(WIDE);
    await page.goto('/#/watchlist');
    await expect(page.getByRole('heading', { name: 'Watchlist' })).toBeVisible({ timeout: 10_000 });
  });

  // ─── Presence ────────────────────────────────────────────────────────────────

  test('Compare tab is visible when watchlist has ≥ 2 tickers', async ({ page }) => {
    await expect(page.getByRole('button', { name: /compare/i })).toBeVisible({ timeout: 10_000 });
  });

  test('Compare tab is NOT visible when watchlist is empty', async ({ page, request }) => {
    // Create a separate user with an empty watchlist by deleting the defaults
    const freshUser = await registerViaApi(request);
    // Delete default tickers via API
    for (const ticker of ['SOXL', 'SOXS']) {
      await request.delete(`/api/watchlist/${ticker}`, {
        headers: { Authorization: `Bearer ${freshUser.token}` },
      });
    }
    await seedAuth(page, freshUser);
    await page.goto('/#/watchlist');
    await expect(page.getByRole('heading', { name: 'Watchlist' })).toBeVisible();
    await expect(page.getByRole('button', { name: /compare/i })).not.toBeVisible({ timeout: 5_000 });
  });

  // ─── Chart renders ───────────────────────────────────────────────────────────

  test('clicking Compare tab shows the VWAC Envelope chart', async ({ page }) => {
    await page.getByRole('button', { name: /compare/i }).click();
    await expect(
      page.getByText('Comparative Performance (VWAC Envelope)')
    ).toBeVisible({ timeout: 15_000 });
  });

  test('chart subtitle shows the two ticker names', async ({ page }) => {
    await page.getByRole('button', { name: /compare/i }).click();
    // Subtitle: "SOXL vs SOXS · VWAP ±2% channels"
    await expect(page.getByText(/SOXL.*SOXS|SOXS.*SOXL/i)).toBeVisible({ timeout: 15_000 });
  });

  test('chart legend shows both tickers', async ({ page }) => {
    await page.getByRole('button', { name: /compare/i }).click();
    const legend = page.locator('.recharts-legend-wrapper');
    await expect(legend).toBeVisible({ timeout: 20_000 });
    await expect(legend.getByText('SOXL')).toBeVisible({ timeout: 10_000 });
    await expect(legend.getByText('SOXS')).toBeVisible({ timeout: 10_000 });
  });

  test('chart SVG is rendered with visible data lines', async ({ page }) => {
    await page.getByRole('button', { name: /compare/i }).click();
    // Wait for loading to complete (no spinner visible)
    await expect(page.locator('[aria-label="Loading chart"]')).not.toBeVisible({ timeout: 20_000 });
    // Recharts renders path elements for lines
    const paths = page.locator('.recharts-line-curve');
    await expect(paths.first()).toBeVisible({ timeout: 15_000 });
    const count = await paths.count();
    // 2 price lines + 4 envelope bands = 6 paths
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('volume histogram sub-chart is rendered', async ({ page }) => {
    await page.getByRole('button', { name: /compare/i }).click();
    await expect(page.locator('[aria-label="Loading chart"]')).not.toBeVisible({ timeout: 20_000 });
    // BarChart renders rect elements
    const bars = page.locator('.recharts-bar-rectangle');
    await expect(bars.first()).toBeVisible({ timeout: 15_000 });
  });

  // ─── Period selector ─────────────────────────────────────────────────────────

  test('period selector renders all five options', async ({ page }) => {
    await page.getByRole('button', { name: /compare/i }).click();
    await expect(page.getByText('Comparative Performance (VWAC Envelope)')).toBeVisible({ timeout: 15_000 });

    for (const label of ['1m', '5m', '15m', '1H', '1D']) {
      await expect(page.getByRole('button', { name: label, exact: true })).toBeVisible({ timeout: 5_000 });
    }
  });

  test('15m is the default selected period', async ({ page }) => {
    await page.getByRole('button', { name: /compare/i }).click();
    await expect(page.getByText('Comparative Performance (VWAC Envelope)')).toBeVisible({ timeout: 15_000 });

    const btn15m = page.getByRole('button', { name: '15m', exact: true });
    await expect(btn15m).toHaveClass(/bg-indigo-600/, { timeout: 5_000 });
  });

  test('switching period reloads chart data', async ({ page }) => {
    await page.getByRole('button', { name: /compare/i }).click();
    await expect(page.getByText('Comparative Performance (VWAC Envelope)')).toBeVisible({ timeout: 15_000 });

    // Click 1H
    await page.getByRole('button', { name: '1H', exact: true }).click();
    await expect(page.getByRole('button', { name: '1H', exact: true })).toHaveClass(/bg-indigo-600/, { timeout: 5_000 });

    // Chart should re-render (loading or data)
    await expect(
      page.locator('[aria-label="Loading chart"]').or(page.locator('.recharts-line-curve').first())
    ).toBeVisible({ timeout: 15_000 });

    // Click 1D
    await page.getByRole('button', { name: '1D', exact: true }).click();
    await expect(page.getByRole('button', { name: '1D', exact: true })).toHaveClass(/bg-indigo-600/, { timeout: 5_000 });
  });

  test('switching period updates aria-pressed state', async ({ page }) => {
    await page.getByRole('button', { name: /compare/i }).click();
    await expect(page.getByText('Comparative Performance (VWAC Envelope)')).toBeVisible({ timeout: 15_000 });

    await page.getByRole('button', { name: '5m', exact: true }).click();
    const btn5m = page.getByRole('button', { name: '5m', exact: true });
    // aria-pressed should be true (or truthy via boolean attribute)
    await expect(btn5m).toHaveAttribute('aria-pressed', /true/, { timeout: 5_000 });
  });

  // ─── Tooltip ─────────────────────────────────────────────────────────────────

  test('hovering over the chart shows a tooltip with price values', async ({ page }) => {
    await page.getByRole('button', { name: /compare/i }).click();
    await expect(page.locator('[aria-label="Loading chart"]')).not.toBeVisible({ timeout: 20_000 });
    await expect(page.locator('.recharts-line-curve').first()).toBeVisible({ timeout: 15_000 });

    // Hover centre of the chart area
    const chartArea = page.locator('.recharts-responsive-container').first();
    const box = await chartArea.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      // Tooltip container should appear
      const tooltip = page.locator('.recharts-tooltip-wrapper');
      await expect(tooltip).toBeVisible({ timeout: 5_000 });
    }
  });

  // ─── Ticker label ─────────────────────────────────────────────────────────────

  test('compare mode label shows first two tickers from watchlist', async ({ page }) => {
    await page.getByRole('button', { name: /compare/i }).click();
    // The label "SOXL vs SOXS" (or similar) appears beside the tab bar
    await expect(page.getByText(/SOXL.*vs.*SOXS|SOXS.*vs.*SOXL/i)).toBeVisible({ timeout: 10_000 });
  });

  // ─── Return to Chart mode ─────────────────────────────────────────────────────

  test('clicking Chart tab returns to single-ticker view', async ({ page }) => {
    await page.getByRole('button', { name: /compare/i }).click();
    await expect(page.getByText('Comparative Performance (VWAC Envelope)')).toBeVisible({ timeout: 15_000 });

    await page.getByRole('button', { name: /^chart$/i }).click();

    // VWAC chart should no longer be visible
    await expect(page.getByText('Comparative Performance (VWAC Envelope)')).not.toBeVisible({ timeout: 5_000 });
    // Regular ticker chart or empty state should appear
    await expect(
      page.locator('.recharts-responsive-container, [aria-label="Loading chart data"]').first()
        .or(page.getByText('Select a stock to view chart'))
    ).toBeVisible({ timeout: 10_000 });
  });

  // ─── Error / empty state ─────────────────────────────────────────────────────

  test('shows fallback message when data cannot be loaded', async ({ page }) => {
    // Intercept both history requests and force them to fail
    await page.route('**/api/market/history/**', route => route.abort());

    await page.getByRole('button', { name: /compare/i }).click();

    await expect(
      page.getByText(/No comparative data available/i)
    ).toBeVisible({ timeout: 15_000 });
  });

  test('retry button is shown in the error state', async ({ page }) => {
    await page.route('**/api/market/history/**', route => route.abort());
    await page.getByRole('button', { name: /compare/i }).click();

    await expect(page.getByRole('button', { name: /retry/i })).toBeVisible({ timeout: 15_000 });
  });
});
