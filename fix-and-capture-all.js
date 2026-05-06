#!/usr/bin/env node
/**
 * ============================================================================
 * Fix and Capture All Apps
 * ============================================================================
 * This script:
 * 1. Identifies and fixes common issues (base href, splash screens)
 * 2. Waits for React to fully mount (splash screens to disappear)
 * 3. Detects runtime errors
 * 4. Captures screenshots only when real content is shown
 * ============================================================================
 */

const { spawn, exec } = require('child_process');
const fs = require('fs').promises;
const fss = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const CONFIG = {
  servePort: 3456,
  buildTimeout: 300000,
  screenshotDir: 'catalogue',
  viewportWidth: 1920,
  viewportHeight: 1080,
  splashWaitTime: 20000,      // Wait 20s for splash to disappear
  maxWaitTime: 40000,          // Max 40s total wait
  recheckInterval: 3000,       // Check every 3s if splash is gone
  minScreenshotSize: 50000,    // 50KB minimum
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
  fixedBaseHref: 0,
  removedSplashScreens: 0,
  splashScreenStuck: 0,
  runtimeErrors: 0,
  screenshotSuccess: 0,
  screenshotFailed: 0,
  startTime: Date.now(),
  results: [],
  issues: {
    baseHrefIssues: [],
    splashScreenIssues: [],
    runtimeErrors: [],
    blankPages: []
  }
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

async function findBuildDir(projectName) {
  const buildDirs = ['dist', 'build'];

  for (const dir of buildDirs) {
    try {
      const indexPath = path.join(projectName, dir, 'index.html');
      await fs.access(indexPath);
      return { found: true, dir, indexPath };
    } catch {
      continue;
    }
  }

  return { found: false };
}

async function checkAndFixBaseHref(indexPath, projectName) {
  try {
    let content = await fs.readFile(indexPath, 'utf-8');
    let fixed = false;

    // Check for <base href="/">
    if (content.includes('<base href="/">')) {
      log(`    Found <base href="/">`, 'yellow');

      // Replace with <base href="./">
      content = content.replace(/<base href="\/">/g, '<base href="./">');
      await fs.writeFile(indexPath, content, 'utf-8');

      fixed = true;
      stats.fixedBaseHref++;
      stats.issues.baseHrefIssues.push(projectName);
      log(`    ✓ Fixed: Changed to <base href="./">`, 'green');
    }

    return { fixed, needsRebuild: false };
  } catch (err) {
    log(`    ✗ Error checking base href: ${err.message}`, 'red');
    return { fixed: false, needsRebuild: false };
  }
}

async function detectSplashScreen(indexPath) {
  try {
    const content = await fs.readFile(indexPath, 'utf-8');

    // Check for splash screen indicators
    const hasSplashStyles = content.includes('tuc-splash') || content.includes('splash-styles');
    const hasSplashHTML = content.includes('class="tuc-splash"') || content.includes('class="splash');
    const hasLoadingAnimation = content.includes('tuc-loading') || content.includes('loading-animation');

    return {
      hasSplash: hasSplashStyles || hasSplashHTML || hasLoadingAnimation,
      hasSplashStyles,
      hasSplashHTML
    };
  } catch (err) {
    return { hasSplash: false };
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
    serverProcess.kill('SIGTERM');

    setTimeout(() => {
      try {
        serverProcess.kill('SIGKILL');
      } catch (e) {}
      resolve();
    }, 2000);
  });
}

