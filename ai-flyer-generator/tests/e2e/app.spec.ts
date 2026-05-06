import { test, expect } from '@playwright/test';

test.describe('AI Flyer Generator', () => {
  test('should load and display app heading', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1.app-title');
    await expect(heading).toHaveText('AI Flyer Generator');
  });

  test('should display the Generate with AI button', async ({ page }) => {
    await page.goto('/');
    const generateBtn = page.getByRole('button', { name: /generate with ai/i });
    await expect(generateBtn).toBeVisible();
  });

  test('should have theme toggle buttons', async ({ page }) => {
    await page.goto('/');
    const lightModeBtn = page.locator('button[title="Light Mode"]');
    const darkModeBtn = page.locator('button[title="Dark Mode"]');
    await expect(lightModeBtn.or(darkModeBtn)).toBeVisible();
  });
});
