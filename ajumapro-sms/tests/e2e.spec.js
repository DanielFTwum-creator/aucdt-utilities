import playwright from '@playwright/test';

describe('Ajumapro SMS E2E Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: 'new' });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should load the cover page and display correct branding', async () => {
    await page.goto('http://localhost:3000/#/');
    const title = await page.$eval('h1', el => el.textContent);
    expect(title).toBe('Ajumapro');
  });

  it('should navigate to the admin portal and require authentication', async () => {
    await page.goto('http://localhost:3000/#/admin');
    await page.waitForSelector('input[type="password"]');
    const heading = await page.$eval('h1', el => el.textContent);
    expect(heading).toBe('ADMIN ACCESS');
  });

  it('should authenticate successfully with correct credentials', async () => {
    await page.type('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForSelector('nav');
    const dashboardTitle = await page.$eval('h1', el => el.textContent);
    expect(dashboardTitle).toBe('ADMIN PORTAL');
  });

  it('should navigate to testing suite and run diagnostics', async () => {
    await page.goto('http://localhost:3000/#/admin/testing');
    await page.waitForSelector('button[title="Run E2E Tests"]');
    await page.click('button[title="Run E2E Tests"]');
    // Wait for simulated tests to complete
    await page.waitForTimeout(2500);
    const results = await page.$$eval('.test-result', nodes => nodes.length);
    expect(results).toBeGreaterThan(0);
  });

  it('should toggle theme successfully', async () => {
    await page.click('button[title="Toggle Theme"]');
    const themeClass = await page.evaluate(() => document.documentElement.className);
    expect(themeClass).toContain('theme-light');
  });
});