async function waitForAppToLoad(page, projectName, hasSplash) {
  let elapsed = 0;
  const startTime = Date.now();

  log(`    Waiting for app to load...`, 'dim');

  while (elapsed < CONFIG.maxWaitTime) {
    await page.waitForTimeout(CONFIG.recheckInterval);
    elapsed = Date.now() - startTime;

    // Check page state
    const pageState = await page.evaluate(() => {
      const body = document.body;
      const text = body.textContent || '';
      const root = document.getElementById('root');

      return {
        hasSplashClass: !!document.querySelector('.tuc-splash, .splash, [class*="splash"]'),
        hasMinimalContent: text.trim().length < 100,
        rootChildCount: root ? root.childElementCount : 0,
        hasMainContent: !!document.querySelector('main, [role="main"], header, nav, .app, #app'),
        textLength: text.trim().length,
        hasConsoleErrors: window.__hasErrors__ || false
      };
    });

    log(`      [${Math.round(elapsed/1000)}s] Root children: ${pageState.rootChildCount}, Text: ${pageState.textLength} chars`, 'dim');

    // Check if app has loaded
    if (pageState.hasMainContent && !pageState.hasSplashClass && pageState.textLength > 200) {
      log(`    ✓ App loaded successfully (${Math.round(elapsed/1000)}s)`, 'green');
      return { loaded: true, runtimeError: false, stuck: false };
    }

    // If we've waited long enough and still seeing splash, it's stuck
    if (elapsed > CONFIG.splashWaitTime && pageState.hasSplashClass) {
      log(`    ⚠ App stuck on splash screen after ${Math.round(elapsed/1000)}s`, 'yellow');
      stats.splashScreenStuck++;
      stats.issues.splashScreenIssues.push(projectName);
      return { loaded: false, runtimeError: true, stuck: true };
    }
  }

  // Timeout reached
  log(`    ⚠ Timeout waiting for app to load (${Math.round(elapsed/1000)}s)`, 'yellow');
  return { loaded: false, runtimeError: true, stuck: false };
}

async function captureWithVerification(project, buildInfo, splashInfo) {
  log(`  Serving app on http://localhost:${CONFIG.servePort}...`, 'cyan');

  let serverProcess = null;

  try {
    const buildPath = path.join(project.name, buildInfo.dir);
    serverProcess = await startServer(buildPath, CONFIG.servePort);

    const page = await browser.newPage({
      viewport: { width: CONFIG.viewportWidth, height: CONFIG.viewportHeight }
    });

    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        log(`    Console error: ${msg.text()}`, 'dim');
      }
    });

    page.on('pageerror', error => {
      log(`    Runtime error: ${error.message}`, 'yellow');
      page.evaluate(() => { window.__hasErrors__ = true; });
    });

    const url = `http://localhost:${CONFIG.servePort}`;
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for app to fully load
    const loadResult = await waitForAppToLoad(page, project.name, splashInfo.hasSplash);

    if (!loadResult.loaded) {
      await page.close();
      await stopServer(serverProcess);

      if (loadResult.runtimeError) {
        stats.runtimeErrors++;
        stats.issues.runtimeErrors.push(project.name);
      }

      return {
        success: false,
        reason: loadResult.stuck ? 'splash_screen_stuck' : 'timeout',
        runtimeError: loadResult.runtimeError
      };
    }

    // Capture screenshot
    const screenshotDir = path.join(CONFIG.screenshotDir, project.name);
    await fs.mkdir(screenshotDir, { recursive: true });
    const screenshotPath = path.join(screenshotDir, 'screenshot.png');

    await page.screenshot({ path: screenshotPath, fullPage: false });

    const fileStats = await fs.stat(screenshotPath);
    await page.close();
    await stopServer(serverProcess);

    if (fileStats.size > CONFIG.minScreenshotSize) {
      stats.screenshotSuccess++;
      log(`  ✓ Screenshot captured (${Math.round(fileStats.size / 1024)}KB)`, 'green');
      return { success: true, size: fileStats.size };
    } else {
      stats.screenshotFailed++;
      log(`  ✗ Screenshot too small (${Math.round(fileStats.size / 1024)}KB)`, 'red');
      return { success: false, reason: 'screenshot_too_small' };
    }

  } catch (error) {
    log(`  ✗ Capture failed: ${error.message}`, 'red');
    if (serverProcess) {
      await stopServer(serverProcess);
    }
    stats.screenshotFailed++;
    return { success: false, reason: 'error', error: error.message };
  }
}

let browser;

