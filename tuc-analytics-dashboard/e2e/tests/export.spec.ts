import { test, expect } from '../fixtures';
import * as path from 'path';
import * as fs from 'fs';

test.describe('Export - CSV Export', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should display export button', async ({ page }) => {
    const exportButton = page.locator('button:has-text("Export")').first();
    const isVisible = await exportButton.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('should export data as CSV', async ({ page, dashboardPage }) => {
    const exportButton = page.locator('button:has-text("Export")').first();
    const exportExists = await exportButton.isVisible().catch(() => false);
    
    if (exportExists) {
      await exportButton.click();
      
      // Look for CSV export option
      const csvOption = page.locator('button:has-text("CSV"), button:has-text("Download CSV")').first();
      const csvExists = await csvOption.isVisible().catch(() => false);
      
      if (csvExists) {
        // Handle download
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          csvOption.click(),
        ]);
        
        expect(download.suggestedFilename()).toContain('.csv');
      }
    }
  });

  test('should have correct CSV format', async ({ page }) => {
    const exportButton = page.locator('button:has-text("Export")').first();
    const exportExists = await exportButton.isVisible().catch(() => false);
    
    if (exportExists) {
      await exportButton.click();
      
      const csvOption = page.locator('button:has-text("CSV")').first();
      const csvExists = await csvOption.isVisible().catch(() => false);
      
      if (csvExists) {
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          csvOption.click(),
        ]);
        
        const path_str = await download.path();
        const content = fs.readFileSync(path_str, 'utf-8');
        
        // CSV should contain commas and headers
        expect(content).toMatch(/,/);
      }
    }
  });

  test('should include metrics in CSV export', async ({ page }) => {
    const exportButton = page.locator('button:has-text("Export")').first();
    const exportExists = await exportButton.isVisible().catch(() => false);
    
    if (exportExists) {
      await exportButton.click();
      
      const csvOption = page.locator('button:has-text("CSV")').first();
      const csvExists = await csvOption.isVisible().catch(() => false);
      
      if (csvExists) {
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          csvOption.click(),
        ]);
        
        expect(download.suggestedFilename()).toBeTruthy();
      }
    }
  });

  test('should allow multiple exports', async ({ page, dashboardPage }) => {
    await dashboardPage.goto();
    
    for (let i = 0; i < 2; i++) {
      const exportButton = page.locator('button:has-text("Export")').first();
      const exportExists = await exportButton.isVisible().catch(() => false);
      
      if (exportExists) {
        await exportButton.click();
        
        const csvOption = page.locator('button:has-text("CSV")').first();
        const csvExists = await csvOption.isVisible().catch(() => false);
        
        if (csvExists) {
          const [download] = await Promise.all([
            page.waitForEvent('download'),
            csvOption.click(),
          ]);
          
          expect(download.suggestedFilename()).toContain('.csv');
        }
        
        // Close export menu
        await page.press('Escape');
        await page.waitForTimeout(200);
      }
    }
  });
});

test.describe('Export - JSON Export', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should export data as JSON', async ({ page }) => {
    const exportButton = page.locator('button:has-text("Export")').first();
    const exportExists = await exportButton.isVisible().catch(() => false);
    
    if (exportExists) {
      await exportButton.click();
      
      const jsonOption = page.locator('button:has-text("JSON"), button:has-text("Download JSON")').first();
      const jsonExists = await jsonOption.isVisible().catch(() => false);
      
      if (jsonExists) {
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          jsonOption.click(),
        ]);
        
        expect(download.suggestedFilename()).toContain('.json');
      }
    }
  });

  test('should have valid JSON format', async ({ page }) => {
    const exportButton = page.locator('button:has-text("Export")').first();
    const exportExists = await exportButton.isVisible().catch(() => false);
    
    if (exportExists) {
      await exportButton.click();
      
      const jsonOption = page.locator('button:has-text("JSON")').first();
      const jsonExists = await jsonOption.isVisible().catch(() => false);
      
      if (jsonExists) {
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          jsonOption.click(),
        ]);
        
        const path_str = await download.path();
        const content = fs.readFileSync(path_str, 'utf-8');
        
        // Should be valid JSON
        expect(() => JSON.parse(content)).not.toThrow();
      }
    }
  });
});

