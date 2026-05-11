import { Page, Locator } from '@playwright/test';
import { BasePage } from '../utils/BasePage';

/**
 * Dashboard Page Object Model
 * Represents the main dashboard after successful login
 */
export class DashboardPage extends BasePage {
  // Locators
  readonly welcomeMessage: Locator;
  readonly userProfile: Locator;
  readonly logoutButton: Locator;
  readonly navigationMenu: Locator;
  readonly applicationLink: Locator;
  readonly profileLink: Locator;
  readonly notificationsIcon: Locator;
  readonly dashboardTitle: Locator;
  readonly applicationStatus: Locator;
  readonly newApplicationButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators - adjust these selectors based on actual page structure
    this.welcomeMessage = page.locator('.welcome, .greeting, h1:has-text("Welcome")').first();
    this.userProfile = page.locator('.user-profile, .profile-info, .user-menu').first();
    this.logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout"), a:has-text("Sign Out")').first();
    this.navigationMenu = page.locator('nav, .navbar, .menu, .navigation').first();
    this.applicationLink = page.locator('a:has-text("Application"), a:has-text("My Application")').first();
    this.profileLink = page.locator('a:has-text("Profile"), a:has-text("My Profile")').first();
    this.notificationsIcon = page.locator('.notifications, .notification-icon, [aria-label*="notification" i]').first();
    this.dashboardTitle = page.locator('h1, h2, .dashboard-title, .page-title').first();
    this.applicationStatus = page.locator('.status, .application-status').first();
    this.newApplicationButton = page.locator('button:has-text("New Application"), a:has-text("Start Application")').first();
  }

  /**
   * Verify user is on dashboard
   */
  async verifyDashboardLoaded(): Promise<void> {
    await this.waitForElement(this.dashboardTitle, 10000);
    await this.verifyElementVisible(this.navigationMenu);
  }

  /**
   * Get welcome message
   */
  async getWelcomeMessage(): Promise<string> {
    return await this.getTextContent(this.welcomeMessage);
  }

  /**
   * Navigate to application page
   */
  async goToApplication(): Promise<void> {
    await this.clickElement(this.applicationLink);
    await this.waitForNavigation();
  }

  /**
   * Navigate to profile page
   */
  async goToProfile(): Promise<void> {
    await this.clickElement(this.profileLink);
    await this.waitForNavigation();
  }

  /**
   * Logout from application
   */
  async logout(): Promise<void> {
    await this.clickElement(this.logoutButton);
    await this.waitForNavigation();
  }

  /**
   * Get application status
   */
  async getApplicationStatus(): Promise<string> {
    if (await this.isVisible(this.applicationStatus)) {
      return await this.getTextContent(this.applicationStatus);
    }
    return 'No application found';
  }

  /**
   * Start new application
   */
  async startNewApplication(): Promise<void> {
    if (await this.isVisible(this.newApplicationButton)) {
      await this.clickElement(this.newApplicationButton);
      await this.waitForNavigation();
    }
  }

  /**
   * Check if notifications are present
   */
  async hasNotifications(): Promise<boolean> {
    if (await this.isVisible(this.notificationsIcon)) {
      const badgeCount = await this.page.locator('.notification-badge, .badge').count();
      return badgeCount > 0;
    }
    return false;
  }

  /**
   * Verify dashboard title
   */
  async verifyDashboardTitle(expectedTitle: string): Promise<void> {
    await this.verifyElementText(this.dashboardTitle, expectedTitle);
  }
}
