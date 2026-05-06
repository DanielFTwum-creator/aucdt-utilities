import playwright from '@playwright/test';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.join(process.cwd(), 'public', 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

(async () => {
  console.log('Starting E2E Tests...');
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    // 1. Home Page Load
    console.log('Testing: Home Page Load');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-home.png') });
    console.log('PASS: Home Page Loaded');

    // 2. Theme Toggle
    console.log('Testing: Theme Toggle');
    const themeBtn = await page.$('button[aria-label^="Current theme"]');
    if (themeBtn) {
      await themeBtn.click();
      await page.waitForTimeout(500); // Wait for transition
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-theme-toggled.png') });
      console.log('PASS: Theme Toggled');
    } else {
      console.error('FAIL: Theme Toggle Button Not Found');
    }

    // 3. Settings Modal
    console.log('Testing: Settings Modal');
    const settingsBtn = await page.$('div[aria-label="Open configuration settings"]');
    if (settingsBtn) {
      await settingsBtn.click();
      await page.waitForSelector('div[role="dialog"]');
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-settings-modal.png') });
      console.log('PASS: Settings Modal Opened');
      
      // Close modal
      const closeBtn = await page.$('button[aria-label="Close settings modal"]');
      if (closeBtn) await closeBtn.click();
    } else {
      console.error('FAIL: Settings Button Not Found');
    }

    // 4. Admin Login
    console.log('Testing: Admin Login');
    await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="text"]', 'admin');
    await page.type('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    if (page.url().includes('/admin/dashboard')) {
      console.log('PASS: Admin Login Successful');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-admin-dashboard.png') });
    } else {
      console.error('FAIL: Admin Login Failed');
    }

  } catch (error) {
    console.error('Test Failed:', error);
  } finally {
    await browser.close();
    console.log('E2E Tests Completed.');
  }
})();
