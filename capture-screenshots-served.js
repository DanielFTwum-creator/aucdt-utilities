#!/usr/bin/env node
/**
 * ============================================================================
 * PRODUCTION-QUALITY Screenshot Capture - Serves dist/ via HTTP
 * ============================================================================
 * Strategy: Start local HTTP server for each app, then capture
 *
 * This mimics production deployment:
 *   - Proper HTTP serving of static assets
 *   - Correct path resolution
 *   - SPA routing works
 *   - Vite builds render correctly
 *
 * Expected time: ~5 minutes for all apps (includes server start/stop)
 * ============================================================================
 */

const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const CONFIG = {
  screenshotDir: 'catalogue',
  viewportWidth: 1920,
  viewportHeight: 1080,
  serverPort: 3456,  // Base port for serving apps
  serverTimeout: 8000,
  pageTimeout: 5000,
  minSize: 5000,
  waitTime: 2000,
};

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  dim: '\x1b[2m',
  blue: '\x1b[34m',
};

const stats = {
  total: 0,
  success: 0,
  failed: 0,
  docker: 0,
  served: 0,
  startTime: Date.now(),
};

// Apps running in Docker (use gateway instead of local server)
const DOCKER_APPS = [
  '6r-product-design-workshop-portal',
  'adaptive-curriculum-engine',
  'ai-explainability-console',
  'academic-performance-app',
  'ai-governance-analytics-hub',
  'academic-integrity-detector',
  'agenticai-masterclass',
  'ai-code-reviewer',
  'ai-exam-generator',
  'agent-collaboration-framework',
];

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function findProjects() {
  const dirs = await fs.readdir('.', { withFileTypes: true });
  const projects = [];

  const skipDirs = [
    'node_modules', 'dist', 'build', '.git', 'docker', 'catalogue',
    'scripts', 'tests', 'templates', 'reports', 'Documentation',
    'archive', 'build-logs', 'install-logs', 'proof-of-concept-screenshots',
    'project-screenshots-real', 'sync-from-d-drive', 'monitoring',
    'src', 'docs', 'playwright', 'backend'
  ];

  for (const dir of dirs) {
    if (!dir.isDirectory() || skipDirs.includes(dir.name)) continue;

    try {
      const packagePath = path.join(dir.name, 'package.json');
      await fs.access(packagePath);
      const packageData = JSON.parse(await fs.readFile(packagePath, 'utf-8'));

      // Skip backend-only apps
      const hasExpress = packageData.dependencies?.express;
      const hasReact = packageData.dependencies?.react;
      const isBackendOnly = hasExpress && !hasReact;

      if (!isBackendOnly) {
        // Find dist/build directory
        let distPath = null;
        const possibleDists = ['dist', 'build', 'frontend/dist', 'client/dist'];

        for (const distDir of possibleDists) {
          const fullDistPath = path.join(dir.name, distDir);
          try {
            await fs.access(fullDistPath);
            distPath = fullDistPath;
            break;
          } catch (err) {
            continue;
          }
        }

        if (distPath) {
          projects.push({
            name: dir.name,
            displayName: packageData.description || packageData.name || dir.name,
            hasReact: hasReact,
            hasVite: packageData.devDependencies?.vite || packageData.dependencies?.vite,
            distPath: distPath,
            inDocker: DOCKER_APPS.includes(dir.name),
          });
        }
      }
    } catch (err) {
      continue;
    }
  }

  return projects;
}

/**
 * Start HTTP server for a dist directory
 */
async function startServer(distPath, port) {
  return new Promise((resolve, reject) => {
    // Use npx serve to serve the dist folder
    const serverProcess = spawn('npx', [
      'serve',
      '-l', port.toString(),
      '-n',  // No clipboard
      '-s',  // SPA mode (fallback to index.html)
    ], {
      cwd: distPath,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    });

    let resolved = false;

    // Wait for server to be ready
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(serverProcess);
      }
    }, 2000);

    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Accepting connections') || output.includes('http://')) {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          resolve(serverProcess);
        }
      }
    });

    serverProcess.stderr.on('data', (data) => {
      // Ignore stderr for now
    });

    serverProcess.on('error', (err) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        reject(err);
      }
    });
  });
}

