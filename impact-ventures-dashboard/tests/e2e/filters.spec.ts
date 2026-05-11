import { test, expect } from '@playwright/test';

test.describe('search and filter journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('search narrows the registry', async ({ page }) => {
    const search = page.getByRole('searchbox', { name: /search ventures/i });
    await search.fill('fraud');
    await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toBeVisible();
    // a non-matching name should disappear
    await expect(page.getByRole('heading', { name: /crop yield predictor/i })).toHaveCount(0);
  });

  test('tier filter restricts to selected tier', async ({ page }) => {
    await page.getByRole('button', { name: /filter tier 1/i }).click();
    await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toBeVisible();
    // a known T2 entry should be hidden
    await expect(page.getByRole('heading', { name: /autonomous audit engine/i })).toHaveCount(0);

    await page.getByRole('button', { name: /show all tiers/i }).click();
    await expect(page.getByRole('heading', { name: /autonomous audit engine/i })).toBeVisible();
  });

  test('advanced filters: toggle, category filter, and reset', async ({ page }) => {
    const refine = page.getByRole('button', { name: /refine/i });
    await expect(refine).toHaveAttribute('aria-expanded', 'false');
    await refine.click();
    await expect(refine).toHaveAttribute('aria-expanded', 'true');

    // Category: HealthTech only — must not show a FinTech card
    await page.getByRole('button', { name: /^HealthTech$/ }).click();
    await expect(page.getByRole('heading', { name: /predictive disease risk model/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toHaveCount(0);

    // Reset returns FinTech entries
    await page.getByRole('button', { name: /reset all filters/i }).click();
    await expect(page.getByRole('heading', { name: /fraud detection engine/i })).toBeVisible();
  });

  test('search + tier compose (both must match)', async ({ page }) => {
    await page.getByRole('searchbox', { name: /search ventures/i }).fill('compliance');
    await page.getByRole('button', { name: /filter tier 1/i }).click();
    // T1 + "compliance" in name/why → bias-detection-engine (rationale mentions regulatory/compliance)
    await expect(page.getByRole('heading', { name: /bias detection engine/i })).toBeVisible();
    // T2 compliance entry should NOT appear
    await expect(page.getByRole('heading', { name: /autonomous audit engine/i })).toHaveCount(0);
  });
});
