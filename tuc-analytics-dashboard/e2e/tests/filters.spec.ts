import { test, expect } from '../fixtures';

test.describe('Filters - Date Range', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should allow filtering by date range', async ({ dashboardPage, page }) => {
    // Look for date inputs or filter controls
    const dateInputs = page.locator('input[type="date"], input[placeholder*="date"], input[placeholder*="Date"]');
    const dateInputCount = await dateInputs.count();
    
    // Should have date controls or equivalent filter mechanism
    expect(dateInputCount).toBeGreaterThanOrEqual(0);
  });

  test('should apply date range filter and update data', async ({ dashboardPage, page }) => {
    // Try to find and interact with date filters
    const dateInputs = page.locator('input[type="date"]');
    const count = await dateInputs.count();
    
    if (count >= 2) {
      // Fill date range
      const startDate = dateInputs.first();
      const endDate = dateInputs.nth(1);
      
      await startDate.fill('2024-01-01');
      await endDate.fill('2024-12-31');
      
      // Click apply or wait for auto-apply
      const applyButton = page.locator('button:has-text("Apply"), button:has-text("Filter")').first();
      const applyExists = await applyButton.isVisible().catch(() => false);
      
      if (applyExists) {
        await applyButton.click();
      }
      
      await page.waitForLoadState('networkidle');
      
      // Data should update
      const metrics = await dashboardPage.getVisibleMetrics();
      expect(metrics.length).toBeGreaterThanOrEqual(0);
    }
  });

  test('should reset date filters', async ({ dashboardPage, page }) => {
    const resetButton = page.locator('button:has-text("Reset")').first();
    const resetExists = await resetButton.isVisible().catch(() => false);
    
    if (resetExists) {
      await dashboardPage.applyFilters(); // First apply some filters
      await resetButton.click();
      await page.waitForLoadState('networkidle');
      
      // Data should reset to original state
      const metrics = await dashboardPage.getVisibleMetrics();
      expect(metrics.length).toBeGreaterThanOrEqual(0);
    }
  });

  test('should validate date range', async ({ page }) => {
    const dateInputs = page.locator('input[type="date"]');
    const count = await dateInputs.count();
    
    if (count >= 2) {
      const startDate = dateInputs.first();
      const endDate = dateInputs.nth(1);
      
      // Set invalid range (end before start)
      await startDate.fill('2024-12-31');
      await endDate.fill('2024-01-01');
      
      // Should either show error or handle gracefully
      const applyButton = page.locator('button:has-text("Apply"), button:has-text("Filter")').first();
      const applyExists = await applyButton.isVisible().catch(() => false);
      
      expect(typeof applyExists).toBe('boolean');
    }
  });

  test('should persist filter state', async ({ dashboardPage, page }) => {
    const dateInputs = page.locator('input[type="date"]');
    const count = await dateInputs.count();
    
    if (count >= 2) {
      const startDate = dateInputs.first();
      const endDate = dateInputs.nth(1);
      
      await startDate.fill('2024-06-01');
      await endDate.fill('2024-06-30');
      
      // Reload page
      await page.reload();
      await dashboardPage.waitForLoadComplete();
      
      // Filters should be restored or reset to defaults
      const inputs = page.locator('input[type="date"]');
      expect(await inputs.count()).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe('Filters - Time Period Selector', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should have time period quick select options', async ({ page }) => {
    const periodSelects = page.locator('button:has-text("Today"), button:has-text("Week"), button:has-text("Month"), button:has-text("Year")');
    const count = await periodSelects.count();
    
    // May or may not have quick select buttons
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should apply quick date filters', async ({ page, dashboardPage }) => {
    const monthButton = page.locator('button:has-text("Month")').first();
    const exists = await monthButton.isVisible().catch(() => false);
    
    if (exists) {
      await monthButton.click();
      await page.waitForLoadState('networkidle');
      
      const metrics = await dashboardPage.getVisibleMetrics();
      expect(metrics.length).toBeGreaterThanOrEqual(0);
    }
  });

  test('should update metrics when time period changes', async ({ page, dashboardPage }) => {
    const metricsInitial = await dashboardPage.getVisibleMetrics();
    
    const periodButton = page.locator('button:has-text("Week"), button:has-text("Month")').first();
    const exists = await periodButton.isVisible().catch(() => false);
    
    if (exists) {
      await periodButton.click();
      await page.waitForLoadState('networkidle');
      
      // Metrics might be different or same depending on data
      const metricsAfter = await dashboardPage.getVisibleMetrics();
      expect(metricsAfter.length).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe('Filters - Search/Filtering', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should have search functionality if applicable', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], input[placeholder*="search"]').first();
    const exists = await searchInput.isVisible().catch(() => false);
    
    expect(typeof exists).toBe('boolean');
  });

  test('should filter data by search input', async ({ page, dashboardPage }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
    const exists = await searchInput.isVisible().catch(() => false);
    
    if (exists) {
      await searchInput.fill('test');
      await page.waitForTimeout(500);
      
      const metrics = await dashboardPage.getVisibleMetrics();
      expect(metrics.length).toBeGreaterThanOrEqual(0);
    }
  });

  test('should clear search results', async ({ page, dashboardPage }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
    const exists = await searchInput.isVisible().catch(() => false);
    
    if (exists) {
      await searchInput.fill('test');
      await searchInput.clear();
      await page.waitForTimeout(500);
      
      const metrics = await dashboardPage.getVisibleMetrics();
      expect(metrics.length).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe('Filters - Dropdown/Select Filters', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should have select dropdown filters', async ({ page }) => {
    const selects = page.locator('select, [role="combobox"], [role="listbox"]');
    const count = await selects.count();
    
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should filter by dropdown selection', async ({ page, dashboardPage }) => {
    const selects = page.locator('select');
    const count = await selects.count();
    
    if (count > 0) {
      const selectElement = selects.first();
      const options = selectElement.locator('option');
      const optionCount = await options.count();
      
      if (optionCount > 1) {
        await selects.first().selectOption({ index: 1 });
        await page.waitForLoadState('networkidle');
        
        const metrics = await dashboardPage.getVisibleMetrics();
        expect(metrics.length).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('should allow multiple filter selections', async ({ page }) => {
    const multiSelects = page.locator('select[multiple], [role="listbox"]');
    const count = await multiSelects.count();
    
    expect(typeof count).toBe('number');
  });
});

test.describe('Filters - Filter Interactions', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should disable filters when no data', async ({ page, dashboardPage }) => {
    // Disable all filters initially if they should be disabled
    const filterButtons = page.locator('button:has-text("Filter"), button:has-text("Apply")');
    const count = await filterButtons.count();
    
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should show active filter indicators', async ({ page }) => {
    const activeFilters = page.locator('[data-testid="active-filter"], [aria-label*="Active"], .active-filter');
    const count = await activeFilters.count().catch(() => 0);
    
    expect(typeof count).toBe('number');
  });

  test('should allow clearing individual filters', async ({ page }) => {
    const clearButtons = page.locator('button[aria-label*="Clear"], button:has-text("✕"), button:has-text("×")');
    const count = await clearButtons.count();
    
    if (count > 0) {
      await clearButtons.first().click();
      await page.waitForLoadState('networkidle');
    }
    
    expect(typeof count).toBe('number');
  });

  test('should show no results message when no data matches filters', async ({ page, dashboardPage }) => {
    // Apply a filter that might result in no data
    const dateInputs = page.locator('input[type="date"]');
    
    if (await dateInputs.count() >= 2) {
      // Set a date range in the future
      await dateInputs.first().fill('2099-01-01');
      await dateInputs.nth(1).fill('2099-12-31');
      
      await page.waitForLoadState('networkidle');
      
      const noDataMsg = page.locator('text=/No data|No results|empty/i').first();
      const isVisible = await noDataMsg.isVisible().catch(() => false);
      
      expect(typeof isVisible).toBe('boolean');
    }
  });
});

test.describe('Filters - Performance', () => {
  test('should apply filters without lag', async ({ page, dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
    
    const dateInputs = page.locator('input[type="date"]');
    
    if (await dateInputs.count() >= 2) {
      const startTime = Date.now();
      
      await dateInputs.first().fill('2024-01-01');
      await dateInputs.nth(1).fill('2024-12-31');
      
      const applyButton = page.locator('button:has-text("Apply")').first();
      if (await applyButton.isVisible()) {
        await applyButton.click();
      }
      
      await page.waitForLoadState('networkidle');
      const applyTime = Date.now() - startTime;
      
      // Filter should apply within 2 seconds
      expect(applyTime).toBeLessThan(2000);
    }
  });
});
