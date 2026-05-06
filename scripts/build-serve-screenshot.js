/**
 * build-serve-screenshot.js
 * For each app: pnpm build → serve -s dist -l PORT → screenshot → kill.
 * Uses ports 4100-4103 (distinct from vite-dev 5200+ and gateway 8080)
 * to avoid serving cached pages.
 *
 * Usage:
 *   node scripts/build-serve-screenshot.js                     # all apps
 *   node scripts/build-serve-screenshot.js --app=kanban-app    # single app
 *   node scripts/build-serve-screenshot.js --skip-existing     # skip already-shot
 *   node scripts/build-serve-screenshot.js --retry-blank       # re-shoot blanks only
 *   node scripts/build-serve-screenshot.js --concurrency=2     # fewer parallel slots
 *
 * Screenshot behaviour:
 *   - If app has /login: signs in with admin/admin, screenshots the post-login dashboard
 *   - Otherwise: screenshots / directly
 *   node scripts/build-serve-screenshot.js --build-timeout=120 # seconds (default 90)
 */

const { chromium } = require('@playwright/test');
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

const ROOT = path.resolve(__dirname, '..');
const SHOTS_DIR = path.join(ROOT, 'catalogue', 'project-screenshots');
const REPORT_PATH = path.join(ROOT, 'catalogue', 'build-serve-screenshot-report.json');

const SKIP = new Set([
  'node_modules', '.git', 'catalogue', 'scripts', 'archive', 'docs',
  'dist', 'build', 'tests', 'test-results', 'aucdt-portal-tests',
  'playwright-report', 'backend', 'docker', 'src', 'templates',
  'reports', 'build-logs', 'install-logs', 'build-validation-reports',
]);

// Parse CLI args: --key=value or --flag → { key: value, flag: true }
const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

const CONCURRENCY    = parseInt(args.concurrency ?? '4', 10);
const SKIP_EXISTING  = !!args['skip-existing'];
const RETRY_BLANK    = !!args['retry-blank'];
const ONLY_APP       = args.app ?? null;
const ONLY_APPS      = args.apps ? new Set(args.apps.split(',').map(s => s.trim())) : null;
const BUILD_TIMEOUT  = parseInt(args['build-timeout'] ?? '90', 10) * 1000;
const BASE_PORT      = 4100; // distinct from vite dev (5200) and gateway (8080)

const IS_WIN = process.platform === 'win32';

fs.mkdirSync(SHOTS_DIR, { recursive: true });

// ── Discover apps ─────────────────────────────────────────────────────────────
// Returns { name, buildDir } — buildDir is the dir containing package.json with
// a build script (either the app root or its client/ subfolder).
function getApps() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(e => e.isDirectory() && !SKIP.has(e.name) && !e.name.startsWith('.'))
    .map(e => {
      const rootPkg  = path.join(ROOT, e.name, 'package.json');
      const clientPkg = path.join(ROOT, e.name, 'client', 'package.json');
      if (fs.existsSync(rootPkg)) {
        const pkg = JSON.parse(fs.readFileSync(rootPkg, 'utf8'));
        if (pkg.scripts?.build) return { name: e.name, buildDir: path.join(ROOT, e.name) };
      }
      if (fs.existsSync(clientPkg)) {
        const pkg = JSON.parse(fs.readFileSync(clientPkg, 'utf8'));
        if (pkg.scripts?.build) return { name: e.name, buildDir: path.join(ROOT, e.name, 'client') };
      }
      return null;
    })
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter(({ name }) => !ONLY_APP || name === ONLY_APP)
    .filter(({ name }) => !ONLY_APPS || ONLY_APPS.has(name));
}