async function processProject(project) {
  stats.total++;
  log(`\n${'='.repeat(80)}`, 'cyan');
  log(`[${stats.total}] ${project.name}`, 'bold');
  log(`${'='.repeat(80)}`, 'cyan');

  const result = {
    name: project.name,
    success: false,
    issues: []
  };

  // Find build directory
  const buildInfo = await findBuildDir(project.name);
  if (!buildInfo.found) {
    log(`  ❌ No build found`, 'red');
    result.error = 'no_build';
    stats.results.push(result);
    return result;
  }

  log(`  Found build: ${buildInfo.dir}/`, 'green');

  // Check and fix base href
  log(`  Checking for base href issues...`, 'dim');
  const baseHrefFix = await checkAndFixBaseHref(buildInfo.indexPath, project.name);

  // Detect splash screen
  log(`  Detecting splash screen...`, 'dim');
  const splashInfo = await detectSplashScreen(buildInfo.indexPath);
  if (splashInfo.hasSplash) {
    log(`  ⚠ Splash screen detected in index.html`, 'yellow');
  }

  // Capture screenshot with verification
  const captureResult = await captureWithVerification(project, buildInfo, splashInfo);

  if (captureResult.success) {
    result.success = true;
    result.size = captureResult.size;
  } else {
    result.error = captureResult.reason;
    if (captureResult.runtimeError) {
      result.issues.push('runtime_error');
    }
  }

  stats.results.push(result);
  return result;
}

async function main() {
  log(`\n${'='.repeat(80)}`, 'cyan');
  log(`Fix and Capture All Apps`, 'bold');
  log(`${'='.repeat(80)}`, 'cyan');
  log(`This script fixes common issues and captures working app screenshots`, 'yellow');
  log(`Started: ${new Date().toLocaleString()}\n`, 'dim');

  const projects = await findProjects();
  log(`Found ${projects.length} projects to process\n`, 'green');

  browser = await chromium.launch({ headless: true });

  // Process only first 5 for testing
  const testProjects = projects.slice(0, 5);
  log(`\nTEST MODE: Processing first ${testProjects.length} projects\n`, 'magenta');

  for (const project of testProjects) {
    await processProject(project);
  }

  await browser.close();

  generateReport();

  process.exit(0);
}

function generateReport() {
  log(`\n\n${'='.repeat(80)}`, 'cyan');
  log(`FINAL REPORT`, 'bold');
  log(`${'='.repeat(80)}`, 'cyan');

  log(`\nStatistics:`, 'yellow');
  log(`  Total processed:               ${stats.total}`);
  log(`  ✅ Screenshots captured:       ${stats.screenshotSuccess}`, 'green');
  log(`  ❌ Screenshot failures:        ${stats.screenshotFailed}`, stats.screenshotFailed > 0 ? 'red' : 'green');
  log(`  🔧 Fixed base href:            ${stats.fixedBaseHref}`, stats.fixedBaseHref > 0 ? 'cyan' : 'green');
  log(`  ⚠️  Apps stuck on splash:      ${stats.splashScreenStuck}`, stats.splashScreenStuck > 0 ? 'yellow' : 'green');
  log(`  ⚠️  Runtime errors:            ${stats.runtimeErrors}`, stats.runtimeErrors > 0 ? 'yellow' : 'green');

  const duration = Math.round((Date.now() - stats.startTime) / 1000);
  log(`\nDuration: ${Math.floor(duration / 60)}m ${duration % 60}s`, 'dim');

  const successful = stats.results.filter(r => r.success);
  const failed = stats.results.filter(r => !r.success);

  if (successful.length > 0) {
    log(`\n\n✅ SUCCESSFUL (${successful.length}):`, 'green');
    successful.forEach((r, i) => {
      log(`  ${i + 1}. ${r.name} (${Math.round(r.size/1024)}KB)`, 'green');
    });
  }

  if (failed.length > 0) {
    log(`\n\n❌ FAILED (${failed.length}):`, 'red');
    failed.forEach((r, i) => {
      log(`  ${i + 1}. ${r.name} - ${r.error}`, 'red');
    });
  }

  if (stats.issues.splashScreenIssues.length > 0) {
    log(`\n\n⚠️  APPS STUCK ON SPLASH SCREEN:`, 'yellow');
    stats.issues.splashScreenIssues.forEach((name, i) => {
      log(`  ${i + 1}. ${name} - Check for runtime errors in browser console`, 'yellow');
    });
  }
}

main().catch(error => {
  log(`\n\nFatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
