const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('🚀 Starting TechBridge Dashboard Critical Journey Test...');
  const browser = await chromium.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 900 });

  try {
    // 1. Load Application
    console.log('📡 Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // 2. Dashboard Auth
    console.log('🔐 Authenticating to Dashboard...');
    await page.waitForSelector('input[type="password"]');
    await page.type('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    
    // 3. Verify Main Navigation
    console.log('✅ Verifying Application Load...');
    await page.waitForSelector('[role="main"]');
    
    // 4. Test Navigation to Strategy
    console.log('🗺️ Testing Navigation to Strategic Plan...');
    await page.click('button:nth-child(2)'); // Strategy tab
    await page.waitForSelector('text/Strategic Implementation Plan');
    
    // 5. Capture Success Screenshot
    const screenshotPath = path.join(__dirname, 'screenshots', 'techbridge-test-success.png');
    if (!fs.existsSync(path.dirname(screenshotPath))) {
        fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
    }
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Screenshot saved to ${screenshotPath}`);
    
    console.log('🏁 TEST COMPLETED SUCCESSFULLY');
  } catch (error) {
    console.error('❌ TEST FAILED:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
