import { test, expect } from '@playwright/test';

test.describe('Theme Cycling', () => {
  test('should cycle through light, dark, and high-contrast modes', async ({ page }) => {
    await page.goto('/');
    
    // Find the theme toggle button
    const themeBtn = page.getByRole('button', { name: /Toggle theme/i });
    await expect(themeBtn).toBeVisible();
    
    // The initial state should be light mode (no 'dark' or 'high-contrast' class on html)
    let html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);
    await expect(html).not.toHaveClass(/high-contrast/);
    
    // Click -> Dark mode
    await themeBtn.click();
    await expect(html).toHaveClass(/dark/);
    await expect(html).not.toHaveClass(/high-contrast/);
    
    // Click -> High Contrast mode
    await themeBtn.click();
    await expect(html).toHaveClass(/high-contrast/);
    
    // Click -> Light mode again
    await themeBtn.click();
    await expect(html).not.toHaveClass(/dark/);
    await expect(html).not.toHaveClass(/high-contrast/);
  });
});
