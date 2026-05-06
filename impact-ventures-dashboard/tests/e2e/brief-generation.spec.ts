import { test, expect } from '@playwright/test';

// This spec exercises the live Gemini call. It needs GEMINI_API_KEY in the
// environment of the vite preview server (loaded from .env.local at build).
// With the current model id ("gemini-3-flash-preview") the API rejects the
// request and the UI surfaces the error branch.

test.describe('AI brief generation (error path)', () => {
  test.skip(!process.env.GEMINI_API_KEY, 'GEMINI_API_KEY not set — skipping live API spec');

  test('GENERATE_BRIEF on a venture surfaces "AI Service Unavailable"', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('heading', { name: /fraud detection engine/i }).click();
    const dialog = page.getByRole('dialog', { name: /venture detail: fraud detection engine/i });
    await expect(dialog).toBeVisible();

    await dialog.getByRole('button', { name: /generate_brief/i }).click();

    // Loading label flips first
    await expect(dialog.getByRole('button', { name: /synthesizing_compute/i })).toBeVisible();

    // The current model id ("gemini-3-flash-preview") is not a valid Gemini
    // model, so the API rejects the call and the error branch renders an alert.
    // Allow up to 30s for the API round-trip + render.
    const errorAlert = dialog.getByRole('alert').filter({ hasText: /AI_SYNTHESIS_ERROR/i });
    await expect(errorAlert).toBeVisible({ timeout: 30_000 });
    await expect(errorAlert).toContainText(/AI Service Unavailable/i);
  });
});
