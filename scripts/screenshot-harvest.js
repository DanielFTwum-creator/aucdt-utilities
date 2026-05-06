#!/usr/bin/env node
/**
 * Screenshot Harvester — Playwright
 * Techbridge University College / TUC
 *
 * Captures screenshots of all 255 apps via the gateway
 * and saves them to catalogue/project-screenshots/<appname>.png
 *
 * Each screenshot is the DEFINITIVE visual validator for the app.
 * A blank/white screenshot = broken app = gap to investigate.
 *
 * Prerequisites:
 *   pnpm add -D @playwright/test  (from repo root)
 *   npx playwright install chromium
 *   docker-compose -f docker-compose-all-apps.yml --profile standard up -d
 *
 * Usage:
 *   node scripts/screenshot-harvest.js               # all apps
 *   node scripts/screenshot-harvest.js --app=kanban-app
 *   node scripts/screenshot-harvest.js --concurrency=5
 *   node scripts/screenshot-harvest.js --retry-blank  # re-shoot white images
 *   node scripts/screenshot-harvest.js --report-only  # show last run results
 */

const fs   = require('fs');
const path = require('path');

const ROOT      = path.resolve(__dirname, '..');
const SHOTS_DIR = path.join(ROOT, 'catalogue', 'project-screenshots');
const REPORT_FILE = path.join(ROOT, 'catalogue', 'screenshot-report.json');
const GATEWAY   = process.env.GATEWAY || 'http://localhost:8080';

const APP_ARG     = (process.argv.find(a => a.startsWith('--app=')) || '').replace('--app=', '');
const CONCURRENCY = parseInt((process.argv.find(a => a.startsWith('--concurrency=')) || '--concurrency=4').split('=')[1]);
const RETRY_BLANK = process.argv.includes('--retry-blank');
const REPORT_ONLY = process.argv.includes('--report-only');

const SKIP = new Set([
  'node_modules','.git','dist','build','scripts','templates','thumbnail-generator',
  'backend','aucdt-portal-tests','tuc-portal-tests','docker','docs','archive',
  'catalogue','project-screenshots','project-screenshots-real','monitoring',
  'reports','build-validation-reports','proof-of-concept-screenshots',
  'master-thumbnail-catalog','playwright','src','gemini','genai','sync-from-d-drive'
]);

// ── Report-only mode ──────────────────────────────────────────────────────────
if (REPORT_ONLY) {
  if (!fs.existsSync(REPORT_FILE)) {
    console.log('No report found. Run without --report-only first.');
    process.exit(0);
  }
  const report = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
  console.log('\n== Last Screenshot Run ==');
  console.log(`Date:     ${report.date}`);
  console.log(`Total:    ${report.total}`);
  console.log(`Success:  ${report.success}`);
  console.log(`Blank:    ${report.blank.length}`);
  console.log(`Failed:   ${report.failed.length}`);
  if (report.blank.length)  { console.log('\n⚠️  Blank (app renders empty):');  report.blank.forEach(a  => console.log(' ', a)); }
  if (report.failed.length) { console.log('\n✗  Failed (nav/timeout error):');  report.failed.forEach(a => console.log(' ', a.name, '-', a.reason)); }
  process.exit(0);
}

// ── Discover apps ─────────────────────────────────────────────────────────────
function getApps() {
  const apps = [];
  for (const e of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (!e.isDirectory() || SKIP.has(e.name) || e.name.startsWith('.')) continue;
    if (APP_ARG && e.name !== APP_ARG) continue;
    if (!fs.existsSync(path.join(ROOT, e.name, 'package.json'))) continue;
    apps.push(e.name);
  }
  return apps.sort();
}

