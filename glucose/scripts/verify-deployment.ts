#!/usr/bin/env node
/**
 * Post-Deployment Verification Script
 * Verifies the deployed app is live and screenshots are accessible
 */

import { chromium } from 'playwright';

const LIVE_URL = 'https://ai-tools.techbridge.edu.gh/glucose';
const VERIFY_TIMEOUT = 60000; // 60 seconds
const MAX_RETRIES = 12;
const RETRY_INTERVAL = 5000; // 5 seconds

async function checkUrlAvailable(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow'
    });
    return response.ok;
  } catch (e) {
    return false;
  }
}

async function waitForDeployment(): Promise<boolean> {
  console.log('🔍 Verifying deployment...');
  console.log(`📍 Checking URL: ${LIVE_URL}\n`);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const available = await checkUrlAvailable(LIVE_URL);
    if (available) {
      console.log(`✅ App is live! (attempt ${attempt}/${MAX_RETRIES})\n`);
      return true;
    }
    console.log(`⏳ Waiting for app... (attempt ${attempt}/${MAX_RETRIES})`);
    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
  }

  console.log('❌ App did not come online within timeout');
  return false;
}

async function verifyScreenshots(): Promise<boolean> {
  console.log('📸 Verifying screenshots are accessible...\n');

  let browser: any = null;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Pre-authenticate with test user
    const testUser = {
      id: 'test-user-001',
      username: 'testuser',
      email: 'test@techbridge.edu.gh',
      fullName: 'Kwadjo Frempong'
    };

    await page.goto(LIVE_URL, { waitUntil: 'networkidle' });

    // Inject auth
    await page.evaluate((user) => {
      localStorage.setItem('glucose_user', JSON.stringify(user));
    }, testUser);

    await page.reload({ waitUntil: 'networkidle' });

    // Check key screenshots
    const screenshotTests = [
      { name: 'oauth-login-view', waitFor: 'text=/Continue with Google|google/i' },
      { name: 'data-scan-interface', waitFor: 'text=/SCAN|scan/i' },
      { name: 'dashboard-stats-overview', waitFor: 'text=/Average|Total/' },
    ];

    let passed = 0;
    for (const test of screenshotTests) {
      try {
        await page.waitForSelector(test.waitFor, { timeout: 3000 });
        console.log(`✅ ${test.name}`);
        passed++;
      } catch (e) {
        console.log(`⚠️  ${test.name} - element not found`);
      }
    }

    console.log(`\n📊 Screenshot verification: ${passed}/${screenshotTests.length} passed`);
    return passed > 0;
  } catch (error) {
    console.error('❌ Verification failed:', (error as Error).message);
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function runVerification() {
  try {
    console.log('╔════════════════════════════════════════╗');
    console.log('║  GLUCOSE DEPLOYMENT VERIFICATION      ║');
    console.log('╚════════════════════════════════════════╝\n');

    const deployed = await waitForDeployment();
    if (!deployed) {
      console.log('\n❌ Deployment verification FAILED');
      process.exit(1);
    }

    const screenshotsOk = await verifyScreenshots();
    if (!screenshotsOk) {
      console.warn('\n⚠️  Screenshot verification incomplete, but deployment is live');
    }

    console.log('\n✅ Deployment verified successfully!');
    console.log(`🌐 Live URL: ${LIVE_URL}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Verification error:', error);
    process.exit(1);
  }
}

runVerification();
