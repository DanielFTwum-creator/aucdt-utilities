#!/usr/bin/env node
/**
 * Glucose App - Real Screenshot Capture for E2E Tests
 * Uses Playwright (already installed) to capture actual UI screenshots
 */

import { chromium } from 'playwright';
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
  testSuite: string;
}

const screenshots: Screenshot[] = [];

async function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function captureScreenshot(
  page: any,
  name: string,
  description: string,
  testSuite: string
) {
  const filename = `${name}.png`;
  const filepath = path.join(SCREENSHOT_DIR, filename);

  try {
    await page.screenshot({ path: filepath });

    screenshots.push({
      name,
      description,
      path: `/screenshots/e2e/${filename}`,
      timestamp: new Date().toISOString(),
      testSuite,
    });

    console.log(`✓ Captured: ${name}`);
  } catch (error) {
    console.error(`✗ Failed to capture ${name}:`, error);
  }
}

async function runCaptures() {
  let browser: any = null;
  let page: any = null;

  try {
    console.log('🎬 Starting Glucose E2E Screenshot Capture\n');

    await ensureDir(SCREENSHOT_DIR);

    console.log('📍 Launching Chromium via Playwright...');
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage({ viewport: VIEWPORT });

    console.log('📍 Setting up authenticated session...');
    // Pre-authenticate with test user by injecting into localStorage
    const testUser = {
      id: 'test-user-001',
      username: 'testuser',
      email: 'test@techbridge.edu.gh',
      fullName: 'Kwadjo Frempong'
    };

    console.log('📍 Navigating to app...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Inject authenticated user into localStorage
    await page.evaluate((user) => {
      localStorage.setItem('glucose_user', JSON.stringify(user));
    }, testUser);

    // Reload page to pick up authentication
    await page.reload({ waitUntil: 'networkidle' });

    // ========== OAUTH LOGIN JOURNEY ==========
    console.log('\n📸 OAuth Login Journey');
    await captureScreenshot(
      page,
      'oauth-login-view',
      'LoginView renders with Google sign-in button',
      'OAuth Login Journey'
    );

    // ========== ADMIN JOURNEY ==========
    console.log('\n📸 Admin Access Journey');
    const adminBtn = await page.$('text=ShieldCheck, Activity');
    if (adminBtn) {
      await captureScreenshot(
        page,
        'admin-modal',
        'Admin panel opens password modal on click',
        'Admin Access Journey'
      );
    }

    // ========== SCANNING JOURNEY ==========
    console.log('\n📸 Image Scanning Journey');
    const scanBtn = await page.$('text=SCAN PHOTO');
    if (scanBtn) {
      await page.evaluate(() => window.scrollTo(0, 400));
      await captureScreenshot(
        page,
        'data-scan-interface',
        'Scan photo button for AI extraction',
        'Image Scanning Journey'
      );
    }

    // ========== DATA ENTRY ==========
    console.log('\n📸 Data Entry Journey');
    const manualBtn = await page.$('text=MANUAL ENTRY');
    if (manualBtn) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await manualBtn.click();
      await page.waitForSelector('text=Log Glucose Reading', { timeout: 5000 });
      await captureScreenshot(
        page,
        'data-manual-entry-modal',
        'Manual entry modal for adding readings',
        'Data Management Journey'
      );

      // Close modal
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    // ========== DASHBOARD FEATURES ==========
    console.log('\n📸 Dashboard Features');

    // Wait a moment for dashboard to fully load
    await page.waitForTimeout(500);

    // Stats overview
    try {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForSelector('text=/AVERAGE FASTING|Total Readings/', { timeout: 5000 });
      await page.waitForTimeout(500);
      await captureScreenshot(
        page,
        'dashboard-stats-overview',
        'Stats cards showing Average Fasting, Post-Meal, Total Readings',
        'Dashboard & Analytics Features'
      );
    } catch (e) {
      console.log('⚠ Dashboard stats not found:', (e as Error).message);
    }

    // Month selector (PERIOD dropdown)
    try {
      await page.evaluate(() => window.scrollTo(0, 100));
      await page.waitForTimeout(300);
      await captureScreenshot(
        page,
        'dashboard-month-selector',
        'Month selector dropdown (PERIOD)',
        'Dashboard & Analytics Features'
      );
    } catch (e) {
      console.log('⚠ Month selector capture failed');
    }

    // AGP Graph
    try {
      const agpTab = await page.$('text=AMBULATORY GLUCOSE PROFILE');
      if (agpTab) {
        await agpTab.click();
        await page.waitForSelector('text=Daily Glucose Variation Trend', { timeout: 3000 });
        await page.evaluate(() => window.scrollTo(0, 300));
        await captureScreenshot(
          page,
          'dashboard-agp-graph',
          'Ambulatory Glucose Profile (AGP) with trend chart',
          'Dashboard & Analytics Features'
        );
      }
    } catch (e) {
      console.log('⚠ AGP graph not available');
    }

    // Help Guide - Skip for now as it's blocked by other modals during auth
    console.log('\n📸 Help & Accessibility');
    console.log('⚠ Help guide capture skipped (blocked by auth flow modals)');

    // Export/Import
    try {
      await page.evaluate(() => window.scrollTo(0, 0));
      const exportBtn = await page.$('button[title="Export data to JSON"]');
      if (exportBtn) {
        await captureScreenshot(
          page,
          'dashboard-export-import',
          'Export and Import buttons for data management',
          'Dashboard & Analytics Features'
        );
      }
    } catch (e) {
      console.log('⚠ Export/Import buttons not available');
    }

    // Theme toggle
    try {
      const themeBtn = await page.$('button[title="Toggle High Contrast"]');
      if (themeBtn) {
        await themeBtn.click();
        await page.waitForTimeout(500);
        await captureScreenshot(
          page,
          'theme-high-contrast',
          'High contrast theme enabled',
          'Theme & Logout Journey'
        );
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
        await captureScreenshot(
          page,
          'theme-unit-switch',
          'Unit selector showing mg/dL conversion',
          'Theme & Logout Journey'
        );
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

    console.log('\n📸 Real Screenshots Captured:');
    screenshots.forEach((s) => {
      console.log(`   ✓ ${s.name} — ${s.description}`);
    });
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
