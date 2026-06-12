#!/usr/bin/env node
/**
 * Capture screenshots for backend API admin UIs
 * Opens each public/index.html file directly
 */

const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

const BACKEND_APIS = [
  'accommodation-management',
  'alumni-network',
  'backend',
  'career-services',
  'complaint-resolution-system',
  'enrollment-management-system',
  'event-management-system',
  'expense-tracking-system',
  'feedback-analysis-system',
  'health-wellness-portal',
  'library-management',
  'media-club-platform',
  'mentorship-program',
  'url-monitoring-service',
];

const CONFIG = {
  catalogueDir: 'catalogue',
  viewportWidth: 1920,
  viewportHeight: 1080,
};

async function captureBackendScreenshots() {
  console.log('\n🎨 Capturing Backend API Admin UI Screenshots...\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: {
      width: CONFIG.viewportWidth,
      height: CONFIG.viewportHeight,
    },
  });

  let success = 0;
  let failed = 0;

  for (const appName of BACKEND_APIS) {
    console.log(`[${BACKEND_APIS.indexOf(appName) + 1}/${BACKEND_APIS.length}] ${appName}`);

    try {
      const htmlPath = path.join(process.cwd(), appName, 'public', 'index.html');
      const screenshotPath = path.join(CONFIG.catalogueDir, appName, 'screenshot.png');

      // Check if HTML exists
      await fs.access(htmlPath);

      // Ensure catalogue directory exists
      await fs.mkdir(path.dirname(screenshotPath), { recursive: true });

      // Load and capture
      await page.goto(`file://${htmlPath.replace(/\\/g, '/')}`, {
        waitUntil: 'networkidle',
      });

      await page.waitForTimeout(2000); // Wait for animations

      await page.screenshot({
        path: screenshotPath,
        fullPage: false,
      });

      console.log(`  ✅ Screenshot captured\n`);
      success++;

    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}\n`);
      failed++;
    }
  }

  await browser.close();

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Backend UI Screenshot Summary:');
  console.log(`   ✅ Success: ${success}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📂 Total: ${BACKEND_APIS.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (success === BACKEND_APIS.length) {
    console.log('🎉 All backend admin UIs captured successfully!\n');
  }
}

captureBackendScreenshots().catch(console.error);
