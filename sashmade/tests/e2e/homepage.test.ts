import { test, expect } from '@playwright/test';

test.describe('E2E-01: Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads with correct heading', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/your/i);
    await expect(page.locator('h1')).toContainText(/style/i);
  });

  test('hero section is visible', async ({ page }) => {
    // Hero section sits in the first <section>
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
  });

  test('navigation links are present', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav.getByRole('link', { name: /shop collections/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /about/i })).toBeVisible();
  });

  test('CTA button links to shop', async ({ page }) => {
    const cta = page.getByRole('link', { name: /view all designs/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /\/shop/);
  });

  test('footer shows contact info', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toContainText('info@sashmade.com');
  });
});
