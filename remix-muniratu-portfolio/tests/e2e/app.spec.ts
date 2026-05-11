import { test, expect } from '@playwright/test';

test.describe('Remix Muniratu Portfolio', () => {
  test('should load the homepage with Muniratu in title', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).toContain('Muniratu');
  });

  test('should display About section navigation link', async ({ page }) => {
    await page.goto('/');
    const aboutLink = page.locator('a[href="#about"]');
    await expect(aboutLink).toBeVisible();
  });

  test('should scroll to About section when About link is clicked', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[href="#about"]').click();
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeVisible();
  });

  test('should display Book Online button', async ({ page }) => {
    await page.goto('/');
    const bookBtn = page.getByRole('button', { name: /Book Online/i });
    await expect(bookBtn).toBeVisible();
  });
});
