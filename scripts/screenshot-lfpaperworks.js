const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  const htmlPath = path.resolve(__dirname, '../lfpaperworks/dist/index.html');
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const outPath = path.resolve(__dirname, '../catalogue/lfpaperworks/screenshot.png');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await page.screenshot({ path: outPath, fullPage: false });
  await browser.close();
  const size = fs.statSync(outPath).size;
  console.log('Screenshot saved: ' + size + ' bytes');
})();
