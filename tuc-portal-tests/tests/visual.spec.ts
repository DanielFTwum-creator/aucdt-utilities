import { test, expect } from '@playwright/test';
import { LoginPage } from '../utils/LoginPage';
import { logTestInfo } from '../utils/helpers';

test.describe('Visual Regression Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test('Should match login page screenshot', async ({ page }) => {
    logTestInfo('Test: Login page visual regression');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Take screenshot and compare
    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
    
    logTestInfo('Login page screenshot captured');
  });

  test('Should match login form screenshot', async ({ page }) => {
    logTestInfo('Test: Login form visual regression');
    
    await page.waitForLoadState('networkidle');
    
    // Screenshot of just the login form area
    const loginForm = page.locator('form, .login-form, .login-container').first();
    
    if (await loginForm.count() > 0) {
      await expect(loginForm).toHaveScreenshot('login-form.png');
    }
    
    logTestInfo('Login form screenshot captured');
  });

  test('Should match error state screenshot', async ({ page }) => {
    logTestInfo('Test: Error state visual regression');
    
    await loginPage.login('invalid_user', 'invalid_pass');
    await page.waitForTimeout(2000);
    
    // Take screenshot with error message
    await expect(page).toHaveScreenshot('login-error-state.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
    
    logTestInfo('Error state screenshot captured');
  });

  test('Should match mobile viewport screenshot', async ({ page }) => {
    logTestInfo('Test: Mobile viewport visual regression');
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('login-mobile.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
    
    logTestInfo('Mobile screenshot captured');
  });

  test('Should match tablet viewport screenshot', async ({ page }) => {
    logTestInfo('Test: Tablet viewport visual regression');
    
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('login-tablet.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
    
    logTestInfo('Tablet screenshot captured');
  });
});
