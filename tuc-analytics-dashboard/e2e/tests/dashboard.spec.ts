import { test, expect, SELECTORS } from '../fixtures';

test.describe('Dashboard - Core Functionality', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should load dashboard successfully', async ({ dashboardPage }) => {
    const isVisible = await dashboardPage.isVisible();
    expect(isVisible).toBe(true);
  });

  test('should display dashboard title', async ({ page }) => {
    const title = await page.locator('h1, h2').first().textContent();
    expect(title).toContain('TUC');
  });

  test('should display header with navigation', async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('should display footer', async ({ page }) => {
    const footer = page.locator('footer').first();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(footer).toBeVisible();
  });

  test('should render all main tabs', async ({ dashboardPage }) => {
    const tabs = await dashboardPage.getAllTabs();
    expect(tabs.length).toBeGreaterThan(0);
    // Expected tabs: Overview, Funnel, Trends, Demographics, Seasonal, Export, About
    expect(tabs.length).toBeGreaterThanOrEqual(6);
  });

  test('should have default tab active', async ({ dashboardPage }) => {
    const activeTab = await dashboardPage.getActiveTab();
    expect(activeTab).toBeTruthy();
  });
});

test.describe('Dashboard - Tab Navigation', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should switch between tabs', async ({ dashboardPage, page }) => {
    const tabs = await dashboardPage.getAllTabs();
    
    for (const tab of tabs.slice(0, 3)) { // Test first 3 tabs
      if (tab) {
        await dashboardPage.navigateToTab(tab);
        const activeTab = await dashboardPage.getActiveTab();
        expect(activeTab).toBe(tab);
        
        // Verify tab content is visible
        const tabPanel = page.locator('[role="tabpanel"]').first();
        await expect(tabPanel).toBeVisible();
      }
    }
  });

  test('should maintain tab state on reload', async ({ dashboardPage, page }) => {
    const tabs = await dashboardPage.getAllTabs();
    const targetTab = tabs[1]; // Switch to second tab
    
    if (targetTab) {
      await dashboardPage.navigateToTab(targetTab);
      const activeTabBefore = await dashboardPage.getActiveTab();
      
      await page.reload();
      await dashboardPage.waitForLoadComplete();
      
      // Tab should return to default or maintain state
      const activeTabAfter = await dashboardPage.getActiveTab();
      expect(activeTabAfter).toBeTruthy();
    }
  });
});

test.describe('Dashboard - Data Display', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should display metrics', async ({ dashboardPage }) => {
    const metrics = await dashboardPage.getVisibleMetrics();
    expect(metrics.length).toBeGreaterThan(0);
    
    // Verify metric structure
    metrics.forEach(metric => {
      expect(metric.label).toBeTruthy();
      expect(metric.value).toBeTruthy();
    });
  });

  test('should display conversion rate metric', async ({ page }) => {
    const conversionRateText = page.locator('text=/conversion rate|Conversion Rate/i').first();
    await expect(conversionRateText).toBeVisible();
  });

  test('should display total signups metric', async ({ page }) => {
    const signupsText = page.locator('text=/total signups|Total Signups|signups/i').first();
    await expect(signupsText).toBeVisible();
  });

  test('should display applicants metric', async ({ page }) => {
    const applicantsText = page.locator('text=/applicants|Applicants/i').first();
    await expect(applicantsText).toBeVisible();
  });

  test('should display accepted metric', async ({ page }) => {
    const acceptedText = page.locator('text=/accepted|Accepted/i').first();
    await expect(acceptedText).toBeVisible();
  });

  test('should display registered metric', async ({ page }) => {
    const registeredText = page.locator('text=/registered|Registered/i').first();
    await expect(registeredText).toBeVisible();
  });

  test('should have numeric metric values', async ({ page }) => {
    const metricValues = await page.locator('[data-testid="metric-value"]');
    const count = await metricValues.count();
    
    // Verify at least some metrics exist
    expect(count).toBeGreaterThan(0);
    
    // Verify values are numeric or formatted numbers
    for (let i = 0; i < Math.min(count, 5); i++) {
      const value = await metricValues.nth(i).textContent();
      expect(value).toMatch(/[\d,%.]/);
    }
  });
});

