import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { mkdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appName = process.argv[2];
const port = process.argv[3] || '4099';
if (!appName) { console.error('Usage: node screenshot-served.mjs <app-name> <port>'); process.exit(1); }

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1920, height: 1080 });
await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() =>
  page.goto(`http://localhost:${port}`, { waitUntil: 'domcontentloaded' })
);
await page.waitForTimeout(4000);
const outPath = resolve(__dirname, '..', 'catalogue', appName, 'screenshot.png');
mkdirSync(dirname(outPath), { recursive: true });
await page.screenshot({ path: outPath, fullPage: false });
await browser.close();
const size = statSync(outPath).size;
console.log(`✓ ${appName}: ${size} bytes`);
