// tests/playwright_cuj.js
// Run with: node tests/playwright_cuj.js
const { chromium } = require('@playwright/test');

(async () => {
  console.log('🚀 Starting Playwright Critical User Journey Test...');
  
  const browser = await chromium.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  try {
    // 1. Navigate to App
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Loaded application');

    // 2. Fill Candidate Details
    await page.type('#fullName', 'Playwright Candidate');
    await page.type('#position', 'Senior Developer');
    console.log('✅ Entered candidate details');

    // 3. Fill Panel Details
    await page.type('#panelMember', 'Automated Tester');
    await page.select('#panelRole', 'QA');
    console.log('✅ Entered panel details');

    // 4. Input Scores
    // Assuming scores are plain number inputs
    await page.type('#score-appearance', '5');
    await page.type('#score-confidence', '15');
    await page.type('#score-competence', '35'); // Max is 40
    console.log('✅ Entered scores');

    // 5. Submit
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      console.log('✅ Clicked submit');
    } else {
      throw new Error('Submit button not found');
    }

    // 6. Verify Success
    await page.waitForSelector('.text-3xl.font-bold', { timeout: 5000 });
    const successText = await page.$eval('body', el => el.innerText);
    
    if (successText.includes('Submission Successful')) {
      console.log('🎉 TEST PASSED: Submission verified.');
      
      // Capture screenshot
      await page.screenshot({ path: 'test_success.png' });
      console.log('📸 Screenshot saved to test_success.png');
    } else {
      throw new Error('Success message not found');
    }

  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();