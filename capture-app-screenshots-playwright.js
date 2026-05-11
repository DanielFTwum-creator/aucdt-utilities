#!/usr/bin/env node
/**
 * ============================================================================
 * Techbridge University College - App Screenshot Capture Script (Playwright)
 * ============================================================================
 * v3.0 - Fixed: no longer hits the same generic port for all apps.
 * Strategy (per app, tried in order):
 *   1. Docker gateway  → http://localhost:8080/{app-name}/  (only if container running)
 *   2. Local dist server → serves dist/ on a fixed temp port  (if built)
 *   3. Skip — log as not capturable
 * ============================================================================
 */

const { chromium } = require('@playwright/test');
const fs = require('fs').promises;
const { execSync, spawn } = require('child_process');
const path = require('path');
const http = require('http');
const net = require('net');

const CONFIG = {
  timeout: 30000,
  screenshotDir: 'catalogue',
  viewportWidth: 1920,
  viewportHeight: 1080,
  tempPort: 9877,           // single reusable port for dist-based captures
  waitAfterLoad: 2500,      // ms to wait for React hydration
  minSizeKB: 8,
};

const colors = {
  reset: '\x1b[0m', green: '\x1b[32m', yellow: '\x1b[33m',
  red: '\x1b[31m', cyan: '\x1b[36m', magenta: '\x1b[35m',
};
const log = (msg, c = 'reset') => console.log(`${colors[c]}${msg}${colors.reset}`);

const stats = { total: 0, docker: 0, dist: 0, failed: 0, startTime: Date.now() };

// ── Docker helpers ────────────────────────────────────────────────────────────

let runningContainers = null;

function getRunningContainers() {
  if (runningContainers !== null) return runningContainers;
  try {
    const out = execSync('docker ps --format "{{.Names}}"', { timeout: 8000 }).toString();
    runningContainers = new Set(out.split('\n').map(s => s.trim()).filter(Boolean));
  } catch {
    runningContainers = new Set();
  }
  return runningContainers;
}

function isContainerRunning(name) {
  return getRunningContainers().has(name);
}

// ── Port helpers ─────────────────────────────────────────────────────────────

function isPortFree(port) {
  return new Promise(resolve => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => { server.close(); resolve(true); });
    server.listen(port);
  });
}

// ── Minimal static SPA server ─────────────────────────────────────────────────
// Serves a single app's dist/ folder on CONFIG.tempPort.
// All non-file requests fall back to index.html (SPA mode).

let activeDistServer = null;

async function startDistServer(distPath) {
  if (activeDistServer) {
    activeDistServer.close();
    activeDistServer = null;
    await new Promise(r => setTimeout(r, 200));
  }

  return new Promise((resolve, reject) => {
    const mimeMap = {
      '.html': 'text/html', '.js': 'application/javascript',
      '.css': 'text/css',   '.png': 'image/png',
      '.webp': 'image/webp', '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon', '.json': 'application/json',
      '.woff2': 'font/woff2', '.woff': 'font/woff',
      '.ttf': 'font/ttf',
    };

    const ext = p => path.extname(p).toLowerCase();
    const mime = p => mimeMap[ext(p)] || 'application/octet-stream';

    const server = http.createServer(async (req, res) => {
      let urlPath = req.url.split('?')[0];
      let filePath = path.join(distPath, urlPath);

      // Try the exact file first, then index.html (SPA fallback)
      const candidates = [filePath, path.join(distPath, 'index.html')];
      for (const candidate of candidates) {
        try {
          const stat = await fs.stat(candidate);
          if (stat.isFile()) {
            const data = await fs.readFile(candidate);
            res.writeHead(200, { 'Content-Type': mime(candidate) });
            res.end(data);
            return;
          }
        } catch { /* try next */ }
      }
      res.writeHead(404);
      res.end('Not found');
    });

    server.listen(CONFIG.tempPort, '127.0.0.1', () => {
      activeDistServer = server;
      resolve(server);
    });
    server.on('error', reject);
  });
}

// ── Screenshot capture ────────────────────────────────────────────────────────

async function screenshot(page, outPath) {
  const dir = path.dirname(outPath);
  await fs.mkdir(dir, { recursive: true });
  await page.screenshot({ path: outPath, fullPage: false });
  const { size } = await fs.stat(outPath);
  return size;
}

