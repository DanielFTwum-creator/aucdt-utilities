import { chromium } from '@playwright/test';
import path from 'path';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  
  console.log('Navigating to glucose app...');
  await page.goto('https://ai-tools.techbridge.edu.gh/glucose', { waitUntil: 'networkidle' });
  
  // Wait a moment for any animations to settle
  await page.waitForTimeout(2000);
  
  const destPath = path.resolve('glucose_screenshot.png');
  await page.screenshot({ path: destPath, fullPage: true });
  
  console.log(`Screenshot saved to ${destPath}`);
  await browser.close();
})();
