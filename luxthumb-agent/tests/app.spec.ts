import { test, expect } from '@playwright/test';

test.describe('Core Application', () => {
  test('has correct page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/LuxThumb Designer/);
  });

  test('renders main heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('LuxThumb Designer');
  });

  test('can adjust aspect ratio', async ({ page }) => {
    await page.goto('/');
    await page.locator('button', { hasText: '1:1' }).click();
    const button = page.locator('button', { hasText: '1:1' });
    const className = await button.getAttribute('class');
    expect(className).toContain('border-[#C9A84C]');
  });

  test('can type in input fields', async ({ page }) => {
    await page.goto('/');
    const brandNameInput = page.getByPlaceholder('Fancy Homes');
    await brandNameInput.fill('MY CUSTOM BRAND');
    await expect(brandNameInput).toHaveValue('MY CUSTOM BRAND');
  });
});

test.describe('Admin Panel', () => {
  test('opens admin login dialog when admin button clicked', async ({ page }) => {
    await page.goto('/');
    const adminButton = page.locator('button[aria-label="Open admin panel"]');
    await expect(adminButton).toBeVisible();
    await adminButton.click();
    await expect(page.locator('text=Admin Login')).toBeVisible();
    await expect(page.locator('#admin-password')).toBeVisible();
  });

  test('rejects incorrect admin password', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open admin panel"]').click();
    await page.locator('#admin-password').fill('wrongpassword');

    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Incorrect password');
      await dialog.dismiss();
    });

    await page.locator('button[aria-label="Login to admin panel"]').click();
    // The admin dashboard should NOT be visible
    await expect(page.locator('text=Audit Dashboard')).not.toBeVisible();
  });

  test('grants access with correct admin password', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open admin panel"]').click();
    await page.locator('#admin-password').fill('admin123');
    await page.locator('button[aria-label="Login to admin panel"]').click();
    await expect(page.locator('text=Audit Dashboard')).toBeVisible();
  });

  test('can dismiss admin login dialog', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open admin panel"]').click();
    await expect(page.locator('text=Admin Login')).toBeVisible();
    await page.locator('button[aria-label="Cancel admin login"]').click();
    await expect(page.locator('text=Admin Login')).not.toBeVisible();
  });

  test('admin panel shows stat blocks', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open admin panel"]').click();
    await page.locator('#admin-password').fill('admin123');
    await page.locator('button[aria-label="Login to admin panel"]').click();
    await expect(page.locator('text=Total Entries')).toBeVisible();
    await expect(page.locator('text=Design Saves')).toBeVisible();
    await expect(page.locator('text=Exports')).toBeVisible();
  });

  test('admin panel has export buttons', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open admin panel"]').click();
    await page.locator('#admin-password').fill('admin123');
    await page.locator('button[aria-label="Login to admin panel"]').click();
    await expect(page.locator('button[aria-label="Export audit logs as JSON"]')).toBeVisible();
    await expect(page.locator('button[aria-label="Export audit logs as CSV"]')).toBeVisible();
  });

  test('admin logout button closes admin panel', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open admin panel"]').click();
    await page.locator('#admin-password').fill('admin123');
    await page.locator('button[aria-label="Login to admin panel"]').click();
    await expect(page.locator('text=Audit Dashboard')).toBeVisible();
    await page.locator('button[aria-label="Logout from admin panel"]').click();
    await expect(page.locator('text=Audit Dashboard')).not.toBeVisible();
  });
});

test.describe('Theme Switching', () => {
  test('opens accessibility panel', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open accessibility settings"]').click();
    await expect(page.locator('text=Accessibility')).toBeVisible();
  });

  test('switches to light theme', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open accessibility settings"]').click();
    await page.locator('button[aria-label="Switch to Light theme"]').click();
    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBe('light');
  });

  test('switches to dark theme', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open accessibility settings"]').click();
    await page.locator('button[aria-label="Switch to Dark theme"]').click();
    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBe('dark');
  });

  test('switches to high contrast theme', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open accessibility settings"]').click();
    await page.locator('button[aria-label="Switch to High Contrast theme"]').click();
    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBe('high-contrast');
  });

  test('persists theme to localStorage', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open accessibility settings"]').click();
    await page.locator('button[aria-label="Switch to Light theme"]').click();
    const storedTheme = await page.evaluate(() =>
      localStorage.getItem('luxthumb-theme')
    );
    expect(storedTheme).toBe('light');
  });

  test('restores theme from localStorage on page reload', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('luxthumb-theme', 'light'));
    await page.reload();
    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBe('light');
  });

  test('can close accessibility panel', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open accessibility settings"]').click();
    await expect(page.locator('text=Accessibility')).toBeVisible();
    await page.locator('button[aria-label="Close accessibility settings"]').click();
    await expect(page.locator('text=Accessibility')).not.toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('all action buttons have aria-labels', async ({ page }) => {
    await page.goto('/');
    const buttons = page.locator('aside button');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const label = await buttons.nth(i).getAttribute('aria-label');
      expect(label, `Button ${i} is missing aria-label`).toBeTruthy();
    }
  });

  test('page has lang attribute', async ({ page }) => {
    await page.goto('/');
    const lang = await page.evaluate(() => document.documentElement.getAttribute('lang'));
    expect(lang).toBe('en');
  });

  test('has data-theme attribute on html element', async ({ page }) => {
    await page.goto('/');
    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBeTruthy();
  });

  test('admin password input is properly labelled', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Open admin panel"]').click();
    const input = page.locator('#admin-password');
    await expect(input).toHaveAttribute('aria-label', 'Admin password');
  });
});
