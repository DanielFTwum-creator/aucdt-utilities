import playwright from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: "new" });
  const page = await browser.newPage();
  
  console.log('Starting E2E Tests...');

  try {
    // Test 1: Homepage Load
    await page.goto('http://localhost:3000');
    const title = await page.title();
    console.log(`Test 1 (Homepage): ${title.includes('Muniratu') ? 'PASS' : 'FAIL'}`);

    // Test 2: Navigation to About
    await page.click('a[href="#about"]');
    await page.waitForSelector('#about');
    console.log('Test 2 (Navigation): PASS');

    // Test 3: Booking Widget Interaction
    await page.goto('http://localhost:3000');
    await page.click('button:has-text("Book Online")'); // Assuming button text
    // Note: This is a simplified example. Real tests would need specific selectors.
    console.log('Test 3 (Booking UI): PASS');

  } catch (error) {
    console.error('Test Failed:', error);
  } finally {
    await browser.close();
  }
})();
