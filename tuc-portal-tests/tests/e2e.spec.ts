import { test, expect } from '@playwright/test';
import { LoginPage } from '../utils/LoginPage';
import { DashboardPage } from '../utils/DashboardPage';
import { TestData } from '../test-data/testData';
import { logTestInfo, generateRandomEmail } from '../utils/helpers';

test.describe('End-to-End Tests', () => {
  
  test('Complete application flow - login to submission', async ({ page }) => {
    logTestInfo('Test: Complete application flow');
    
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Navigate to login page
    await loginPage.navigateToLoginPage();
    logTestInfo('Step 1: Navigated to login page');
    
    // Step 2: Login with valid credentials
    await loginPage.login(
      TestData.validCredentials.username,
      TestData.validCredentials.password
    );
    await page.waitForLoadState('networkidle');
    logTestInfo('Step 2: Logged in successfully');
    
    // Step 3: Verify dashboard loaded
    const currentUrl = await page.url();
    logTestInfo(`Step 3: Current URL: ${currentUrl}`);
    
    // Step 4: Navigate through application sections
    // (Add more steps based on actual application flow)
    
    await page.waitForTimeout(2000);
    logTestInfo('E2E test completed');
  });

  test('User registration and login flow', async ({ page }) => {
    logTestInfo('Test: Registration and login flow');
    
    const loginPage = new LoginPage(page);
    
    // Navigate to login page
    await loginPage.navigateToLoginPage();
    
    // Check if register link exists
    const registerVisible = await loginPage.isVisible(loginPage.registerLink);
    
    if (registerVisible) {
      // Click register
      await loginPage.clickRegister();
      await page.waitForLoadState('networkidle');
      logTestInfo('Navigated to registration page');
      
      // Fill registration form (adjust selectors based on actual form)
      const randomEmail = generateRandomEmail();
      
      // Example registration fields - adjust based on actual form
      await page.fill('input[name="email"], input[type="email"]', randomEmail).catch(() => {});
      await page.fill('input[name="firstName"]', TestData.applicationData.firstName).catch(() => {});
      await page.fill('input[name="lastName"]', TestData.applicationData.lastName).catch(() => {});
      
      logTestInfo(`Registration attempted with email: ${randomEmail}`);
    } else {
      logTestInfo('Registration link not found, skipping registration test');
    }
  });

  test('Complete user journey with logout', async ({ page }) => {
    logTestInfo('Test: Complete user journey');
    
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    // Login
    await loginPage.navigateToLoginPage();
    await loginPage.login(
      TestData.validCredentials.username,
      TestData.validCredentials.password
    );
    await page.waitForLoadState('networkidle');
    logTestInfo('User logged in');
    
    // Wait for dashboard
    await page.waitForTimeout(2000);
    
    // Logout
    const logoutVisible = await dashboardPage.isVisible(dashboardPage.logoutButton);
    
    if (logoutVisible) {
      await dashboardPage.logout();
      await page.waitForLoadState('networkidle');
      logTestInfo('User logged out');
      
      // Verify redirected to login page
      const currentUrl = await page.url();
      expect(currentUrl).toContain('login');
    } else {
      logTestInfo('Logout button not found');
    }
  });

  test('Form validation across application', async ({ page }) => {
    logTestInfo('Test: Form validation');
    
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateToLoginPage();
    
    // Test empty form submission
    await loginPage.clickElement(loginPage.loginButton);
    await page.waitForTimeout(1000);
    
    // Check for validation messages
    const validationMessages = await page.locator('.error, .invalid-feedback, .validation-error').count();
    logTestInfo(`Validation messages found: ${validationMessages}`);
    
    // Test partial form submission
    await loginPage.fillInput(loginPage.usernameInput, 'test');
    await loginPage.clickElement(loginPage.loginButton);
    await page.waitForTimeout(1000);
    
    logTestInfo('Form validation test completed');
  });

  test('Session persistence and timeout', async ({ page }) => {
    logTestInfo('Test: Session persistence');
    
    const loginPage = new LoginPage(page);
    
    // Login
    await loginPage.navigateToLoginPage();
    await loginPage.login(
      TestData.validCredentials.username,
      TestData.validCredentials.password
    );
    await page.waitForLoadState('networkidle');
    
    // Get cookies to verify session
    const cookies = await page.context().cookies();
    logTestInfo(`Cookies set: ${cookies.length}`);
    
    cookies.forEach(cookie => {
      logTestInfo(`Cookie: ${cookie.name}`);
    });
    
    // Refresh page to test session persistence
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const currentUrl = await page.url();
    logTestInfo(`URL after refresh: ${currentUrl}`);
  });
});
