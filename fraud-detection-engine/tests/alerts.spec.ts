import { test, expect } from '@playwright/test';

test.describe('Alerts Flow', () => {
  test('should show alerts and allow acknowledgement', async ({ page }) => {
    await page.goto('/#/alerts');
    
    // Wait for alerts to load from API polling
    await expect(page.getByRole('heading', { name: 'Alerts' })).toBeVisible();
    
    // Note: Due to mock data generation there might be alerts or it might say "All Clear"
    // We check for either state
    const allClearVisible = await page.getByText('All Clear').isVisible();
    
    if (!allClearVisible) {
      // Find the first acknowledge button
      const ackBtn = page.getByRole('button', { name: /Acknowledge alert/i }).first();
      await expect(ackBtn).toBeVisible();
      
      // Click it
      await ackBtn.click();
      
      // Verify it goes to acknowledged section
      await expect(page.getByRole('region', { name: 'Acknowledged alerts' })).toBeVisible();
    }
  });
});
