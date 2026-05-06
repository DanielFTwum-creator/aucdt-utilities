import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

test('has title', async ({ page }) => {
  await page.goto(APP_URL);
  await expect(page).toHaveTitle(/LinkScan Techbridge/);
});

test('public page shows title', async ({ page }) => {
  await page.goto(APP_URL);
  await expect(page.locator('h2')).toContainText('Techbridge Link Auditor');
});

test('admin login works', async ({ page }) => {
  await page.goto(`${APP_URL}/admin`);
  await page.fill('input[type="password"]', 'admin');
  await page.click('button:has-text("Authenticate")');
  await expect(page.locator('h1')).toContainText('Link auditor');
});
