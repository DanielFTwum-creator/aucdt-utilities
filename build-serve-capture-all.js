#!/usr/bin/env node
/**
 * ============================================================================
 * Build, Serve, and Capture - CORRECTED VERSION
 * ============================================================================
 * This script properly serves each app via HTTP before capturing screenshots
 * to ensure React fully mounts and displays actual content (not splash screens)
 * ============================================================================
 */

const { spawn, exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { chromium } = require('playwright');

const CONFIG = {
  servePort: 3456,
  buildTimeout: 300000,
  screenshotDir: 'catalogue',
  viewportWidth: 1920,
  viewportHeight: 1080,
  appLoadWait: 10000,        // Wait 10s for app to fully load
  minScreenshotSize: 20000,  // 20KB minimum
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
  splashScreenDetected: 0,
  actualContentCaptured: 0,
  startTime: Date.now(),
  results: []
};

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
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
  // Check if already built
  const buildDirs = ['dist', 'build'];
  for (const dir of buildDirs) {
    try {
      const indexPath = path.join(project.name, dir, 'index.html');
      await fs.access(indexPath);
      log(`  ✓ Already built (found ${dir}/index.html)`, 'dim');
      return { success: true, path: indexPath, dir };
    } catch {
      continue;
    }
  }

  // Need to build
  log(`  Building...`, 'cyan');
  try {
    const buildCmd = project.packageManager === 'pnpm' ? 'pnpm run build' : 'npm run build';
    await execPromise(buildCmd, project.name);

    // Find build output
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
    log(`  ✗ Build failed: ${error.error?.message || error.message}`, 'red');
    return { success: false };
  }
}

function startServer(buildDir, port) {
  return new Promise((resolve, reject) => {
    const serve = spawn('npx', ['serve', '-s', buildDir, '-l', port.toString()], {
      stdio: 'pipe',
      shell: true
    });

    let started = false;
    const timeout = setTimeout(() => {
      if (!started) {
        serve.kill();
        reject(new Error('Server start timeout'));
      }
    }, 10000);

    serve.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Accepting connections') || output.includes(`http://localhost:${port}`)) {
        if (!started) {
          started = true;
          clearTimeout(timeout);
          // Wait a bit more to ensure server is ready
          setTimeout(() => resolve(serve), 1000);
        }
      }
    });

    serve.stderr.on('data', (data) => {
      const error = data.toString();
      if (error.includes('EADDRINUSE')) {
        if (!started) {
          clearTimeout(timeout);
          reject(new Error('Port already in use'));
        }
      }
    });

    serve.on('error', (error) => {
      if (!started) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  });
}

function stopServer(serverProcess) {
  return new Promise((resolve) => {
    if (!serverProcess) {
      resolve();
      return;
    }

    serverProcess.on('exit', () => resolve());

    // Try graceful shutdown first
    serverProcess.kill('SIGTERM');

    // Force kill after 2 seconds
    setTimeout(() => {
      try {
        serverProcess.kill('SIGKILL');
      } catch (e) {
        // Process already dead
      }
      resolve();
    }, 2000);
  });
}

async function isSplashScreen(page) {
  try {
    // Check for common splash screen indicators
    const indicators = await page.evaluate(() => {
      const body = document.body;
      const text = body.textContent.toLowerCase();

      return {
        hasLoadingText: text.includes('loading') || text.includes('please wait'),
        hasSplashClass: !!body.querySelector('.splash, .loading, [class*="splash"]'),
        hasMinimalContent: body.querySelectorAll('div, section, main, article').length < 10,
        hasSpinner: !!body.querySelector('[class*="spin"], [class*="load"], .loader'),
        textLength: text.trim().length
      };
    });

    // It's likely a splash screen if:
    const isSplash = (
      indicators.hasLoadingText ||
      indicators.hasSplashClass ||
      (indicators.hasMinimalContent && indicators.textLength < 200) ||
      indicators.hasSpinner
    );

    return isSplash;
  } catch (err) {
    return false;
  }
}

