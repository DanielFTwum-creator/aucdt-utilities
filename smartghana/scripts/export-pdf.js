/**
 * SmartGhana — Alliance Brief PDF Export
 *
 * Captures the Alliance Brief document as a print-quality A4 PDF
 * using Playwright Chromium.
 *
 * Usage:
 *   pnpm run export-pdf
 *
 * Output:
 *   exports/Techbridge-SmartBridge-Alliance-Brief.pdf
 */

import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const EXPORTS = resolve(ROOT, 'exports');
const PORT = 4174;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function testPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/`, (res) => {
      resolve(res.statusCode < 500);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(500, () => req.destroy());
  });
}

function startPreviewServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      'pnpm',
      ['exec', 'vite', 'preview', '--port', String(PORT)],
      { cwd: ROOT, shell: process.platform === 'win32', stdio: 'inherit' }
    );

    proc.on('error', reject);

    let attempts = 0;
    const checkReady = async () => {
      attempts++;
      if (attempts > 30) {
        reject(new Error('Preview server failed to start after 30 attempts'));
        return;
      }
      const ready = await testPort(PORT) || await testPort(4173);
      if (ready) {
        resolve(proc);
      } else {
        setTimeout(checkReady, 200);
      }
    };

    setTimeout(checkReady, 500);
  });
}

async function detectPort() {
  if (await testPort(PORT)) return PORT;
  if (await testPort(4173)) return 4173;
  throw new Error('Preview server not responding on ports 4174 or 4173');
}

async function main() {
  mkdirSync(EXPORTS, { recursive: true });

  console.log('\n⚙  Building production bundle...');
  const { execSync } = await import('child_process');
  execSync('pnpm exec vite build', { cwd: ROOT, stdio: 'inherit' });

  console.log('\n🚀 Starting preview server...');
  const server = await startPreviewServer();
  await sleep(2000);

  const actualPort = await detectPort();
  const briefUrl = `http://localhost:${actualPort}/?brief=1`;

  const browser = await chromium.launch();

  try {
    const context = await browser.newContext({
      viewport: { width: 794, height: 1123 }, // A4 at 96dpi
    });
    const page = await context.newPage();

    console.log(`\n📄 Capturing Alliance Brief from ${briefUrl}...`);
    await page.goto(briefUrl, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for all resources and allow fonts/images to settle
    await page.waitForLoadState('networkidle');
    await sleep(2000);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      displayHeaderFooter: false,
    });

    // Generate timestamp (ISO format: YYYY-MM-DD-HHmmss)
    const now = new Date();
    const timestamp = now.toISOString().split('T')[0] + '-' +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');

    const outPath = resolve(EXPORTS, `Techbridge-SmartBridge-Alliance-Brief-${timestamp}.pdf`);
    writeFileSync(outPath, pdfBuffer);
    console.log(`  ✅ Saved → exports/Techbridge-SmartBridge-Alliance-Brief-${timestamp}.pdf`);

  } finally {
    await browser.close();
    server.kill();
  }

  console.log('\n✅ Export complete.\n');
}

main().catch(err => {
  console.error('\n❌ Export failed:', err.message);
  process.exit(1);
});
