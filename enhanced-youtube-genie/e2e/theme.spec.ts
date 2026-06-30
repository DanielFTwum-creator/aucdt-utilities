import { test, expect } from '@playwright/test';

/**
 * Theme system tests — cycles dark → light → high-contrast, persists to localStorage.
 */

const AUTH_KEY  = 'tuc_auth_youtube-genie';
const USER_KEY  = 'youtube-genie_user';
const FAKE_USER = JSON.stringify({ id: 'test-001', name: 'TUC Test', email: 'test@techbridge.edu.gh' });
const THEME_KEY = 'youtube-genie-theme';

async function loginAndGoto(page: import('@playwright/test').Page) {
  await page.addInitScript(({ authKey, userKey, fakeUser }) => {
    sessionStorage.setItem(authKey, '1');
    localStorage.setItem(userKey, fakeUser);
    localStorage.removeItem('youtube-genie-theme'); // start from default
  }, { authKey: AUTH_KEY, userKey: USER_KEY, fakeUser: FAKE_USER });
  await page.goto('/youtube-genie/');
}

test.describe('Theme system', () => {
  test('default theme is dark — html data-theme attribute is "dark"', async ({ page }) => {
    await loginAndGoto(page);
    const dataTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(dataTheme).toBe('dark');
  });

  test('theme toggle button is visible', async ({ page }) => {
    await loginAndGoto(page);
    await expect(page.getByRole('button', { name: /Theme:/i })).toBeVisible();
  });

  test('first click switches to light theme', async ({ page }) => {
    await loginAndGoto(page);
    await page.getByRole('button', { name: /Theme:/i }).click();

    const dataTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(dataTheme).toBe('light');
  });

  test('second click switches to high-contrast theme', async ({ page }) => {
    await loginAndGoto(page);
    await page.getByRole('button', { name: /Theme:/i }).click(); // dark → light
    await page.getByRole('button', { name: /Theme:/i }).click(); // light → high-contrast

    const dataTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(dataTheme).toBe('high-contrast');
  });

  test('third click cycles back to dark', async ({ page }) => {
    await loginAndGoto(page);
    await page.getByRole('button', { name: /Theme:/i }).click();
    await page.getByRole('button', { name: /Theme:/i }).click();
    await page.getByRole('button', { name: /Theme:/i }).click();

    const dataTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(dataTheme).toBe('dark');
  });

  test('theme persists in localStorage after toggle', async ({ page }) => {
    await loginAndGoto(page);
    await page.getByRole('button', { name: /Theme:/i }).click(); // → light

    const stored = await page.evaluate((key) => localStorage.getItem(key), THEME_KEY);
    expect(stored).toBe('light');
  });

  test('theme is restored from localStorage on reload', async ({ page }) => {
    await page.addInitScript(({ authKey, userKey, fakeUser, themeKey }) => {
      sessionStorage.setItem(authKey, '1');
      localStorage.setItem(userKey, fakeUser);
      localStorage.setItem(themeKey, 'high-contrast');
    }, { authKey: AUTH_KEY, userKey: USER_KEY, fakeUser: FAKE_USER, themeKey: THEME_KEY });

    await page.goto('/youtube-genie/');

    const dataTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(dataTheme).toBe('high-contrast');
  });
});
