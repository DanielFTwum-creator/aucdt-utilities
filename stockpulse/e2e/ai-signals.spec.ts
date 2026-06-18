import { test, expect } from './screenshot';
import { registerViaApi, seedAuth } from './helpers';

const BUY_SIGNAL = {
  ticker: 'AAPL', signal: 'buy', confidence: 85, score: 80,
  rationale: 'Strong momentum with solid earnings growth.',
  keyFactors: ['Revenue growth', 'Market share'],
  riskLevel: 'low', timeHorizon: 'medium',
  priceAtAnalysis: 189.30, analyzedAt: new Date().toISOString(),
};

const SELL_SIGNAL = {
  ticker: 'TSLA', signal: 'sell', confidence: 68, score: 30,
  rationale: 'Overvalued relative to growth prospects.',
  keyFactors: ['High valuation', 'Competition'],
  riskLevel: 'high', timeHorizon: 'short',
  priceAtAnalysis: 250.00, analyzedAt: new Date().toISOString(),
};

test.describe('AI Signals', () => {
  let tu: Awaited<ReturnType<typeof registerViaApi>>;

  test.beforeAll(async ({ request }) => {
    tu = await registerViaApi(request);
  });

  test.beforeEach(async ({ page }) => {
    // Mock the AI analyze endpoint so we don't depend on Gemini availability
    await page.route('/api/ai/analyze/**', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(BUY_SIGNAL) })
    );
    await seedAuth(page, tu);
    await page.goto('/#/ai');
    await expect(page.getByRole('heading', { name: /AI Stock Analysis/i })).toBeVisible({ timeout: 10_000 });
  });

  // ── Unauthenticated ───────────────────────────────────────────────────────

  test('shows sign-in prompt for unauthenticated users', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.goto('/#/ai');
    await expect(page.getByText('AI Stock Analysis')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in free' })).toBeVisible();
  });

  // ── Signal history ────────────────────────────────────────────────────────

  test('shows empty history state for new user', async ({ page }) => {
    await page.route('/api/ai/signals', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );
    await page.goto('/#/ai');
    await expect(page.getByText(/no signal|analyze your first/i)).toBeVisible({ timeout: 8_000 });
  });

  test('displays signal history after analysis', async ({ page }) => {
    await page.route('/api/ai/signals', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([BUY_SIGNAL]) })
    );
    await page.goto('/#/ai');
    await expect(page.locator('text=AAPL').first()).toBeVisible({ timeout: 8_000 });
    await expect(page.locator('text=buy').first()).toBeVisible();
  });

  // ── Analyze stock ─────────────────────────────────────────────────────────

  test('analyzes a stock and shows BUY signal', async ({ page }) => {
    await page.getByRole('textbox', { name: /ticker/i }).fill('AAPL');
    await page.getByRole('button', { name: /analyze|get signal/i }).click();
    await expect(page.getByText('buy')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText('85')).toBeVisible();
    await expect(page.getByText('Strong momentum')).toBeVisible();
  });

  test('analyzes a stock and shows SELL signal', async ({ page }) => {
    await page.route('/api/ai/analyze/**', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(SELL_SIGNAL) })
    );
    await page.getByRole('textbox', { name: /ticker/i }).fill('TSLA');
    await page.getByRole('button', { name: /analyze|get signal/i }).click();
    await expect(page.getByText('sell')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText('Overvalued')).toBeVisible();
  });

  test('shows loading state while analyzing', async ({ page }) => {
    await page.route('/api/ai/analyze/**', async route => {
      await new Promise(r => setTimeout(r, 600));
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(BUY_SIGNAL) });
    });
    await page.getByRole('textbox', { name: /ticker/i }).fill('AAPL');
    await page.getByRole('button', { name: /analyze|get signal/i }).click();
    await expect(page.getByText(/analyzing|loading/i)).toBeVisible();
    await expect(page.getByText('buy')).toBeVisible({ timeout: 10_000 });
  });

  // ── Tier limits ───────────────────────────────────────────────────────────

  test('shows upgrade modal when hourly limit is reached', async ({ page }) => {
    await page.route('/api/ai/analyze/**', route =>
      route.fulfill({ status: 429, contentType: 'application/json', body: JSON.stringify({ error: 'Hourly limit reached', upgrade: true }) })
    );
    await page.getByRole('textbox', { name: /ticker/i }).fill('AAPL');
    await page.getByRole('button', { name: /analyze|get signal/i }).click();
    await expect(page.getByText(/upgrade|premium/i)).toBeVisible({ timeout: 8_000 });
  });

  test('shows error message when analysis fails', async ({ page }) => {
    await page.route('/api/ai/analyze/**', route =>
      route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Analysis failed. Please try again.' }) })
    );
    await page.getByRole('textbox', { name: /ticker/i }).fill('AAPL');
    await page.getByRole('button', { name: /analyze|get signal/i }).click();
    await expect(page.getByText(/failed|try again/i)).toBeVisible({ timeout: 8_000 });
  });
});
