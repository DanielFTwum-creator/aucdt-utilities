
const { chromium } = require('@playwright/test');

(async () => {
  console.log('🚀 Starting TUC Critical Journey Tests...');
  
  const browser = await chromium.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Set viewport to desktop
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    // --- Test 1: Homepage Load & Critical Elements ---
    console.log('TEST 1: Homepage Load Verification');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    const headerTitle = await page.$eval('title', el => el.textContent);
    if (!headerTitle.includes('Techbridge University')) throw new Error('Title mismatch');
    console.log('✅ Title verified');

    const heroSlider = await page.$('#hero-slider-section'); // Assuming ID exists or selecting by component structure
    if (!heroSlider) console.log('⚠️ Hero Slider ID not found, checking visual container');
    // In actual implementation we'd target specific classes like .swiper-container or custom IDs
    
    await page.screenshot({ path: 'screenshots/01-homepage.png' });
    console.log('📸 Screenshot captured: Homepage');


    // --- Test 2: Theme Toggling ---
    console.log('\nTEST 2: Theme Switching (Light -> Dark -> High Contrast)');
    
    // Toggle to Dark
    const themeSwitcher = await page.$('[aria-label="Theme Switcher"]');
    const darkBtn = await page.$('[aria-label="Dark Mode"]');
    await darkBtn.click();
    
    // Check for 'dark' class on html element
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    if (!isDark) throw new Error('Dark mode failed to activate');
    console.log('✅ Dark mode activated');
    await page.screenshot({ path: 'screenshots/02-darkmode.png' });

    // Toggle to High Contrast
    const contrastBtn = await page.$('[aria-label="High Contrast Mode"]');
    await contrastBtn.click();
    
    const isContrast = await page.evaluate(() => document.documentElement.classList.contains('high-contrast'));
    if (!isContrast) throw new Error('High contrast mode failed to activate');
    console.log('✅ High Contrast mode activated');
    await page.screenshot({ path: 'screenshots/03-highcontrast.png' });

    // Reset to Light
    const lightBtn = await page.$('[aria-label="Light Mode"]');
    await lightBtn.click();


    // --- Test 3: Navigation ---
    console.log('\nTEST 3: Navigation Integrity');
    // Verify "About Us" dropdown exists (hover simulation)
    const aboutLink = await page.$x("//span[contains(text(), 'About Us')]");
    if (aboutLink.length > 0) {
        await aboutLink[0].hover();
        await page.waitForSelector('.absolute', { visible: true, timeout: 2000 });
        console.log('✅ Navigation dropdown functions');
    }


    // --- Test 4: Virtual Assistant Interaction ---
    console.log('\nTEST 4: Virtual Assistant Logic');
    const chatToggle = await page.$('[aria-label="Toggle Chat"]');
    await chatToggle.click();
    
    await page.waitForSelector('input[placeholder="Type a message..."]');
    await page.type('input[placeholder="Type a message..."]', 'Admissions');
    await page.keyboard.press('Enter');
    
    // Wait for bot response (simulated delay in app is 1s)
    await new Promise(r => setTimeout(r, 1500));
    
    const messages = await page.evaluate(() => {
        const els = document.querySelectorAll('.bg-white.border.border-gray-200'); // Bot message styling
        return Array.from(els).map(e => e.textContent);
    });
    
    if (messages.some(m => m.includes('Admissions are currently open'))) {
        console.log('✅ Bot replied correctly to "Admissions"');
    } else {
        throw new Error('Bot failed to reply correctly');
    }
    await page.screenshot({ path: 'screenshots/04-chatbot.png' });

    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    await page.screenshot({ path: 'screenshots/error-state.png' });
  } finally {
    await browser.close();
  }
})();
