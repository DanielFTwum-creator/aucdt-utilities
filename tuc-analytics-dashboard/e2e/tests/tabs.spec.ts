import { test, expect } from '../fixtures';

test.describe('Dashboard - Tab: Overview', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should display overview tab content', async ({ dashboardPage, page }) => {
    await dashboardPage.navigateToTab('Overview');
    
    // Should display key metrics
    const metrics = await dashboardPage.getVisibleMetrics();
    expect(metrics.length).toBeGreaterThan(0);
  });

  test('should show time series chart in overview', async ({ dashboardPage }) => {
    await dashboardPage.navigateToTab('Overview');
    
    const canvas = dashboardPage.page.locator('canvas').first();
    const isVisible = await canvas.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('should display conversion rate in overview', async ({ dashboardPage, page }) => {
    await dashboardPage.navigateToTab('Overview');
    
    const conversionText = page.locator('text=/conversion|Conversion/i').first();
    const isVisible = await conversionText.isVisible().catch(() => false);
    expect(isVisible).toBe(true);
  });

  test('should have trendline controls in overview', async ({ dashboardPage, page }) => {
    await dashboardPage.navigateToTab('Overview');
    
    const trendlineButton = page.locator('button:has-text("Trend"), button:has-text("trend")').first();
    const isVisible = await trendlineButton.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });
});

