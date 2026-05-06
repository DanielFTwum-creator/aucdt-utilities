import playwright from '@playwright/test';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await chromium.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Ensure screenshots directory exists
  const screenshotDir = path.join(process.cwd(), 'tests/screenshots');
  if (!fs.existsSync(screenshotDir)){
      fs.mkdirSync(screenshotDir, { recursive: true });
  }

  try {
    console.log('Starting E2E Tests...');

    // Test 1: Load Home Page
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✓ Home Page Loaded');
    await page.screenshot({ path: path.join(screenshotDir, 'home.png') });

    // Test 2: Verify Hero Title
    const title = await page.$eval('h1', el => el.textContent);
    if (title.includes('STRATEGIC MANDATE')) { // Adjust based on actual content
        console.log('✓ Hero Title Verified');
    } else {
        console.log('✗ Hero Title Mismatch');
    }

    // Test 3: Check Chapter Navigation
    // Assuming there are links with href starting with #
    const links = await page.$$('a[href^="#"]');
    if (links.length > 0) {
        console.log(`✓ Found ${links.length} chapter links`);
    }

    // Test 4: Admin Access (Login)
    await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    if (page.url().includes('/admin/diagnostics')) {
        console.log('✓ Admin Login Successful');
        await page.screenshot({ path: path.join(screenshotDir, 'admin_dashboard.png') });
    } else {
        console.log('✗ Admin Login Failed');
    }

  } catch (error) {
    console.error('Test Failed:', error);
  } finally {
    await browser.close();
  }
})();
