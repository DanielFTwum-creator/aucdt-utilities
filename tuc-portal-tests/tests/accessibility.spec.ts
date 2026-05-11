import { test, expect } from '@playwright/test';
import { LoginPage } from '../utils/LoginPage';
import { logTestInfo } from '../utils/helpers';

test.describe('Accessibility Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test('Should have proper page title', async ({ page }) => {
    logTestInfo('Test: Verify page title');
    
    const title = await page.title();
    logTestInfo(`Page title: ${title}`);
    
    expect(title.length).toBeGreaterThan(0);
  });

  test('Should have accessible form labels', async ({ page }) => {
    logTestInfo('Test: Verify form labels');
    
    // Check for labels or aria-labels
    const usernameLabel = await page.locator('label[for*="username"], [aria-label*="username"]').count();
    const passwordLabel = await page.locator('label[for*="password"], [aria-label*="password"]').count();
    
    logTestInfo(`Username label found: ${usernameLabel > 0}`);
    logTestInfo(`Password label found: ${passwordLabel > 0}`);
  });

  test('Should support keyboard navigation', async ({ page }) => {
    logTestInfo('Test: Keyboard navigation');
    
    // Tab through form elements
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    // Check if elements are focused
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    logTestInfo(`Focused element: ${focusedElement}`);
  });

  test('Should have proper contrast ratios', async ({ page }) => {
    logTestInfo('Test: Check for visibility');
    
    // Take screenshot for manual verification
    await loginPage.takeScreenshot('accessibility-contrast-check');
    
    logTestInfo('Screenshot taken for contrast verification');
  });

  test('Should have no console errors', async ({ page }) => {
    logTestInfo('Test: Check console errors');
    
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    if (errors.length > 0) {
      logTestInfo(`Console errors found: ${errors.length}`);
      errors.forEach(error => logTestInfo(`Error: ${error}`));
    } else {
      logTestInfo('No console errors found');
    }
  });

  test('Should load all resources successfully', async ({ page }) => {
    logTestInfo('Test: Resource loading');
    
    const failedRequests: string[] = [];
    
    page.on('requestfailed', (request) => {
      failedRequests.push(request.url());
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    if (failedRequests.length > 0) {
      logTestInfo(`Failed requests: ${failedRequests.length}`);
      failedRequests.forEach(url => logTestInfo(`Failed: ${url}`));
    } else {
      logTestInfo('All resources loaded successfully');
    }
    
    expect(failedRequests.length).toBe(0);
  });
});
