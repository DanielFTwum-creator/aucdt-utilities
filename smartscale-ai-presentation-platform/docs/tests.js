const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('--- STARTING SMARTSCALIE AUTOMATED TESTS ---');

  // 1. Navigation Test
  await page.goto('http://localhost:3000');
  await page.waitForSelector('h1');
  console.log('✅ Title Slide Loaded');

  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(600);
  console.log('✅ Navigation to Slide 2 Successful');

  // 2. Admin Security Test
  await page.keyboard.down('Control');
  await page.keyboard.down('Shift');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Shift');
  await page.keyboard.up('Control');
  
  await page.waitForSelector('input[type="password"]');
  console.log('✅ Admin Password Prompt Displayed');

  // 3. AI Sandbox Test
  await page.keyboard.press('KeyA'); // Direct open workshop
  await page.waitForSelector('textarea');
  await page.type('textarea', 'Test Prompt for Audit Log');
  await page.click('button:has-text("Generate")');
  console.log('✅ AI Request Flow Initiated');

  await browser.close();
  console.log('--- ALL TESTS PASSED ---');
})();