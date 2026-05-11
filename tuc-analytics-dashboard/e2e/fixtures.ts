import { test as base, expect, Page } from '@playwright/test';

/**
 * Selectors used throughout the dashboard
 */
export const SELECTORS = {
  // Dashboard main elements
  dashboard: '[data-testid="enhanced-dashboard"]',
  header: 'header',
  footer: 'footer',
  
  // Tab elements
  tabsList: '[role="tablist"]',
  tab: (name: string) => `button[role="tab"]:has-text("${name}")`,
  tabContent: (name: string) => `[role="tabpanel"]:has-text("${name}")`,
  
  // Filter elements
  timeRangeSelect: '[data-testid="time-range-select"]',
  datePickerInput: 'input[type="date"]',
  filterButton: 'button:has-text("Filter")',
  resetButton: 'button:has-text("Reset")',
  
  // Chart elements
  chart: '[role="img"]',
  chartTitle: 'h2',
  chartLegend: '[role="legend"]',
  chartCanvas: 'canvas',
  
  // Data elements
  dataCard: '[data-testid="data-card"]',
  metric: '[data-testid="metric"]',
  metricValue: '[data-testid="metric-value"]',
  metricLabel: '[data-testid="metric-label"]',
  
  // Export elements
  exportButton: 'button:has-text("Export")',
  csvButton: 'button:has-text("CSV")',
  pdfButton: 'button:has-text("PDF")',
  downloadLink: 'a[download]',
  
  // Navigation
  navLink: 'a[role="navigation"]',
  backButton: 'button:has-text("Back")',
  
  // Loading states
  loadingIndicator: '[data-testid="loading"]',
  spinner: '.spinner',
  skeletonLoader: '[data-testid="skeleton"]',
  
  // Messages
  errorMessage: '[role="alert"]',
  successMessage: '[data-testid="success-message"]',
  noDataMessage: 'text=No data available',
  
  // Forms
  input: 'input[type="text"]',
  select: 'select',
  checkbox: 'input[type="checkbox"]',
  radio: 'input[type="radio"]',
  submitButton: 'button[type="submit"]',
};

/**
 * Test data for dashboard
 */
export const TEST_DATA = {
  funnelData: {
    timeSeriesData: [
      { month: '2024-01', signups: 150, applicants: 100, accepted: 50, registered: 25 },
      { month: '2024-02', signups: 180, applicants: 120, accepted: 60, registered: 30 },
      { month: '2024-03', signups: 200, applicants: 140, accepted: 70, registered: 35 },
    ],
    totalMetrics: {
      totalSignups: 530,
      totalApplicants: 360,
      totalAccepted: 180,
      totalRegistered: 90,
      acceptedNotRegistered: 90,
      signupsNeverApplied: 170,
      overallConversionRate: 16.98,
    },
    conversionRates: {
      signupToApplication: 67.92,
      applicationToAcceptance: 50.0,
      acceptanceToRegistration: 50.0,
    },
    funnelBreakdown: {
      registered: 90,
      acceptedNotRegistered: 90,
      rejected: 180,
      waitlisted: 0,
    },
  },
};

/**
 * Common dashboard operations
 */
export class DashboardPage {
  constructor(public page: Page) {}

  /**
   * Navigate to dashboard
   */
  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoadComplete() {
    const loadingIndicator = this.page.locator(SELECTORS.loadingIndicator).first();
    if (await loadingIndicator.isVisible()) {
      await loadingIndicator.waitFor({ state: 'hidden' });
    }
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get dashboard container
   */
  async getDashboard() {
    return this.page.locator('[role="main"]').first();
  }

  /**
   * Check if dashboard is visible
   */
  async isVisible() {
    const dashboard = await this.getDashboard();
    return dashboard.isVisible();
  }

  /**
   * Navigate to specific tab
   */
  async navigateToTab(tabName: string) {
    const tab = this.page.locator(`button[role="tab"]:has-text("${tabName}")`);
    await expect(tab).toBeVisible();
    await tab.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get currently active tab
   */
  async getActiveTab() {
    const activeTab = this.page.locator('button[role="tab"][data-state="active"]');
    return activeTab.getAttribute('aria-label');
  }

  /**
   * Get all visible tabs
   */
  async getAllTabs() {
    const tabs = await this.page.locator('button[role="tab"]');
    const count = await tabs.count();
    const tabNames = [];
    for (let i = 0; i < count; i++) {
      const label = await tabs.nth(i).getAttribute('aria-label');
      tabNames.push(label);
    }
    return tabNames;
  }

  /**
   * Get metric value by label
   */
  async getMetricValue(label: string) {
    const metric = this.page.locator(`[data-testid="metric"]:has-text("${label}")`);
    const value = await metric.locator('[data-testid="metric-value"]').textContent();
    return value?.trim();
  }

  /**
   * Get all visible metrics
   */
  async getVisibleMetrics() {
    const metrics = await this.page.locator('[data-testid="metric"]');
    const count = await metrics.count();
    const metricData = [];
    
    for (let i = 0; i < count; i++) {
      const label = await metrics.nth(i).locator('[data-testid="metric-label"]').textContent();
      const value = await metrics.nth(i).locator('[data-testid="metric-value"]').textContent();
      metricData.push({ label: label?.trim(), value: value?.trim() });
    }
    
    return metricData;
  }

  /**
   * Verify chart is rendered
   */
  async verifyChartRendered(chartName: string) {
    const chart = this.page.locator(`[data-testid="chart-${chartName}"]`).first();
    await expect(chart).toBeVisible();
    return chart.isVisible();
  }

  /**
   * Get chart data points (for interaction testing)
   */
  async getChartDataPoints(chartName: string) {
    const canvas = this.page.locator(`[data-testid="chart-${chartName}"] canvas`).first();
    return canvas.isVisible();
  }

  /**
   * Hover over chart element
   */
  async hoverOverChart(chartName: string, x: number = 50, y: number = 50) {
    const chart = this.page.locator(`[data-testid="chart-${chartName}"]`).first();
    const box = await chart.boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + x, box.y + y);
      await this.page.waitForTimeout(500); // Wait for hover effects
    }
  }

