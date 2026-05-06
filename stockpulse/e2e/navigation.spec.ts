import { test, expect } from './screenshot';
import { registerViaApi, seedAuth } from './helpers';

test.describe('Navigation & layout', () => {
  let tu: Awaited<ReturnType<typeof registerViaApi>>;

  test.beforeAll(async ({ request }) => {
    tu = await registerViaApi(request);
  });

  // ─── Sidebar nav ──────────────────────────────────────────────────────────────

  const views: { link: RegExp; heading: RegExp | string; hash: string }[] = [
    { link: /watchlist/i,    heading: 'Watchlist',      hash: '#/watchlist' },
    { link: /portfolio/i,    heading: 'Portfolio',      hash: '#/portfolio' },
    { link: /paper.?trade/i, heading: 'Paper Trading',  hash: '#/paper'     },
    { link: /alerts/i,       heading: 'Alerts',         hash: '#/alerts'    },
    { link: /ai.?signals/i,  heading: /AI Signals/i,    hash: '#/ai'        },
    { link: /news/i,         heading: 'Market News',    hash: '#/news'      },
  ];

  for (const { link, heading, hash } of views) {
    test(`sidebar "${link.source}" navigates to correct view`, async ({ page }) => {
      await seedAuth(page, tu);
      await page.goto('/');
      await page.getByRole('link', { name: link }).click();
      await expect(page).toHaveURL(new RegExp(hash.replace('#', '\\#')));
      await expect(
        page.getByRole('heading', { name: heading })
      ).toBeVisible({ timeout: 12_000 });
    });
  }

  // ─── Hash routing ─────────────────────────────────────────────────────────────

  test('direct navigation to hash URL loads correct view', async ({ page }) => {
    await seedAuth(page, tu);
    await page.goto('/#/alerts');
    await expect(page.getByRole('heading', { name: 'Alerts' })).toBeVisible({ timeout: 10_000 });
  });

  test('unknown hash defaults to Watchlist', async ({ page }) => {
    await seedAuth(page, tu);
    await page.goto('/#/unknown-route');
    await expect(page.getByRole('heading', { name: 'Watchlist' })).toBeVisible({ timeout: 10_000 });
  });

  // ─── Dark mode toggle ─────────────────────────────────────────────────────────

  test('dark mode toggle switches theme class on root element', async ({ page }) => {
    await seedAuth(page, tu);
    await page.goto('/');

    const html = page.locator('html');
    const initialClass = await html.getAttribute('class') ?? '';
    const isDark = initialClass.includes('dark');

    await page.getByRole('button', { name: /(dark|light|theme)/i }).click();

    const newClass = await html.getAttribute('class') ?? '';
    if (isDark) {
      expect(newClass).not.toContain('dark');
    } else {
      expect(newClass).toContain('dark');
    }
  });

  // ─── Navbar ───────────────────────────────────────────────────────────────────

  test('navbar shows market index ticker when market data loads', async ({ page }) => {
    await seedAuth(page, tu);
    await page.goto('/');
    // At least one of the major indices should appear in the ticker bar
    await expect(
      page.getByText(/S&P|NASDAQ|Dow|VIX/).first()
    ).toBeVisible({ timeout: 20_000 });
  });

  test('navbar shows user name when logged in', async ({ page }) => {
    await seedAuth(page, tu);
    await page.goto('/');
    // User initials or name appears in navbar
    await expect(page.getByText(new RegExp(tu.name.split(' ')[0], 'i'))).toBeVisible({ timeout: 8_000 });
  });

  // ─── Screener (premium gate) ──────────────────────────────────────────────────

  test('Screener shows upgrade prompt for free-tier users', async ({ page }) => {
    await seedAuth(page, tu);
    await page.goto('/#/screener');
    await expect(page.getByRole('button', { name: /upgrade.*screener/i })).toBeVisible({ timeout: 10_000 });
  });

  // ─── Auth guard ───────────────────────────────────────────────────────────────

  test('all protected views show sign-in prompt when unauthenticated', async ({ page }) => {
    const protectedHashes = ['#/portfolio', '#/paper', '#/alerts', '#/ai'];
    for (const hash of protectedHashes) {
      await page.goto(`/${hash}`);
      await expect(page.getByRole('button', { name: 'Sign in free' })).toBeVisible({ timeout: 8_000 });
    }
  });
});
