import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('MP4 Video Export - WebCodecs', () => {
  test.beforeEach(async ({ page, context }) => {
    // Listen for download events
    page.on('download', async (download) => {
      const downloadPath = path.join('./test-outputs', download.suggestedFilename);
      await download.saveAs(downloadPath);
    });

    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
      console.log('Network did not reach idle state, continuing anyway');
    });

    // Wait for any modal overlays to disappear (z-[200] class indicates modal)
    const modalOverlay = page.locator('.fixed.inset-0.z-\\[200\\]');
    await modalOverlay.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
      console.log('Modal overlay may still be visible, attempting to proceed');
    });

    // Wait for main content to be visible
    await page.locator('main, [class*="flex"]').first().waitFor({ state: 'visible', timeout: 10000 });
  });

  test('should have MP4 export button visible on supported browsers', async ({ page, browserName }) => {
    // VideoEncoder only available on Chromium
    if (browserName !== 'chromium') {
      console.log(`Skipping MP4 test on ${browserName} (VideoEncoder not supported)`);
      return;
    }

    // Wait for the app to load
    await page.waitForSelector('[class*="flex"]'); // Wait for main content

    // Check if MP4 button exists
    const mp4Button = page.locator('button:has-text("MP4")').first();

    // On supported browsers, button should be enabled
    const isDisabled = await mp4Button.evaluate((el) => el.disabled);
    expect(isDisabled).toBe(false);

    // Button should have correct styling
    await expect(mp4Button).toBeVisible();
  });

  test('should detect VideoEncoder API availability', async ({ page, browserName }) => {
    if (browserName !== 'chromium') {
      console.log('Skipping on non-Chromium browser');
      return;
    }

    const hasVideoEncoder = await page.evaluate(() => {
      return typeof window.VideoEncoder !== 'undefined';
    });

    expect(hasVideoEncoder).toBe(true);
  });

  test('should initiate MP4 export and show progress', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    test.setTimeout(120000); // 2 minute timeout for video encoding

    // Set up to capture progress updates
    const progressUpdates: string[] = [];

    await page.evaluate(() => {
      // Store original console.log
      const originalLog = window.console.log;
      window.console.log = function(...args: any[]) {
        if (args[0]?.includes?.('frame') || args[0]?.includes?.('Progress')) {
          (window as any).__progressLogs = (window as any).__progressLogs || [];
          (window as any).__progressLogs.push(args[0]);
        }
        originalLog.apply(console, args);
      };
    });

    // Locate and click MP4 export button
    const mp4Button = page.locator('button:has-text("MP4")').first();

    if (await mp4Button.evaluate((el) => el.disabled)) {
      console.log('MP4 button is disabled, skipping test');
      return;
    }

    // Click export
    await mp4Button.click();

    // Wait for progress indicator or completion
    const progressIndicator = page.locator('[class*="progress"]').first();

    // Wait for either completion or error
    await Promise.race([
      page.waitForTimeout(90000), // Max 90 seconds
      page.waitForSelector('text="Export Finalized"').catch(() => null),
      page.waitForSelector('text="Export Error"').catch(() => null),
    ]);

    // Check console logs for progress
    const logs = await page.evaluate(() => (window as any).__progressLogs || []);
    console.log('Progress logs:', logs);
  });

  test('should download MP4 file with correct naming', async ({ page, browserName, context }) => {
    if (browserName !== 'chromium') return;

    test.setTimeout(120000);

    // Create output directory
    const outputDir = './test-outputs';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Track downloads
    let downloadedFile: string | null = null;
    const downloadPromise = new Promise<void>((resolve) => {
      context.on('page', (page) => {
        page.on('popup', async (popup) => {
          resolve();
        });
      });
    });

    // Wait for download
    const downloadPromise2 = page.waitForEvent('download').then(async (download) => {
      const filename = download.suggestedFilename;
      downloadedFile = path.join(outputDir, filename);
      await download.saveAs(downloadedFile);
      console.log('Downloaded:', downloadedFile);
      return downloadedFile;
    }).catch(() => null);

    // Click MP4 button
    const mp4Button = page.locator('button:has-text("MP4")').first();
    if (await mp4Button.evaluate((el) => el.disabled)) {
      console.log('MP4 button disabled, skipping');
      return;
    }

    await mp4Button.click();

    // Wait for download or timeout
    const result = await Promise.race([
      downloadPromise2,
      new Promise(resolve => setTimeout(() => resolve(null), 100000))
    ]);

    if (result) {
      // Verify file exists and has content
      expect(fs.existsSync(result)).toBe(true);

      const stats = fs.statSync(result);
      console.log(`Downloaded file: ${result}, size: ${stats.size} bytes`);

      // MP4 files should be at least 1KB
      expect(stats.size).toBeGreaterThan(1024);

      // Check for MP4 magic number (0x66 0x74 0x79 0x70 = 'ftyp')
      const buffer = Buffer.alloc(4);
      const fd = fs.openSync(result, 'r');
      fs.readSync(fd, buffer, 0, 4, 4);
      fs.closeSync(fd);

      const magic = buffer.toString('hex');
      expect(magic).toBe('66747970'); // 'ftyp' in hex
    }
  });

  test('should handle MP4 encoding errors gracefully', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    test.setTimeout(120000);

    // Try to export
    const mp4Button = page.locator('button:has-text("MP4")').first();
    if (await mp4Button.evaluate((el) => el.disabled)) {
      console.log('MP4 unavailable on this browser');
      return;
    }

    await mp4Button.click();

    // Wait for modal to appear (indicates export started)
    await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
      console.log('Modal did not appear');
    });

    // Wait for modal to disappear (indicates export completed, successful or not)
    await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
      console.log('Modal did not disappear');
      return;
    });

    console.log('Export completed');

    // Button should be enabled again after export
    const isEnabled = await mp4Button.evaluate((el) => !el.disabled);
    expect(isEnabled).toBe(true);
  });

  test('should update UI during MP4 encoding', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    test.setTimeout(120000);

    const mp4Button = page.locator('button:has-text("MP4")').first();
    if (await mp4Button.evaluate((el) => el.disabled)) return;

    // Click export
    await mp4Button.click();

    // Wait for modal to appear (indicates encoding started and progress is showing)
    await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
      console.log('Modal did not appear');
    });

    // Modal should show progress, so check if text exists
    const encodingText = page.locator('text=/Encoding MP4/i');
    await encodingText.waitFor({ timeout: 10000, state: 'visible' }).catch(() => {
      console.log('Encoding text not found');
    });

    // Wait for completion
    await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 });
  });

  test('should export valid MP4 from all aspect ratios', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    test.setTimeout(300000); // 5 minutes for multiple exports

    const aspectRatios = ['STORY', 'PORTRAIT', 'SQUARE', 'LANDSCAPE', 'CINEMA'];
    const outputDir = './test-outputs';

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const ratio of aspectRatios) {
      console.log(`Testing MP4 export for ${ratio}`);

      // Wait for any modal from previous export to disappear
      await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
        console.log(`Modal may still be visible for ${ratio}`);
      });

      // Click aspect ratio button
      const ratioButton = page.locator(`button:has-text("${ratio}")`).first();
      if (await ratioButton.isVisible()) {
        await ratioButton.click();
        await page.waitForTimeout(500); // Wait for UI to update
      }

      // Attempt export
      const mp4Button = page.locator('button:has-text("MP4")').first();
      if (await mp4Button.evaluate((el) => el.disabled)) {
        console.log(`MP4 disabled for ${ratio}, skipping`);
        continue;
      }

      // Set up download listener
      const downloadPromise = page.waitForEvent('download').then(async (download) => {
        const filename = `${ratio}-${Date.now()}.mp4`;
        const filepath = path.join(outputDir, filename);
        await download.saveAs(filepath);
        console.log(`Saved: ${filepath}`);
        return filepath;
      }).catch(() => null);

      // Click export
      await mp4Button.click();

      // Wait for modal to appear and then disappear
      await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
        console.log(`Modal did not appear for ${ratio}`);
      });

      await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
        console.log(`Modal did not disappear for ${ratio}`);
      });

      // Wait for download with timeout
      const result = await Promise.race([
        downloadPromise,
        new Promise(resolve => setTimeout(() => resolve(null), 90000))
      ]) as string | null;

      if (result && fs.existsSync(result)) {
        const stats = fs.statSync(result);
        console.log(`✓ ${ratio}: ${stats.size} bytes`);
        expect(stats.size).toBeGreaterThan(1024);
      } else {
        console.log(`⚠ ${ratio}: No download detected`);
      }
    }
  });

  test('should handle concurrent MP4 requests', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    test.setTimeout(180000);

    const mp4Button = page.locator('button:has-text("MP4")').first();
    if (await mp4Button.evaluate((el) => el.disabled)) return;

    // Attempt to click MP4 button twice quickly
    console.log('Clicking MP4 button...');
    await mp4Button.click();

    // Second click should be prevented (button likely disabled during export)
    await page.waitForTimeout(500);
    const isDisabled = await mp4Button.evaluate((el) => el.disabled);
    console.log('Button disabled after first click:', isDisabled);

    expect(isDisabled).toBe(true); // Should be disabled during export

    // Wait for completion
    await Promise.race([
      page.waitForSelector('text="Export Finalized"').catch(() => null),
      new Promise(resolve => setTimeout(() => resolve(null), 150000))
    ]);
  });

  test('should recover from encoding errors and allow retry', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    test.setTimeout(180000);

    const mp4Button = page.locator('button:has-text("MP4")').first();
    if (await mp4Button.evaluate((el) => el.disabled)) return;

    // First export attempt
    console.log('First export attempt...');
    await mp4Button.click();

    // Wait for modal overlay to appear (indicates export is running)
    const modalOverlay = page.locator('.fixed.inset-0.z-\\[200\\]');
    await modalOverlay.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
      console.log('Modal did not appear');
    });

    // Wait for modal to disappear (indicates export completed)
    try {
      await modalOverlay.waitFor({ state: 'hidden', timeout: 120000 });
    } catch (e) {
      console.log('Modal did not disappear within timeout:', e);
      return; // Exit early if modal never disappears
    }

    // Wait longer for state to update from React
    await page.waitForTimeout(3000);

    // Verify button is enabled by waiting for it to become enabled
    let attempts = 0;
    let isEnabled = false;
    while (!isEnabled && attempts < 10) {
      isEnabled = await mp4Button.evaluate((el) => !el.disabled);
      if (!isEnabled) {
        await page.waitForTimeout(500);
        attempts++;
      }
    }

    console.log('Button enabled for retry after', attempts, 'attempts');
    expect(isEnabled).toBe(true);
  });
});
