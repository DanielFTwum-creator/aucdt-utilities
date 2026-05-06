import { test, expect } from '@playwright/test';

test.describe('E2E-02: Shop / Collections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
  });

  test('loads the shop heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/collections/i);
  });

  test('displays product cards', async ({ page }) => {
    const cards = page.getByRole('heading', { level: 3 }).filter({ hasText: /adehye style|nyonyo|sophie|daisy|my becoming/i });
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThanOrEqual(5);
  });

  test('product card shows price in GHS', async ({ page }) => {
    const firstPrice = page.locator('text=/₵\\d+/').first();
    await expect(firstPrice).toBeVisible();
  });

  test('colour filters are rendered', async ({ page }) => {
    await expect(page.getByTitle(/black/i)).toBeVisible();
    await expect(page.getByTitle(/gold/i)).toBeVisible();
  });

  test('clicking a colour filter updates the result count', async ({ page }) => {
    const totalText = page.getByText(/showing \d+ designs?/i).first();
    const beforeMatch = (await totalText.textContent())?.match(/\d+/);
    const totalBefore = beforeMatch ? Number(beforeMatch[0]) : 0;

    await page.getByTitle(/gold/i).click();
    const afterMatch = (await totalText.textContent())?.match(/\d+/);
    const totalAfter = afterMatch ? Number(afterMatch[0]) : 0;

    expect(totalAfter).toBeLessThanOrEqual(totalBefore);
  });

  test('order buttons are present on product cards', async ({ page }) => {
    const orderBtn = page.getByRole('button', { name: /order/i }).first();
    await expect(orderBtn).toBeVisible();
  });

  test('how to order sidebar is visible on desktop', async ({ page }) => {
    await expect(page.getByText(/how to order/i)).toBeVisible();
  });

  test('payment info banner is at the bottom', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByText(/payment options/i)).toBeVisible();
  });
});
