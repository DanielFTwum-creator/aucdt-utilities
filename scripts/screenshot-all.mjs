import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { mkdirSync, statSync, existsSync, readdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { extname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const SMALL_THRESHOLD = 20 * 1024; // 20KB
const FILE_TIMEOUT = 10000;
const SERVE_TIMEOUT = 15000;
const WAIT_AFTER_LOAD = 3000;
const SCREENSHOT_TIMEOUT = 10000;
const RESUME = process.argv.includes('--resume');
const SERVE_PORT = 4399;

const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.mjs': 'application/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.gif': 'image/gif',
};

let currentDistPath = '';

// Single shared static file server (reused across all apps)
const server = createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = join(currentDistPath, urlPath);
  if (existsSync(filePath)) {
    const ext = extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(readFileSync(filePath));
  } else {
    // SPA fallback: serve index.html for unknown routes
    const indexPath = join(currentDistPath, 'index.html');
    if (existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(readFileSync(indexPath));
    } else {
      res.writeHead(404); res.end('Not found');
    }
  }
});

function startStaticServer() {
  return new Promise(res => server.listen(SERVE_PORT, '127.0.0.1', res));
}

function stopStaticServer() {
  return new Promise(res => server.close(res));
}

function findApps() {
  const apps = [];
  const entries = readdirSync(ROOT, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    if (['node_modules', 'scripts', 'catalogue', 'templates', 'reports',
         'build-logs', 'install-logs', 'tests', 'docker', '.git',
         'src', 'backend', 'archive', 'test-results', 'lems', 'send-platform-api'].includes(name)) continue;
    if (existsSync(resolve(ROOT, name, 'dist', 'index.html'))) {
      apps.push(name);
    }
  }
  return apps.sort();
}

function existingSize(appName) {
  const p = resolve(ROOT, 'catalogue', appName, 'screenshot.png');
  return existsSync(p) ? statSync(p).size : 0;
}

async function safeScreenshot(page, outPath) {
  return Promise.race([
    page.screenshot({ path: outPath, fullPage: false }),
    new Promise((_, rej) => setTimeout(() => rej(new Error('screenshot timeout')), SCREENSHOT_TIMEOUT)),
  ]);
}

async function processApp(browser, appName) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  const outPath = resolve(ROOT, 'catalogue', appName, 'screenshot.png');
  mkdirSync(dirname(outPath), { recursive: true });
  let size = 0;
  let method = 'file';

  // Try file:// first
  try {
    const htmlPath = resolve(ROOT, appName, 'dist', 'index.html');
    const fileUrl = 'file:///' + htmlPath.split('\\').join('/');
    await page.goto(fileUrl, { waitUntil: 'domcontentloaded', timeout: FILE_TIMEOUT });
    await page.waitForTimeout(WAIT_AFTER_LOAD);
    await safeScreenshot(page, outPath);
    size = statSync(outPath).size;
  } catch (e) {
    size = 0;
  }

  // If small, retry via built-in server
  if (size < SMALL_THRESHOLD) {
    method = 'served';
    currentDistPath = resolve(ROOT, appName, 'dist');
    try {
      await page.goto(`http://127.0.0.1:${SERVE_PORT}/`, {
        waitUntil: 'networkidle', timeout: SERVE_TIMEOUT
      }).catch(() =>
        page.goto(`http://127.0.0.1:${SERVE_PORT}/`, {
          waitUntil: 'domcontentloaded', timeout: SERVE_TIMEOUT
        })
      );
      await page.waitForTimeout(WAIT_AFTER_LOAD);
      await safeScreenshot(page, outPath);
      size = existsSync(outPath) ? statSync(outPath).size : 0;
    } catch (e) {
      console.log(`  [serve err] ${appName}: ${e.message?.slice(0, 70)}`);
    }
  }

  await page.close();
  return { appName, size, method };
}

async function main() {
  const allApps = findApps();
  const apps = RESUME
    ? allApps.filter(a => existingSize(a) < SMALL_THRESHOLD)
    : allApps;

  console.log(`Found ${allApps.length} total. Processing ${apps.length}${RESUME ? ' (resume)' : ''}`);

  await startStaticServer();

  // Restart browser every 30 apps to free memory
  const BROWSER_RESTART = 30;
  let browser = await chromium.launch();
  let done = 0;
  const total = apps.length;
  const results = [];

  for (let i = 0; i < apps.length; i++) {
    if (i > 0 && i % BROWSER_RESTART === 0) {
      await browser.close();
      browser = await chromium.launch();
    }
    const r = await processApp(browser, apps[i]);
    done++;
    const kb = (r.size / 1024).toFixed(1);
    const warn = r.size < SMALL_THRESHOLD ? ' ⚠ SMALL' : '';
    console.log(`[${done}/${total}] ${r.appName} — ${kb}KB (${r.method})${warn}`);
    results.push(r);
  }

  await browser.close();
  await stopStaticServer();

  const small = results.filter(r => r.size < SMALL_THRESHOLD);
  console.log(`\nDone. ${results.length} processed. ${results.length - small.length} good.`);
  if (small.length > 0) {
    console.log(`\n${small.length} still small:`);
    for (const r of small) console.log(`  ${r.appName} — ${(r.size / 1024).toFixed(1)}KB`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
