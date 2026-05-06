import { test, expect } from '@playwright/test';

test.describe('venture detail modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('clicking a card opens the modal with venture details', async ({ page }) => {
    await page.getByRole('heading', { name: /fraud detection engine/i }).click();
    const dialog = page.getByRole('dialog', { name: /venture detail: fraud detection engine/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('STRATEGIC_SUMMARY')).toBeVisible();
    await expect(dialog.getByText('ROI_CAPACITY_INDEX')).toBeVisible();
    await expect(dialog.getByText('SOCIAL_LIQUIDITY')).toBeVisible();
  });

  test('close (X) button dismisses the modal', async ({ page }) => {
    await page.getByRole('heading', { name: /fraud detection engine/i }).click();
    const dialog = page.getByRole('dialog', { name: /venture detail/i });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: /close venture detail/i }).click();
    await expect(dialog).toHaveCount(0);
  });

  test('CLOSE_NODE button dismisses the modal', async ({ page }) => {
    await page.getByRole('heading', { name: /fraud detection engine/i }).click();
    const dialog = page.getByRole('dialog', { name: /venture detail/i });
    await dialog.getByRole('button', { name: /close_node/i }).click();
    await expect(page.getByRole('dialog', { name: /venture detail/i })).toHaveCount(0);
  });
});