// ── Blank detection (Node.js, no canvas) ─────────────────────────────────────
// Uses Playwright's screenshot buffer — check PNG IDAT chunk pixel variance
function isBlank(pngBuffer) {
  // Quick heuristic: if file is very small it's likely a blank/error page
  if (pngBuffer.length < 8000) return true;
  // Sample bytes from body of PNG for variance — solid colour = low variance
  const sample = pngBuffer.slice(100, Math.min(5000, pngBuffer.length));
  let min = 255, max = 0;
  for (const b of sample) { if (b < min) min = b; if (b > max) max = b; }
  // Very low variance in raw bytes → likely solid white or solid colour
  return (max - min) < 8;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  let playwright;
  try {
    playwright = require('@playwright/test');
  } catch {
    console.error('\n✗ @playwright/test not installed.');
    console.error('  Run: pnpm add -D @playwright/test && npx playwright install chromium\n');
    process.exit(1);
  }

  const { chromium } = playwright;
  const apps = getApps();
  console.log(`\nScreenshot Harvester — ${apps.length} apps — concurrency ${CONCURRENCY}`);
  console.log(`Gateway: ${GATEWAY}\n`);

  fs.mkdirSync(SHOTS_DIR, { recursive: true });

  const results = { success: [], blank: [], failed: [] };
  let done = 0;

  // Process in batches
  async function processApp(appName, browser) {
    const url      = `${GATEWAY}/${appName}/`;
    const outFile  = path.join(SHOTS_DIR, appName + '.png');

    // Skip if already captured and not in retry-blank mode
    if (fs.existsSync(outFile) && !RETRY_BLANK && !APP_ARG) {
      results.success.push(appName);
      return;
    }

    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1.5,
    });
    const page = await context.newPage();

    try {
      await page.goto(url, {
        timeout: 20000,
        waitUntil: 'networkidle',
      });

      // Extra wait for heavy React apps
      await page.waitForTimeout(1500);

      // Dismiss any overlay / cookie banners
      for (const sel of ['button:has-text("Accept")', 'button:has-text("Close")', '[aria-label="Close"]']) {
        try { await page.click(sel, { timeout: 800 }); } catch { /* no overlay */ }
      }

      const buf = await page.screenshot({
        fullPage: false,
        type: 'png',
        clip: { x: 0, y: 0, width: 1280, height: 800 },
      });

      if (isBlank(buf)) {
        // Wait another 3s and retry once
        await page.waitForTimeout(3000);
        const buf2 = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1280, height: 800 } });
        if (isBlank(buf2)) {
          results.blank.push(appName);
          console.log(`  ⚪ ${appName} (blank)`);
        } else {
          fs.writeFileSync(outFile, buf2);
          results.success.push(appName);
          console.log(`  ✓ ${appName}`);
        }
      } else {
        fs.writeFileSync(outFile, buf);
        results.success.push(appName);
        console.log(`  ✓ ${appName}`);
      }
    } catch (err) {
      results.failed.push({ name: appName, reason: err.message.split('\n')[0] });
      console.log(`  ✗ ${appName} — ${err.message.split('\n')[0]}`);
    } finally {
      await context.close();
    }
  }

  const browser = await chromium.launch({ headless: true });

  // Batch concurrency
  for (let i = 0; i < apps.length; i += CONCURRENCY) {
    const batch = apps.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(a => processApp(a, browser)));
    done += batch.length;
    const pct = Math.round((done / apps.length) * 100);
    process.stdout.write(`\r  Progress: ${done}/${apps.length} (${pct}%) `);
  }

  await browser.close();
  console.log('\n');

  // ── Report ──────────────────────────────────────────────────────────────────
  const report = {
    date:    new Date().toISOString(),
    total:   apps.length,
    success: results.success.length,
    blank:   results.blank,
    failed:  results.failed,
  };
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

  console.log('== Screenshot Report ==');
  console.log(`✓  Success:  ${results.success.length}/${apps.length}`);
  if (results.blank.length)  console.log(`⚪ Blank:    ${results.blank.length} (app renders empty — investigate)`);
  if (results.failed.length) console.log(`✗  Failed:   ${results.failed.length} (navigation/timeout)`);
  console.log(`\nReport saved: catalogue/screenshot-report.json`);

  if (results.blank.length || results.failed.length) {
    console.log('\n⚠️  Broken apps detected (need investigation):');
    results.blank.forEach(a  => console.log(`  ⚪ ${a} — renders blank`));
    results.failed.forEach(a => console.log(`  ✗  ${a.name} — ${a.reason}`));
    console.log('\nRe-run after fixing: node scripts/screenshot-harvest.js --retry-blank');
  }

  // Regenerate gallery with fresh screenshots
  console.log('\nRegenerating gallery…');
  try {
    require('./regenerate-gallery.js');
  } catch { /* gallery script exits process */ }

  process.exit(results.failed.length > 0 ? 1 : 0);
}

main().catch(err => { console.error(err); process.exit(1); });
