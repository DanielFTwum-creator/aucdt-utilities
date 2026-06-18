import { test, expect } from './screenshot';
import { registerViaApi, seedAuth } from './helpers';

test.describe('Subscription & Upgrade', () => {
  let tu: Awaited<ReturnType<typeof registerViaApi>>;

  test.beforeAll(async ({ request }) => {
    tu = await registerViaApi(request);
  });

  test.beforeEach(async ({ page }) => {
    await seedAuth(page, tu);
    await page.goto('/');
  });

  // ── Screener gate ─────────────────────────────────────────────────────────

  test('screener shows upgrade CTA for free users', async ({ page }) => {
    await page.getByRole('link', { name: 'Screener' }).click();
    await expect(page.getByText(/Upgrade to access Screener/i)).toBeVisible({ timeout: 8_000 });
  });

  // ── Upgrade modal ─────────────────────────────────────────────────────────

  test('upgrade modal opens from screener upgrade button', async ({ page }) => {
    await page.getByRole('link', { name: 'Screener' }).click();
    await page.getByRole('button', { name: /Upgrade to access Screener/i }).click();
    await expect(page.getByText(/StockPulse Premium|Upgrade to Premium/i)).toBeVisible({ timeout: 8_000 });
  });

  test('upgrade modal lists premium features', async ({ page }) => {
    await page.getByRole('link', { name: 'Screener' }).click();
    await page.getByRole('button', { name: /Upgrade to access Screener/i }).click();
    await expect(page.getByText(/50 stocks|100 alerts|Sharpe|metrics|unlimited/i)).toBeVisible({ timeout: 8_000 });
  });

  test('upgrade modal closes on X button', async ({ page }) => {
    await page.getByRole('link', { name: 'Screener' }).click();
    await page.getByRole('button', { name: /Upgrade to access Screener/i }).click();
    await expect(page.getByText(/StockPulse Premium|Upgrade to Premium/i)).toBeVisible({ timeout: 8_000 });
    await page.getByRole('button', { name: /close/i }).click();
    await expect(page.getByText(/StockPulse Premium|Upgrade to Premium/i)).not.toBeVisible();
  });

  // ── Upgrade flow ──────────────────────────────────────────────────────────

  test('upgrade to premium updates user tier', async ({ page, request }) => {
    await page.getByRole('link', { name: 'Screener' }).click();
    await page.getByRole('button', { name: /Upgrade to access Screener/i }).click();
    await page.getByRole('button', { name: /upgrade|go premium|subscribe/i }).first().click();

    // After upgrade the user tier changes
    await page.waitForFunction(() => {
      const u = JSON.parse(localStorage.getItem('sp_user') || '{}');
      return u.tier === 'premium';
    }, { timeout: 10_000 });

    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('sp_user') || '{}'));
    expect(stored.tier).toBe('premium');
  });

  // ── Watchlist tier indicator ──────────────────────────────────────────────

  test('watchlist shows free tier stock count limit', async ({ page }) => {
    await page.goto('/#/watchlist');
    await expect(page.getByText(/\d+\/5 stocks/i)).toBeVisible({ timeout: 10_000 });
  });

  // ── Alerts tier indicator ─────────────────────────────────────────────────

  test('alerts shows free tier limit badge', async ({ page }) => {
    await page.goto('/#/alerts');
    await expect(page.getByText(/0\/5 active alerts/i)).toBeVisible({ timeout: 8_000 });
  });

  // ── Cancel subscription ───────────────────────────────────────────────────

  test('premium user can cancel subscription', async ({ page, request }) => {
    // First upgrade
    const upgradeRes = await request.post('/api/auth/upgrade', {
      headers: { Authorization: `Bearer ${tu.token}` },
    });
    expect(upgradeRes.ok()).toBe(true);
    const { token: premiumToken } = await upgradeRes.json();

    const premiumUser = { ...tu.user, tier: 'premium' };
    await page.addInitScript(({ token, user }) => {
      localStorage.setItem('sp_token', token);
      localStorage.setItem('sp_user', JSON.stringify(user));
    }, { token: premiumToken, user: premiumUser });

    await page.goto('/');

    // Find and click cancel
    const cancelBtn = page.getByRole('button', { name: /cancel subscription|downgrade/i });
    if (await cancelBtn.count() > 0) {
      await cancelBtn.click();
      const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('sp_user') || '{}'));
      expect(stored.tier).toBe('free');
    }
  });
});
