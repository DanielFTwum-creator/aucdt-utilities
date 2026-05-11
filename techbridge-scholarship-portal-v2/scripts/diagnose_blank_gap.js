import playwright from '@playwright/test';
import path from 'path';

(async () => {
    const browser = await chromium.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Capture console logs to see why it's blank
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

    const targetHtml = path.resolve('../academic-integrity-detector/index.html');
    console.log(`🔍 Diagnosing: file://${targetHtml}`);

    try {
        await page.goto(`file://${targetHtml}`, { waitUntil: 'networkidle2', timeout: 5000 });
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: 'docs/screenshots/diagnosis_check.png' });
    } catch (e) {
        console.log('Capture failed:', e.message);
    }

    await browser.close();
})();