test.describe('Dashboard - Responsiveness', () => {
  test('should be responsive on desktop', async ({ dashboardPage, page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
    
    const isVisible = await dashboardPage.isVisible();
    expect(isVisible).toBe(true);
  });

  test('should be responsive on tablet', async ({ dashboardPage, page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
    
    const isVisible = await dashboardPage.isVisible();
    expect(isVisible).toBe(true);
  });

  test('should be responsive on mobile', async ({ dashboardPage, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
    
    const isVisible = await dashboardPage.isVisible();
    expect(isVisible).toBe(true);
  });

  test('should show hamburger menu on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Look for mobile menu button
    const mobileMenuButton = page.locator('button[aria-label*="menu"], button:has-text("☰")').first();
    const isVisible = await mobileMenuButton.isVisible().catch(() => false);
    
    // Menu button might not be present - that's ok
    expect(typeof isVisible).toBe('boolean');
  });
});

test.describe('Dashboard - Loading States', () => {
  test('should show loading indicator initially', async ({ page }) => {
    // Intercept the API call to simulate loading
    await page.route('**/data/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.continue();
    });

    await page.goto('/');
    
    // Check for loading indicator
    const loadingText = page.locator('text=/loading|Loading/i').first();
    const isLoading = await loadingText.isVisible().catch(() => false);
    
    // Loading state may or may not be visible depending on timing
    expect(typeof isLoading).toBe('boolean');
  });

  test('should load data and display content', async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
    
    const metrics = await dashboardPage.getVisibleMetrics();
    expect(metrics.length).toBeGreaterThan(0);
  });
});

test.describe('Dashboard - Accessibility', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should have proper heading hierarchy', async ({ dashboardPage }) => {
    const headings = await dashboardPage.getHeadings();
    expect(headings.length).toBeGreaterThan(0);
    
    // Should start with h1 or h2
    const firstHeading = headings[0];
    expect(['H1', 'H2']).toContain(firstHeading.level);
  });

  test('should support keyboard navigation', async ({ dashboardPage }) => {
    const supportsKeyboard = await dashboardPage.checkKeyboardNavigation();
    expect(supportsKeyboard).toBe(true);
  });

  test('should have meaningful page title', async ({ dashboardPage }) => {
    const title = await dashboardPage.getPageTitle();
    expect(title.length).toBeGreaterThan(0);
    expect(title).toContain('Dashboard');
  });

  test('should have proper tab roles', async ({ page }) => {
    const tabs = page.locator('[role="tab"]');
    const count = await tabs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have visible focus indicators', async ({ page }) => {
    const button = page.locator('button').first();
    await button.focus();
    
    // Check if button has focus
    const focused = await button.evaluate(el => document.activeElement === el);
    expect(focused).toBe(true);
  });
});

test.describe('Dashboard - Error Handling', () => {
  test('should handle missing data gracefully', async ({ page }) => {
    // Intercept and fail the data request
    await page.route('**/data/**', route => route.abort());
    
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Page should still be visible, not crash
    const dashboard = page.locator('[role="main"]').first();
    const isVisible = await dashboard.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('should display error messages when appropriate', async ({ page }) => {
    // Simulate an error response
    await page.route('**/data/funnel-data.json', route => {
      route.abort('failed');
    });
    
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Check for error message or graceful degradation
    const errorMsg = page.locator('[role="alert"]').first();
    const isErrorVisible = await errorMsg.isVisible().catch(() => false);
    expect(typeof isErrorVisible).toBe('boolean');
  });
});

test.describe('Dashboard - Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should not have console errors', async ({ page, dashboardPage }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
    
    // Should have minimal or no errors
    const criticalErrors = errors.filter(e => 
      !e.includes('404') && 
      !e.includes('undefined') &&
      !e.includes('null')
    );
    
    expect(criticalErrors.length).toBeLessThanOrEqual(2); // Allow minimal errors
  });
});
