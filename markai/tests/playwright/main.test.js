const { chromium } = require('playwright');

// Simple delay function
const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

(async () => {
  console.log('🚀 Starting Playwright E2E test...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 50,
  });
  
  // Need context to grant geolocation for login
  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: { latitude: 51.5074, longitude: -0.1278 }
  });
  
  const page = await context.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  const appUrl = 'http://localhost:3000';

  try {
    console.log(`Navigating to ${appUrl}...`);
    await page.goto(appUrl, { waitUntil: 'networkidle' });
    console.log('✅ Page loaded successfully.');

    // --- Step 0: User Registration/Login ---
    console.log('🧪 Test Step 0: User Authentication');
    await page.waitForSelector('text="Sign In"'); // Verify Login View
    
    // 0a: Invalid Login Test
    console.log('  -> Testing invalid credentials...');
    await page.fill('input[placeholder="Username or Phone Number"]', 'invaliduser');
    await page.fill('input[placeholder="Password"]', 'invalidpass');
    await page.click('button[type="submit"]'); // Sign In button
    
    // Wait for the error message
    await page.waitForSelector('.text-red-500', { timeout: 5000 });
    const errorText = await page.textContent('.text-red-500');
    if (!errorText.includes('Invalid credentials')) {
      throw new Error(`Expected "Invalid credentials" error but got: ${errorText}`);
    }
    console.log('✅ Invalid login rejected correctly.');

    // 0b: Invalid Registration Test (Mismatched Passwords)
    console.log('  -> Testing invalid registration (mismatched passwords)...');
    const signUpBtn = await page.$('button:has-text("Sign Up")');
    if (signUpBtn) {
      await signUpBtn.click();
      await page.waitForSelector('text="Create Your Account"');
      await page.fill('input[placeholder="Username"]', 'invalidreg');
      await page.fill('input[placeholder="Password"]', 'password123');
      await page.fill('input[placeholder="Confirm Password"]', 'password456');
      await page.click('button[type="submit"]'); // Create Account button
      
      // Wait for the error message
      await page.waitForSelector('.text-red-500', { timeout: 5000 });
      const regErrorText = await page.textContent('.text-red-500');
      if (!regErrorText.includes('Passwords do not match')) {
        throw new Error(`Expected "Passwords do not match" error but got: ${regErrorText}`);
      }
      console.log('✅ Invalid registration rejected correctly.');
    }

    // 0c: Register new user (Successful Registration)
    console.log('  -> Testing successful user registration...');
    // Clear fields first since we just tried submitting invalid values
    await page.fill('input[placeholder="Username"]', '');
    await page.fill('input[placeholder="Password"]', '');
    await page.fill('input[placeholder="Confirm Password"]', '');
    
    await page.fill('input[placeholder="Username"]', 'e2etester');
    await page.fill('input[placeholder="Password"]', 'password123');
    await page.fill('input[placeholder="Confirm Password"]', 'password123');
    await page.click('button[type="submit"]'); // Create Account button
    console.log('✅ Registration submitted.');

    // Wait for the Nav to appear, meaning we logged in successfully
    await page.waitForSelector('[data-testid="nav-generator"]', { timeout: 10000 });
    console.log('✅ Authenticated successfully after registration.');

    // 0d: Logout and Login (Successful login verification)
    console.log('  -> Testing successful login...');
    const logoutBtn = await page.$('button[aria-label="Logout"]');
    if (logoutBtn) {
      await logoutBtn.click();
      console.log('✅ Logged out successfully.');
    }

    // Sign in with the registered credentials
    await page.waitForSelector('text="Sign In"');
    await page.fill('input[placeholder="Username or Phone Number"]', 'e2etester');
    await page.fill('input[placeholder="Password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for the Nav to appear again
    await page.waitForSelector('[data-testid="nav-generator"]', { timeout: 10000 });
    console.log('✅ Successful login verified.');
    
    await page.click('[data-testid="nav-generator"]');

    // --- Step 1: Generate Content ---
    console.log('🧪 Test Step 1: Generate Content');
    const generateButtonSelector = 'button[type="submit"]';
    await page.waitForSelector(generateButtonSelector);
    await page.click(generateButtonSelector);

    console.log('⏳ Waiting for AI content to be generated...');
    // Wait for the results to appear. 
    await page.waitForSelector('[data-testid="generated-content-card"]', { timeout: 30000 });
    console.log('✅ Content generated successfully.');

    // --- Step 2: Schedule a Post ---
    console.log('🧪 Test Step 2: Schedule a Post');
    const scheduleButtonSelector = 'button[aria-label^="Schedule this"]';
    await page.waitForSelector(scheduleButtonSelector);
    await page.click(scheduleButtonSelector);
    console.log('✅ Clicked "Schedule" button. Modal should be open.');

    await page.waitForSelector('#schedule-date');
    
    // The modal defaults to a valid future date/time, so we can just confirm.
    const confirmButtonSelector = 'form button[type="submit"]'; 
    await page.click(confirmButtonSelector);
    console.log('✅ Confirmed schedule in modal.');
    
    await delay(500); 
    const contentCard = await page.$(scheduleButtonSelector);
    if (contentCard) {
        throw new Error('Content card did not disappear after scheduling.');
    }
    console.log('✅ Content card removed from generator view.');


    // --- Step 3: Verify on Calendar ---
    console.log('🧪 Test Step 3: Verify on Calendar');
    await page.click('[data-testid="nav-calendar"]');
    console.log('✅ Navigated to Calendar view.');

    await page.waitForSelector('[data-testid="scheduled-post-item"]');
    console.log('✅ Scheduled post found on the calendar.');
    
    console.log('🎉 Playwright E2E Test Passed Successfully!');

  } catch (error) {
    console.error('❌ E2E Test Failed:');
    console.error(error);
    await page.screenshot({ path: 'test-failure-screenshot.png' });
    console.log('📸 Screenshot saved as test-failure-screenshot.png');
    process.exit(1); 
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
