/**
 * local-screenshot.js
 * Spins up each app's vite dev server, captures a real screenshot, kills it.
 * No Docker required. Runs 4 apps concurrently on ports 5200-5203.
 *
 * Usage:
 *   node scripts/local-screenshot.js              # all apps
 *   node scripts/local-screenshot.js --app=kanban-app
 *   node scripts/local-screenshot.js --concurrency=2
 *   node scripts/local-screenshot.js --skip-existing
 */

const { chromium } = require('@playwright/test');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

const ROOT = path.resolve(__dirname, '..');
const SHOTS_DIR = path.join(ROOT, 'catalogue', 'project-screenshots');
const REPORT_PATH = path.join(ROOT, 'catalogue', 'local-screenshot-report.json');

const SKIP = new Set([
  'node_modules', '.git', 'catalogue', 'scripts', 'archive', 'docs',
  'dist', 'build', 'tests', 'test-results', 'aucdt-portal-tests',
  'playwright-report', 'backend'
]);

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

const CONCURRENCY = parseInt(args.concurrency ?? '4', 10);
const SKIP_EXISTING = !!args['skip-existing'];
const ONLY_APP = args.app ?? null;
const BASE_PORT = 5200;

fs.mkdirSync(SHOTS_DIR, { recursive: true });

// ── Discover apps ────────────────────────────────────────────────────────────
function getApps() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(e => e.isDirectory() && !SKIP.has(e.name) && !e.name.startsWith('.'))
    .filter(e => {
      const pkg = path.join(ROOT, e.name, 'package.json');
      if (!fs.existsSync(pkg)) return false;
      // Must have a vite config or a dev script
      const hasVite = fs.existsSync(path.join(ROOT, e.name, 'vite.config.ts'))
                   || fs.existsSync(path.join(ROOT, e.name, 'vite.config.js'));
      if (!hasVite) return false;
      const scripts = JSON.parse(fs.readFileSync(pkg, 'utf8')).scripts ?? {};
      return !!scripts.dev || !!scripts.start;
    })
    .map(e => e.name)
    .sort()
    .filter(name => !ONLY_APP || name === ONLY_APP);
}

// ── Port utilities ───────────────────────────────────────────────────────────
function waitForPort(port, timeout = 20000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      const client = new net.Socket();
      client.setTimeout(500);
      client.connect(port, '127.0.0.1', () => {
        client.destroy();
        resolve();
      });
      client.on('error', () => {
        client.destroy();
        if (Date.now() - start > timeout) {
          reject(new Error(`Port ${port} not ready after ${timeout}ms`));
        } else {
          setTimeout(check, 400);
        }
      });
      client.on('timeout', () => {
        client.destroy();
        setTimeout(check, 400);
      });
    };
    check();
  });
}

// ── Screenshot one app ───────────────────────────────────────────────────────
async function screenshotApp(browser, appName, port) {
  const appDir = path.join(ROOT, appName);
  const outPath = path.join(SHOTS_DIR, `${appName}.png`);

  let proc = null;
  const result = { app: appName, port, status: 'unknown', path: outPath };

  try {
    // Use local vite binary directly (faster than pnpm exec on Windows)
    const viteBin = path.join(appDir, 'node_modules', '.bin', process.platform === 'win32' ? 'vite.cmd' : 'vite');
    const viteExists = fs.existsSync(viteBin) || fs.existsSync(viteBin.replace('.cmd', ''));
    const viteCmd = viteExists ? viteBin : 'vite';

    proc = spawn(viteCmd, ['--port', String(port), '--host', '0.0.0.0'], {
      cwd: appDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
      env: { ...process.env, BROWSER: 'none', NO_OPEN: '1', VITE_CJS_IGNORE_WARNING: '1' }
    });

    proc.stderr.on('data', () => {}); // suppress stderr
    proc.stdout.on('data', () => {}); // suppress stdout

    // Wait for port ready (30s timeout)
    await waitForPort(port, 30000);

    // Give it an extra moment to finish rendering
    await new Promise(r => setTimeout(r, 1500));

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });

    try {
      await page.goto(`http://localhost:${port}/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      // Wait for network idle (APIs resolve) or 5s, whichever comes first
      await Promise.race([
        page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {}),
        new Promise(r => setTimeout(r, 5000)),
      ]);
      await page.waitForTimeout(1000); // final settle

      await page.screenshot({ path: outPath, fullPage: false });

      // Check if screenshot is usable (not blank)
      const stat = fs.statSync(outPath);
      result.size = stat.size;
      result.status = stat.size > 5000 ? 'ok' : 'blank';
    } finally {
      await page.close();
    }

  } catch (err) {
    result.status = 'error';
    result.error = err.message;
  } finally {
    if (proc) {
      try { process.kill(-proc.pid); } catch (_) {}
      proc.kill('SIGKILL');
    }
    // Give port time to free
    await new Promise(r => setTimeout(r, 500));
  }

  return result;
}

// ── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  const apps = getApps();
  console.log(`Found ${apps.length} Vite apps`);

  const RETRY_BLANK = !!args['retry-blank'];
  const BLANK_SIZE = parseInt(args['blank-size'] ?? '100000', 10);

  if (SKIP_EXISTING) {
    const toProcess = apps.filter(a => {
      const p = path.join(SHOTS_DIR, `${a}.png`);
      if (!fs.existsSync(p)) return true;
      return fs.statSync(p).size < 5000; // re-shoot blank ones
    });
    console.log(`Skipping ${apps.length - toProcess.length} existing. Processing ${toProcess.length}.`);
    apps.splice(0, apps.length, ...toProcess);
  } else if (RETRY_BLANK) {
    const toProcess = apps.filter(a => {
      const p = path.join(SHOTS_DIR, `${a}.png`);
      if (!fs.existsSync(p)) return false; // only retry existing blanks
      return fs.statSync(p).size <= BLANK_SIZE;
    });
    console.log(`Retrying ${toProcess.length} blank/small screenshots (≤${BLANK_SIZE} bytes).`);
    apps.splice(0, apps.length, ...toProcess);
  }

  const browser = await chromium.launch({ headless: true });
  const results = [];
  let done = 0;
  const total = apps.length;

  // Process in batches of CONCURRENCY, each on its own port slot
  const queue = [...apps];
  const slots = Array.from({ length: CONCURRENCY }, (_, i) => BASE_PORT + i);

  async function worker(port) {
    while (queue.length) {
      const app = queue.shift();
      if (!app) break;
      process.stdout.write(`[${++done}/${total}] ${app} (port ${port})... `);
      const r = await screenshotApp(browser, app, port);
      results.push(r);
      console.log(r.status === 'ok' ? `✓ ${r.size ? (r.size/1024).toFixed(0)+'KB' : ''}` : `✗ ${r.status}${r.error ? ': '+r.error.slice(0,60) : ''}`);
    }
  }

  await Promise.all(slots.map(port => worker(port)));

  await browser.close();

  // Write report
  const summary = {
    total,
    ok: results.filter(r => r.status === 'ok').length,
    blank: results.filter(r => r.status === 'blank').length,
    error: results.filter(r => r.status === 'error').length,
    timestamp: new Date().toISOString(),
    results
  };
  fs.writeFileSync(REPORT_PATH, JSON.stringify(summary, null, 2));

  console.log(`\n✓ ${summary.ok} ok  ✗ ${summary.error} error  ○ ${summary.blank} blank`);
  console.log(`Report: ${REPORT_PATH}`);
  console.log(`Screenshots: ${SHOTS_DIR}`);
})();