async function captureWithServer(project, buildInfo, browser) {
  log(`  Serving app on http://localhost:${CONFIG.servePort}...`, 'cyan');

  let serverProcess = null;

  try {
    // Start server
    const buildPath = path.join(project.name, buildInfo.dir);
    serverProcess = await startServer(buildPath, CONFIG.servePort);

    const page = await browser.newPage({
      viewport: { width: CONFIG.viewportWidth, height: CONFIG.viewportHeight }
    });

    const url = `http://localhost:${CONFIG.servePort}`;
    log(`  Loading ${url}...`, 'dim');

    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for app to load
    log(`  Waiting ${CONFIG.appLoadWait/1000}s for app to fully load...`, 'dim');
    await page.waitForTimeout(CONFIG.appLoadWait);

    // Check if it's still a splash screen
    const stillSplash = await isSplashScreen(page);

    if (stillSplash) {
      log(`  ⚠ Splash screen detected, waiting longer...`, 'yellow');
      stats.splashScreenDetected++;
      await page.waitForTimeout(5000); // Wait 5 more seconds

      const stillSplashAfterWait = await isSplashScreen(page);
      if (stillSplashAfterWait) {
        log(`  ⚠ App stuck on splash screen`, 'yellow');
      }
    } else {
      stats.actualContentCaptured++;
    }

    // Capture screenshot
    const screenshotDir = path.join(CONFIG.screenshotDir, project.name);
    await fs.mkdir(screenshotDir, { recursive: true });
    const screenshotPath = path.join(screenshotDir, 'screenshot.png');

    await page.screenshot({ path: screenshotPath, fullPage: false });

    const fileStats = await fs.stat(screenshotPath);
    await page.close();

    // Stop server
    await stopServer(serverProcess);

    if (fileStats.size > CONFIG.minScreenshotSize) {
      stats.screenshotSuccess++;
      log(`  ✓ Screenshot captured (${Math.round(fileStats.size / 1024)}KB)${stillSplash ? ' - may be splash screen' : ''}`, 'green');
      return { success: true, size: fileStats.size, isSplash: stillSplash };
    } else {
      stats.screenshotFailed++;
      log(`  ✗ Screenshot too small (${Math.round(fileStats.size / 1024)}KB)`, 'red');
      return { success: false, size: fileStats.size };
    }

  } catch (error) {
    log(`  ✗ Capture failed: ${error.message}`, 'red');
    if (serverProcess) {
      await stopServer(serverProcess);
    }
    stats.screenshotFailed++;
    return { success: false, error: error.message };
  }
}

async function processProject(project, browser) {
  stats.total++;
  log(`\n${'='.repeat(80)}`, 'cyan');
  log(`[${stats.total}] ${project.name}`, 'bold');
  log(`${'='.repeat(80)}`, 'cyan');

  const result = {
    name: project.name,
    buildSuccess: false,
    screenshotSuccess: false,
    isSplash: false
  };

  // Build if needed
  const buildInfo = await buildIfNeeded(project);
  if (!buildInfo.success) {
    result.error = 'build_failed';
    stats.results.push(result);
    return result;
  }
  result.buildSuccess = true;

  // Capture with server
  const captureResult = await captureWithServer(project, buildInfo, browser);
  if (captureResult.success) {
    result.screenshotSuccess = true;
    result.isSplash = captureResult.isSplash;
    result.size = captureResult.size;
  } else {
    result.error = captureResult.error || 'screenshot_failed';
  }

  stats.results.push(result);
  return result;
}

