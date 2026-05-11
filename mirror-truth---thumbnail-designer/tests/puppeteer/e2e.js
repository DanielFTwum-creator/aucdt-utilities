const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Ensure reports directory exists
const reportDir = path.join(__dirname, 'reports');
if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
}

(async () => {
    console.log('🚀 Starting Mirror Truth E2E Tests...');
    const browser = await chromium.launch({ 
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    
    // Set viewport to standard HD
    await page.setViewport({ width: 1440, height: 900 });

    try {
        // 1. Load Application
        console.log('📍 Navigating to application...');
        await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
        
        // Take initial screenshot
        await page.screenshot({ path: path.join(reportDir, '01-load.png') });
        console.log('✅ App loaded successfully');

        // 2. Verify Core Elements
        const canvas = await page.$('#thumbnail-canvas');
        if (canvas) console.log('✅ Thumbnail Canvas found');
        else throw new Error('Thumbnail Canvas not found');

        // 3. Test Theme Toggle
        console.log('🌗 Testing Theme Toggle...');
        const bodyClassBefore = await page.evaluate(() => document.documentElement.className);
        // Assuming the toggle is the button with Sun/Moon icon. Finding by aria-label if possible or generic button structure
        // In our app, it's the first button in the header group.
        await page.click('button[aria-label="Toggle Theme"]');
        await new Promise(r => setTimeout(r, 500)); // wait for transition
        const bodyClassAfter = await page.evaluate(() => document.documentElement.className);
        
        if (bodyClassBefore !== bodyClassAfter) {
            console.log(`✅ Theme switched from "${bodyClassBefore}" to "${bodyClassAfter}"`);
        } else {
            throw new Error('Theme toggle failed');
        }
        await page.screenshot({ path: path.join(reportDir, '02-light-mode.png') });

        // 4. Test Text Input Update
        console.log('⌨️ Testing Text Input...');
        const artistInput = await page.$('input[value="Kudjo Twum"]'); // Initial value
        if (artistInput) {
            await artistInput.click({ clickCount: 3 });
            await artistInput.type('TEST ARTIST');
            await new Promise(r => setTimeout(r, 200));
            // Check if rendered canvas text updated (Visual check via screenshot)
            await page.screenshot({ path: path.join(reportDir, '03-text-update.png') });
            console.log('✅ Text input interaction successful');
        } else {
            console.warn('⚠️ Could not find specific artist input to test');
        }

        // 5. Test Admin Panel Open
        console.log('🛡️ Testing Admin Panel...');
        await page.click('button[aria-label="Admin Panel"]');
        await new Promise(r => setTimeout(r, 300));
        await page.screenshot({ path: path.join(reportDir, '04-admin-modal.png') });
        
        const passwordInput = await page.$('input[type="password"]');
        if (passwordInput) console.log('✅ Admin Modal opened and password field found');
        else throw new Error('Admin modal failed to open');

        console.log('🎉 All tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error);
        await page.screenshot({ path: path.join(reportDir, 'error-state.png') });
    } finally {
        await browser.close();
    }
})();