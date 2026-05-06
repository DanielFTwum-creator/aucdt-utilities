import playwright from '@playwright/test';

describe('TechBridge Pottery Archive E2E', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await chromium.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test('Navigation Routing & Links', async () => {
    await page.goto('http://localhost:3000');
    
    // Check Home
    await page.waitForSelector('h2#hero-heading');
    const heroText = await page.$eval('h2#hero-heading', el => el.textContent);
    expect(heroText).toContain('Mastery in');

    // Navigate to Collection
    await page.click('a[href="/collection"]');
    await page.waitForSelector('h2#collection-heading');
    const collectionText = await page.$eval('h2#collection-heading', el => el.textContent);
    expect(collectionText).toContain('The Archive');
  });

  test('Theme Switching (Light/Dark/HC)', async () => {
    await page.goto('http://localhost:3000/admin');
    
    // Since it's protected, we need to login first
    await page.waitForSelector('input[type="password"]');
    await page.type('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Wait for admin dashboard
    await page.waitForSelector('h1');

    // Click Light Theme
    await page.click('button[aria-label="Light theme"]');
    const lightThemeClass = await page.$eval('html', el => el.className);
    expect(lightThemeClass).toContain('light');

    // Click High Contrast Theme
    await page.click('button[aria-label="High contrast theme"]');
    const hcThemeClass = await page.$eval('html', el => el.className);
    expect(hcThemeClass).toContain('hc');
  });

  test('Admin Authentication Flow', async () => {
    // Clear localStorage to ensure logged out state
    await page.evaluate(() => localStorage.clear());
    await page.goto('http://localhost:3000/admin');

    // Verify login form is present
    await page.waitForSelector('input[type="password"]');
    
    // Try invalid password
    await page.type('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await page.waitForSelector('#login-error');
    
    // Try valid password
    await page.click('input[type="password"]', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Verify successful login
    await page.waitForSelector('h1');
    const dashboardText = await page.$eval('h1', el => el.textContent);
    expect(dashboardText).toContain('Dashboard');
  });

  test('Collection Filtering', async () => {
    await page.goto('http://localhost:3000/collection');
    
    // Wait for filters
    await page.waitForSelector('button[aria-label="Filter by 1990s"]');
    
    // Click 1990s filter
    await page.click('button[aria-label="Filter by 1990s"]');
    
    // Verify active state
    const isActive = await page.$eval('button[aria-label="Filter by 1990s"]', el => el.getAttribute('aria-pressed'));
    expect(isActive).toBe('true');
  });
});
