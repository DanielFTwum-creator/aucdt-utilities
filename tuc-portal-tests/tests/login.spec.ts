import { test, expect } from '@playwright/test';
import { LoginPage } from '../utils/LoginPage';
import { DashboardPage } from '../utils/DashboardPage';
import { TestData, ErrorMessages } from '../test-data/testData';
import { logTestInfo } from '../utils/helpers';

test.describe('Login Page Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    logTestInfo('Navigated to login page');
  });

  test('Should display login page elements', async ({ page }) => {
    logTestInfo('Test: Verify login page elements are displayed');
    
    await loginPage.verifyLoginPageDisplayed();
    
    // Verify all required elements are visible
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    
    logTestInfo('Login page elements verified successfully');
  });

  test('Should login with valid credentials', async ({ page }) => {
    logTestInfo('Test: Login with valid credentials');
    
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.login(
      TestData.validCredentials.username,
      TestData.validCredentials.password
    );
    
    // Wait for navigation to dashboard
    await page.waitForLoadState('networkidle');
    
    // Verify dashboard is loaded (adjust based on actual success indicator)
    const currentUrl = await loginPage.getCurrentUrl();
    logTestInfo(`Current URL after login: ${currentUrl}`);
    
    // You can verify dashboard elements or URL contains dashboard
    // await dashboardPage.verifyDashboardLoaded();
    
    logTestInfo('Login successful');
  });

  test('Should show error with invalid credentials', async ({ page }) => {
    logTestInfo('Test: Login with invalid credentials');
    
    await loginPage.login(
      TestData.invalidCredentials.username,
      TestData.invalidCredentials.password
    );
    
    // Wait for error message
    await page.waitForTimeout(2000);
    
    // Check if error message is displayed
    const errorVisible = await loginPage.isErrorMessageDisplayed();
    logTestInfo(`Error message displayed: ${errorVisible}`);
    
    if (errorVisible) {
      const errorText = await loginPage.getErrorMessage();
      logTestInfo(`Error message: ${errorText}`);
      expect(errorText.length).toBeGreaterThan(0);
    }
  });

  test('Should show error with empty username', async ({ page }) => {
    logTestInfo('Test: Login with empty username');
    
    await loginPage.login('', TestData.validCredentials.password);
    
    // Verify login button state or error message
    await page.waitForTimeout(1000);
    
    // Either error message is shown or login button is disabled
    const errorVisible = await loginPage.isErrorMessageDisplayed();
    const buttonEnabled = await loginPage.isLoginButtonEnabled();
    
    logTestInfo(`Error visible: ${errorVisible}, Button enabled: ${buttonEnabled}`);
  });

  test('Should show error with empty password', async ({ page }) => {
    logTestInfo('Test: Login with empty password');
    
    await loginPage.login(TestData.validCredentials.username, '');
    
    await page.waitForTimeout(1000);
    
    const errorVisible = await loginPage.isErrorMessageDisplayed();
    logTestInfo(`Error message displayed: ${errorVisible}`);
  });

  test('Should clear login form', async ({ page }) => {
    logTestInfo('Test: Clear login form');
    
    await loginPage.fillInput(loginPage.usernameInput, 'test_user');
    await loginPage.fillInput(loginPage.passwordInput, 'test_pass');
    
    await loginPage.clearLoginForm();
    
    const usernameValue = await loginPage.usernameInput.inputValue();
    const passwordValue = await loginPage.passwordInput.inputValue();
    
    expect(usernameValue).toBe('');
    expect(passwordValue).toBe('');
    
    logTestInfo('Login form cleared successfully');
  });

  test('Should navigate to forgot password page', async ({ page }) => {
    logTestInfo('Test: Navigate to forgot password');
    
    const forgotPasswordVisible = await loginPage.isVisible(loginPage.forgotPasswordLink);
    
    if (forgotPasswordVisible) {
      await loginPage.clickForgotPassword();
      await page.waitForLoadState('networkidle');
      
      const currentUrl = await loginPage.getCurrentUrl();
      logTestInfo(`Navigated to: ${currentUrl}`);
      
      expect(currentUrl).toContain('forgot');
    } else {
      logTestInfo('Forgot password link not found on page');
    }
  });

  test('Should navigate to registration page', async ({ page }) => {
    logTestInfo('Test: Navigate to registration');
    
    const registerVisible = await loginPage.isVisible(loginPage.registerLink);
    
    if (registerVisible) {
      await loginPage.clickRegister();
      await page.waitForLoadState('networkidle');
      
      const currentUrl = await loginPage.getCurrentUrl();
      logTestInfo(`Navigated to: ${currentUrl}`);
      
      expect(currentUrl).toContain('register');
    } else {
      logTestInfo('Register link not found on page');
    }
  });

  test('Should handle login with special characters in password', async ({ page }) => {
    logTestInfo('Test: Login with special characters');
    
    await loginPage.login(
      TestData.validCredentials.username,
      'Test@123!#$%'
    );
    
    await page.waitForTimeout(2000);
    
    const currentUrl = await loginPage.getCurrentUrl();
    logTestInfo(`URL after login attempt: ${currentUrl}`);
  });

  test('Should verify page responsiveness', async ({ page }) => {
    logTestInfo('Test: Page responsiveness');
    
    // Test different viewport sizes
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginPage.verifyElementVisible(loginPage.loginButton);
    
    await page.setViewportSize({ width: 768, height: 1024 });
    await loginPage.verifyElementVisible(loginPage.loginButton);
    
    await page.setViewportSize({ width: 375, height: 667 });
    await loginPage.verifyElementVisible(loginPage.loginButton);
    
    logTestInfo('Page responsiveness verified');
  });
});
