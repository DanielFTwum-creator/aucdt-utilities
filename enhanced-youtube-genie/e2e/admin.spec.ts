import { test, expect } from '@playwright/test';

/**
 * Admin panel tests — password gate, dashboard, audit log, clear data.
 *
 * Default admin password: tuc-ict-2026 (overridden by VITE_ADMIN_PASSWORD at build time).
 */

const AUTH_KEY     = 'tuc_auth_youtube-genie';
const USER_KEY     = 'youtube-genie_user';
const FAKE_USER    = JSON.stringify({ id: 'test-001', name: 'TUC Test', email: 'test@techbridge.edu.gh' });
const ADMIN_PW     = 'tuc-ict-2026';
const WRONG_PW     = 'wrong-password';
const STATS_KEY    = 'youtube-genie-stats';

async function loginAndGoto(page: import('@playwright/test').Page) {
  await page.addInitScript(({ authKey, userKey, fakeUser }) => {
    sessionStorage.setItem(authKey, '1');
    localStorage.setItem(userKey, fakeUser);
  }, { authKey: AUTH_KEY, userKey: USER_KEY, fakeUser: FAKE_USER });
  await page.goto('/youtube-genie/');
}

async function openAdmin(page: import('@playwright/test').Page) {
  await loginAndGoto(page);
  await page.getByRole('button', { name: /Admin/i }).click();
}

async function enterAdminPassword(page: import('@playwright/test').Page, pw: string) {
  await page.getByLabel(/Password/i).fill(pw);
  await page.getByRole('button', { name: /^Enter$/i }).click();
}

test.describe('Admin panel', () => {
  test('Admin button is visible when authenticated', async ({ page }) => {
    await loginAndGoto(page);
    await expect(page.getByRole('button', { name: /Admin/i })).toBeVisible();
  });

  test('clicking Admin shows password gate', async ({ page }) => {
    await openAdmin(page);
    await expect(page.getByRole('heading', { name: /Admin Access/i })).toBeVisible();
    await expect(page.getByLabel(/Password/i)).toBeVisible();
  });

  test('wrong password shows error message', async ({ page }) => {
    await openAdmin(page);
    await enterAdminPassword(page, WRONG_PW);
    await expect(page.getByText(/Incorrect password/i)).toBeVisible();
  });

  test('5 wrong attempts locks the gate', async ({ page }) => {
    await openAdmin(page);
    for (let i = 0; i < 5; i++) {
      await page.getByLabel(/Password/i).fill(WRONG_PW);
      await page.getByRole('button', { name: /^Enter$/i }).click();
    }
    await expect(page.getByText(/Too many attempts/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /^Enter$/i })).toBeDisabled();
  });

  test('correct password shows admin dashboard', async ({ page }) => {
    await openAdmin(page);
    await enterAdminPassword(page, ADMIN_PW);
    await expect(page.getByRole('heading', { name: /Admin Panel/i })).toBeVisible();
  });

  test('dashboard shows generation stats', async ({ page }) => {
    await page.addInitScript(({ authKey, userKey, fakeUser, statsKey }) => {
      sessionStorage.setItem(authKey, '1');
      localStorage.setItem(userKey, fakeUser);
      localStorage.setItem(statsKey, JSON.stringify({ generations: 42, lastUsed: new Date().toISOString() }));
    }, { authKey: AUTH_KEY, userKey: USER_KEY, fakeUser: FAKE_USER, statsKey: STATS_KEY });

    await page.goto('/youtube-genie/');
    await page.getByRole('button', { name: /Admin/i }).click();
    await enterAdminPassword(page, ADMIN_PW);

    await expect(page.getByText('42')).toBeVisible();
    await expect(page.getByText(/Total Generations/i)).toBeVisible();
  });

  test('clear data button removes stats', async ({ page }) => {
    await page.addInitScript(({ authKey, userKey, fakeUser, statsKey }) => {
      sessionStorage.setItem(authKey, '1');
      localStorage.setItem(userKey, fakeUser);
      localStorage.setItem(statsKey, JSON.stringify({ generations: 10, lastUsed: new Date().toISOString() }));
    }, { authKey: AUTH_KEY, userKey: USER_KEY, fakeUser: FAKE_USER, statsKey: STATS_KEY });

    await page.goto('/youtube-genie/');
    await page.getByRole('button', { name: /Admin/i }).click();
    await enterAdminPassword(page, ADMIN_PW);

    await page.getByRole('button', { name: /Clear All Stats/i }).click();

    // Stats should reset to 0
    await expect(page.getByText('0')).toBeVisible();
    await expect(page.getByRole('button', { name: /Cleared/i })).toBeVisible();
  });

  test('audit log records admin login event', async ({ page }) => {
    await openAdmin(page);
    await enterAdminPassword(page, ADMIN_PW);
    await expect(page.getByText(/Admin login successful/i)).toBeVisible();
  });

  test('Exit Admin button returns to generator', async ({ page }) => {
    await openAdmin(page);
    await enterAdminPassword(page, ADMIN_PW);
    await page.getByRole('button', { name: /Exit Admin/i }).click();
    await expect(page.getByRole('heading', { name: /Enter Song Details/i })).toBeVisible();
  });

  test('URL hash is #/admin when admin panel is open', async ({ page }) => {
    await openAdmin(page);
    expect(page.url()).toContain('#/admin');
  });

  test('navigating to #/admin directly shows password gate', async ({ page }) => {
    await page.addInitScript(({ authKey, userKey, fakeUser }) => {
      sessionStorage.setItem(authKey, '1');
      localStorage.setItem(userKey, fakeUser);
    }, { authKey: AUTH_KEY, userKey: USER_KEY, fakeUser: FAKE_USER });

    await page.goto('/youtube-genie/#/admin');
    await expect(page.getByRole('heading', { name: /Admin Access/i })).toBeVisible();
  });
});
