/**
 * TECHBRIDGE Scholarship Portal - Critical Path E2E Test
 * Run with: npm run test:e2e
 */

import playwright from '@playwright/test';
import fs from 'fs';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log('🚀 Starting Critical Path Test Suite...');
  
  // Ensure results directory exists
  if (!fs.existsSync('tests/results')) {
      fs.mkdirSync('tests/results', { recursive: true });
  }

  // Launch browser
  const browser = await chromium.launch({ 
    headless: "new", // Use new headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some container environments
    defaultViewport: { width: 1280, height: 800 }
  });
  const page = await browser.newPage();
  
  // Log browser console messages
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  try {
    // 1. Navigate to Application
    console.log('📍 Navigating to application...');
    await page.goto('http://localhost:3000?view=form', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait for hydration - check for the main layout or buttons
    console.log('⏳ Waiting for hydration...');
    await page.waitForSelector('button', { timeout: 30000 });
    
    // Check if we need to click "Bond / Undertaking" tab (if it's not default)
    console.log('📍 Switching to Bond Tab...');
    try {
        // Find the button with text "2. Bond / Undertaking"
        const buttons = await page.$$('button');
        for (const button of buttons) {
            const text = await page.evaluate(el => el.textContent, button);
            if (text.includes('2. Bond / Undertaking')) {
                await button.click();
                console.log('✅ Switched to Bond Tab');
                break;
            }
        }
        await delay(1000);
    } catch (e) {
        console.log('⚠️ Bond tab navigation error:', e.message);
    }

    // 2. Scholar Details (Step 1)
    console.log('✍️ Filling Scholar Details...');
    // Wait for inputs to appear
    await page.waitForSelector('input[placeholder="e.g. John Doe"]');

    await page.type('input[placeholder="e.g. John Doe"]', 'Playwright Automated Tester');
    await page.type('input[placeholder="GHA-000000000-0"]', 'GHA-123456789-0');
    await page.type('input[placeholder="Parent/Guardian Name"]', 'Parent Tester');
    await page.type('input[placeholder="Full residential address"]', '123 Test Lane, Accra');
    await page.type('input[type="email"]', 'daniel.twum@techbridge.edu.gh');
    await page.type('input[type="tel"]', '0555000000');
    
    // Screenshot Step 1
    await page.screenshot({ path: 'tests/results/step1_filled.png' });
    
    // Navigate Next
    console.log('➡️ Clicking Next...');
    await page.click('button::-p-text("Continue")');
    await delay(1000);
    
    // 3. Programme Details (Step 2)
    console.log('✍️ Filling Programme Details...');
    await page.waitForSelector('input[placeholder="e.g. Computer Science"]');

    await page.type('input[placeholder="e.g. Computer Science"]', 'Computer Science');
    await page.type('input[placeholder="e.g. 3 Years"]', '3');
    await page.type('input[placeholder="e.g. TECHBRIDGE Fellowship Grant"]', 'Fellowship');
    await page.type('input[placeholder="Completion of PhD in..."]', 'AI Research');

    
    // Bond Duration is read-only, we skip typing it.
    
    // Verify Clause Update (Strict Policy Enforcement)
    const clauseText = await page.$eval('.border-l-4.border-tuc-maroon', el => el.textContent);
    if (!clauseText.includes('10 years')) throw new Error("Service Bond clause did not show 10 years!");
    
    console.log('➡️ Clicking Next...');
    await page.click('button::-p-text("Continue")');
    await delay(1000);

    // 4. Guarantor (Step 3)
    console.log('✍️ Filling Guarantor Details...');
    await page.waitForSelector('input[placeholder="Full legal name"]');
    
    await page.type('input[placeholder="Full legal name"]', 'Guarantor Bot');
    await page.type('input[placeholder="GHA-000000000-0"]', 'GHA-000000000-9');
    await page.type('input[placeholder="Full residential address"]', '456 Guarantor St');
    await page.type('input[placeholder="+233 00 000 0000"]', '0244000000');
    
    // Witnesses
    // We added placeholders in the previous step
    // Techbridge Witness
    // Note: There are two inputs with "Witness Name" placeholder now.
    // Playwright's type finds the first one by default, which is Techbridge Witness (comes first in DOM).
    const witnessNameInputs = await page.$$('input[placeholder="Witness Name"]');
    if (witnessNameInputs.length < 2) throw new Error("Could not find both witness name inputs");
    
    await witnessNameInputs[0].type('Registrar Bot');
    await page.type('input[placeholder="e.g. Registrar / TUC-001"]', 'REG-001');
    
    // Scholar Witness
    await witnessNameInputs[1].type('Friend Bot');
    await page.type('input[placeholder="Witness ID"]', 'FR-002');

    console.log('➡️ Clicking Next...');
    await page.click('button::-p-text("Continue")');
    await delay(1000);

    // 5. Sign (Step 4)
    console.log('✍️ Signing Document...');
    await page.waitForSelector('input[type="checkbox"]');
    
    await page.click('input[type="checkbox"]'); // Agree to terms
    
    // Select Text Signature (default is text, but ensure)
    // The toggle button for "Textual"
    
    await page.type('input[placeholder="Type your full name exactly as it appears on your ID"]', 'Playwright Automated Tester');
    
    // Wait for signature preview generation (debounce 800ms)
    await delay(1500);
    
    // Submit
    console.log('🚀 Submitting Application...');
    const submitBtnSelector = 'button:not([disabled])::-p-text("Finalize Agreement")';
    await page.waitForSelector(submitBtnSelector, { timeout: 5000 });
    await page.click(submitBtnSelector);
    
    // 6. Verify Success
    console.log('⏳ Waiting for success...');
    try {
        await page.waitForFunction(
            () => document.body.textContent.includes("Process Another Application"),
            { timeout: 30000 }
        );
        
        // Give time for final logs to appear (e.g. payload)
        await delay(3000);
        
        console.log('✅ TEST PASSED: Application submitted successfully');
        await page.screenshot({ path: 'tests/results/success.png' });
    } catch (e) {
        const content = await page.content();
        console.log('❌ FAILURE CONTENT SNAPSHOT:', content.substring(0, 2000) + '...');
        throw new Error('Success message "Bond Executed" not found');
    }

  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
    await page.screenshot({ path: 'tests/results/failure.png' });
    process.exit(1);
  } finally {
    await browser.close();
  }
})();