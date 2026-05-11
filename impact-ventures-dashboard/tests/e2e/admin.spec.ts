import { test, expect } from '@playwright/test';

test.describe('admin journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // ensure clean session/local storage for each scenario
    await page.evaluate(() => {
      sessionStorage.clear();
      localStorage.removeItem('impact-ventures-audit-logs');
    });
  });

  test('footer Admin link navigates to login modal', async ({ page }) => {
    await page.getByRole('button', { name: /open admin dashboard/i }).click();
    await expect(page.getByRole('dialog', { name: /admin access/i })).toBeVisible();
  });

  test('deep link #/admin opens the login modal', async ({ page }) => {
    await page.goto('/#/admin');
    await expect(page.getByRole('dialog', { name: /admin access/i })).toBeVisible();
  });

  test('show/hide password toggle flips input type', async ({ page }) => {
    await page.goto('/#/admin');
    const pwd = page.getByRole('textbox', { name: 'Password' });
    await pwd.fill('something');
    await expect(pwd).toHaveAttribute('type', 'password');
    await page.getByRole('button', { name: /show password/i }).click();
    await expect(pwd).toHaveAttribute('type', 'text');
    await page.getByRole('button', { name: /hide password/i }).click();
    await expect(pwd).toHaveAttribute('type', 'password');
  });

  test('invalid password shows alert and writes a fail entry to audit log', async ({ page }) => {
    await page.goto('/#/admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrong');
    await page.getByRole('button', { name: /authenticate/i }).click();
    await expect(page.getByRole('alert')).toContainText(/invalid password/i);

    const logs = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('impact-ventures-audit-logs') || '[]'),
    );
    expect(logs[0].action).toBe('ADMIN_LOGIN_FAIL');
  });

  test('cancel returns to home', async ({ page }) => {
    await page.goto('/#/admin');
    await page.getByRole('button', { name: /^cancel$/i }).click();
    await expect(page.getByRole('dialog', { name: /admin access/i })).toHaveCount(0);
    await expect(page).toHaveURL(/\/$|#$/);
  });

  test('valid password opens dashboard, both tabs work, logout clears session', async ({ page }) => {
    await page.goto('/#/admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
    await page.getByRole('button', { name: /authenticate/i }).click();

    const dashboard = page.getByRole('main', { name: /admin dashboard/i });
    await expect(dashboard).toBeVisible();

    // Audit Log tab is the default
    const logsTab = page.getByRole('tab', { name: /audit log/i });
    const diagTab = page.getByRole('tab', { name: /diagnostics/i });
    await expect(logsTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('region', { name: /audit log/i })).toBeVisible();
    await expect(page.getByText('ADMIN_LOGIN_SUCCESS')).toBeVisible();

    // Switch to Diagnostics
    await diagTab.click();
    await expect(diagTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('region', { name: /system diagnostics/i })).toBeVisible();
    await expect(page.getByText(/portfolio count/i)).toBeVisible();

    // Run storage test → PASS
    await page.getByRole('button', { name: /^run test$/i }).click();
    await expect(page.getByRole('status').filter({ hasText: 'PASS' })).toBeVisible();

    // Diagnostic run is logged
    await logsTab.click();
    await expect(page.getByText('DIAGNOSTIC_RUN')).toBeVisible();

    // Logout clears session and unmounts dashboard
    await page.getByRole('button', { name: /logout from admin/i }).click();
    await expect(dashboard).toHaveCount(0);

    const session = await page.evaluate(() => sessionStorage.getItem('impact-ventures-admin'));
    expect(session).toBeNull();
  });

  test('admin session persists: re-entering #/admin skips login', async ({ page }) => {
    await page.goto('/#/admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
    await page.getByRole('button', { name: /authenticate/i }).click();
    await expect(page.getByRole('main', { name: /admin dashboard/i })).toBeVisible();

    // Close dashboard via logout-free path: navigate away then back
    await page.evaluate(() => { window.location.hash = ''; });
    await page.evaluate(() => { window.location.hash = '#/admin'; });

    // Session is still set, so dashboard reopens without the login modal
    await expect(page.getByRole('main', { name: /admin dashboard/i })).toBeVisible();
    await expect(page.getByRole('dialog', { name: /admin access/i })).toHaveCount(0);
  });
});
