const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const RESULTS_DIR = 'test-results';
const TIMEOUT = 60000; // 60 seconds for potentially slow AI generation
const ADMIN_PASSWORD = 'password123';

const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const takeScreenshot = async (page, name) => {
    const filePath = path.join(RESULTS_DIR, `${name}.png`);
    await page.screenshot({ path: filePath });
    console.log(`📸 Screenshot saved: ${filePath}`);
};

(async () => {
    ensureDirExists(RESULTS_DIR);
    console.log('🚀 Starting E2E test suite for CreoAI...');

    const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1024 });

    try {
        console.log(`Navigating to ${APP_URL}`);
        await page.goto(APP_URL, { waitUntil: 'networkidle2' });

        // 1. Test Initial Page Load
        console.log('✅ Verifying initial page load...');
        await page.waitForSelector('h1', { timeout: 5000 });
        const heading = await page.$eval('h1', el => el.textContent.trim());
        if (heading !== 'CreoAI') {
            throw new Error(`Unexpected heading: "${heading}"`);
        }
        await takeScreenshot(page, '01-initial-load');
        console.log('Page loaded successfully.');

        // 2. Test Theme Switching
        console.log('🧪 Testing theme switcher...');
        const getBodyClasses = () => page.evaluate(() => document.body.className);
        
        let initialClasses = await getBodyClasses();
        console.log(`Initial theme classes: "${initialClasses}"`);

        const themeButtonSelector = 'button[title^="Switch to"]';
        
        await page.click(themeButtonSelector);
        await page.waitForTimeout(500);
        let secondThemeClasses = await getBodyClasses();
        console.log(`Second theme classes: "${secondThemeClasses}"`);
        if (initialClasses === secondThemeClasses) throw new Error('Theme did not change on first click');
        await takeScreenshot(page, '02-theme-change-1');

        await page.click(themeButtonSelector);
        await page.waitForTimeout(500);
        let thirdThemeClasses = await getBodyClasses();
        console.log(`Third theme classes: "${thirdThemeClasses}"`);
        if (secondThemeClasses === thirdThemeClasses) throw new Error('Theme did not change on second click');
        await takeScreenshot(page, '03-theme-change-2');
        
        console.log('Theme switching works correctly.');

        // 3. Test Admin Login
        console.log('🧪 Testing admin login...');
        await page.click('footer button ::-p-text(Admin)');
        await page.waitForSelector('input[type="password"]');
        await page.type('input[type="password"]', ADMIN_PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForSelector('h2 ::-p-text(Admin Panel)');
        console.log('Admin login successful.');
        await takeScreenshot(page, '04-admin-panel');

        // 4. Test Self-Test Feature
        console.log('🧪 Testing self-test feature...');
        await page.click('footer button ::-p-text(Testing)');
        await page.waitForSelector('button ::-p-text(Run Self-Test)');
        await page.click('button ::-p-text(Run Self-Test)');
        await page.waitForSelector('span ::-p-text(Pass: API Key is configured.)');
        console.log('Self-test passed.');
        await takeScreenshot(page, '05-self-test-passed');
        
        // 5. Test Flyer Generation and Screenshot Capture
        console.log('🧪 Starting flyer generation test...');
        await page.click('h1 ::-p-text(CreoAI)'); // Navigate back to generator
        await page.waitForSelector('#generate-flyer-btn');
        await page.click('#generate-flyer-btn');

        console.log('⏳ Waiting for image cropper to appear...');
        await page.waitForSelector('h2 ::-p-text(Adjust Image)', { visible: true, timeout: TIMEOUT });
        console.log('✅ Image cropper modal appeared.');
        await takeScreenshot(page, '06-image-cropper');
        
        await page.click('button ::-p-text(Use Image)');
        console.log('⏳ Waiting for flyer to be rendered...');
        await page.waitForSelector('#flyer-container', { timeout: 10000 });
        
        await page.waitForFunction(
            () => {
                const flyerDiv = document.querySelector('#flyer-container > div:first-child');
                return flyerDiv && flyerDiv.style.backgroundImage.includes('data:image/jpeg;base64,');
            }, 
            { timeout: 10000 }
        );
        console.log('✅ Flyer generated successfully!');
        await takeScreenshot(page, '07-successful-generation');
        
        console.log('🧪 Testing screenshot capture...');
        await page.click('footer button ::-p-text(Testing)');
        
        const downloadPath = path.resolve(RESULTS_DIR);
        const client = await page.target().createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadPath,
        });

        await page.waitForSelector('button ::-p-text(Capture Flyer Screenshot)');
        await page.click('button ::-p-text(Capture Flyer Screenshot)');
        
        const expectedFile = path.join(downloadPath, 'flyer-complete.png');
        console.log(`⏳ Waiting for download of ${expectedFile}...`);
        await new Promise((resolve, reject) => {
           let checkCount = 0;
           const interval = setInterval(() => {
               if(fs.existsSync(expectedFile)) {
                   clearInterval(interval);
                   resolve();
               } else if (checkCount > 20) { // 10 second timeout
                   clearInterval(interval);
                   reject(new Error('Download did not complete in time.'));
               }
               checkCount++;
           }, 500);
        });

        console.log('✅ Screenshot captured and downloaded successfully!');

    } catch (error) {
        console.error('\n🔥 An error occurred during the E2E test:', error);
        await takeScreenshot(page, '99-error-screenshot');
        process.exit(1); // Exit with a non-zero code to indicate failure
    } finally {
        await browser.close();
        console.log('\n✅ E2E test suite finished.');
    }
})();