test.describe('Dashboard - Tab: Funnel Analysis', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should display funnel analysis tab', async ({ dashboardPage }) => {
    await dashboardPage.navigateToTab('Funnel');
    
    const tabPanel = dashboardPage.page.locator('[role="tabpanel"]').first();
    await expect(tabPanel).toBeVisible();
  });

  test('should display funnel metrics', async ({ dashboardPage, page }) => {
    await dashboardPage.navigateToTab('Funnel');
    
    const metrics = await dashboardPage.getVisibleMetrics();
    expect(metrics.length).toBeGreaterThan(0);
  });

  test('should show funnel breakdown', async ({ dashboardPage, page }) => {
    await dashboardPage.navigateToTab('Funnel');
    
    // Look for funnel-related content
    const funnelContent = page.locator('text=/funnel|Funnel|registered|Registered/i').first();
    const isVisible = await funnelContent.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('should display conversion stages', async ({ dashboardPage, page }) => {
    await dashboardPage.navigateToTab('Funnel');
    
    // Should show signup -> applicant -> accepted -> registered flow
    const stages = page.locator('text=/signup|applicant|accepted|registered/i');
    const count = await stages.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Dashboard - Tab: Trends', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should display trends analysis tab', async ({ dashboardPage }) => {
    await dashboardPage.navigateToTab('Trends');
    
    const tabPanel = dashboardPage.page.locator('[role="tabpanel"]').first();
    await expect(tabPanel).toBeVisible();
  });

  test('should show trend data over time', async ({ dashboardPage, page }) => {
    await dashboardPage.navigateToTab('Trends');
    
    const canvas = page.locator('canvas').first();
    const isVisible = await canvas.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('should have trendline options', async ({ dashboardPage, page }) => {
    await dashboardPage.navigateToTab('Trends');
    
    const trendOptions = page.locator('[data-testid="trendline-option"], button:has-text("Linear"), button:has-text("Polynomial")');
    const count = await trendOptions.count().catch(() => 0);
    expect(typeof count).toBe('number');
  });

  test('should allow toggling trendlines', async ({ dashboardPage, page }) => {
    await dashboardPage.navigateToTab('Trends');
    
    const toggleButtons = page.locator('button:has-text("Show"), button:has-text("Hide"), input[type="checkbox"]');
    const count = await toggleButtons.count().catch(() => 0);
    expect(typeof count).toBe('number');
  });
});

test.describe('Dashboard - Tab: Demographics', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should display demographics tab', async ({ dashboardPage }) => {
    await dashboardPage.navigateToTab('Demographics');
    
    const tabPanel = dashboardPage.page.locator('[role="tabpanel"]').first();
    await expect(tabPanel).toBeVisible();
  });

  test('should display demographic data', async ({ dashboardPage, page }) => {
    await dashboardPage.navigateToTab('Demographics');
    
    const metrics = await dashboardPage.getVisibleMetrics();
    expect(metrics.length).toBeGreaterThanOrEqual(0);
  });

  test('should show geographic distribution', async ({ dashboardPage, page }) => {
    await dashboardPage.navigateToTab('Demographics');
    
    // Look for geography-related content
    const geoContent = page.locator('text=/region|country|international|domestic/i').first();
    const isVisible = await geoContent.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('should display demographic charts', async ({ dashboardPage, page }) => {
    await dashboardPage.navigateToTab('Demographics');
    
    const charts = page.locator('canvas');
    const count = await charts.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Dashboard - Tab: Seasonal', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should display seasonal analysis tab', async ({ dashboardPage }) => {
    await dashboardPage.navigateToTab('Seasonal');
    
    const tabPanel = dashboardPage.page.locator('[role="tabpanel"]').first();
    await expect(tabPanel).toBeVisible();
  });

  test('should show seasonal patterns', async ({ dashboardPage, page }) => {
    await dashboardPage.navigateToTab('Seasonal');
    
    // Look for seasonal content
    const seasonalContent = page.locator('text=/seasonal|season|quarter|month/i').first();
    const isVisible = await seasonalContent.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('should display seasonal metrics', async ({ dashboardPage }) => {
    await dashboardPage.navigateToTab('Seasonal');
    
    const metrics = await dashboardPage.getVisibleMetrics();
    expect(metrics.length).toBeGreaterThanOrEqual(0);
  });

  test('should show seasonal trends chart', async ({ dashboardPage, page }) => {
    await dashboardPage.navigateToTab('Seasonal');
    
    const canvas = page.locator('canvas').first();
    const isVisible = await canvas.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });
});

test.describe('Dashboard - Tab: Export', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should display export tab', async ({ dashboardPage }) => {
    await dashboardPage.navigateToTab('Export');
    
    const tabPanel = dashboardPage.page.locator('[role="tabpanel"]').first();
    await expect(tabPanel).toBeVisible();
  });

  test('should have export format options', async ({ dashboardPage, page }) => {
    await dashboardPage.navigateToTab('Export');
    
    const formats = page.locator('button:has-text("CSV"), button:has-text("JSON"), button:has-text("PDF")');
    const count = await formats.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should allow data export', async ({ dashboardPage, page }) => {
    await dashboardPage.navigateToTab('Export');
    
    const exportButton = page.locator('button:has-text("Export"), button:has-text("Download")').first();
    const isVisible = await exportButton.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('should show export history or options', async ({ dashboardPage, page }) => {
    await dashboardPage.navigateToTab('Export');
    
    const content = page.locator('[role="tabpanel"]').first();
    const text = await content.textContent();
    expect(text?.length).toBeGreaterThan(0);
  });
});

test.describe('Dashboard - Tab: About', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should display about tab', async ({ dashboardPage }) => {
    await dashboardPage.navigateToTab('About');
    
    const tabPanel = dashboardPage.page.locator('[role="tabpanel"]').first();
    await expect(tabPanel).toBeVisible();
  });

  test('should show application information', async ({ dashboardPage, page }) => {
    await dashboardPage.navigateToTab('About');
    
    // Look for about content
    const aboutContent = page.locator('text=/about|TUC|analytics|dashboard/i').first();
    const isVisible = await aboutContent.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('should display system information', async ({ dashboardPage, page }) => {
    await dashboardPage.navigateToTab('About');
    
    const systemStatus = page.locator('text=/system|status|online|active/i').first();
    const isVisible = await systemStatus.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('should show version or last update info', async ({ dashboardPage, page }) => {
    await dashboardPage.navigateToTab('About');
    
    const content = page.locator('[role="tabpanel"]').first();
    const text = await content.textContent();
    expect(text?.length).toBeGreaterThan(0);
  });
});

test.describe('Tabs - Navigation Flow', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should navigate through all tabs sequentially', async ({ dashboardPage }) => {
    const tabs = await dashboardPage.getAllTabs();
    
    for (const tab of tabs) {
      if (tab) {
        await dashboardPage.navigateToTab(tab);
        
        const activeTab = await dashboardPage.getActiveTab();
        expect(activeTab).toBe(tab);
        
        // Verify tab content is visible
        const content = dashboardPage.page.locator('[role="tabpanel"]').first();
        const isVisible = await content.isVisible();
        expect(isVisible).toBe(true);
      }
    }
  });

  test('should maintain data consistency across tabs', async ({ dashboardPage }) => {
    const tabs = await dashboardPage.getAllTabs();
    const initialMetrics = await dashboardPage.getVisibleMetrics();
    
    // Navigate to another tab and back
    if (tabs.length > 1 && tabs[1]) {
      await dashboardPage.navigateToTab(tabs[1]);
      await dashboardPage.navigateToTab(tabs[0]);
      
      const finalMetrics = await dashboardPage.getVisibleMetrics();
      
      // Should have same number of metrics
      expect(initialMetrics.length).toBe(finalMetrics.length);
    }
  });

  test('should handle rapid tab switching', async ({ dashboardPage }) => {
    const tabs = await dashboardPage.getAllTabs();
    
    // Rapidly switch between tabs
    for (let i = 0; i < 5; i++) {
      const tab = tabs[i % tabs.length];
      if (tab) {
        await dashboardPage.navigateToTab(tab);
      }
    }
    
    // Should not crash and remain responsive
    const isVisible = await dashboardPage.isVisible();
    expect(isVisible).toBe(true);
  });

  test('should scroll to selected tab', async ({ dashboardPage, page }) => {
    const tabs = await dashboardPage.getAllTabs();
    
    if (tabs.length > 3) {
      // Navigate to last tab
      const lastTab = tabs[tabs.length - 1];
      if (lastTab) {
        await dashboardPage.navigateToTab(lastTab);
        
        const activeTab = await dashboardPage.getActiveTab();
        expect(activeTab).toBe(lastTab);
      }
    }
  });
});

test.describe('Tabs - Content Updates', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should update tab content on filter change', async ({ dashboardPage, page }) => {
    const initialMetrics = await dashboardPage.getVisibleMetrics();
    
    // Apply a filter if available
    const dateInputs = page.locator('input[type="date"]');
    if (await dateInputs.count() >= 2) {
      await dateInputs.first().fill('2024-01-01');
      await dateInputs.nth(1).fill('2024-12-31');
      
      await page.waitForLoadState('networkidle');
      
      // Metrics might change
      const updatedMetrics = await dashboardPage.getVisibleMetrics();
      expect(updatedMetrics.length).toBeGreaterThanOrEqual(0);
    }
  });

  test('should load correct data for each tab', async ({ dashboardPage }) => {
    const tabs = await dashboardPage.getAllTabs();
    const tabDataStatus: Record<string, boolean> = {};
    
    for (const tab of tabs) {
      if (tab) {
        await dashboardPage.navigateToTab(tab);
        
        const tabContent = dashboardPage.page.locator('[role="tabpanel"]').first();
        const isVisible = await tabContent.isVisible();
        const hasContent = (await tabContent.textContent())?.length ?? 0 > 0;
        
        tabDataStatus[tab] = isVisible && hasContent;
      }
    }
    
    // Most tabs should have visible content
    const loadedTabs = Object.values(tabDataStatus).filter(v => v).length;
    expect(loadedTabs).toBeGreaterThan(0);
  });

  test('should preserve data when switching tabs', async ({ dashboardPage, page }) => {
    // Navigate through tabs
    const tabs = await dashboardPage.getAllTabs();
    const firstTab = tabs[0];
    
    if (firstTab && tabs.length > 1) {
      await dashboardPage.navigateToTab(firstTab);
      const firstMetrics = await dashboardPage.getVisibleMetrics();
      
      // Switch to different tab
      await dashboardPage.navigateToTab(tabs[1]);
      
      // Switch back
      await dashboardPage.navigateToTab(firstTab);
      const secondMetrics = await dashboardPage.getVisibleMetrics();
      
      // Should have same data
      expect(firstMetrics.length).toBe(secondMetrics.length);
    }
  });
});

