import { test, expect } from '@playwright/test';

test.describe('Admin Flows', () => {
  test('should login as admin and view diagnostics', async ({ page }) => {
    await page.goto('/#/admin');
    
    // Ensure we are redirected to login if not authenticated
    await expect(page).toHaveURL(/.*\/login/);
    
    // Login
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('admin');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Should be redirected to diagnostics
    await expect(page).toHaveURL(/.*\/admin\/diagnostics/);
    await expect(page.getByRole('heading', { name: 'System Diagnostics' })).toBeVisible();
    
    // Check that we can see system info cards
    await expect(page.getByText('Server Uptime')).toBeVisible();
  });

  test('should view audit logs', async ({ page }) => {
    await page.goto('/#/login');
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('admin');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Go to logs
    await page.getByRole('link', { name: 'Logs' }).click();
    
    // Ensure audit logs load
    await expect(page.getByRole('heading', { name: 'Audit Logs' })).toBeVisible();
    
    // Should show the login action we just performed
    await expect(page.getByText('Admin login successful')).toBeVisible();
  });
});
