import { test, expect } from '@playwright/test';

test.describe('Admin Workflows', () => {
  test.beforeEach(async ({ page }) => {
    // Login as registrar before each test
    await page.goto('/login');
    await page.fill('input[type="email"]', 'registrar@tuc.edu.gh');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
  });

  test('should display dashboard with stats', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('text=Total Students')).toBeVisible();
    await expect(page.locator('text=Total Lecturers')).toBeVisible();
    await expect(page.locator('text=Pending Results')).toBeVisible();
    await expect(page.locator('text=Active Courses')).toBeVisible();
  });

  test('should display users table', async ({ page }) => {
    await page.click('[role="navigation"] >> text=Users');
    await page.waitForURL('**/users');
    await expect(page.locator('table[role="table"]')).toBeVisible();
    await expect(page.locator('th:has-text("Email")')).toBeVisible();
    await expect(page.locator('th:has-text("Role")')).toBeVisible();
  });

  test('should open add user modal', async ({ page }) => {
    await page.click('[role="navigation"] >> text=Users');
    await page.click('button:has-text("Add User")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('h2:has-text("Add New User")')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should close modal on cancel', async ({ page }) => {
    await page.click('[role="navigation"] >> text=Users');
    await page.click('button:has-text("Add User")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await page.click('[aria-label="Close dialogue"]');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should open reset password modal', async ({ page }) => {
    await page.click('[role="navigation"] >> text=Users');
    await page.locator('button:has-text("Reset Password")').first().click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('h2:has-text("Reset Password")')).toBeVisible();
  });

  test('should display audit log', async ({ page }) => {
    await page.click('[role="navigation"] >> text=Audit Log');
    await page.waitForURL('**/audit-log');
    await expect(page.locator('table[role="table"]')).toBeVisible();
    await expect(page.locator('th:has-text("Action")')).toBeVisible();
    await expect(page.locator('th:has-text("User")')).toBeVisible();
  });

  test('should display approve results page', async ({ page }) => {
    await page.click('[role="navigation"] >> text=Approve Results');
    await page.waitForURL('**/approve-results');
    await expect(page.locator('table[role="table"]')).toBeVisible();
    await expect(page.locator('th:has-text("Course")')).toBeVisible();
  });

  test('should cycle through light theme', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('data-theme', '');
    const themeButton = page.locator('[aria-label="Toggle theme"]');
    await themeButton.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('should cycle through dark theme', async ({ page }) => {
    const themeButton = page.locator('[aria-label="Toggle theme"]');
    await themeButton.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await themeButton.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'high-contrast');
  });

  test('should cycle through high-contrast theme back to light', async ({ page }) => {
    const themeButton = page.locator('[aria-label="Toggle theme"]');
    await themeButton.click(); // dark
    await themeButton.click(); // high-contrast
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'high-contrast');
    await themeButton.click(); // back to light
    await expect(page.locator('html')).toHaveAttribute('data-theme', '');
  });

  test('should display notifications bell', async ({ page }) => {
    const notificationBell = page.locator('[aria-label="View notifications"]');
    await expect(notificationBell).toBeVisible();
  });
});
