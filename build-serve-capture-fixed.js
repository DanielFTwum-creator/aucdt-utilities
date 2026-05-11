#!/usr/bin/env node
/**
 * ============================================================================
 * Build, Serve, and Capture - FINAL FIX
 * ============================================================================
 * Uses different port for each app to avoid caching/conflicts
 * Clears browser cache between captures
 * ============================================================================
 */

const { spawn, exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { chromium } = require('playwright');

const CONFIG = {
  basePort: 4000,              // Starting port, increments for each app
  buildTimeout: 300000,
  screenshotDir: 'catalogue',
  viewportWidth: 1920,
  viewportHeight: 1080,
  appLoadWait: 12000,          // Wait 12s for app to fully load
  serverStartWait: 3000,        // Wait 3s after server starts
  serverStopWait: 2000,        // Wait 2s after server stops
  minScreenshotSize: 20000,
  skipDirs: [
    'node_modules', 'dist', 'build', '.git', 'docker', 'catalogue',
    'scripts', 'tests', 'templates', 'reports', 'Documentation',
    'archive', 'build-logs', 'install-logs', 'proof-of-concept-screenshots',
    'project-screenshots-real', 'sync-from-d-drive', 'monitoring',
    'src', 'docs', 'playwright', 'backend', 'gemini', 'genai', '.claude',
    '.vscode', '.github', 'test-results', 'build-validation-reports'
  ]
};

const stats = {
  total: 0,
  buildSuccess: 0,
  buildFailed: 0,
  screenshotSuccess: 0,
  screenshotFailed: 0,
  startTime: Date.now(),
  results: []
};

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execPromise(command, cwd) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd, timeout: CONFIG.buildTimeout, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function findProjects() {
  const dirs = await fs.readdir('.', { withFileTypes: true });
  const projects = [];

  for (const dir of dirs) {
    if (!dir.isDirectory() || CONFIG.skipDirs.includes(dir.name)) continue;

    try {
      const packagePath = path.join(dir.name, 'package.json');
      await fs.access(packagePath);
      const packageData = JSON.parse(await fs.readFile(packagePath, 'utf-8'));

      const hasExpress = packageData.dependencies?.express;
      const hasReact = packageData.dependencies?.react;
      const isBackendOnly = hasExpress && !hasReact;

      if (!isBackendOnly) {
        projects.push({
          name: dir.name,
          displayName: packageData.description || packageData.name || dir.name,
          packageManager: await detectPackageManager(dir.name)
        });
      }
    } catch (err) {
      continue;
    }
  }

  return projects;
}

async function detectPackageManager(projectDir) {
  try {
    await fs.access(path.join(projectDir, 'pnpm-lock.yaml'));
    return 'pnpm';
  } catch {
    return 'npm';
  }
}

async function buildIfNeeded(project) {
  const buildDirs = ['dist', 'build'];
  for (const dir of buildDirs) {
    try {
      const indexPath = path.join(project.name, dir, 'index.html');
      await fs.access(indexPath);
      log(`  ✓ Already built`, 'dim');
      return { success: true, path: indexPath, dir };
    } catch {
      continue;
    }
  }

  log(`  Building...`, 'cyan');
  try {
    const buildCmd = project.packageManager === 'pnpm' ? 'pnpm run build' : 'npm run build';
    await execPromise(buildCmd, project.name);

    for (const dir of buildDirs) {
      try {
        const indexPath = path.join(project.name, dir, 'index.html');
        await fs.access(indexPath);
        stats.buildSuccess++;
        log(`  ✓ Build successful`, 'green');
        return { success: true, path: indexPath, dir };
      } catch {
        continue;
      }
    }

    throw new Error('Build succeeded but no index.html found');
  } catch (error) {
    stats.buildFailed++;
    log(`  ✗ Build failed`, 'red');
    return { success: false };
  }
}

function startServer(buildDir, port) {
  return new Promise((resolve, reject) => {
    const serve = spawn('npx', ['serve', '-s', buildDir, '-l', port.toString(), '--no-clipboard'], {
      stdio: 'pipe',
      shell: true
    });

    let started = false;
    const timeout = setTimeout(() => {
      if (!started) {
        serve.kill();
        reject(new Error('Server start timeout'));
      }
    }, 15000);

    serve.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Accepting connections') || output.includes(`http://localhost:${port}`)) {
        if (!started) {
          started = true;
          clearTimeout(timeout);
          resolve(serve);
        }
      }
    });

    serve.stderr.on('data', (data) => {
      const error = data.toString();
      if (error.includes('EADDRINUSE')) {
        if (!started) {
          clearTimeout(timeout);
          reject(new Error(`Port ${port} already in use`));
        }
      }
    });
  });
}

