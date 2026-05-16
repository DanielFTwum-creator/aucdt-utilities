#!/usr/bin/env node
/**
 * Glucose App - Real Screenshot Capture for E2E Tests
 * Uses Puppeteer to capture actual UI screenshots from running application
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

const VIEWPORT = { width: 1280, height: 800 };
const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(process.cwd(), 'public', 'screenshots', 'e2e');

interface Screenshot {
  name: string;
  description: string;
  path: string;
  timestamp: string;
}

const screenshots: Screenshot[] = [];

async function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function captureScreenshot(page: Page, name: string, description: string) {
  const filename = `${name}.png`;
  const filepath = path.join(SCREENSHOT_DIR, filename);

  try {
    await page.screenshot({ path: filepath, fullPage: false });

    screenshots.push({
      name,
      description,
      path: `/screenshots/e2e/${filename}`,
      timestamp: new Date().toISOString(),
    });

    console.log(`✓ Captured: ${name}`);
  } catch (error) {
    console.error(`✗ Failed to capture ${name}:`, error);
  }
}

async function runCaptures() {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    console.log('🎬 Starting Glucose E2E Screenshot Capture\n');

    await ensureDir(SCREENSHOT_DIR);

    console.log('📍 Launching browser...');
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.setViewport(VIEWPORT);

    console.log('📍 Navigating to app...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 15000 });

    // ========== OAUTH LOGIN JOURNEY ==========
    console.log('\n📸 OAuth Login Journey');
    try {
      await page.waitForSelector('text=Continue with Google', { timeout: 5000 });
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'oauth-login-view.png') });
      screenshots.push({
        name: 'oauth-login-view',
        description: 'LoginView renders with Google sign-in button',
        path: '/screenshots/e2e/oauth-login-view.png',
        timestamp: new Date().toISOString(),
      });
      console.log('✓ Captured: oauth-login-view');
    } catch (e) {
      console.log('⚠ OAuth login view not available');
    }

    // ========== ADMIN JOURNEY ==========
    console.log('\n📸 Admin Access Journey');
    try {
      // Look for admin button or login flow
      const adminElements = await page.$('text=Admin');
      if (adminElements) {
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'admin-modal.png') });
        screenshots.push({
          name: 'admin-modal',
          description: 'Admin panel opens password modal on click',
          path: '/screenshots/e2e/admin-modal.png',
          timestamp: new Date().toISOString(),
        });
        console.log('✓ Captured: admin-modal');
      }
    } catch (e) {
      console.log('⚠ Admin section not available');
    }

    // ========== SCANNING JOURNEY ==========
    console.log('\n📸 Image Scanning Journey');
    try {
      const scanButton = await page.$('text=SCAN PHOTO');
      if (scanButton) {
        await page.evaluate(() => window.scrollTo(0, 400));
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'data-scan-interface.png') });
        screenshots.push({
          name: 'data-scan-interface',
          description: 'Scan photo button for AI extraction',
          path: '/screenshots/e2e/data-scan-interface.png',
          timestamp: new Date().toISOString(),
        });
        console.log('✓ Captured: data-scan-interface');
      }
    } catch (e) {
      console.log('⚠ Scan interface not available');
    }

    // ========== DATA ENTRY ==========
    console.log('\n📸 Data Entry Journey');
    try {
      const manualButton = await page.$('text=MANUAL ENTRY');
      if (manualButton) {
        await manualButton.click();
        await page.waitForSelector('text=Log Glucose Reading', { timeout: 5000 });
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'data-manual-entry-modal.png') });
        screenshots.push({
          name: 'data-manual-entry-modal',
          description: 'Manual entry modal for adding readings',
          path: '/screenshots/e2e/data-manual-entry-modal.png',
          timestamp: new Date().toISOString(),
        });
        console.log('✓ Captured: data-manual-entry-modal');

        // Close modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      }
    } catch (e) {
      console.log('⚠ Manual entry modal not available');
    }

    // ========== DASHBOARD FEATURES ==========
    console.log('\n📸 Dashboard Features');

    // Stats overview
    try {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForSelector('text=AVERAGE FASTING', { timeout: 5000 });
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dashboard-stats-overview.png') });
      screenshots.push({
        name: 'dashboard-stats-overview',
        description: 'Stats cards showing Average Fasting, Post-Meal, Total Readings',
        path: '/screenshots/e2e/dashboard-stats-overview.png',
        timestamp: new Date().toISOString(),
      });
      console.log('✓ Captured: dashboard-stats-overview');
    } catch (e) {
      console.log('⚠ Stats cards not available');
    }

    // Month selector
    try {
      await page.waitForSelector('text=PERIOD', { timeout: 5000 });
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dashboard-month-selector.png') });
      screenshots.push({
        name: 'dashboard-month-selector',
        description: 'Month selector dropdown (PERIOD)',
        path: '/screenshots/e2e/dashboard-month-selector.png',
        timestamp: new Date().toISOString(),
      });
      console.log('✓ Captured: dashboard-month-selector');
    } catch (e) {
      console.log('⚠ Month selector not available');
    }

    // AGP Graph
    try {
      const agpTab = await page.$('text=AMBULATORY GLUCOSE PROFILE');
      if (agpTab) {
        await agpTab.click();
        await page.waitForSelector('text=Daily Glucose Variation Trend', { timeout: 5000 });
        await page.evaluate(() => window.scrollTo(0, 300));
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dashboard-agp-graph.png') });
        screenshots.push({
          name: 'dashboard-agp-graph',
          description: 'Ambulatory Glucose Profile (AGP) with trend chart',
          path: '/screenshots/e2e/dashboard-agp-graph.png',
          timestamp: new Date().toISOString(),
        });
        console.log('✓ Captured: dashboard-agp-graph');
      }
    } catch (e) {
      console.log('⚠ AGP graph not available');
    }

    // Help Guide
    console.log('\n📸 Help & Accessibility');
    try {
      const helpButton = await page.$('button[title="View user guide"]');
      if (helpButton) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await helpButton.click();
        await page.waitForSelector('text=ROPHE Guide', { timeout: 5000 });
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dashboard-help-guide.png') });
        screenshots.push({
          name: 'dashboard-help-guide',
          description: 'Help modal with comprehensive user guide',
          path: '/screenshots/e2e/dashboard-help-guide.png',
          timestamp: new Date().toISOString(),
        });
        console.log('✓ Captured: dashboard-help-guide');

        // Close modal
        const closeBtn = await page.$('button[aria-label="Close help"]');
        if (closeBtn) await closeBtn.click();
        await page.waitForTimeout(300);
      }
    } catch (e) {
      console.log('⚠ Help guide not available');
    }

    // Export/Import
    try {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForSelector('button[title="Export data to JSON"]', { timeout: 5000 });
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dashboard-export-import.png') });
      screenshots.push({
        name: 'dashboard-export-import',
        description: 'Export and Import buttons for data management',
        path: '/screenshots/e2e/dashboard-export-import.png',
        timestamp: new Date().toISOString(),
      });
      console.log('✓ Captured: dashboard-export-import');
    } catch (e) {
      console.log('⚠ Export/Import buttons not available');
    }

    // Theme toggle
    try {
      const themeBtn = await page.$('button[title="Toggle High Contrast"]');
      if (themeBtn) {
        await themeBtn.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'theme-high-contrast.png') });
        screenshots.push({
          name: 'theme-high-contrast',
          description: 'High contrast theme enabled',
          path: '/screenshots/e2e/theme-high-contrast.png',
          timestamp: new Date().toISOString(),
        });
        console.log('✓ Captured: theme-high-contrast');
        await themeBtn.click(); // Toggle back
      }
    } catch (e) {
      console.log('⚠ Theme toggle not available');
    }

    // Unit switch
    try {
      const unitBtn = await page.$('button:has-text("mg/dL")');
      if (unitBtn) {
        await unitBtn.click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'theme-unit-switch.png') });
        screenshots.push({
          name: 'theme-unit-switch',
          description: 'Unit selector showing mg/dL conversion',
          path: '/screenshots/e2e/theme-unit-switch.png',
          timestamp: new Date().toISOString(),
        });
        console.log('✓ Captured: theme-unit-switch');
      }
    } catch (e) {
      console.log('⚠ Unit switch not available');
    }

    // Write manifest file
    console.log('\n📝 Writing screenshot manifest...');
    const manifestPath = path.join(SCREENSHOT_DIR, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(screenshots, null, 2));

    console.log(`\n✅ Screenshot capture complete!`);
    console.log(`📊 Total screenshots: ${screenshots.length}`);
    console.log(`📁 Location: ${SCREENSHOT_DIR}`);
    console.log(`📋 Manifest: ${manifestPath}`);
  } catch (error) {
    console.error('❌ Screenshot capture failed:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run capture
runCaptures().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});

export { runCaptures, screenshots };
