const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

const appName = process.argv[2];
if (!appName) {
  console.error('Usage: node capture-single-app.js <app-name>');
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  const htmlPath = path.resolve(`${appName}/dist/index.html`);
  const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;

  console.log(`Loading ${fileUrl}...`);
  await page.goto(fileUrl, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(5000);

  await fs.mkdir(`catalogue/${appName}`, { recursive: true });
  await page.screenshot({ path: `catalogue/${appName}/screenshot.png`, fullPage: false });

  const stats = await fs.stat(`catalogue/${appName}/screenshot.png`);
  console.log(`✓ Screenshot captured: ${Math.round(stats.size/1024)}KB`);

  await browser.close();
})();
