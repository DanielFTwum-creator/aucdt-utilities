const { chromium } = require('@playwright/test');
const fs = require('fs');

const APP_URL = 'http://localhost:3000'; // Adjust if your app runs on a different port
const RESULTS_DIR = 'test-results';
const TIMEOUT = 30000; // 30 seconds

// Helper to create a directory if it doesn't exist
const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
};

(async () => {
    ensureDirExists(RESULTS_DIR);
    console.log('🚀 Starting E2E test suite...');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    try {
        console.log(`Navigating to ${APP_URL}`);
        await page.goto(APP_URL, { waitUntil: 'networkidle2' });

        // 1. Test Initial Page Load
        console.log('✅ Verifying initial page load...');
        await page.waitForSelector('h1.app-title');
        const heading = await page.$eval('h1.app-title', el => el.textContent);
        if (heading !== 'AI Flyer Generator') {
            throw new Error(`Unexpected heading: ${heading}`);
        }
        console.log('Page loaded successfully.');

        // 2. Test Flyer Generation
        console.log('🧪 Starting flyer generation test...');
        // The generator tab is active by default.
        await page.waitForSelector('button.btn-primary');
        await page.click('button ::-p-text(Generate with AI)');

        console.log('⏳ Waiting for image cropper to appear...');
        try {
            await page.waitForSelector('.fixed.inset-0.bg-black', { timeout: TIMEOUT });
            console.log('✅ Image cropper modal appeared.');

            // Click crop button to proceed
            await page.click('button ::-p-text(Crop Image)');

            console.log('⏳ Waiting for flyer to be rendered...');
            await page.waitForSelector('#flyer-container');
            
            await page.waitForFunction(
                () => {
                    const flyerContainer = document.getElementById('flyer-container');
                    if (!flyerContainer) return false;
                    const imageColumn = flyerContainer.querySelector<HTMLElement>('div[style*="background-image"]');
                    if (!imageColumn) return false;
                    const style = window.getComputedStyle(imageColumn);
                    return style.backgroundImage.includes('data:image/jpeg;base64,');
                }, 
                { timeout: 5000 }
            );

            console.log('✅ Flyer generated successfully!');
            await page.screenshot({ path: `${RESULTS_DIR}/successful-generation.png` });
        } catch (error) {
            console.error('❌ Flyer generation failed within the timeout period.', error.message);
            await page.screenshot({ path: `${RESULTS_DIR}/failed-generation.png` });
            throw error;
        }
        
        // 3. Test Theme Switching
        console.log('🧪 Testing theme switcher...');
        
        await page.click('button[title="Light Mode"]');
        await page.waitForFunction(() => document.body.classList.contains('light-mode'));
        console.log('✅ Switched to light mode successfully.');
        await page.screenshot({ path: `${RESULTS_DIR}/light-mode.png` });

        await page.click('button[title="Dark Mode"]');
        await page.waitForFunction(() => !document.body.classList.contains('light-mode'));
        console.log('✅ Switched to dark mode successfully.');
        
    } catch (error) {
        console.error('\n🔥 An error occurred during the E2E test:', error);
        await page.screenshot({ path: `${RESULTS_DIR}/error-screenshot.png` });
        process.exit(1); // Exit with a non-zero code to indicate failure
    } finally {
        await browser.close();
        console.log('\n✅ E2E test suite finished.');
    }
})();