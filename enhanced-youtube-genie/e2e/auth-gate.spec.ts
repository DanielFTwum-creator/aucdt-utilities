import { test, expect } from '@playwright/test';

/**
 * Auth gate tests — verifies unauthenticated and authenticated states.
 *
 * AuthGate reads: sessionStorage('tuc_auth_youtube-genie') === '1'
 * We inject this via addInitScript to bypass Google OAuth in tests.
 */

const AUTH_KEY  = 'tuc_auth_youtube-genie';
const USER_KEY  = 'youtube-genie_user';
const FAKE_USER = JSON.stringify({ id: 'test-001', name: 'TUC Test', email: 'test@techbridge.edu.gh' });

test.describe('Auth gate', () => {
  test('unauthenticated visit shows Google login button', async ({ page }) => {
    await page.goto('/youtube-genie/');
    await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible();
  });

  test('unauthenticated visit does not show the main form', async ({ page }) => {
    await page.goto('/youtube-genie/');
    await expect(page.getByRole('heading', { name: /Enter Song Details/i })).not.toBeVisible();
  });

  test('authenticated visit shows the main app', async ({ page }) => {
    await page.addInitScript(({ authKey, userKey, fakeUser }) => {
      sessionStorage.setItem(authKey, '1');
      localStorage.setItem(userKey, fakeUser);
    }, { authKey: AUTH_KEY, userKey: USER_KEY, fakeUser: FAKE_USER });

    await page.goto('/youtube-genie/');
    await expect(page.getByRole('heading', { name: /Enter Song Details/i })).toBeVisible();
  });

  test('sign out returns to login screen', async ({ page }) => {
    await page.addInitScript(({ authKey, userKey, fakeUser }) => {
      sessionStorage.setItem(authKey, '1');
      localStorage.setItem(userKey, fakeUser);
    }, { authKey: AUTH_KEY, userKey: USER_KEY, fakeUser: FAKE_USER });

    await page.goto('/youtube-genie/');
    await page.getByRole('button', { name: /Sign out/i }).click();
    await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible();
  });
});
