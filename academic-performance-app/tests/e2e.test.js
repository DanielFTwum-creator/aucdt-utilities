const { chromium } = require('@playwright/test');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');

    console.log('Testing Academic Performance Dashboard...');

    // Check title
    const title = await page.$eval('h1', el => el.textContent);
    console.log('Page Title:', title);

    // Test Admin Login
    await page.click('button:contains("Admin Login")');
    await page.type('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Verify Admin Section
    const auditLogExists = await page.waitForSelector('h2:contains("Admin: Audit Log")');
    console.log('Admin Login Success:', !!auditLogExists);

    // Take screenshot
    await page.screenshot({ path: 'docs/screenshots/test-run.png' });

    await browser.close();
})();
