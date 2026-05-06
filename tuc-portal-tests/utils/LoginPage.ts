import { Page, Locator } from '@playwright/test';
import { BasePage } from '../utils/BasePage';

/**
 * Login Page Object Model
 * Represents the login page of TUC Admissions Portal
 */
export class LoginPage extends BasePage {
  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;
  readonly pageTitle: Locator;
  readonly rememberMeCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators - adjust these selectors based on actual page structure
    this.usernameInput = page.locator('input[name="username"], input[type="text"], input[placeholder*="username" i]').first();
    this.passwordInput = page.locator('input[name="password"], input[type="password"]').first();
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
    this.errorMessage = page.locator('.error, .alert-danger, .error-message, [role="alert"]').first();
    this.forgotPasswordLink = page.locator('a:has-text("Forgot Password"), a:has-text("Reset Password")').first();
    this.registerLink = page.locator('a:has-text("Register"), a:has-text("Sign Up"), a:has-text("Create Account")').first();
    this.pageTitle = page.locator('h1, h2, .title, .page-title').first();
    this.rememberMeCheckbox = page.locator('input[type="checkbox"][name*="remember" i]').first();
  }

  /**
   * Navigate to login page
   */
  async navigateToLoginPage(): Promise<void> {
    await this.goto('https://portal.aucdt.edu.gh/admissions-qa/#/main-applcation-login');
    await this.waitForPageLoad();
  }

  /**
   * Perform login action
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  /**
   * Login with remember me option
   */
  async loginWithRememberMe(username: string, password: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    
    if (await this.isVisible(this.rememberMeCheckbox)) {
      await this.clickElement(this.rememberMeCheckbox);
    }
    
    await this.clickElement(this.loginButton);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.waitForElement(this.errorMessage, 5000);
    return await this.getTextContent(this.errorMessage);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
  }

  /**
   * Click register link
   */
  async clickRegister(): Promise<void> {
    await this.clickElement(this.registerLink);
  }

  /**
   * Verify login page is displayed
   */
  async verifyLoginPageDisplayed(): Promise<void> {
    await this.verifyElementVisible(this.usernameInput);
    await this.verifyElementVisible(this.passwordInput);
    await this.verifyElementVisible(this.loginButton);
  }

  /**
   * Clear login form
   */
  async clearLoginForm(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Check if login button is enabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }

  /**
   * Get page title text
   */
  async getPageTitle(): Promise<string> {
    return await this.getTextContent(this.pageTitle);
  }

  /**
   * Verify specific error message
   */
  async verifyErrorMessage(expectedMessage: string): Promise<void> {
    await this.verifyElementText(this.errorMessage, expectedMessage);
  }
}
