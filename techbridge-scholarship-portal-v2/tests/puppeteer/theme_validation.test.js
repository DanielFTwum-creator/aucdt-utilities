/**
 * TECHBRIDGE Scholarship Portal - Theme Validation Test
 * Executes theme toggles and captures screenshots of each mode.
 */

import playwright from '@playwright/test';
import fs from 'fs';
import path from 'path';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log('🎨 Starting Theme Validation Suite...');
  
  const resultsDir = 'tests/results/themes';
  
  if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
  }

  const browser = await chromium.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 }
  });
  
  const page = await browser.newPage();

  const capture = async (themeName) => {
      const fileName = `theme_${themeName}.png`;
      const filePath = path.join(resultsDir, fileName);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log(`📸 Captured: ${themeName} Theme`);
  };

  try {
    // Polling for server readiness
    console.log('⏳ Polling for server at http://localhost:3000...');
    let ready = false;
    for (let i = 0; i < 30; i++) {
        try {
            await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 2000 });
            ready = true;
            break;
        } catch (e) {
            await delay(1000);
        }
    }
    if (!ready) throw new Error("Server not available at http://localhost:3000 after 30 seconds");
    console.log('✅ Server is UP');

    await page.goto('http://localhost:3000?view=form', { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(1000); // Wait for initial animations

    // 1. Capture Default (Dark) Theme
    await capture('dark_mode_initial');

    // 2. Switch to Light Theme
    console.log('🔄 Switching to Light Mode...');
    await page.click('button[aria-label="Switch to Day Mode"]');
    await delay(1500); // Wait for CSS transition (duration-500)
    await capture('light_mode');

    // 3. Switch to High-Contrast Theme
    console.log('🔄 Switching to High-Contrast Mode...');
    await page.click('button[aria-label="Switch to High Contrast Mode"]');
    await delay(1500);
    await capture('high_contrast_mode');

    // 4. Switch back to Dark Theme
    console.log('🔄 Switching back to Dark Mode...');
    await page.click('button[aria-label="Switch to Night Mode"]');
    await delay(1500);
    await capture('dark_mode_final');

    console.log(`✅ Theme screenshots saved to ${resultsDir}`);

  } catch (error) {
    console.error('❌ THEME VALIDATION FAILED:', error.message);
    await page.screenshot({ path: path.join(resultsDir, 'theme_failure_state.png') });
  } finally {
    await browser.close();
  }
})();