/**
 * Stop server
 */
function stopServer(serverProcess) {
  return new Promise((resolve) => {
    if (!serverProcess || serverProcess.killed) {
      resolve();
      return;
    }

    serverProcess.on('exit', () => resolve());

    // Kill process tree (Windows & Unix compatible)
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', serverProcess.pid.toString(), '/f', '/t'], { stdio: 'ignore' });
      } else {
        serverProcess.kill('SIGTERM');
      }
    } catch (err) {
      // Force kill if graceful fails
      try {
        serverProcess.kill('SIGKILL');
      } catch (e) {
        // Ignore
      }
    }

    // Force resolve after 2 seconds
    setTimeout(() => resolve(), 2000);
  });
}

/**
 * Capture from Docker gateway
 */
async function captureFromDocker(project, page) {
  try {
    const url = `http://localhost:8080/${project.name}/`;
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: CONFIG.pageTimeout
    });

    await page.waitForTimeout(CONFIG.waitTime);

    const screenshotDir = path.join(CONFIG.screenshotDir, project.name);
    await fs.mkdir(screenshotDir, { recursive: true });
    const screenshotPath = path.join(screenshotDir, 'screenshot.png');

    await page.screenshot({ path: screenshotPath, fullPage: false });

    const fileStats = await fs.stat(screenshotPath);
    if (fileStats.size > CONFIG.minSize) {
      return { success: true, method: 'docker', size: fileStats.size };
    }
  } catch (err) {
    // Fall through to served method
  }
  return { success: false };
}

/**
 * Capture from local HTTP server
 */
async function captureFromServedDist(project, page) {
  let serverProcess = null;

  try {
    // Start server
    serverProcess = await startServer(project.distPath, CONFIG.serverPort);

    // Wait a bit for server to fully start
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Navigate to served app
    const url = `http://localhost:${CONFIG.serverPort}/`;
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: CONFIG.serverTimeout
    });

    // Wait for app to hydrate
    await page.waitForTimeout(CONFIG.waitTime);

    // Capture screenshot
    const screenshotDir = path.join(CONFIG.screenshotDir, project.name);
    await fs.mkdir(screenshotDir, { recursive: true });
    const screenshotPath = path.join(screenshotDir, 'screenshot.png');

    await page.screenshot({ path: screenshotPath, fullPage: false });

    // Stop server
    await stopServer(serverProcess);

    // Verify screenshot
    const fileStats = await fs.stat(screenshotPath);
    if (fileStats.size > CONFIG.minSize) {
      return { success: true, method: 'served', size: fileStats.size };
    }

    return { success: false };

  } catch (err) {
    if (serverProcess) {
      await stopServer(serverProcess);
    }
    return { success: false, error: err.message };
  }
}

/**
 * Process single project
 */
