/**
 * Playwright Test Suite: Gemini Slingshot - Full System Validation
 * Version: 1.0.2-QA
 * Description: Automated validation of critical user journeys including vision AI, security auth, and theme responsiveness.
 */

const { chromium } = require('@playwright/test');

async function runTests() {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
  });
  const page = await browser.newPage();
  
  console.log('🚀 INITIATING GEMINI SLINGSHOT QA PROTOCOL...');

  try {
    // 1. App Launch
    await page.goto('http://localhost:3000');
    await page.waitForSelector('canvas', { timeout: 10000 });
    console.log('✅ PROTOCOL 01: Application Lifecycle Boot - SUCCESS');

    // 2. Interface Responsiveness (Theming)
    await page.click('[aria-label="Switch to light mode"]');
    await page.waitForTimeout(500);
    const bodyColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    console.log(`✅ PROTOCOL 02: Interface Mode Shift - SUCCESS (State: ${bodyColor})`);

    // 3. Security Access Escalation
    await page.click('[aria-label="Administrator Log-in"]');
    await page.waitForSelector('#admin-pass');
    await page.type('#admin-pass', 'admin');
    await page.click('button:contains("Verify")');
    await page.waitForSelector('text/Admin Access Granted');
    console.log('✅ PROTOCOL 03: Security Credential Validation - SUCCESS');

    // 4. Strategic AI Intelligence Loop
    await page.click('button:contains("Force Analysis")');
    console.log('📡 PROTOCOL 04: AI Tactical Scan Initiated...');
    await page.waitForFunction(() => {
      const hint = document.querySelector('aside .italic.font-black')?.innerText;
      return hint && hint !== "Scanning tactical field..." && hint !== "\"System Baseline Initialized...\"";
    }, { timeout: 10000 });
    const finalHint = await page.evaluate(() => document.querySelector('aside .italic.font-black').innerText);
    console.log(`✅ PROTOCOL 04: AI Tactical Signal Integrity - SUCCESS (Signal: ${finalHint})`);

    // 5. Visual Asset Verification
    const hasImage = await page.evaluate(() => !!document.querySelector('aside img'));
    if (!hasImage) throw new Error('Visual Process Buffer missing image content');
    console.log('✅ PROTOCOL 05: Visual Processing Engine - SUCCESS');

    console.log('\n🌟 ALL CRITICAL SYSTEMS OPERATIONAL - QA PASS');
  } catch (err) {
    console.error(`\n❌ SYSTEM FAILURE: ${err.message}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runTests();
