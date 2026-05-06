import { test, expect } from '@playwright/test';

test.describe('E2E-04: AI Studio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ai-studio');
  });

  test('loads the AI Studio heading', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Visual Decoder tab is present', async ({ page }) => {
    await expect(page.getByText(/visual decoder/i)).toBeVisible();
  });

  test('Generative Loom tab is present', async ({ page }) => {
    await expect(page.getByText(/generative loom/i)).toBeVisible();
  });

  test('upload area or prompt input is reachable', async ({ page }) => {
    // At least one of these interactive elements should exist
    const uploadArea = page.getByText(/drag.*drop|upload|choose file/i).first();
    const promptInput = page.locator('textarea, input[type="text"]').first();
    const hasUpload = await uploadArea.isVisible().catch(() => false);
    const hasInput  = await promptInput.isVisible().catch(() => false);
    expect(hasUpload || hasInput).toBeTruthy();
  });
});
