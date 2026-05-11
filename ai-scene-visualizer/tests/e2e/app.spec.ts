import { test, expect } from '@playwright/test';

test.describe('AI Scene Visualizer', () => {
  test('should load the registration page', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('should show registration form with username and password fields', async ({ page }) => {
    await page.goto('/');
    const registerBtn = page.getByRole('button', { name: /register/i });
    await expect(registerBtn).toBeVisible();
  });

  test('should allow registering a new user', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /register/i }).click();
    const uniqueUser = `testuser_${Date.now()}`;
    await page.locator('#username').fill(uniqueUser);
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('h1', { hasText: /ai scene visualizer/i })).toBeVisible({ timeout: 10000 });
  });

  test('should show logout button after login', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /register/i }).click();
    const uniqueUser = `testuser_${Date.now()}`;
    await page.locator('#username').fill(uniqueUser);
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('h1', { hasText: /ai scene visualizer/i })).toBeVisible({ timeout: 10000 });
    const logoutBtn = page.getByRole('button', { name: /logout/i });
    await expect(logoutBtn).toBeVisible();
  });

  test('should show prompt textarea for image generation', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /register/i }).click();
    const uniqueUser = `testuser_${Date.now()}`;
    await page.locator('#username').fill(uniqueUser);
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('h1', { hasText: /ai scene visualizer/i })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('textarea')).toBeVisible();
  });
});