// ── Port utilities ────────────────────────────────────────────────────────────
function waitForPort(port, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      const client = new net.Socket();
      client.setTimeout(600);
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

// ── Kill a process tree ───────────────────────────────────────────────────────
function killProc(proc) {
  if (!proc) return;
  try {
    if (IS_WIN) {
      // On Windows, kill the whole process tree by PID
      execSync(`taskkill /PID ${proc.pid} /T /F`, { stdio: 'ignore' });
    } else {
      process.kill(-proc.pid, 'SIGKILL');
    }
  } catch (_) {}
  try { proc.kill('SIGKILL'); } catch (_) {}
}

// ── Build one app ─────────────────────────────────────────────────────────────
function buildApp(appName, appDir) {
  return new Promise((resolve, reject) => {
    const pkgJson = JSON.parse(fs.readFileSync(path.join(appDir, 'package.json'), 'utf8'));
    const buildScript = pkgJson.scripts?.build ?? 'build';

    // Prefer pnpm if a lockfile exists, else npm
    const usePnpm = fs.existsSync(path.join(appDir, 'pnpm-lock.yaml'));
    const pm = usePnpm ? 'pnpm' : 'npm';

    const proc = spawn(pm, ['run', 'build'], {
      cwd: appDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: IS_WIN,
      env: {
        ...process.env,
        NODE_ENV: 'production',
        NODE_OPTIONS: '--max-old-space-size=4096',
        CI: 'true',
      },
    });

    const timer = setTimeout(() => {
      killProc(proc);
      reject(new Error(`Build timed out after ${BUILD_TIMEOUT / 1000}s`));
    }, BUILD_TIMEOUT);

    proc.on('close', code => {
      clearTimeout(timer);
      if (code === 0) resolve();
      else reject(new Error(`Build exited with code ${code}`));
    });

    proc.on('error', err => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

// ── Shared settle helper ──────────────────────────────────────────────────────
async function settle(page) {
  await Promise.race([
    page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {}),
    new Promise(r => setTimeout(r, 5000)),
  ]);
  await page.waitForTimeout(800);
}

// ── Serve dist and screenshot ─────────────────────────────────────────────────
async function screenshotApp(browser, appName, buildDir, port) {
  const distDir    = path.join(buildDir, 'dist');
  const outPublic  = path.join(SHOTS_DIR, `${appName}.png`);
  const outAdmin   = path.join(SHOTS_DIR, `${appName}-admin.png`);
  const result = { app: appName, port, status: 'unknown', path: outPublic };

  let serveProc = null;

  try {
    // ── 1. Build ──────────────────────────────────────────────────────────────
    await buildApp(appName, buildDir);

    if (!fs.existsSync(distDir)) {
      throw new Error('Build completed but dist/ directory not found');
    }

    // ── 2. Serve dist with `serve -s dist -l PORT` ────────────────────────────
    // Check both buildDir and its parent for a local serve binary
    const localServe = [
      path.join(buildDir, 'node_modules', '.bin', IS_WIN ? 'serve.cmd' : 'serve'),
      path.join(path.dirname(buildDir), 'node_modules', '.bin', IS_WIN ? 'serve.cmd' : 'serve'),
    ].find(p => fs.existsSync(p));
    const serveCmd   = localServe ?? 'serve';
    const serveArgs  = ['-s', 'dist', '-l', String(port), '--no-clipboard'];

    serveProc = spawn(serveCmd, serveArgs, {
      cwd: buildDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: IS_WIN,
      env: { ...process.env },
    });

    serveProc.stderr.on('data', () => {});
    serveProc.stdout.on('data', () => {});

    // ── 3. Wait for server ready ──────────────────────────────────────────────
    await waitForPort(port, 20000);
    await new Promise(r => setTimeout(r, 800));

    // ── 4a. Public screenshot — what the user sees before logging in ──────────
    const ctx1  = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page1 = await ctx1.newPage();
    try {
      const loginUrl = `http://localhost:${port}/login`;
      const rootUrl  = `http://localhost:${port}/`;
      await page1.goto(loginUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
      // If /login renders nothing (SPA router has no /login route), fall back to /
      const hasContent = await page1.waitForSelector('input, button, h1, h2, nav, main, form', { timeout: 2000 }).catch(() => null);
      if (!hasContent) {
        await page1.goto(rootUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
      }
      await settle(page1);
      await page1.screenshot({ path: outPublic, fullPage: false });
      const s1 = fs.statSync(outPublic);
      result.sizePublic = s1.size;
      result.status     = s1.size > 5000 ? 'ok' : 'blank';
    } finally {
      await ctx1.close();
    }

    // ── 4b. Admin screenshot — what the user sees after logging in ────────────
    const ctx2  = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page2 = await ctx2.newPage();
    try {
      const loginUrl = `http://localhost:${port}/login`;
      const rootUrl  = `http://localhost:${port}/`;

      // Try /login, /admin/login, then / in order until a password input is found
      const loginCandidates = [loginUrl, `http://localhost:${port}/admin/login`, rootUrl];
      let passwordInput = null;
      for (const url of loginCandidates) {
        await page2.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
        passwordInput = await page2.waitForSelector('input[type="password"]', { timeout: 3000 }).catch(() => null);
        if (passwordInput) break;
      }
      if (passwordInput) {
        await page2.fill('input[type="text"], input[name="username"], input[name="email"]', 'admin', { timeout: 3000 });
        await page2.fill('input[type="password"]', 'admin', { timeout: 3000 });
        await page2.click('button[type="submit"]', { timeout: 3000 });
        // Wait for the login form to disappear (re-render to app content)
        await page2.waitForFunction(
          () => !document.querySelector('input[type="password"]'),
          { timeout: 8000 }
        ).catch(() => {});
        // If we logged in from /login and the URL is still /login, navigate to / to show app home
        if (page2.url().endsWith('/login')) {
          await page2.goto(rootUrl, { waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {});
        }
      }

      await settle(page2);
      await page2.screenshot({ path: outAdmin, fullPage: false });
      const s2 = fs.statSync(outAdmin);
      result.sizeAdmin   = s2.size;
      result.adminStatus = s2.size > 5000 ? 'ok' : 'blank';
    } catch (_) {
      result.adminStatus = 'error';
    } finally {
      await ctx2.close();
    }

    result.size = result.sizePublic;

  } catch (err) {
    result.status = 'error';
    result.error  = err.message;
  } finally {
    killProc(serveProc);
    await new Promise(r => setTimeout(r, 600));
  }

  return result;
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  let apps = getApps();
  console.log(`Found ${apps.length} apps with a build script`);

  if (SKIP_EXISTING) {
    apps = apps.filter(({ name }) => {
      const p = path.join(SHOTS_DIR, `${name}.png`);
      return !fs.existsSync(p) || fs.statSync(p).size < 5000;
    });
    console.log(`Processing ${apps.length} (skipping apps that already have a good screenshot)`);
  } else if (RETRY_BLANK) {
    apps = apps.filter(({ name }) => {
      const p = path.join(SHOTS_DIR, `${name}.png`);
      return fs.existsSync(p) && fs.statSync(p).size <= 100000;
    });
    console.log(`Retrying ${apps.length} blank/small screenshots`);
  }

  if (!apps.length) {
    console.log('Nothing to do.');
    return;
  }

  const browser = await chromium.launch({ headless: true });
  const results = [];
  let done = 0;
  const total = apps.length;

  const queue = [...apps];
  let nextPort = BASE_PORT;

  async function worker() {
    while (queue.length) {
      const app = queue.shift();
      if (!app) break;
      const port = nextPort++;
      const idx = ++done;
      process.stdout.write(`[${idx}/${total}] ${app.name} (port ${port}) building... `);
      const r = await screenshotApp(browser, app.name, app.buildDir, port);
      results.push(r);
      const adminTag = r.adminStatus === 'ok' ? ' +admin✓' : r.adminStatus === 'error' ? ' +admin✗' : '';
      if (r.status === 'ok') {
        console.log(`✓ ${((r.sizePublic ?? 0) / 1024).toFixed(0)}KB${adminTag}`);
      } else if (r.status === 'blank') {
        console.log(`○ blank (${((r.sizePublic ?? 0) / 1024).toFixed(0)}KB)${adminTag}`);
      } else {
        console.log(`✗ ${r.error?.slice(0, 80) ?? 'error'}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  await browser.close();

  // ── Report ────────────────────────────────────────────────────────────────
  const summary = {
    timestamp: new Date().toISOString(),
    total,
    ok:         results.filter(r => r.status === 'ok').length,
    blank:      results.filter(r => r.status === 'blank').length,
    error:      results.filter(r => r.status === 'error').length,
    adminOk:    results.filter(r => r.adminStatus === 'ok').length,
    adminError: results.filter(r => r.adminStatus === 'error').length,
    errors: results.filter(r => r.status === 'error').map(r => ({ app: r.app, error: r.error })),
    blanks: results.filter(r => r.status === 'blank').map(r => r.app),
    results,
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(summary, null, 2));

  console.log(`\n✓ ${summary.ok} ok  ✗ ${summary.error} error  ○ ${summary.blank} blank`);
  console.log(`Admin:  ✓ ${summary.adminOk} ok  ✗ ${summary.adminError} error`);
  console.log(`Report : ${REPORT_PATH}`);
  console.log(`Shots  : ${SHOTS_DIR}`);
})();
