#!/usr/bin/env node
/**
 * Targeted rebuild + recapture for known-bad catalogue screenshots.
 * Handles: fullstack apps (client/dist), renamed dirs, stale captures.
 */

const { chromium } = require('playwright');
const fs   = require('fs');
const fsp  = require('fs').promises;
const path = require('path');
const http = require('http');
const { execSync } = require('child_process');

// ─── Problem apps ─────────────────────────────────────────────────────────────
// Each entry: { catalogue: 'name in catalogue/', app: 'actual dir name', distSubdir: 'dist or client/dist' }

const PROBLEM_APPS = [
  // Group A — catalogue name mismatches (dirs were renamed)
  // catalogue entry                                     → actual dir                          distSubdir
  { cat: 'smartscale-ai-presentation-v1.06.12.2025.0020', app: 'smartscale-ai-presentation-platform',    dist: 'dist' },
  { cat: 'smartscale-presenter',                           app: 'smartscale-ai-presentation-platform',    dist: 'dist' },
  { cat: 'techbridge-tuc-dashboard',                       app: 'techbridge-assessment-platform',         dist: 'dist' },
  { cat: 'university-timetable-insights',                  app: 'university-digital-twin',                dist: 'dist' },
  { cat: 'lecturer-assessment-portal',                     app: 'lecturer-assessment-system',             dist: 'dist' },
  { cat: 'modern-product-dev-lifecycle',                   app: 'modern-product-development-lifecycle',   dist: 'dist' },

  // Group B — fullstack apps, frontend in client/dist
  { cat: 'accommodation-management',  app: 'accommodation-management',  dist: 'client/dist' },
  { cat: 'alumni-network',            app: 'alumni-network',            dist: 'client/dist' },
  { cat: 'health-wellness-portal',    app: 'health-wellness-portal',    dist: 'client/dist' },
  { cat: 'library-management',        app: 'library-management',        dist: 'client/dist' },
  { cat: 'scholarship-tracker',       app: 'scholarship-tracker',       dist: 'client/dist' },
  { cat: 'student-payment-system',    app: 'student-payment-system',    dist: 'client/dist' },
  { cat: 'student-success-coach',     app: 'student-success-coach',     dist: 'client/dist' },
  { cat: 'techbridge-dashboard',      app: 'techbridge-dashboard',      dist: 'client/dist' },

  // Group C — flat apps that had blank captures, dist already exists
  { cat: '6r-product-design-workshop-portal',  app: '6r-product-design-workshop-portal',  dist: 'dist' },
  { cat: 'academic-performance-app',           app: 'academic-performance-app',           dist: 'dist' },

  // Group D — stale (rebuilt after last screenshot)
  { cat: 'groove-streamer', app: 'groove-streamer', dist: 'dist' },
];

const PORT = 3457;
const WAIT = 4000;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript',
  '.mjs': 'application/javascript',   '.css': 'text/css',
  '.png': 'image/png',                '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',            '.ico': 'image/x-icon',
  '.json': 'application/json',        '.woff': 'font/woff',
  '.woff2': 'font/woff2',             '.ttf': 'font/ttf',
};

const c = { reset:'\x1b[0m', green:'\x1b[32m', yellow:'\x1b[33m', red:'\x1b[31m', cyan:'\x1b[36m', dim:'\x1b[2m', bold:'\x1b[1m' };
const log = (msg, col='reset') => console.log(`${c[col]}${msg}${c.reset}`);

// ─── Built-in SPA HTTP server ─────────────────────────────────────────────────

function startServer(distPath, port) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let urlPath = req.url.split('?')[0];
      if (urlPath === '/') urlPath = '/index.html';
      let filePath = path.join(distPath, urlPath);
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(distPath, 'index.html');
      }
      const ext  = path.extname(filePath).toLowerCase();
      const mime = MIME[ext] || 'application/octet-stream';
      fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': mime });
        res.end(data);
      });
    });
    server.on('error', reject);
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

// ─── Build (only if dist missing) ────────────────────────────────────────────

function dirExists(p) { try { fs.accessSync(p); return true; } catch { return false; } }

