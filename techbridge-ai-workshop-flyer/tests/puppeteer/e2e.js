/**
 * Playwright E2E Test Suite for Techbridge Flyer App
 * 
 * Usage:
 * 1. Ensure app is running (e.g., http://localhost:3000)
 * 2. npm install playwright
 * 3. node tests/playwright/e2e.js
 */

const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3000'; // Adjust as needed
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)){
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

(async () => {
  console.log('🚀 Starting E2E Test Suite...');
  
  const browser = await chromium.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Helper to take screenshot
  const takeScreenshot = async (name) => {
    const filePath = path.join(SCREENSHOT_DIR, `${name}.png`);
    await page.screenshot({ path: filePath, fullPage: true });
    console.log(`📸 Screenshot saved: ${name}.png`);
  };

  try {
    // 1. Initial Load
    console.log(`Testing navigation to ${BASE_URL}...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    
    const title = await page.title();
    if (title.includes('Techbridge AI Workshop')) {
      console.log('✅ Page Title Verified');
    } else {
      throw new Error(`Title mismatch: ${title}`);
    }
    await takeScreenshot('01-initial-load');

    // 2. Check Critical Elements
    const flyerExists = await page.$('main[aria-label="Flyer: AI Rendering in Fashion Design Workshop"]');
    if (flyerExists) console.log('✅ Flyer container found');
    else throw new Error('Flyer container missing');

    const speakers = await page.$$('[role="article"]');
    if (speakers.length >= 2) console.log(`✅ ${speakers.length} Speakers rendered`);
    else throw new Error('Speakers not rendered correctly');

    // 3. Accessibility / Theme Testing
    console.log('Testing Theme Switcher...');
    const themeSwitcher = await page.$('[aria-label="Accessibility Controls"]');
    if (!themeSwitcher) throw new Error('Theme Switcher not found');
    
    // Switch to Light Mode
    const lightButton = await page.$('button[aria-label="Switch to Light Theme"]');
    await lightButton.click();
    await new Promise(r => setTimeout(r, 500)); // Wait for transition
    await takeScreenshot('02-light-mode');
    
    // Verify CSS Variable change
    const bgColor = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });
    console.log(`Info: Background color is now ${bgColor}`);

    // 4. Admin Panel Interaction
    console.log('Testing Admin Panel Access...');
    // Simulate Ctrl+Shift+A
    await page.keyboard.down('Control');
    await page.keyboard.down('Shift');
    await page.keyboard.press('A');
    await page.keyboard.up('Shift');
    await page.keyboard.up('Control');
    
    await new Promise(r => setTimeout(r, 500));
    await takeScreenshot('03-admin-login-modal');

    // Login
    await page.type('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 500));

    // Verify Dashboard
    const dashboardTitle = await page.$('#admin-dash-title');
    if (dashboardTitle) console.log('✅ Admin Login Successful');
    else throw new Error('Failed to login to Admin Panel');
    
    await takeScreenshot('04-admin-dashboard');

    console.log('🎉 All Tests Passed Successfully!');

  } catch (error) {
    console.error('❌ Test Failed:', error);
    await takeScreenshot('error-state');
    process.exit(1);
  } finally {
    await browser.close();
  }
})();