async function stopServer(serverProcess) {
  if (!serverProcess) return;

  return new Promise((resolve) => {
    serverProcess.kill('SIGTERM');

    const timeout = setTimeout(() => {
      try {
        serverProcess.kill('SIGKILL');
      } catch (e) {}
      resolve();
    }, 2000);

    serverProcess.on('exit', () => {
      clearTimeout(timeout);
      resolve();
    });
  });
}

async function captureApp(project, buildInfo, port, browser) {
  const buildPath = path.join(project.name, buildInfo.dir);
  log(`  Serving on port ${port}...`, 'cyan');

  let serverProcess = null;

  try {
    serverProcess = await startServer(buildPath, port);
    await new Promise(resolve => setTimeout(resolve, CONFIG.serverStartWait));

    // Create new browser context (clears cache)
    const context = await browser.newContext({
      viewport: { width: CONFIG.viewportWidth, height: CONFIG.viewportHeight }
    });
    const page = await context.newPage();

    const url = `http://localhost:${port}`;
    log(`  Loading ${url}...`, 'dim');

    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    log(`  Waiting ${CONFIG.appLoadWait/1000}s for React...`, 'dim');
    await page.waitForTimeout(CONFIG.appLoadWait);

    // Get page title to verify correct app loaded
    const pageTitle = await page.title();
    log(`  Page loaded: "${pageTitle}"`, 'dim');

    // Capture screenshot
    const screenshotDir = path.join(CONFIG.screenshotDir, project.name);
    await fs.mkdir(screenshotDir, { recursive: true });
    const screenshotPath = path.join(screenshotDir, 'screenshot.png');

    await page.screenshot({ path: screenshotPath, fullPage: false });

    await context.close();
    await stopServer(serverProcess);
    await new Promise(resolve => setTimeout(resolve, CONFIG.serverStopWait));

    const fileStats = await fs.stat(screenshotPath);

    if (fileStats.size > CONFIG.minScreenshotSize) {
      stats.screenshotSuccess++;
      log(`  ✓ Screenshot saved (${Math.round(fileStats.size / 1024)}KB)`, 'green');
      return { success: true, size: fileStats.size, title: pageTitle };
    } else {
      stats.screenshotFailed++;
      log(`  ✗ Screenshot too small (${Math.round(fileStats.size / 1024)}KB)`, 'red');
      return { success: false, size: fileStats.size };
    }

  } catch (error) {
    log(`  ✗ Error: ${error.message}`, 'red');
    if (serverProcess) {
      await stopServer(serverProcess);
      await new Promise(resolve => setTimeout(resolve, CONFIG.serverStopWait));
    }
    stats.screenshotFailed++;
    return { success: false, error: error.message };
  }
}

async function processProject(project, index, browser) {
  stats.total++;
  const port = CONFIG.basePort + index;

  log(`\n${'='.repeat(80)}`, 'cyan');
  log(`[${stats.total}] ${project.name}`, 'bold');
  log(`${'='.repeat(80)}`, 'cyan');

  const result = {
    name: project.name,
    buildSuccess: false,
    screenshotSuccess: false
  };

  const buildInfo = await buildIfNeeded(project);
  if (!buildInfo.success) {
    result.error = 'build_failed';
    stats.results.push(result);
    return result;
  }
  result.buildSuccess = true;

  const captureResult = await captureApp(project, buildInfo, port, browser);
  if (captureResult.success) {
    result.screenshotSuccess = true;
    result.size = captureResult.size;
    result.title = captureResult.title;
  } else {
    result.error = captureResult.error || 'screenshot_failed';
  }

  stats.results.push(result);
  return result;
}