async function ensureDist(appName, distSubdir) {
  const appDir  = path.resolve(appName);
  const distDir = path.join(appDir, distSubdir);

  if (dirExists(distDir)) {
    log(`  ↳ ${distSubdir} exists, skipping build`, 'dim');
    return distDir;
  }

  // Determine build dir — for client/dist, build inside client/
  const buildDir = distSubdir.startsWith('client') ? path.join(appDir, 'client') : appDir;
  log(`  ↳ Building in ${path.relative(process.cwd(), buildDir)}…`, 'yellow');

  const env = { ...process.env, CI: 'true', NODE_OPTIONS: '--max-old-space-size=4096' };

  for (const cmd of ['pnpm install --no-frozen-lockfile', 'npm install --legacy-peer-deps']) {
    try { execSync(cmd, { cwd: buildDir, stdio: 'inherit', timeout: 120000, env, shell: true }); break; }
    catch { /* try next */ }
  }

  for (const cmd of ['pnpm run build', 'npm run build', 'npx vite build']) {
    try {
      execSync(cmd, { cwd: buildDir, stdio: 'inherit', timeout: 180000, env, shell: true });
      if (dirExists(distDir)) return distDir;
    } catch { /* try next */ }
  }

  return null;
}

// ─── Capture ──────────────────────────────────────────────────────────────────

async function captureApp(entry, browser) {
  log(`\n[${entry.cat}]`, 'bold');
  if (entry.cat !== entry.app) log(`  ↳ actual dir: ${entry.app}`, 'dim');

  if (!dirExists(path.resolve(entry.app))) {
    log(`  ↳ Directory not found: ${entry.app}`, 'red');
    return { cat: entry.cat, ok: false, reason: 'directory not found' };
  }

  const distDir = await ensureDist(entry.app, entry.dist);
  if (!distDir) return { cat: entry.cat, ok: false, reason: 'build failed' };

  let server;
  try {
    log(`  ↳ Serving ${path.relative(process.cwd(), distDir)} on :${PORT}…`, 'cyan');
    server = await startServer(distDir, PORT);

    const ctx  = await browser.newContext({ viewport: { width: 1920, height: 1080 }, bypassCSP: true, ignoreHTTPSErrors: true });
    const page = await ctx.newPage();

    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(WAIT);

    const outDir  = path.join('catalogue', entry.cat);
    await fsp.mkdir(outDir, { recursive: true });
    const outPath = path.join(outDir, 'screenshot.png');
    await page.screenshot({ path: outPath, fullPage: false });
    await ctx.close();
    server.close();

    const { size } = fs.statSync(outPath);
    const kb = (size / 1024).toFixed(1);
    if (size < 10000) {
      log(`  ↳ Too small (${kb}KB) — blank/error page`, 'red');
      return { cat: entry.cat, ok: false, reason: `blank (${kb}KB)` };
    }
    log(`  ↳ ✓ ${kb}KB  →  catalogue/${entry.cat}/screenshot.png`, 'green');
    return { cat: entry.cat, ok: true, size };

  } catch (err) {
    if (server) try { server.close(); } catch {}
    log(`  ↳ Error: ${err.message.split('\n')[0]}`, 'red');
    return { cat: entry.cat, ok: false, reason: err.message.split('\n')[0] };
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log(`  Targeted Recapture (${PROBLEM_APPS.length} problem apps)`, 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const entry of PROBLEM_APPS) {
    results.push(await captureApp(entry, browser));
  }

  await browser.close();

  const ok     = results.filter(r => r.ok);
  const failed = results.filter(r => !r.ok);

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log(`  ✅ ${ok.length} recaptured`, 'green');
  if (ok.length) ok.forEach(r => log(`     • ${r.cat}  (${(r.size/1024).toFixed(1)}KB)`, 'green'));
  if (failed.length) {
    log(`  ❌ ${failed.length} still failed:`, 'red');
    failed.forEach(r => log(`     • ${r.cat}  →  ${r.reason}`, 'red'));
  }
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch(err => { log(`\n❌ Fatal: ${err.message}`, 'red'); process.exit(1); });
