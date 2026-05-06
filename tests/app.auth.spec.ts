/**
 * Auth Tests — TUC Apps with Auth Scaffolded
 * Validates: /login renders, /admin redirects unauthenticated, form is accessible
 *
 * Run: npx playwright test --project=auth
 */
import { test, expect } from '@playwright/test';
import { ALL_APPS, GATEWAY } from '../playwright.config';
import fs from 'fs';
import path from 'path';

// Only test apps that have auth files scaffolded
const AUTH_APPS = ALL_APPS.filter(appName => {
  const authCtx = path.join(__dirname, '..', appName, 'src', 'contexts', 'AuthContext.tsx');
  return fs.existsSync(authCtx);
});

for (const appName of AUTH_APPS) {
  test.describe(`${appName} — auth`, () => {
    test('/login page renders with accessible form', async ({ page }) => {
      await page.goto(`${GATEWAY}/${appName}/login`, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(1000);

      const status = await page.evaluate(() => document.readyState);
      expect(status).toBe('complete');

      // Login form must exist
      const form = page.locator('form').first();
      await expect(form, `${appName}: login form not found`).toBeVisible({ timeout: 5000 });

      // Username + password inputs
      const usernameInput = page.locator('input[type="text"], input[id="username"], input[name="username"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      await expect(usernameInput, `${appName}: username input not found`).toBeVisible();
      await expect(passwordInput, `${appName}: password input not found`).toBeVisible();

      // Submit button
      const submitBtn = page.locator('button[type="submit"]').first();
      await expect(submitBtn, `${appName}: submit button not found`).toBeVisible();

      // Inputs must have labels or aria-labels
      const usernameLabel = await usernameInput.getAttribute('aria-label') ||
        await page.evaluate(el => {
          const id = el.id;
          return id ? !!document.querySelector(`label[for="${id}"]`) : false;
        }, await usernameInput.elementHandle());
      expect(usernameLabel, `${appName}: username input must have label`).toBeTruthy();
    });

    test('/admin redirects to /login when unauthenticated', async ({ page }) => {
      await page.goto(`${GATEWAY}/${appName}/admin`, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(1500);

      const url = page.url();

      // Should be on /login (redirect happened) or show login form
      const onLoginPage = url.includes('/login');
      const hasLoginForm = await page.locator('input[type="password"]').count() > 0;

      expect(
        onLoginPage || hasLoginForm,
        `${appName}: /admin should redirect to /login when unauthenticated (got ${url})`
      ).toBe(true);
    });
  });
}
