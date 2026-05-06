#!/usr/bin/env node
/**
 * ============================================================================
 * 100% App Screenshot Capture - Build & Serve Approach
 * ============================================================================
 * Purpose: Capture screenshots from ALL apps with 100% coverage
 * Method: Build each app, serve it, capture screenshot, move to next
 * Author: TUC ICT Department
 * Date: March 11, 2026
 * ============================================================================
 */

const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');
const { exec, spawn } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuration
const CONFIG = {
  catalogueDir: 'catalogue',
  viewportWidth: 1920,
  viewportHeight: 1080,
  timeout: 20000,
  serverPort: 4173,
  serverStartDelay: 8000, // Wait 8 seconds for server to start
};

// Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

// Statistics
const stats = {
  total: 0,
  success: 0,
  failed: 0,
  backendOnly: 0,
  skipped: 0,
  startTime: Date.now(),
  successApps: [],
  failedApps: [],
  backendApps: [],
  skippedApps: [],
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Get all projects
 */
async function findAllProjects() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('  TUC 100% Screenshot Capture - Build & Serve Method', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  log('📦 Scanning for all projects...', 'blue');

  const projects = [];
  const entries = await fs.readdir('.', { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const packageJsonPath = path.join(entry.name, 'package.json');

    try {
      await fs.access(packageJsonPath);
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

      // Check if backend-only
      const hasExpress = packageJson.dependencies?.express || packageJson.dependencies?.['@types/express'];
      const hasReact = packageJson.dependencies?.react || packageJson.dependencies?.['react-dom'];
      const isBackendOnly = hasExpress && !hasReact;

      projects.push({
        name: entry.name,
        isBackendOnly,
        packageJson,
      });
    } catch (err) {
      // No package.json
    }
  }

  const frontendApps = projects.filter(p => !p.isBackendOnly);
  const backendApps = projects.filter(p => p.isBackendOnly);

  log(`✅ Found ${projects.length} projects:`, 'green');
  log(`   • ${frontendApps.length} frontend apps (WILL capture 100%)`, 'cyan');
  log(`   • ${backendApps.length} backend APIs (will skip - no UI)\n`, 'yellow');

  stats.backendApps = backendApps.map(p => p.name);
  stats.backendOnly = backendApps.length;

  return frontendApps;
}

/**
 * Build an app
 */
async function buildApp(project) {
  const appDir = project.name;

  log(`  📦 Installing dependencies...`, 'blue');

  try {
    // Try pnpm first
    await execAsync('pnpm install --silent', {
      cwd: appDir,
      timeout: 120000, // 2 minutes
    });
  } catch (err) {
    // Fallback to npm
    try {
      await execAsync('npm install --silent --legacy-peer-deps', {
        cwd: appDir,
        timeout: 120000,
      });
    } catch (npmErr) {
      throw new Error('Dependency installation failed');
    }
  }

  log(`  🔨 Building app...`, 'blue');

  try {
    await execAsync('pnpm run build || npm run build', {
      cwd: appDir,
      timeout: 180000, // 3 minutes
    });
  } catch (err) {
    throw new Error('Build failed');
  }

  // Verify dist exists
  const distPath = path.join(appDir, 'dist');
  try {
    await fs.access(distPath);
  } catch (err) {
    throw new Error('Build succeeded but dist/ not found');
  }

  return true;
}

/**
 * Start preview server
 */
async function startPreviewServer(project) {
  const appDir = project.name;

  return new Promise((resolve, reject) => {
    const serverProcess = spawn('pnpm', ['run', 'preview'], {
      cwd: appDir,
      shell: true,
      stdio: 'pipe',
    });

    let started = false;

    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Local:') || output.includes('localhost:')) {
        started = true;
      }
    });

    serverProcess.stderr.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Local:') || output.includes('localhost:')) {
        started = true;
      }
    });

    // Wait for server to start
    setTimeout(() => {
      if (started || true) { // Always assume started after delay
        resolve(serverProcess);
      } else {
        serverProcess.kill();
        reject(new Error('Server failed to start'));
      }
    }, CONFIG.serverStartDelay);
  });
}

/**
 * Capture screenshot from preview server
 */
async function captureScreenshot(project, page) {
  const url = `http://localhost:${CONFIG.serverPort}`;
  const screenshotPath = path.join(CONFIG.catalogueDir, project.name, 'screenshot.png');

  await fs.mkdir(path.dirname(screenshotPath), { recursive: true });

  try {
    const response = await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: CONFIG.timeout,
    });

    if (!response || !response.ok()) {
      throw new Error(`HTTP ${response?.status() || 'N/A'}`);
    }

    // Wait for React to render
    await page.waitForTimeout(3000);

    await page.screenshot({
      path: screenshotPath,
      fullPage: false,
    });

    return true;
  } catch (err) {
    throw new Error(`Screenshot failed: ${err.message}`);
  }
}

/**
 * Process a single app
 */
