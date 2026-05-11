import { test, expect } from '@playwright/test';

test.describe('E2E-03: About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('loads the About heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/about/i);
    await expect(page.locator('h1')).toContainText(/sashmade/i);
  });

  test('shows the founder message section', async ({ page }) => {
    await expect(page.getByText(/message from our founder/i)).toBeVisible();
    await expect(page.getByText(/sharon a\./i)).toBeVisible();
  });

  test('team section lists members', async ({ page }) => {
    const teamSection = page.getByText(/the team behind/i).locator('..').locator('..');
    await expect(teamSection.getByText(/sharon akua begah/i)).toBeVisible();
    await expect(teamSection.getByText(/george kofi tego/i)).toBeVisible();
  });

  test('clients section is present', async ({ page }) => {
    await expect(page.getByText(/trusted by/i)).toBeVisible();
    await expect(page.getByText(/jospong/i)).toBeVisible();
    await expect(page.getByText(/zoomlion/i)).toBeVisible();
  });

  test('contact block shows phone and email', async ({ page }) => {
    const contactSection = page.locator('section').last();
    await expect(contactSection.getByRole('link', { name: /0247 139 986/i }).first()).toBeVisible();
    await expect(contactSection.getByRole('link', { name: /info@sashmade\.com/i }).first()).toBeVisible();
  });

  test('opening hours table is visible', async ({ page }) => {
    const contactSection = page.locator('section').last();
    await expect(contactSection.getByText(/opening hours/i)).toBeVisible();
    await expect(contactSection.getByText(/7:00 am/i).first()).toBeVisible();
    await expect(contactSection.getByText(/sunday/i)).toBeVisible();
  });
});
