import { test, expect } from '@playwright/test';

test('home renders core landmarks without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

  await page.goto('/');

  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: /IMPACT/i })).toBeVisible();
  await expect(page.getByText('PORTFOLIO.SIZE')).toBeVisible();
  await expect(page.getByText('IMPACT.CRITICAL')).toBeVisible();
  await expect(page.getByRole('region', { name: /impact matrix/i })).toBeVisible();
  await expect(page.getByRole('region', { name: /venture registry/i })).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();

  expect(errors, `errors: ${errors.join(' | ')}`).toEqual([]);
});

test('skip-link is present for keyboard users', async ({ page }) => {
  await page.goto('/');
  const skip = page.getByRole('link', { name: /skip to main content/i });
  await expect(skip).toHaveAttribute('href', '#main-content');
});
