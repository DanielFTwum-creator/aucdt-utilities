import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('.login-card')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Sign in');
  });

  test('should reject invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'WrongPassword123');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });

  test('should implement rate limiting after 5 failed attempts', async ({ page }) => {
    await page.goto('/login');

    // Attempt 5 failed logins
    for (let i = 0; i < 5; i++) {
      await page.fill('input[type="email"]', 'registrar@tuc.edu.gh');
      await page.fill('input[type="password"]', 'WrongPassword');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
    }

    // 6th attempt should be rate limited
    await page.fill('input[type="email"]', 'registrar@tuc.edu.gh');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Too many login attempts')).toBeVisible({ timeout: 5000 });
  });

  test('should login successfully as registrar', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'registrar@tuc.edu.gh');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    await expect(page.url()).toContain('/dashboard');
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'registrar@tuc.edu.gh');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // Logout
    await page.click('[aria-label="Log out"]');
    await page.waitForURL('**/login');
    await expect(page.url()).toContain('/login');
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('**/login');
    await expect(page.url()).toContain('/login');
  });
});
