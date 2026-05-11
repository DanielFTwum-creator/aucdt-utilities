import { test, expect } from '@playwright/test';
import { LoginPage } from '../utils/LoginPage';
import { logTestInfo } from '../utils/helpers';

test.describe('Performance Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test('Should load login page within acceptable time', async ({ page }) => {
    logTestInfo('Test: Page load performance');
    
    const startTime = Date.now();
    
    await loginPage.navigateToLoginPage();
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    logTestInfo(`Page load time: ${loadTime}ms`);
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('Should measure login action performance', async ({ page }) => {
    logTestInfo('Test: Login action performance');
    
    await loginPage.navigateToLoginPage();
    
    const startTime = Date.now();
    
    await loginPage.login('test_user', 'test_pass');
    await page.waitForLoadState('networkidle');
    
    const actionTime = Date.now() - startTime;
    logTestInfo(`Login action time: ${actionTime}ms`);
    
    // Login action should complete within 10 seconds
    expect(actionTime).toBeLessThan(10000);
  });

  test('Should measure page metrics', async ({ page }) => {
    logTestInfo('Test: Collect page metrics');
    
    await loginPage.navigateToLoginPage();
    await page.waitForLoadState('networkidle');
    
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        dns: perfData.domainLookupEnd - perfData.domainLookupStart,
        tcp: perfData.connectEnd - perfData.connectStart,
        ttfb: perfData.responseStart - perfData.requestStart,
        download: perfData.responseEnd - perfData.responseStart,
        domInteractive: perfData.domInteractive,
        domComplete: perfData.domComplete,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart
      };
    });
    
    logTestInfo('Performance Metrics:');
    logTestInfo(`DNS Lookup: ${metrics.dns.toFixed(2)}ms`);
    logTestInfo(`TCP Connection: ${metrics.tcp.toFixed(2)}ms`);
    logTestInfo(`Time to First Byte: ${metrics.ttfb.toFixed(2)}ms`);
    logTestInfo(`Download Time: ${metrics.download.toFixed(2)}ms`);
    logTestInfo(`DOM Interactive: ${metrics.domInteractive.toFixed(2)}ms`);
    logTestInfo(`DOM Complete: ${metrics.domComplete.toFixed(2)}ms`);
    logTestInfo(`Load Complete: ${metrics.loadComplete.toFixed(2)}ms`);
  });

  test('Should check network performance', async ({ page }) => {
    logTestInfo('Test: Network performance');
    
    const resourceSizes: { [key: string]: number } = {};
    
    page.on('response', async (response) => {
      const url = response.url();
      const contentLength = response.headers()['content-length'];
      if (contentLength) {
        resourceSizes[url] = parseInt(contentLength);
      }
    });
    
    await loginPage.navigateToLoginPage();
    await page.waitForLoadState('networkidle');
    
    let totalSize = 0;
    Object.entries(resourceSizes).forEach(([url, size]) => {
      totalSize += size;
      if (size > 100000) { // Log resources larger than 100KB
        logTestInfo(`Large resource: ${url} - ${(size / 1024).toFixed(2)}KB`);
      }
    });
    
    logTestInfo(`Total page size: ${(totalSize / 1024).toFixed(2)}KB`);
  });

  test('Should verify response times for API calls', async ({ page }) => {
    logTestInfo('Test: API response times');
    
    const apiCalls: { url: string; duration: number }[] = [];
    
    page.on('response', async (response) => {
      const timing = response.timing();
      if (timing) {
        apiCalls.push({
          url: response.url(),
          duration: timing.responseEnd
        });
      }
    });
    
    await loginPage.navigateToLoginPage();
    await page.waitForLoadState('networkidle');
    
    // Log slow API calls (>1 second)
    apiCalls.forEach(call => {
      if (call.duration > 1000) {
        logTestInfo(`Slow API call: ${call.url} - ${call.duration.toFixed(2)}ms`);
      }
    });
  });
});
