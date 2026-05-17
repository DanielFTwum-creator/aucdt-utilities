#!/usr/bin/env node
/**
 * Glucose App - Full E2E Screenshot Capture (22 screenshots)
 * Covers all major user journeys with real browser automation
 */

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const VIEWPORT = { width: 1280, height: 800 };
const BASE_URL = 'http://localhost:3010'; // Updated to match actual dev server
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
    await page.screenshot({ path: filepath, fullPage: false });
    screenshots.push({
      name,
      description,
      path: `./screenshots/e2e/${filename}`,
      timestamp: new Date().toISOString(),
      testSuite,
    });
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ Failed: ${name}`, error);
  }
}

async function injectTestData(page: any) {
  // Inject 15 glucose readings spanning multiple days so charts render properly
  await page.evaluate(() => {
    const readings = [
      { id: '1', date: '2026-05-01', fasting: '6.5', post_breakfast: '8.1', pre_lunch: '6.8', post_lunch: '7.5', pre_dinner: '7.0', post_dinner: '8.2', createdAt: Date.now(), updatedAt: Date.now() },
      { id: '2', date: '2026-05-02', fasting: '6.8', post_breakfast: '8.3', pre_lunch: '7.1', post_lunch: '7.8', pre_dinner: '7.2', post_dinner: '8.5', createdAt: Date.now(), updatedAt: Date.now() },
      { id: '3', date: '2026-05-03', fasting: '7.2', post_breakfast: '8.0', pre_lunch: '6.9', post_lunch: '7.6', pre_dinner: '6.8', post_dinner: '8.1', createdAt: Date.now(), updatedAt: Date.now() },
      { id: '4', date: '2026-05-04', fasting: '6.9', post_breakfast: '8.2', pre_lunch: '7.0', post_lunch: '7.7', pre_dinner: '7.1', post_dinner: '8.3', createdAt: Date.now(), updatedAt: Date.now() },
      { id: '5', date: '2026-05-05', fasting: '7.0', post_breakfast: '7.9', pre_lunch: '6.7', post_lunch: '7.4', pre_dinner: '6.9', post_dinner: '8.0', createdAt: Date.now(), updatedAt: Date.now() },
      { id: '6', date: '2026-05-06', fasting: '6.7', post_breakfast: '8.1', pre_lunch: '6.8', post_lunch: '7.5', pre_dinner: '7.0', post_dinner: '8.2', createdAt: Date.now(), updatedAt: Date.now() },
      { id: '7', date: '2026-05-07', fasting: '6.9', post_breakfast: '8.0', pre_lunch: '7.1', post_lunch: '7.8', pre_dinner: '7.2', post_dinner: '8.4', createdAt: Date.now(), updatedAt: Date.now() },
      { id: '8', date: '2026-05-08', fasting: '7.1', post_breakfast: '8.2', pre_lunch: '6.9', post_lunch: '7.6', pre_dinner: '7.0', post_dinner: '8.1', createdAt: Date.now(), updatedAt: Date.now() },
      { id: '9', date: '2026-05-09', fasting: '6.8', post_breakfast: '7.9', pre_lunch: '7.0', post_lunch: '7.7', pre_dinner: '7.1', post_dinner: '8.3', createdAt: Date.now(), updatedAt: Date.now() },
      { id: '10', date: '2026-05-10', fasting: '7.0', post_breakfast: '8.1', pre_lunch: '6.8', post_lunch: '7.5', pre_dinner: '6.9', post_dinner: '8.0', createdAt: Date.now(), updatedAt: Date.now() },
      { id: '11', date: '2026-05-11', fasting: '6.6', post_breakfast: '8.0', pre_lunch: '6.9', post_lunch: '7.6', pre_dinner: '7.2', post_dinner: '8.2', createdAt: Date.now(), updatedAt: Date.now() },
      { id: '12', date: '2026-05-12', fasting: '6.9', post_breakfast: '8.2', pre_lunch: '7.0', post_lunch: '7.8', pre_dinner: '7.0', post_dinner: '8.1', createdAt: Date.now(), updatedAt: Date.now() },
      { id: '13', date: '2026-05-13', fasting: '7.1', post_breakfast: '8.1', pre_lunch: '6.8', post_lunch: '7.5', pre_dinner: '7.1', post_dinner: '8.3', createdAt: Date.now(), updatedAt: Date.now() },
      { id: '14', date: '2026-05-14', fasting: '6.8', post_breakfast: '7.9', pre_lunch: '7.1', post_lunch: '7.7', pre_dinner: '6.9', post_dinner: '8.0', createdAt: Date.now(), updatedAt: Date.now() },
      { id: '15', date: '2026-05-15', fasting: '7.2', post_breakfast: '8.0', pre_lunch: '6.9', post_lunch: '7.6', pre_dinner: '7.0', post_dinner: '8.2', createdAt: Date.now(), updatedAt: Date.now() },
      { id: '16', date: '2026-05-16', fasting: '7.2', post_breakfast: null, pre_lunch: '4.3', post_lunch: null, pre_dinner: '6.9', post_dinner: null, createdAt: Date.now(), updatedAt: Date.now() },
    ];

    const dbRequest = indexedDB.open('glucoseDB', 1);
    dbRequest.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('readings')) {
        db.createObjectStore('readings', { keyPath: 'id' });
      }
    };

    dbRequest.onsuccess = (e: any) => {
      const db = e.target.result;
      const tx = db.transaction('readings', 'readwrite');
      const store = tx.objectStore('readings');
      readings.forEach(r => store.put(r));
    };
  });

  await page.waitForTimeout(500);
}

async function runCaptures() {
  let browser: any = null;
  let page: any = null;

  try {
    console.log('🎬 Glucose E2E Screenshot Capture — 22 Scenarios\n');
    await ensureDir(SCREENSHOT_DIR);

    console.log('📍 Launching browser...');
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage({ viewport: VIEWPORT });

    const testUser = {
      id: 'test-user-001',
      username: 'testuser',
      email: 'test@techbridge.edu.gh',
      fullName: 'Daniel Twum'
    };

    console.log('📍 Navigating to app...');
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    // ========== 1. LOGIN SCENARIO ==========
    console.log('\n📸 1. Login & Authentication\n');

    // Capture empty password field state
    await captureScreenshot(page, 'login-password-empty', 'Password gate (empty state)', 'Login');

    // Capture filled password field state
    await page.fill('input[type="password"]', '1234');
    await page.waitForTimeout(200);
    await captureScreenshot(page, 'login-password-filled', 'Password gate (filled)', 'Login');

    // Submit password and enter authenticated state
    const submitButton = await page.$('button[type="submit"]');
    if (submitButton) {
      await submitButton.click();
      await page.waitForTimeout(1000);
    }
    await page.waitForLoadState('networkidle');

    // Inject test data for authenticated state
    await injectTestData(page);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // ========== 2. DASHBOARD SCENARIOS ==========
    console.log('📸 2. Dashboard & Navigation\n');
    await captureScreenshot(page, 'dashboard-default', 'Full dashboard (default theme)', 'Dashboard');

    // High contrast theme - click by title exact match
    try {
      await page.click('button[title="Toggle High Contrast"]', { timeout: 5000 });
      await page.waitForTimeout(500);
      await captureScreenshot(page, 'dashboard-high-contrast', 'Dashboard (high contrast theme)', 'Dashboard');
      await page.click('button[title="Toggle High Contrast"]');
      await page.waitForTimeout(300);
    } catch (e) {
      console.log('⚠ High contrast toggle skipped:', e instanceof Error ? e.message : '');
    }

    // Unit conversion to mg/dL
    try {
      const mgButton = await page.$('button:text-is("mg/dL")');
      if (mgButton) {
        await mgButton.click();
        await page.waitForTimeout(300);
        await captureScreenshot(page, 'unit-mgdl', 'Values converted to mg/dL', 'Dashboard');
        const mmolButton = await page.$('button:text-is("mmol/L")');
        if (mmolButton) {
          await mmolButton.click();
        }
        await page.waitForTimeout(300);
      }
    } catch (e) {
      console.log('⚠ Unit conversion skipped');
    }

    // Year/Month view - use different selectors
    try {
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await btn.textContent();
        if (text && text.includes('YEAR')) {
          await btn.click();
          await page.waitForTimeout(300);
          await captureScreenshot(page, 'period-year-view', 'Year view mode active', 'Dashboard');
          break;
        }
      }
    } catch (e) {
      console.log('⚠ Year view skipped');
    }

    // Month selector
    try {
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await btn.textContent();
        if (text && text.includes('MONTH')) {
          await btn.click();
          await page.waitForTimeout(300);
          await captureScreenshot(page, 'period-month-selector', 'Month view with selector', 'Dashboard');
          break;
        }
      }
    } catch (e) {
      console.log('⚠ Month view skipped');
    }

    // ========== 3. DATA ENTRY SCENARIOS ==========
    console.log('📸 3. Data Entry\n');

    // New entry modal (empty)
    try {
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await btn.textContent();
        if (text && text.includes('MANUAL ENTRY')) {
          await btn.click();
          await page.waitForTimeout(300);
          await captureScreenshot(page, 'modal-new-entry-empty', 'New entry modal (blank)', 'Data Entry');

          // Fill form
          try {
            await page.fill('input[type="number"]', '7.2');
            await page.waitForTimeout(200);
            await captureScreenshot(page, 'modal-new-entry-filled', 'New entry modal (filled)', 'Data Entry');
          } catch (e) {
            console.log('⚠ Form fill skipped');
          }

          // Close modal
          await page.keyboard.press('Escape');
          await page.waitForTimeout(300);
          break;
        }
      }
    } catch (e) {
      console.log('⚠ Data entry modal skipped');
    }

    // Edit modal
    try {
      const editButtons = await page.$$('button[aria-label*="Edit"]');
      if (editButtons.length > 0) {
        await editButtons[0].click();
        await page.waitForTimeout(300);
        await captureScreenshot(page, 'modal-edit-prefilled', 'Edit modal (prefilled)', 'Data Entry');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      }
    } catch (e) {
      console.log('⚠ Edit modal skipped');
    }

    // ========== 4. TABLE SCENARIOS ==========
    console.log('📸 4. Data Table\n');

    // Selected row
    try {
      const firstRow = await page.locator('tbody tr').first();
      if (await firstRow.isVisible({ timeout: 2000 })) {
        await firstRow.click({ timeout: 5000 });
        await page.waitForTimeout(300);
        await captureScreenshot(page, 'table-row-selected', 'Row selected (amber highlight)', 'Table');

        // Row hover (edit/delete icons)
        await firstRow.hover();
        await page.waitForTimeout(300);
        await captureScreenshot(page, 'table-row-hover', 'Row hover (icons visible)', 'Table');
      }
    } catch (e) {
      console.log('⚠ Table selection skipped');
    }

    // Empty state (delete all)
    try {
      let rowCount = await page.locator('tbody tr').count();
      while (rowCount > 0) {
        const firstRow = await page.locator('tbody tr').first();
        const deleteBtn = await firstRow.locator('button[aria-label*="Delete"]').first();
        if (await deleteBtn.isVisible({ timeout: 1000 })) {
          await deleteBtn.click({ timeout: 5000 });
          await page.waitForTimeout(200);
          rowCount = await page.locator('tbody tr').count();
        } else {
          break;
        }
      }
      await captureScreenshot(page, 'table-empty-state', 'Empty table state', 'Table');

      // Reload with data for next tests
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');
      await injectTestData(page);
      await page.waitForTimeout(500);
    } catch (e) {
      console.log('⚠ Table empty state skipped');
    }

    // ========== 5. SCANNING SCENARIOS ==========
    console.log('📸 5. Image Scanning\n');
    await captureScreenshot(page, 'scan-interface', 'Scan button visible (default state)', 'Scanning');

    // Scan overlay (progress and error states via JS)
    await page.evaluate(() => {
      (window as any).isScanning = true;
      (window as any).scanProgress = 40;
    });
    await page.waitForTimeout(200);
    await captureScreenshot(page, 'scan-overlay-progress', 'Scan progress overlay (40%)', 'Scanning');

    // Success state
    await page.evaluate(() => {
      (window as any).scanProgress = 100;
      (window as any).uploadSuccess = true;
    });
    await page.waitForTimeout(200);
    await captureScreenshot(page, 'scan-overlay-success', 'Scan success overlay', 'Scanning');

    // Error state
    await page.evaluate(() => {
      (window as any).isScanning = false;
      (window as any).uploadError = 'Could not extract readings from image';
    });
    await page.waitForTimeout(200);
    await captureScreenshot(page, 'scan-overlay-error', 'Scan error overlay', 'Scanning');

    // Close overlay
    await page.evaluate(() => {
      (window as any).isScanning = false;
      (window as any).uploadError = null;
    });
    await page.waitForTimeout(300);

    // ========== 6. AGP SCENARIOS ==========
    console.log('📸 6. Analytics & AGP Chart\n');

    // Navigate to AGP tab
    try {
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await btn.textContent();
        if (text && text.includes('AMBULATORY')) {
          await btn.click();
          await page.waitForTimeout(500);
          await captureScreenshot(page, 'agp-chart-trendlines-on', 'AGP chart with trendlines', 'Analytics');

          // Toggle trendlines off
          try {
            const allButtons = await page.$$('button');
            for (const trendBtn of allButtons) {
              const trendText = await trendBtn.textContent();
              if (trendText && trendText.includes('TRENDLINES')) {
                await trendBtn.click();
                await page.waitForTimeout(300);
                await captureScreenshot(page, 'agp-chart-trendlines-off', 'AGP chart without trendlines', 'Analytics');
                break;
              }
            }
          } catch (e) {
            console.log('⚠ Trendlines toggle skipped');
          }
          break;
        }
      }
    } catch (e) {
      console.log('⚠ AGP chart skipped');
    }

    // ========== 7. HELP & E2E SCENARIOS ==========
    console.log('📸 7. Help & E2E Test\n');

    // Help modal
    try {
      const helpButtons = await page.$$('button[title*="help"]');
      if (helpButtons.length > 0) {
        await helpButtons[0].click();
        await page.waitForTimeout(300);
        await captureScreenshot(page, 'help-modal-open', 'Help modal open', 'Help');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      }
    } catch (e) {
      console.log('⚠ Help modal skipped');
    }

    // Navigate to E2E Test tab
    try {
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await btn.textContent();
        if (text && text.includes('E2E TEST')) {
          await btn.click();
          await page.waitForTimeout(300);
          await captureScreenshot(page, 'e2e-test-idle', 'E2E test tab (idle)', 'E2E');

          // Run tests
          try {
            const allButtons = await page.$$('button');
            for (const runBtn of allButtons) {
              const runText = await runBtn.textContent();
              if (runText && runText.includes('Run Full Test Suite')) {
                await runBtn.click();
                await page.waitForTimeout(500);
                await captureScreenshot(page, 'e2e-test-running', 'E2E tests running', 'E2E');
                await page.waitForTimeout(5000);
                await captureScreenshot(page, 'e2e-test-complete', 'E2E tests complete with results', 'E2E');
                break;
              }
            }
          } catch (e) {
            console.log('⚠ Test run skipped');
          }
          break;
        }
      }
    } catch (e) {
      console.log('⚠ E2E test tab skipped');
    }

    // ========== FINALIZE ==========
    console.log('\n📝 Writing manifest...');
    const manifestPath = path.join(SCREENSHOT_DIR, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(screenshots, null, 2));

    console.log(`\n✅ Capture Complete!\n📊 Screenshots: ${screenshots.length}`);
    console.log(`📁 Location: ${SCREENSHOT_DIR}\n`);
    console.log('📸 Screenshots captured:');
    screenshots.forEach(s => console.log(`   ✓ ${s.name} — ${s.description}`));

  } catch (error) {
    console.error('❌ Capture failed:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

runCaptures().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});

export { runCaptures, screenshots };
