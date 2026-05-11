import { test, expect } from '@playwright/test';

test.describe('Ananse Cartoon Generator', () => {
  test('should load the initial page correctly', async ({ page }) => {
    await page.goto('/');
    const headerText = await page.locator('h1').textContent();
    expect(headerText).toBe('Ananse Cartoon Generator');
  });

  test('should display initial prompt in textarea', async ({ page }) => {
    await page.goto('/');
    const initialPrompt = await page.locator('[data-testid="prompt-textarea"]').inputValue();
    expect(initialPrompt).toContain('Ananse');
  });

  test('should show initial message in output area', async ({ page }) => {
    await page.goto('/');
    const initialMessage = page.locator('[data-testid="initial-message"]');
    await expect(initialMessage).toContainText('Your generated cartoon will appear here');
  });

  test('should display generate button', async ({ page }) => {
    await page.goto('/');
    const generateBtn = page.locator('[data-testid="generate-button"]');
    await expect(generateBtn).toBeVisible();
  });

  test('should display next scene button', async ({ page }) => {
    await page.goto('/');
    const nextSceneBtn = page.locator('[data-testid="next-scene-button"]');
    await expect(nextSceneBtn).toBeVisible();
  });
});