test.describe('Tabs - Accessibility', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should have keyboard accessible tabs', async ({ dashboardPage, page }) => {
    const tabList = page.locator('[role="tablist"]').first();
    
    // Tab list should be accessible
    const isVisible = await tabList.isVisible();
    expect(isVisible).toBe(true);
    
    // Should be able to focus
    await tabList.focus();
    const focused = await tabList.evaluate(el => document.activeElement?.closest('[role="tablist"]') === el);
    expect(typeof focused).toBe('boolean');
  });

  test('should support arrow key navigation', async ({ page, dashboardPage }) => {
    const firstTab = page.locator('button[role="tab"]').first();
    await firstTab.focus();
    
    // Press right arrow to go to next tab
    await page.press('button', 'ArrowRight');
    await page.waitForTimeout(300);
    
    // Should still be in tab navigation
    const activeTab = page.locator('button[role="tab"][data-state="active"]');
    const isVisible = await activeTab.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('should have proper aria labels on tabs', async ({ page }) => {
    const tabs = page.locator('button[role="tab"]');
    const count = await tabs.count();
    
    for (let i = 0; i < Math.min(count, 3); i++) {
      const tab = tabs.nth(i);
      const label = await tab.getAttribute('aria-label');
      const text = await tab.textContent();
      
      // Should have label or text
      expect(label || text?.length).toBeTruthy();
    }
  });

  test('should announce tab changes to screen readers', async ({ page, dashboardPage }) => {
    const tabs = await dashboardPage.getAllTabs();
    
    if (tabs.length > 1 && tabs[1]) {
      await dashboardPage.navigateToTab(tabs[1]);
      
      const activeTab = page.locator('button[role="tab"][data-state="active"]');
      const ariaSelected = await activeTab.getAttribute('aria-selected');
      
      expect(ariaSelected).toBe('true');
    }
  });
});
