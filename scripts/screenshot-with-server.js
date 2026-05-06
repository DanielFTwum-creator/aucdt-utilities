#!/usr/bin/env node
const chromium = require('playwright').chromium;
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, '../project-screenshots');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function captureWithServer(projectDir, projectName, port = 4173) {
  return new Promise((resolve) => {
    // Start vite preview server
    const server = spawn('npx', ['vite', 'preview', '--port', port], {
      cwd: projectDir,
      shell: true,
      stdio: 'pipe'
    });

    setTimeout(async () => {
      try {
        const browser = await chromium.launch({
          headless: 'new',
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });

        await page.goto(`http://localhost:${port}`, {
          waitUntil: 'networkidle0',
          timeout: 15000
        });

        await page.waitForTimeout(2000);

        const screenshotPath = path.join(SCREENSHOT_DIR, `${projectName}.png`);
        await page.screenshot({
          path: screenshotPath,
          fullPage: false
        });

        await browser.close();
        server.kill();

        console.log(`✓ ${projectName}`);
        resolve(true);
      } catch (error) {
        server.kill();
        console.log(`✗ ${projectName}: ${error.message}`);
        resolve(false);
      }
    }, 3000);
  });
}

async function main() {
  const rootDir = path.join(__dirname, '..');
  const projects = fs.readdirSync(rootDir)
    .filter(item => {
      const fullPath = path.join(rootDir, item);
      return fs.statSync(fullPath).isDirectory()
        && fs.existsSync(path.join(fullPath, 'package.json'))
        && fs.existsSync(path.join(fullPath, 'index.html'))
        && !item.startsWith('.')
        && !['node_modules', 'docker', 'scripts', 'templates'].includes(item);
    })
    .slice(0, 10); // First 10 for testing

  console.log(`Found ${projects.length} projects\n`);

  let captured = 0;
  let port = 4173;

  for (const project of projects) {
    const success = await captureWithServer(
      path.join(rootDir, project),
      project,
      port++
    );
    if (success) captured++;
  }

  console.log(`\n✓ Captured ${captured}/${projects.length} screenshots`);
}

main().catch(console.error);
