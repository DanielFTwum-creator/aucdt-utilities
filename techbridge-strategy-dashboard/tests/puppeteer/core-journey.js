/**
 * TechBridge Dashboard - Critical Path E2E Test Suite
 * 
 * Usage:
 * 1. Ensure Node.js is installed
 * 2. npm install playwright
 * 3. node tests/playwright/core-journey.js
 */

const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Setup screenshot directory
  const screenshotDir = path.join(__dirname, 'reports', 'screenshots');
  if (!fs.existsSync(screenshotDir)){
      fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

  try {
    // 1. Initial Load Test
    log('🚀 Starting Test Suite: Critical User Journey');
    await page.setViewport({ width: 1440, height: 900 });
    
    log('NAV: Loading Application...');
    // Replace with actual URL in production
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Verify Title
    const title = await page.title();
    if (!title.includes('TechBridge')) throw new Error('Incorrect Page Title');
    log('✅ PASS: Application Loaded');
    await page.screenshot({ path: path.join(screenshotDir, '1-dashboard-load.png') });

    // 2. Executive Overview Validation
    log('TEST: Verifying Executive Metrics...');
    const enrollmentCard = await page.$eval('body', (body) => body.innerText.includes('Current Enrollment'));
    if (!enrollmentCard) throw new Error('Enrollment Metric missing');
    log('✅ PASS: Metrics Rendered');

    // 3. Navigation Test: Strategy View
    log('NAV: Clicking "Strategic Plan" tab...');
    // Using aria-label or text content to find button
    const buttons = await page.$$('button');
    for (const btn of buttons) {
        const text = await btn.evaluate(el => el.textContent);
        if (text.includes('Strategic Plan')) {
            await btn.click();
            break;
        }
    }
    
    // Wait for chart rendering
    await new Promise(r => setTimeout(r, 500)); 
    const pieChart = await page.$('.recharts-wrapper');
    if (!pieChart) throw new Error('Strategy Pie Chart failed to render');
    log('✅ PASS: Strategy View & Charts Active');
    await page.screenshot({ path: path.join(screenshotDir, '2-strategy-view.png') });

    // 4. Admin Authentication Test
    log('NAV: Accessing Admin Module...');
    // Find Admin button
    for (const btn of buttons) {
        const text = await btn.evaluate(el => el.textContent);
        if (text.includes('Admin Settings')) {
            await btn.click();
            break;
        }
    }

    log('AUTH: Attempting Login...');
    await page.waitForSelector('input[type="password"]');
    await page.type('input[type="password"]', 'admin');
    
    const submitBtn = await page.$('button[type="submit"]');
    await submitBtn.click();
    
    // Check for success state (Security Audit Log header)
    await page.waitForFunction(() => document.body.innerText.includes('Security Audit Log'));
    log('✅ PASS: Admin Authentication Successful');
    await page.screenshot({ path: path.join(screenshotDir, '3-admin-dashboard.png') });

    // 5. Theme Switching Test
    log('UI: Testing Dark Mode Toggle...');
    const moonIcon = await page.$('button[title="Dark Mode"]');
    if (moonIcon) {
        await moonIcon.click();
        const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
        if (!isDark) throw new Error('Dark mode toggle failed');
        log('✅ PASS: Dark Mode Activated');
        await page.screenshot({ path: path.join(screenshotDir, '4-dark-mode.png') });
    }

    log('🎉 All Critical Paths Passed');

  } catch (error) {
    log(`❌ FAIL: ${error.message}`);
    await page.screenshot({ path: path.join(screenshotDir, 'FAILURE-trace.png') });
    process.exit(1);
  } finally {
    await browser.close();
  }
})();