async function captureProject(project, browser, index) {
  log(`[${index + 1}/${stats.total}] ${project.name}`);

  const context = await browser.newContext({
    viewport: { width: CONFIG.viewportWidth, height: CONFIG.viewportHeight },
    bypassCSP: true,
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  const outPath = path.join(CONFIG.screenshotDir, project.name, 'screenshot.png');

  try {
    // ── Method 1: Docker gateway ─────────────────────────────────────────────
    if (isContainerRunning(project.name)) {
      log(`  → Docker gateway`, 'yellow');
      try {
        await page.goto(`http://localhost:8080/${project.name}/`, {
          waitUntil: 'networkidle',
          timeout: CONFIG.timeout,
        });
        await page.waitForTimeout(CONFIG.waitAfterLoad);
        const size = await screenshot(page, outPath);
        if (size > CONFIG.minSizeKB * 1024) {
          log(`  ✓ Docker  (${(size / 1024).toFixed(1)} KB)`, 'green');
          stats.docker++;
          return;
        }
        log(`  ⊘ Docker screenshot too small, trying dist`, 'yellow');
      } catch (e) {
        log(`  ⊘ Docker failed: ${e.message.split('\n')[0]}`, 'yellow');
      }
    }

    // ── Method 2: local dist server ──────────────────────────────────────────
    const distCandidates = [
      path.join(project.name, 'dist'),
      path.join(project.name, 'build'),
      path.join(project.name, 'client', 'dist'),
    ];

    let distPath = null;
    for (const d of distCandidates) {
      try {
        await fs.access(path.join(d, 'index.html'));
        distPath = d;
        break;
      } catch { /* skip */ }
    }

    if (distPath) {
      log(`  → Local dist server (${distPath})`, 'yellow');
      try {
        await startDistServer(path.resolve(distPath));
        await page.goto(`http://127.0.0.1:${CONFIG.tempPort}/`, {
          waitUntil: 'networkidle',
          timeout: CONFIG.timeout,
        });
        await page.waitForTimeout(CONFIG.waitAfterLoad);
        const size = await screenshot(page, outPath);
        if (size > CONFIG.minSizeKB * 1024) {
          log(`  ✓ Dist    (${(size / 1024).toFixed(1)} KB)`, 'green');
          stats.dist++;
          return;
        }
        log(`  ⊘ Dist screenshot too small`, 'yellow');
      } catch (e) {
        log(`  ⊘ Dist server failed: ${e.message.split('\n')[0]}`, 'yellow');
      }
    }

    // ── Failed ────────────────────────────────────────────────────────────────
    log(`  ✗ No screenshot — container not running and no dist/ found`, 'red');
    stats.failed++;
    await fs.appendFile('screenshot-failures.log',
      `${project.name}: container not running, no dist\n`);

  } finally {
    await context.close();
  }
}

// ── Project discovery ─────────────────────────────────────────────────────────

async function findProjects() {
  const dirs = await fs.readdir('.', { withFileTypes: true });
  const skip = new Set(['node_modules', 'dist', 'build', '.git', 'docker',
    'catalogue', 'scripts', 'tests', 'templates', 'reports',
    'Documentation', 'archive', 'build-logs', 'install-logs', 'src']);
  const projects = [];

  for (const dir of dirs) {
    if (!dir.isDirectory() || skip.has(dir.name)) continue;
    try {
      const pkg = JSON.parse(
        await fs.readFile(path.join(dir.name, 'package.json'), 'utf-8')
      );
      projects.push({
        name: dir.name,
        displayName: pkg.description || pkg.name || dir.name,
        hasReact: !!(pkg.dependencies?.react || pkg.devDependencies?.react),
        hasVite:  !!(pkg.devDependencies?.vite || pkg.dependencies?.vite),
      });
    } catch { /* no package.json — skip */ }
  }

  return projects;
}

// ── Gallery ───────────────────────────────────────────────────────────────────

async function generateGallery(projects) {
  log('\nGenerating gallery...', 'cyan');
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TUC Apps Gallery</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Inter','Segoe UI',system-ui,sans-serif;background:#0f172a;color:#f8fafc;padding:40px}
    .header{background:linear-gradient(135deg,#1e293b,#0f172a);padding:40px;text-align:center;border-radius:16px;margin-bottom:40px;border:1px solid #334155}
    h1{font-size:2.5em;margin-bottom:10px;color:#38bdf8}
    .stats{display:flex;justify-content:center;gap:20px;margin-top:24px;flex-wrap:wrap}
    .stat{background:#1e293b;padding:12px 24px;border-radius:12px;border:1px solid #334155;min-width:140px}
    .stat-number{font-size:1.8em;font-weight:bold}
    .stat-label{font-size:0.9em;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em}
    .gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:30px}
    .card{background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;transition:all .3s}
    .card:hover{transform:translateY(-8px);border-color:#38bdf8;box-shadow:0 12px 24px -8px rgba(0,0,0,.5)}
    .img-wrap{position:relative;height:240px;background:#0f172a;overflow:hidden}
    .img-wrap img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
    .card:hover img{transform:scale(1.05)}
    .no-img{display:flex;align-items:center;justify-content:center;height:100%;color:#475569;flex-direction:column;gap:12px}
    .card-title{padding:20px 20px 8px;font-size:1.25em;font-weight:600;color:#f1f5f9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .card-info{padding:0 20px 20px;color:#94a3b8;font-size:.875em}
    .tag{display:inline-block;padding:2px 8px;border-radius:4px;font-size:.75em;font-weight:600;margin-right:6px}
    .tr{background:#0ea5e920;color:#0ea5e9;border:1px solid #0ea5e940}
    .tv{background:#f59e0b20;color:#f59e0b;border:1px solid #f59e0b40}
    footer{text-align:center;margin-top:60px;color:#475569;border-top:1px solid #334155;padding-top:30px}
  </style>
</head>
<body>
  <div class="header">
    <h1>Techbridge University College</h1>
    <p style="color:#94a3b8;font-size:1.1em">Institutional Application Ecosystem</p>
    <div class="stats">
      <div class="stat"><div class="stat-number">${stats.total}</div><div class="stat-label">Total Apps</div></div>
      <div class="stat"><div class="stat-number" style="color:#22c55e">${stats.docker}</div><div class="stat-label">Via Docker</div></div>
      <div class="stat"><div class="stat-number" style="color:#38bdf8">${stats.dist}</div><div class="stat-label">Via Dist</div></div>
      <div class="stat"><div class="stat-number" style="color:#ef4444">${stats.failed}</div><div class="stat-label">Not Captured</div></div>
    </div>
  </div>
  <div class="gallery">
    ${projects.map(p => `
    <div class="card">
      <div class="img-wrap">
        <img src="${p.name}/screenshot.png" alt="${p.displayName}" loading="lazy"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="no-img" style="display:none">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" opacity=".4">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span>Not captured</span>
        </div>
      </div>
      <div class="card-title">${p.displayName}</div>
      <div class="card-info">
        <div style="margin-bottom:8px;font-family:monospace;font-size:.8em;color:#64748b">/${p.name}</div>
        <div>
          ${p.hasReact ? '<span class="tag tr">REACT</span>' : ''}
          ${p.hasVite  ? '<span class="tag tv">VITE</span>'  : ''}
        </div>
      </div>
    </div>`).join('')}
  </div>
  <footer>
    <p>Captured: ${new Date().toLocaleString()} | Docker: ${stats.docker} | Dist: ${stats.dist} | Failed: ${stats.failed}</p>
    <p style="margin-top:8px">&copy; ${new Date().getFullYear()} Techbridge University College</p>
  </footer>
</body>
</html>`;
  await fs.writeFile(path.join(CONFIG.screenshotDir, 'index.html'), html, 'utf-8');
  log(`Gallery → ${CONFIG.screenshotDir}/index.html`, 'green');
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  log('\n========================================', 'cyan');
  log(' TUC Screenshot Capture v3.0', 'cyan');
  log('========================================\n', 'cyan');

  // Verify temp port is free
  if (!(await isPortFree(CONFIG.tempPort))) {
    log(`Port ${CONFIG.tempPort} already in use — choose a different tempPort`, 'red');
    process.exit(1);
  }

  const projects = await findProjects();
  if (!projects.length) { log('No projects found', 'red'); process.exit(1); }

  stats.total = projects.length;
  log(`Found ${projects.length} projects`, 'green');
  log(`Running containers: ${getRunningContainers().size}\n`, 'cyan');

  try { await fs.unlink('screenshot-failures.log'); } catch {}

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
           '--disable-gpu', '--window-size=1920,1080'],
  });

  for (let i = 0; i < projects.length; i++) {
    await captureProject(projects[i], browser, i);
  }

  if (activeDistServer) activeDistServer.close();
  await browser.close();
  await generateGallery(projects);

  const secs = ((Date.now() - stats.startTime) / 1000).toFixed(1);
  log('\n========================================', 'cyan');
  log(` Done in ${secs}s`, 'cyan');
  log(`  Docker:  ${stats.docker}`, 'green');
  log(`  Dist:    ${stats.dist}`, 'green');
  log(`  Failed:  ${stats.failed}`, 'red');
  log('========================================\n', 'cyan');
}

main().catch(e => { console.error(e); process.exit(1); });
