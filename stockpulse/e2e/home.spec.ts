import { test, expect } from './screenshot';

const uid = () => Date.now().toString(36);

test('new user watchlist defaults to SOXL and SOXS', async ({ page }) => {
  await page.goto('/');

  // Open auth modal then switch to register
  await page.getByText('Sign in to get started →').click();
  await page.getByText('Sign up free').click();

  const id = uid();
  await page.fill('#auth-name', `Test User ${id}`);
  await page.fill('#auth-email', `test_${id}@example.com`);
  await page.fill('#auth-password', 'Password123!');
  await page.getByRole('button', { name: 'Create Account' }).click();

  // Wait for watchlist section heading to load
  await expect(page.getByRole('heading', { name: 'Watchlist' })).toBeVisible({ timeout: 10000 });

  // Both default tickers must appear in the watchlist rows
  const table = page.getByRole('table');
  await expect(table.getByText('SOXL')).toBeVisible({ timeout: 15000 });
  await expect(table.getByText('SOXS')).toBeVisible({ timeout: 15000 });
});