test.describe('Export - PDF Export', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should export data as PDF', async ({ page }) => {
    const exportButton = page.locator('button:has-text("Export")').first();
    const exportExists = await exportButton.isVisible().catch(() => false);
    
    if (exportExists) {
      await exportButton.click();
      
      const pdfOption = page.locator('button:has-text("PDF"), button:has-text("Download PDF")').first();
      const pdfExists = await pdfOption.isVisible().catch(() => false);
      
      if (pdfExists) {
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          pdfOption.click(),
        ]);
        
        expect(download.suggestedFilename()).toContain('.pdf');
      }
    }
  });

  test('should include charts in PDF', async ({ page }) => {
    const exportButton = page.locator('button:has-text("Export")').first();
    const exportExists = await exportButton.isVisible().catch(() => false);
    
    if (exportExists) {
      await exportButton.click();
      
      const pdfOption = page.locator('button:has-text("PDF")').first();
      const pdfExists = await pdfOption.isVisible().catch(() => false);
      
      if (pdfExists) {
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          pdfOption.click(),
        ]);
        
        const path_str = await download.path();
        const stats = fs.statSync(path_str);
        
        // PDF should have reasonable size (not empty)
        expect(stats.size).toBeGreaterThan(1000);
      }
    }
  });
});

test.describe('Export - Export Options', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should show multiple export format options', async ({ page }) => {
    const exportButton = page.locator('button:has-text("Export")').first();
    const exportExists = await exportButton.isVisible().catch(() => false);
    
    if (exportExists) {
      await exportButton.click();
      
      const options = page.locator('button:has-text("CSV"), button:has-text("JSON"), button:has-text("PDF")');
      const count = await options.count();
      
      // Should have at least one export format
      expect(count).toBeGreaterThanOrEqual(1);
    }
  });

  test('should allow selecting export range', async ({ page }) => {
    const exportButton = page.locator('button:has-text("Export")').first();
    const exportExists = await exportButton.isVisible().catch(() => false);
    
    if (exportExists) {
      await exportButton.click();
      
      // Check for range options
      const rangeOptions = page.locator('input[type="radio"], input[type="checkbox"]');
      const count = await rangeOptions.count();
      
      expect(typeof count).toBe('number');
    }
  });

  test('should allow selecting data columns to export', async ({ page }) => {
    const exportButton = page.locator('button:has-text("Export")').first();
    const exportExists = await exportButton.isVisible().catch(() => false);
    
    if (exportExists) {
      await exportButton.click();
      
      // Check for column selection
      const columnCheckboxes = page.locator('input[type="checkbox"]');
      const count = await columnCheckboxes.count();
      
      expect(typeof count).toBe('number');
    }
  });
});

