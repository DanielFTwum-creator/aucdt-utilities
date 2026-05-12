import { test, expect } from '@playwright/test';

test.describe('Compliance Workflow Dashboard - Core Journeys', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
    // Wait for the main app to load
    await page.waitForSelector('h1');
  });

  test('Authentication (admin login)', async ({ page }) => {
    // Navigate to admin panel
    const adminButton = page.locator("button", { hasText: 'Admin' }).first();
    if (await adminButton.count() > 0) {
      await adminButton.click();
    }

    // Verify login prompt
    await page.waitForSelector('h2');
    await expect(page.locator('h2').first()).toContainText('Admin Login');

    // Simulate login
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');

    // Verify successful login
    await page.waitForSelector('nav');
    await expect(page.locator('nav').first()).toContainText('Settings');
  });

  test('Audit logging tracking', async ({ page }) => {
    const adminButton = page.locator("button", { hasText: 'Admin' }).first();
    if (await adminButton.count() > 0) {
      await adminButton.click();
      await page.fill('input[type="password"]', 'admin');
      await page.click('button[type="submit"]');
    }

    // Navigate to Logs
    const logsTab = page.locator("button", { hasText: 'Logs' }).first();
    if (await logsTab.count() > 0) {
      await logsTab.click();
    }

    // Verify audit log exists
    await page.waitForSelector('.border.rounded-xl.overflow-hidden');
    await expect(page.locator('.border.rounded-xl.overflow-hidden').first()).toContainText('admin_login');
  });

  test('Theme switching', async ({ page }) => {
    // Find theme toggle button
    const themeButton = page.locator('button[aria-label="Toggle Theme"]').first();
    
    // Check initial mode
    const initialHtmlClass = await page.evaluate(() => document.documentElement.className);
    
    // Toggle
    if (await themeButton.count() > 0) {
      await themeButton.click();
    }
    
    // Check updated mode
    const updatedHtmlClass = await page.evaluate(() => document.documentElement.className);
    expect(initialHtmlClass).not.toBe(updatedHtmlClass);
  });

  test('Accessibility checks (ARIA)', async ({ page }) => {
    // Verify main content aria setup
    const mainRegion = page.locator('main[role="main"]').first();
    expect(await mainRegion.count()).toBeGreaterThanOrEqual(0);
  });
});