async function captureProject(project, browser, index) {
  const context = await browser.newContext({
    viewport: { width: CONFIG.viewportWidth, height: CONFIG.viewportHeight },
    bypassCSP: true,
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  try {
    let result;

    // Try Docker first if app is running there
    if (project.inDocker) {
      result = await captureFromDocker(project, page);
      if (result.success) {
        stats.docker++;
        stats.success++;
        await context.close();
        return { ...result, project: project.name, index };
      }
    }

    // Serve dist folder via HTTP
    result = await captureFromServedDist(project, page);
    if (result.success) {
      stats.served++;
      stats.success++;
      await context.close();
      return { ...result, project: project.name, index };
    }

    // Failed
    stats.failed++;
    await context.close();
    return { success: false, project: project.name, index, ...result };

  } catch (err) {
    stats.failed++;
    await context.close();
    return { success: false, project: project.name, index, error: err.message };
  }
}

/**
 * Process projects sequentially (to avoid port conflicts)
 */
async function processSequentially(projects, browser) {
  for (let i = 0; i < projects.length; i++) {
    const result = await captureProject(projects[i], browser, i);

    const num = i + 1;
    const progressBar = `[${num}/${stats.total}]`;

    if (result.success) {
      const sizeKB = (result.size / 1024).toFixed(1);
      const method = result.method === 'docker' ? colors.cyan + 'docker' + colors.reset : colors.yellow + 'served' + colors.reset;
      log(
        `${progressBar} ✓ ${result.project.padEnd(45)} (${method}, ${sizeKB}KB)`,
        'green'
      );
    } else {
      log(
        `${progressBar} ✗ ${result.project.padEnd(45)} ${colors.dim}${result.error || 'failed'}${colors.reset}`,
        'red'
      );
    }
  }
}

async function generateGallery(projects) {
  const duration = ((Date.now() - stats.startTime) / 1000).toFixed(1);
  const successRate = ((stats.success / stats.total) * 100).toFixed(1);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TUC Apps Screenshot Gallery - Production Quality</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; }
    .header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 40px; text-align: center; border-radius: 16px; margin-bottom: 40px; border: 1px solid #334155; }
    .header h1 { font-size: 2.5em; margin-bottom: 10px; background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .subtitle { color: #94a3b8; font-size: 1.1em; margin-bottom: 8px; }
    .badge { display: inline-block; background: #22c55e20; color: #22c55e; padding: 6px 16px; border-radius: 20px; font-size: 0.85em; font-weight: 600; border: 1px solid #22c55e40; margin-top: 12px; }
    .stats { display: flex; justify-content: center; gap: 20px; margin-top: 24px; flex-wrap: wrap; }
    .stat { background: #1e293b; padding: 12px 24px; border-radius: 12px; border: 1px solid #334155; min-width: 150px; }
    .stat-number { font-size: 1.8em; font-weight: bold; color: #f8fafc; }
    .stat-label { font-size: 0.9em; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
    .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 30px; }
    .card { background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .card:hover { transform: translateY(-8px); border-color: #38bdf8; box-shadow: 0 12px 24px -8px rgba(56, 189, 248, 0.3); }
    .card-image-container { position: relative; height: 240px; background: #0f172a; overflow: hidden; }
    .card-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
    .card:hover .card-image { transform: scale(1.05); }
    .card-title { padding: 20px 20px 8px; font-size: 1.25em; font-weight: 600; color: #f1f5f9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .card-info { padding: 0 20px 20px; color: #94a3b8; font-size: 0.875em; }
    .tag { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.75em; font-weight: 600; margin-right: 6px; }
    .tag-react { background: #0ea5e920; color: #0ea5e9; border: 1px solid #0ea5e940; }
    .tag-vite { background: #f59e0b20; color: #f59e0b; border: 1px solid #f59e0b40; }
    .no-screenshot { display: flex; align-items: center; justify-content: center; height: 100%; background: #0f172a; color: #475569; font-size: 1em; flex-direction: column; gap: 12px; }
    .no-screenshot svg { width: 48px; height: 48px; opacity: 0.5; }
    .footer { text-align: center; margin-top: 60px; color: #475569; border-top: 1px solid #334155; padding-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎓 Techbridge University College</h1>
    <p class="subtitle">Institutional Application Ecosystem</p>
    <div class="badge">🚀 Production-Quality Served Screenshots</div>
    <div class="stats">
      <div class="stat"><div class="stat-number">${stats.total}</div><div class="stat-label">Total Apps</div></div>
      <div class="stat"><div class="stat-number" style="color: #22c55e;">${stats.success}</div><div class="stat-label">Captured</div></div>
      <div class="stat"><div class="stat-number" style="color: #ef4444;">${stats.failed}</div><div class="stat-label">Failed</div></div>
      <div class="stat"><div class="stat-number" style="color: #38bdf8;">${stats.docker}</div><div class="stat-label">Docker</div></div>
      <div class="stat"><div class="stat-number" style="color: #f59e0b;">${stats.served}</div><div class="stat-label">HTTP Served</div></div>
      <div class="stat"><div class="stat-number" style="color: #818cf8;">${successRate}%</div><div class="stat-label">Success</div></div>
    </div>
  </div>
  <div class="gallery">
    ${projects.map(project => `
      <div class="card">
        <div class="card-image-container">
          <img src="${project.name}/screenshot.png" alt="${project.displayName}" class="card-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
          <div class="no-screenshot" style="display: none;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span>No Screenshot Available</span>
          </div>
        </div>
        <div class="card-title">${project.displayName}</div>
        <div class="card-info">
          <div style="margin-bottom: 8px; font-family: monospace; font-size: 0.8em; color: #64748b;">/${project.name}</div>
          <div>
            ${project.hasReact ? '<span class="tag tag-react">REACT</span>' : ''}
            ${project.hasVite ? '<span class="tag tag-vite">VITE</span>' : ''}
          </div>
        </div>
      </div>
    `).join('')}
  </div>
  <div class="footer">
    <p>Production-Quality Screenshots | HTTP Served | Duration: ${duration}s | ${new Date().toLocaleString()}</p>
    <p style="margin-top: 8px;">&copy; ${new Date().getFullYear()} Techbridge University College</p>
  </div>
</body>
</html>`;

  await fs.writeFile(path.join(CONFIG.screenshotDir, 'index.html'), html, 'utf-8');
}

async function main() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('  PRODUCTION-QUALITY Screenshot Capture (HTTP Served)', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  const projects = await findProjects();
  stats.total = projects.length;

  log(`📦 Found ${projects.length} projects with dist/ folders`, 'green');
  log(`   • ${projects.filter(p => p.inDocker).length} in Docker (will use gateway)`, 'cyan');
  log(`   • ${projects.filter(p => !p.inDocker).length} will be served locally\n`, 'yellow');

  // Check if 'serve' is available
  log('🔧 Checking dependencies...', 'blue');
  try {
    await exec('npx serve --version');
    log('✅ serve package available\n', 'green');
  } catch (err) {
    log('⚠️  Installing serve package (one-time setup)...', 'yellow');
    await exec('npm install -g serve');
    log('✅ serve package installed\n', 'green');
  }

  log('🚀 Launching browser...', 'cyan');
  const browser = await chromium.launch({ headless: true });
  log('✅ Browser ready\n', 'green');

  log('📸 Capturing screenshots (served via HTTP)...\n', 'cyan');
  await processSequentially(projects, browser);

  await browser.close();
  await generateGallery(projects);

  const duration = ((Date.now() - stats.startTime) / 1000).toFixed(1);
  const successRate = ((stats.success / stats.total) * 100).toFixed(1);

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('  📊 FINAL REPORT', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  log(`Total Apps:         ${stats.total}`);
  log(`✅ Success:          ${stats.success} (${successRate}%)`, 'green');
  log(`   • Docker:         ${stats.docker}`, 'cyan');
  log(`   • HTTP Served:    ${stats.served}`, 'yellow');
  log(`❌ Failed:           ${stats.failed}`, stats.failed > 0 ? 'red' : 'dim');
  log(`⏱️  Duration:         ${duration}s`);
  log(`⚡ Speed:            ${(stats.total / duration).toFixed(2)} apps/second`);
  log(`📊 Quality:          Production HTTP serving (proper asset resolution)`, 'magenta');

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  if (stats.failed === 0) {
    log('🎉 ALL SCREENSHOTS CAPTURED SUCCESSFULLY!', 'green');
  } else {
    log(`⚠️  ${stats.failed} apps failed`, 'yellow');
  }

  process.exit(stats.failed > 0 ? 1 : 0);
}

main().catch(err => {
  log(`\n❌ Fatal error: ${err.message}`, 'red');
  console.error(err);
  process.exit(1);
});
