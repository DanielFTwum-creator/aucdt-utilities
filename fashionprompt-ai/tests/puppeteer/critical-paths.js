const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // 1. Navigate to App
  console.log('Navigating to application...');
  await page.goto('http://localhost:3000');
  
  // 2. Test Generator Tab
  console.log('Testing Prompt Generation...');
  await page.select('#garment', 'suit');
  await page.click('button.generate-btn'); // Assuming class name
  const promptText = await page.$eval('#textPrompt', el => el.textContent);
  if (!promptText.includes('suit')) throw new Error('Generation failed: Garment not found in prompt');
  
  // 3. Test Admin Login
  console.log('Testing Admin Access...');
  await page.click('text=Admin');
  await page.type('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForSelector('table'); // Audit log table
  
  // 4. Test Internal Diagnostics
  console.log('Running internal diagnostics...');
  await page.click('text=System Tests');
  await page.click('button:has-text("Run Test Suite")');
  await page.waitForSelector('.bg-green-500'); // Wait for a pass
  
  console.log('✅ All critical paths passed');
  await browser.close();
})();
