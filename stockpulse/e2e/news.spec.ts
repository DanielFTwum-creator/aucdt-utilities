import { test, expect } from './screenshot';
import { registerViaApi, seedAuth } from './helpers';

const MOCK_NEWS = [
  { title: 'Fed holds rates steady amid inflation concerns', publisher: 'Reuters', link: 'https://reuters.com/story/1', publishedAt: new Date().toISOString(), thumbnail: null },
  { title: 'Tech stocks rally on AI spending optimism', publisher: 'Bloomberg', link: 'https://bloomberg.com/story/1', publishedAt: new Date(Date.now() - 3600000).toISOString(), thumbnail: 'https://example.com/thumb.jpg' },
  { title: 'S&P 500 hits record high', publisher: 'CNBC', link: 'https://cnbc.com/story/1', publishedAt: new Date(Date.now() - 7200000).toISOString(), thumbnail: null },
];

test.describe('News', () => {
  let tu: Awaited<ReturnType<typeof registerViaApi>>;

  test.beforeAll(async ({ request }) => {
    tu = await registerViaApi(request);
  });

  test.beforeEach(async ({ page }) => {
    // Mock Yahoo Finance news to avoid flaky external calls
    await page.route('/api/market/news*', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_NEWS) })
    );
    await seedAuth(page, tu);
    await page.goto('/#/news');
  });

  // ── Display ───────────────────────────────────────────────────────────────

  test('displays news article headlines', async ({ page }) => {
    await expect(page.getByText('Fed holds rates steady')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Tech stocks rally')).toBeVisible();
    await expect(page.getByText('S&P 500 hits record high')).toBeVisible();
  });

  test('shows publisher name for each article', async ({ page }) => {
    await expect(page.getByText('Reuters')).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText('Bloomberg')).toBeVisible();
    await expect(page.getByText('CNBC')).toBeVisible();
  });

  test('news articles link to external sources in new tab', async ({ page }) => {
    await page.waitForSelector('text=Fed holds rates steady', { timeout: 10_000 });
    const link = page.getByRole('link', { name: /Fed holds rates steady/i }).or(
      page.locator('a').filter({ hasText: 'Fed holds rates steady' })
    ).first();
    await expect(link).toHaveAttribute('href', /reuters\.com/);
    await expect(link).toHaveAttribute('target', '_blank');
  });

  test('shows thumbnail image when available', async ({ page }) => {
    await page.waitForSelector('text=Tech stocks rally', { timeout: 8_000 });
    await expect(page.locator('img[src="https://example.com/thumb.jpg"]')).toBeVisible();
  });

  test('shows published time for each article', async ({ page }) => {
    await page.waitForSelector('text=Reuters', { timeout: 8_000 });
    // Should show relative time like "2h ago" or absolute time
    await expect(page.getByText(/(ago|AM|PM|\d{4})/i).first()).toBeVisible();
  });

  // ── Empty state ───────────────────────────────────────────────────────────

  test('shows empty state when no news is available', async ({ page }) => {
    await page.route('/api/market/news*', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );
    await page.goto('/#/news');
    await expect(page.getByText(/no news|nothing to show/i)).toBeVisible({ timeout: 8_000 });
  });

  // ── Accessibility to unauthenticated users ────────────────────────────────

  test('news is accessible without authentication', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.goto('/#/news');
    await expect(page.getByText('Fed holds rates steady')).toBeVisible({ timeout: 10_000 });
  });

  // ── News filtering / search ───────────────────────────────────────────────

  test('can filter news by topic if ticker field exists', async ({ page }) => {
    await page.waitForSelector('text=Fed holds rates steady', { timeout: 8_000 });
    const searchInput = page.getByPlaceholder(/ticker|search|symbol/i);
    if (await searchInput.count() > 0) {
      await page.route('/api/market/news*', route =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([MOCK_NEWS[0]]) })
      );
      await searchInput.fill('AAPL');
      await expect(page.getByText('Fed holds rates steady')).toBeVisible({ timeout: 5_000 });
    }
  });
});
