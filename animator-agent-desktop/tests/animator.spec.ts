import { test, expect } from '@playwright/test';

test.describe('Animator Agent Desktop E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the workspace with correct branding', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByText('Animator Agent')).toBeVisible();
    await expect(page.getByText('Workspace')).toHaveAttribute('aria-current', 'page');
  });

  test('should have a functional timeline', async ({ page }) => {
    const timeline = page.getByRole('region', { name: 'Animation timeline' });
    await expect(timeline).toBeVisible();
    
    // Check for tracks
    await expect(page.getByRole('row', { name: /Track: Character/ })).toBeVisible();
  });

  test('should handle playback controls', async ({ page }) => {
    const playButton = page.getByRole('button', { name: 'Play animation' });
    const pauseButton = page.getByRole('button', { name: 'Pause playback' });
    
    await playButton.click();
    await expect(playButton).toHaveAttribute('aria-pressed', 'true');
    
    await pauseButton.click();
    await expect(playButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('should require authentication for admin section', async ({ page }) => {
    await page.goto('/admin/dashboard');
    
    // Should see auth requirement
    await expect(page.getByText('Admin Authorization Required')).toBeVisible();
    
    // Login
    const passwordInput = page.getByLabel('Admin password');
    await passwordInput.fill('admin');
    await page.getByRole('button', { name: 'Authenticate' }).click();
    
    // Should reach dashboard
    await expect(page.getByText('Admin Diagnostics')).toBeVisible();
  });

  test('should record audit logs for admin actions', async ({ page }) => {
    // Navigate to admin (already logged in if running after previous test, but tests are isolated)
    await page.goto('/admin/audit');
    await page.getByLabel('Admin password').fill('admin');
    await page.getByRole('button', { name: 'Authenticate' }).click();
    
    // Should see at least the login entry
    await expect(page.getByText('Admin login')).toBeVisible();
    await expect(page.getByText('Successful authentication')).toBeVisible();
  });
});