async function main() {
  log(`\n${'='.repeat(80)}`, 'cyan');
  log(`Build, Serve, and Capture - FIXED VERSION`, 'bold');
  log(`${'='.repeat(80)}`, 'cyan');
  log(`Fix: Different port per app + browser context clearing`, 'yellow');
  log(`Started: ${new Date().toLocaleString()}\n`, 'dim');

  const projects = await findProjects();
  log(`Found ${projects.length} projects to process\n`, 'green');

  const browser = await chromium.launch({ headless: true });

  for (let i = 0; i < projects.length; i++) {
    await processProject(projects[i], i, browser);
  }

  await browser.close();

  // Generate report
  log(`\n\n${'='.repeat(80)}`, 'cyan');
  log(`FINAL REPORT`, 'bold');
  log(`${'='.repeat(80)}`, 'cyan');
  log(`\nStatistics:`, 'yellow');
  log(`  Total projects:           ${stats.total}`);
  log(`  Build successful:         ${stats.buildSuccess}`, 'green');
  log(`  Build failed:             ${stats.buildFailed}`, stats.buildFailed > 0 ? 'red' : 'green');
  log(`  Screenshots captured:     ${stats.screenshotSuccess}`, 'green');
  log(`  Screenshot failures:      ${stats.screenshotFailed}`, stats.screenshotFailed > 0 ? 'red' : 'green');

  const duration = Math.round((Date.now() - stats.startTime) / 1000);
  log(`\nDuration: ${Math.floor(duration / 60)}m ${duration % 60}s`, 'dim');

  const failures = stats.results.filter(r => !r.buildSuccess || !r.screenshotSuccess);
  if (failures.length > 0) {
    log(`\n\nIssues (${failures.length}):`, 'red');
    failures.forEach((f, i) => {
      log(`  ${i + 1}. ${f.name} - ${f.error || 'unknown'}`, 'red');
    });
  }

  const reportPath = 'SCREENSHOT-CAPTURE-REPORT.md';
  const report = `# Screenshot Capture Report

**Generated:** ${new Date().toLocaleString()}
**Duration:** ${Math.floor((Date.now() - stats.startTime) / 60000)}m ${Math.floor(((Date.now() - stats.startTime) % 60000) / 1000)}s

## Summary

| Metric | Count | Percentage |
|--------|-------|------------|
| Total Projects | ${stats.total} | 100% |
| ✅ Build Successful | ${stats.buildSuccess} | ${((stats.buildSuccess/stats.total)*100).toFixed(1)}% |
| ✅ Screenshots Captured | ${stats.screenshotSuccess} | ${((stats.screenshotSuccess/stats.total)*100).toFixed(1)}% |
| ❌ Build Failed | ${stats.buildFailed} | ${((stats.buildFailed/stats.total)*100).toFixed(1)}% |
| ❌ Screenshot Failed | ${stats.screenshotFailed} | ${((stats.screenshotFailed/stats.total)*100).toFixed(1)}% |

## Successful Captures (${stats.screenshotSuccess})

${stats.results.filter(r => r.screenshotSuccess).map((r, i) => `${i + 1}. ✅ **${r.name}**
   - Title: ${r.title || 'N/A'}
   - Size: ${Math.round(r.size/1024)}KB`).join('\n\n')}

## Failed (${failures.length})

${failures.map((r, i) => `${i + 1}. ❌ **${r.name}** - ${r.error || 'unknown'}`).join('\n')}
`;

  await fs.writeFile(reportPath, report);
  log(`\n✓ Report saved to ${reportPath}`, 'green');

  process.exit(failures.length > 0 ? 1 : 0);
}

main().catch(error => {
  log(`\n\nFatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