async function processApp(project, page, index, total) {
  log(`\n[${ index + 1 }/${total}] ${project.name}`, 'bright');

  try {
    // Check if already has screenshot (skip if exists)
    const screenshotPath = path.join(CONFIG.catalogueDir, project.name, 'screenshot.png');
    try {
      await fs.access(screenshotPath);
      log(`  ⏩ SKIPPED: Screenshot already exists`, 'yellow');
      stats.skipped++;
      stats.skippedApps.push(project.name);
      return true;
    } catch (err) {
      // Screenshot doesn't exist, continue
    }

    // Check if already built
    const distPath = path.join(project.name, 'dist');
    let needsBuild = true;

    try {
      await fs.access(distPath);
      log(`  ✓ Dist folder exists, skipping build`, 'green');
      needsBuild = false;
    } catch (err) {
      // Needs build
    }

    if (needsBuild) {
      await buildApp(project);
      log(`  ✓ Build complete`, 'green');
    }

    // Start preview server
    log(`  🚀 Starting preview server...`, 'blue');
    const serverProcess = await startPreviewServer(project);

    try {
      // Capture screenshot
      log(`  📸 Capturing screenshot...`, 'blue');
      await captureScreenshot(project, page);

      log(`  ✅ SUCCESS: Screenshot captured`, 'green');
      stats.success++;
      stats.successApps.push(project.name);

      return true;
    } finally {
      // Always kill server
      serverProcess.kill();
      await new Promise(r => setTimeout(r, 1000)); // Wait for port to free
    }
  } catch (error) {
    log(`  ❌ FAILED: ${error.message}`, 'red');
    stats.failed++;
    stats.failedApps.push({
      name: project.name,
      error: error.message,
    });
    return false;
  }
}

/**
 * Generate final report
 */
async function generateReport() {
  const duration = ((Date.now() - stats.startTime) / 1000 / 60).toFixed(1);

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('  📊 100% CAPTURE FINAL REPORT', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');

  log(`\n📈 Statistics:`, 'bright');
  log(`   Total Apps:           ${stats.total}`, 'cyan');
  log(`   ✅ Captured:           ${stats.success}`, 'green');
  log(`   ⏩ Skipped (existed):   ${stats.skipped}`, 'yellow');
  log(`   ❌ Failed:              ${stats.failed}`, 'red');
  log(`   ⊘  Backend (no UI):     ${stats.backendOnly}`, 'magenta');
  log(`   ⏱️  Duration:            ${duration} minutes`, 'blue');

  const totalAttempted = stats.success + stats.failed + stats.skipped;
  const successRate = ((stats.success + stats.skipped) / totalAttempted * 100).toFixed(1);
  log(`   📊 Coverage Rate:      ${successRate}%`, 'bright');

  // Write logs
  if (stats.successApps.length > 0) {
    await fs.writeFile('100-percent-success.log', stats.successApps.join('\n'));
    log(`\n✅ Success log: 100-percent-success.log`, 'green');
  }

  if (stats.failedApps.length > 0) {
    const failedReport = stats.failedApps
      .map(f => `${f.name} - ${f.error}`)
      .join('\n');
    await fs.writeFile('100-percent-failed.log', failedReport);
    log(`❌ Failed log: 100-percent-failed.log`, 'red');
  }

  if (stats.skippedApps.length > 0) {
    await fs.writeFile('100-percent-skipped.log', stats.skippedApps.join('\n'));
    log(`⏩ Skipped log: 100-percent-skipped.log`, 'yellow');
  }

  if (stats.backendApps.length > 0) {
    await fs.writeFile('backend-apis.log', stats.backendApps.join('\n'));
    log(`⊘  Backend APIs log: backend-apis.log`, 'magenta');
  }

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');

  if (stats.failed === 0) {
    log('🎉 100% COVERAGE ACHIEVED - ALL APPS CAPTURED!', 'green');
  } else {
    log(`⚠️  ${stats.failed} apps need attention for 100% coverage`, 'yellow');
  }

  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');
}

/**
 * Main execution
 */
async function main() {
  try {
    // Find all projects
    const projects = await findAllProjects();
    stats.total = projects.length;

    if (projects.length === 0) {
      log('❌ No frontend projects found!', 'red');
      process.exit(1);
    }

    // Launch browser
    log('🚀 Launching browser...', 'blue');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      viewport: {
        width: CONFIG.viewportWidth,
        height: CONFIG.viewportHeight,
      },
    });
    log('✅ Browser ready\n', 'green');

    log('📸 Starting 100% coverage capture...\n', 'bright');

    // Process each app sequentially (can't parallelize due to port conflicts)
    for (let i = 0; i < projects.length; i++) {
      await processApp(projects[i], page, i, projects.length);
    }

    // Cleanup
    await browser.close();

    // Generate report
    await generateReport();

    process.exit(stats.failed > 0 ? 1 : 0);

  } catch (error) {
    log(`\n❌ Fatal Error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

main();