async function main() {
  log(`\n${'='.repeat(80)}`, 'cyan');
  log(`Build, Serve, and Capture - CORRECTED VERSION`, 'bold');
  log(`${'='.repeat(80)}`, 'cyan');
  log(`Mode: Serve via HTTP (not file://)`, 'yellow');
  log(`Started: ${new Date().toLocaleString()}\n`, 'dim');

  const projects = await findProjects();
  log(`Found ${projects.length} projects to process\n`, 'green');

  const browser = await chromium.launch({ headless: true });

  for (const project of projects) {
    await processProject(project, browser);
  }

  await browser.close();

  // Generate report
  log(`\n\n${'='.repeat(80)}`, 'cyan');
  log(`FINAL REPORT`, 'bold');
  log(`${'='.repeat(80)}`, 'cyan');
  log(`\nStatistics:`, 'yellow');
  log(`  Total projects:               ${stats.total}`);
  log(`  Build successful:             ${stats.buildSuccess}`, 'green');
  log(`  Build failed:                 ${stats.buildFailed}`, stats.buildFailed > 0 ? 'red' : 'green');
  log(`  Screenshots captured:         ${stats.screenshotSuccess}`, 'green');
  log(`  Screenshot failures:          ${stats.screenshotFailed}`, stats.screenshotFailed > 0 ? 'red' : 'green');
  log(`  Actual content captured:      ${stats.actualContentCaptured}`, 'green');
  log(`  Splash screens detected:      ${stats.splashScreenDetected}`, stats.splashScreenDetected > 0 ? 'yellow' : 'green');

  const duration = Math.round((Date.now() - stats.startTime) / 1000);
  log(`\nDuration: ${Math.floor(duration / 60)}m ${duration % 60}s`, 'dim');

  const failures = stats.results.filter(r => !r.buildSuccess || !r.screenshotSuccess);
  if (failures.length > 0) {
    log(`\n\nIssues (${failures.length}):`, 'red');
    failures.forEach((f, i) => {
      log(`  ${i + 1}. ${f.name} - ${f.error || 'unknown'}`, 'red');
    });
  }

  const splashScreens = stats.results.filter(r => r.isSplash);
  if (splashScreens.length > 0) {
    log(`\n\nApps stuck on splash screen (${splashScreens.length}):`, 'yellow');
    splashScreens.forEach((s, i) => {
      log(`  ${i + 1}. ${s.name}`, 'yellow');
    });
  }

  // Save report
  const reportPath = 'BUILD-SERVE-CAPTURE-REPORT.md';
  const report = generateReport();
  await fs.writeFile(reportPath, report);
  log(`\n✓ Detailed report saved to ${reportPath}`, 'green');

  process.exit(failures.length > 0 ? 1 : 0);
}

function generateReport() {
  const successful = stats.results.filter(r => r.buildSuccess && r.screenshotSuccess && !r.isSplash);
  const splashScreens = stats.results.filter(r => r.isSplash);
  const failed = stats.results.filter(r => !r.buildSuccess || !r.screenshotSuccess);

  return `# Build, Serve, and Capture Report

**Generated:** ${new Date().toLocaleString()}
**Duration:** ${Math.floor((Date.now() - stats.startTime) / 60000)}m ${Math.floor(((Date.now() - stats.startTime) % 60000) / 1000)}s

## Summary

| Metric | Count | Percentage |
|--------|-------|------------|
| Total Projects | ${stats.total} | 100% |
| ✅ Build Successful | ${stats.buildSuccess} | ${((stats.buildSuccess/stats.total)*100).toFixed(1)}% |
| ❌ Build Failed | ${stats.buildFailed} | ${((stats.buildFailed/stats.total)*100).toFixed(1)}% |
| ✅ Screenshots Captured | ${stats.screenshotSuccess} | ${((stats.screenshotSuccess/stats.total)*100).toFixed(1)}% |
| ✅ Actual Content | ${stats.actualContentCaptured} | ${((stats.actualContentCaptured/stats.total)*100).toFixed(1)}% |
| ⚠️ Splash Screens | ${stats.splashScreenDetected} | ${((stats.splashScreenDetected/stats.total)*100).toFixed(1)}% |
| ❌ Screenshot Failed | ${stats.screenshotFailed} | ${((stats.screenshotFailed/stats.total)*100).toFixed(1)}% |

## Fully Successful Projects (${successful.length})

${successful.map((r, i) => `${i + 1}. ✅ **${r.name}** (${Math.round(r.size/1024)}KB)`).join('\n')}

## Apps Stuck on Splash Screen (${splashScreens.length})

${splashScreens.length > 0 ? splashScreens.map((r, i) => `${i + 1}. ⚠️ **${r.name}** - May need longer load time or has runtime errors`).join('\n') : '*None*'}

## Failed Projects (${failed.length})

${failed.length > 0 ? failed.map((r, i) => `${i + 1}. ❌ **${r.name}** - ${r.error || 'unknown'}`).join('\n') : '*None*'}

---
*Generated by build-serve-capture-all.js*
`;
}

main().catch(error => {
  log(`\n\nFatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
