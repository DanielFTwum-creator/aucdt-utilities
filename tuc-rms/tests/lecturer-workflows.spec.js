import { test, expect } from '@playwright/test';

test.describe('Lecturer Workflows', () => {
  test.beforeEach(async ({ page }) => {
    // Login as lecturer
    await page.goto('/login');
    await page.fill('input[type="email"]', 'lecturer@tuc.edu.gh');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
  });

  test('should display lecturer dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('text=My Courses')).toBeVisible();
  });

  test('should display courses page without add course button', async ({ page }) => {
    await page.click('[role="navigation"] >> text=Courses');
    await page.waitForURL('**/courses');
    await expect(page.locator('table[role="table"]')).toBeVisible();
    await expect(page.locator('button:has-text("Add Course")')).not.toBeVisible();
  });

  test('should navigate to enter scores page', async ({ page }) => {
    await page.click('[role="navigation"] >> text=Enter Scores');
    await page.waitForURL('**/enter-scores');
    await expect(page.locator('text=Select a course')).toBeVisible();
  });

  test('should save draft scores', async ({ page }) => {
    await page.click('[role="navigation"] >> text=Enter Scores');
    const courseSelect = page.locator('select').first();
    await courseSelect.selectOption({ index: 0 });
    await page.waitForTimeout(500);
    await expect(page.locator('button:has-text("Save Draft")')).toBeVisible();
    await page.click('button:has-text("Save Draft")');
    await expect(page.locator('text=Draft saved successfully')).toBeVisible();
  });
});
