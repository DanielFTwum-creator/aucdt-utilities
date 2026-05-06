#!/usr/bin/env node
const chromium = require('playwright').chromium;
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, '../project-screenshots');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const projects = fs.readdirSync(path.join(__dirname, '..'))
  .filter(d => fs.existsSync(path.join(__dirname, '..', d, 'index.html')))
  .slice(0, 50); // First 50 only for batch

(async () => {
  const browser = await chromium.launch({ headless: 'new', args: ['--no-sandbox'] });
  let done = 0;

  for (const proj of projects) {
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 720 });
      await page.goto(`file://${path.join(__dirname, '..', proj, 'index.html')}`, { timeout: 5000 });
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${proj}.png`) });
      await page.close();
      done++;
      console.log(`✓ ${done}/${projects.length} ${proj}`);
    } catch (e) {
      console.log(`✗ ${proj}`);
    }
  }

  await browser.close();
  console.log(`\nDone: ${done}/${projects.length} screenshots in ${SCREENSHOT_DIR}`);
})();
