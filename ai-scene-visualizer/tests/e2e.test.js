// This is a test script for Playwright.
// To run:
// 1. Install playwright: npm install playwright
// 2. Start a local server for the app (e.g., `npx serve .`)
// 3. Run this script: `node tests/e2e.test.js`

const { chromium } = require('@playwright/test');
const assert = require('assert');

(async () => {
    console.log('🚀 Starting E2E test...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const appUrl = 'http://localhost:3000'; // Adjust if your server runs on a different port

    try {
        await page.goto(appUrl, { waitUntil: 'networkidle0' });
        console.log('✅ Navigated to the app.');

        // --- 1. Registration ---
        const uniqueUser = `testuser_${Date.now()}`;
        console.log(`- Registering new user: ${uniqueUser}`);
        await page.click('button:text("Register")');
        await page.type('#username', uniqueUser);
        await page.type('#password', 'password123');
        await page.click('button[type="submit"]');
        await page.waitForSelector('h1:text("AI Scene Visualizer")');
        console.log('✅ Registration successful.');
        
        // --- 2. Logout ---
        console.log('- Logging out...');
        await page.click('button:text("Logout")');
        await page.waitForSelector('h1:text("Welcome Back")');
        console.log('✅ Logout successful.');

        // --- 3. Login ---
        console.log(`- Logging in as ${uniqueUser}...`);
        await page.type('#username', uniqueUser);
        await page.type('#password', 'password123');
        await page.click('button[type="submit"]');
        await page.waitForSelector('h1:text("AI Scene Visualizer")');
        console.log('✅ Login successful.');

        // --- 4. Image Generation ---
        const prompt = 'A futuristic city with flying cars and neon lights';
        console.log(`- Generating image with prompt: "${prompt}"`);
        await page.type('textarea', prompt);
        await page.click('button:text("Generate Scene")');
        
        // Wait for the loading overlay to appear and then disappear.
        // The generation can take a while, so we use a long timeout.
        console.log('- Waiting for image generation (this may take up to 90 seconds)...');
        await page.waitForSelector('.fixed.inset-0.bg-black\\/80', { hidden: true, timeout: 90000 });
        
        // Wait for the gallery to contain an image
        await page.waitForSelector('#gallery img');
        console.log('✅ Image generated and displayed in the gallery.');

        // --- 5. Verification & Screenshot ---
        const imageSrc = await page.$eval('#gallery img', img => img.src);
        assert(imageSrc.startsWith('data:image/jpeg;base64,'), 'Image src should be a base64 data URL');
        console.log('✅ Image source verified.');

        const screenshotPath = 'e2e-test-result.png';
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`📸 Screenshot saved to ${screenshotPath}`);

        console.log('🎉 E2E test completed successfully!');

    } catch (error) {
        console.error('❌ E2E test failed:', error);
        await page.screenshot({ path: 'e2e-test-error.png' });
        console.log('📸 Error screenshot saved to e2e-test-error.png');
        process.exit(1); // Exit with error code
    } finally {
        await browser.close();
    }
})();
