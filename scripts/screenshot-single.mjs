import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { mkdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appName = process.argv[2];
if (!appName) { console.error('Usage: node screenshot-single.mjs <app-name>'); process.exit(1); }

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1920, height: 1080 });
const htmlPath = resolve(__dirname, '..', appName, 'dist', 'index.html');
const fileUrl = 'file:///' + htmlPath.split('\\').join('/');
await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const outPath = resolve(__dirname, '..', 'catalogue', appName, 'screenshot.png');
mkdirSync(dirname(outPath), { recursive: true });
await page.screenshot({ path: outPath, fullPage: false });
await browser.close();
const size = statSync(outPath).size;
console.log(`✓ ${appName}: ${size} bytes`);
