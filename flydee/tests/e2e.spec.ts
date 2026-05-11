import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Flydee/);
});

test('can login', async ({ page }) => {
  await page.goto('/');
  await page.click('text=INITIALIZE SYSTEM');
  // Mock login behavior or check for navigation
});