  /**
   * Set time range filter
   */
  async setTimeRange(startDate: string, endDate: string) {
    const startInput = this.page.locator('input[data-testid="date-start"]');
    const endInput = this.page.locator('input[data-testid="date-end"]');
    
    await startInput.fill(startDate);
    await endInput.fill(endDate);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Apply filters
   */
  async applyFilters() {
    const filterButton = this.page.locator('button:has-text("Apply"):first()');
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Reset filters
   */
  async resetFilters() {
    const resetButton = this.page.locator('button:has-text("Reset"):first()');
    if (await resetButton.isVisible()) {
      await resetButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Trigger export
   */
  async exportAs(format: 'csv' | 'pdf' | 'json') {
    const exportButton = this.page.locator('button:has-text("Export")');
    await exportButton.click();
    
    const formatButton = this.page.locator(`button:has-text("${format.toUpperCase()}")`);
    
    // Handle file download
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      formatButton.click(),
    ]);
    
    return download;
  }

  /**
   * Verify no data message
   */
  async verifyNoDataMessage() {
    const noDataMsg = this.page.locator('text=/No data|empty/i');
    return noDataMsg.isVisible();
  }

  /**
   * Verify error message
   */
  async verifyErrorMessage(errorText?: string) {
    const errorMsg = this.page.locator('[role="alert"]').first();
    if (errorText) {
      return errorMsg.textContent().then(text => text?.includes(errorText));
    }
    return errorMsg.isVisible();
  }

  /**
   * Get all visible error messages
   */
  async getErrorMessages() {
    const errors = this.page.locator('[role="alert"]');
    const count = await errors.count();
    const messages = [];
    
    for (let i = 0; i < count; i++) {
      const text = await errors.nth(i).textContent();
      messages.push(text?.trim());
    }
    
    return messages;
  }

  /**
   * Scroll to element
   */
  async scrollToElement(selector: string) {
    const element = this.page.locator(selector).first();
    await element.scrollIntoViewIfNeeded();
  }

  /**
   * Verify responsive design
   */
  async verifyResponsive() {
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 768, height: 1024 },  // Tablet
      { width: 375, height: 667 },   // Mobile
    ];

    const results = [];
    for (const viewport of viewports) {
      await this.page.setViewportSize(viewport);
      const dashboard = await this.getDashboard();
      results.push({
        viewport,
        visible: await dashboard.isVisible(),
      });
    }
    return results;
  }

  /**
   * Check accessibility - get all headings
   */
  async getHeadings() {
    const headings = this.page.locator('h1, h2, h3, h4, h5, h6');
    const count = await headings.count();
    const headingTexts = [];
    
    for (let i = 0; i < count; i++) {
      const text = await headings.nth(i).textContent();
      const level = await headings.nth(i).evaluate(el => el.tagName);
      headingTexts.push({ level, text: text?.trim() });
    }
    
    return headingTexts;
  }

  /**
   * Check keyboard navigation
   */
  async checkKeyboardNavigation() {
    const focusable = this.page.locator('button, a, input, select, textarea, [tabindex]');
    const count = await focusable.count();
    return count > 0;
  }

  /**
   * Get page title
   */
  async getPageTitle() {
    return this.page.title();
  }

  /**
   * Check for console errors
   */
  async getConsoleMessages() {
    const messages: string[] = [];
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        messages.push(msg.text());
      }
    });
    return messages;
  }
}

/**
 * Custom fixture extending base test
 */
export const test = base.extend<{ dashboardPage: DashboardPage }>({
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
});

export { expect };