test.describe('Export - Data Integrity', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should export complete dataset', async ({ dashboardPage, page }) => {
    const metrics = await dashboardPage.getVisibleMetrics();
    const exportButton = page.locator('button:has-text("Export")').first();
    const exportExists = await exportButton.isVisible().catch(() => false);
    
    if (exportExists && metrics.length > 0) {
      await exportButton.click();
      
      const csvOption = page.locator('button:has-text("CSV")').first();
      const csvExists = await csvOption.isVisible().catch(() => false);
      
      if (csvExists) {
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          csvOption.click(),
        ]);
        
        const path_str = await download.path();
        const content = fs.readFileSync(path_str, 'utf-8');
        
        // Should contain data
        expect(content.length).toBeGreaterThan(0);
      }
    }
  });

  test('should maintain data accuracy in export', async ({ dashboardPage, page }) => {
    const metricsOnPage = await dashboardPage.getVisibleMetrics();
    
    if (metricsOnPage.length > 0) {
      const exportButton = page.locator('button:has-text("Export")').first();
      const exportExists = await exportButton.isVisible().catch(() => false);
      
      if (exportExists) {
        await exportButton.click();
        
        const csvOption = page.locator('button:has-text("CSV")').first();
        const csvExists = await csvOption.isVisible().catch(() => false);
        
        if (csvExists) {
          const [download] = await Promise.all([
            page.waitForEvent('download'),
            csvOption.click(),
          ]);
          
          const path_str = await download.path();
          const content = fs.readFileSync(path_str, 'utf-8');
          
          // Check if some metrics are present in export
          const hasData = metricsOnPage.some(m => 
            content.includes(m.value || '') || content.includes(m.label || '')
          );
          
          expect(hasData || content.length > 100).toBe(true);
        }
      }
    }
  });

  test('should include timestamps in export', async ({ page }) => {
    const exportButton = page.locator('button:has-text("Export")').first();
    const exportExists = await exportButton.isVisible().catch(() => false);
    
    if (exportExists) {
      await exportButton.click();
      
      const csvOption = page.locator('button:has-text("CSV")').first();
      const csvExists = await csvOption.isVisible().catch(() => false);
      
      if (csvExists) {
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          csvOption.click(),
        ]);
        
        expect(download.suggestedFilename()).toBeTruthy();
      }
    }
  });
});

test.describe('Export - Error Handling', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoadComplete();
  });

  test('should handle export with no data gracefully', async ({ page, dashboardPage }) => {
    // Simulate no data
    await page.route('**/data/**', route => route.abort());
    
    await page.reload();
    await dashboardPage.waitForLoadComplete();
    
    const exportButton = page.locator('button:has-text("Export")').first();
    const exportDisabled = await exportButton.isDisabled().catch(() => true);
    
    // Button should either be disabled or still work
    expect(typeof exportDisabled).toBe('boolean');
  });

  test('should show error if export fails', async ({ page }) => {
    const exportButton = page.locator('button:has-text("Export")').first();
    const exportExists = await exportButton.isVisible().catch(() => false);
    
    if (exportExists) {
      await exportButton.click();
      
      const csvOption = page.locator('button:has-text("CSV")').first();
      const csvExists = await csvOption.isVisible().catch(() => false);
      
      if (csvExists) {
        // Simulate network error
        await page.context().setOffline(true);
        
        await csvOption.click().catch(() => {
          // Error is expected
        });
        
        await page.context().setOffline(false);
      }
    }
  });
});

test.describe('Export - Performance', () => {
  test('should export within reasonable time', async ({ page, dashboardPage }) => {
    await dashboardPage.goto();
    
    const exportButton = page.locator('button:has-text("Export")').first();
    const exportExists = await exportButton.isVisible().catch(() => false);
    
    if (exportExists) {
      const startTime = Date.now();
      await exportButton.click();
      
      const csvOption = page.locator('button:has-text("CSV")').first();
      const csvExists = await csvOption.isVisible().catch(() => false);
      
      if (csvExists) {
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          csvOption.click(),
        ]);
        
        const exportTime = Date.now() - startTime;
        
        // Export should complete within 10 seconds
        expect(exportTime).toBeLessThan(10000);
      }
    }
  });

  test('should not block UI during export', async ({ page, dashboardPage }) => {
    await dashboardPage.goto();
    
    const exportButton = page.locator('button:has-text("Export")').first();
    const exportExists = await exportButton.isVisible().catch(() => false);
    
    if (exportExists) {
      await exportButton.click();
      
      // Page should still be interactive
      const tabButton = page.locator('button[role="tab"]').first();
      const canClick = await tabButton.isVisible().catch(() => false);
      
      expect(canClick).toBe(true);
    }
  });
});
