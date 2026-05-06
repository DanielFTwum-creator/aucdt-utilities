#!/usr/bin/env node
/**
 * ============================================================================
 * Techbridge University College - Docker Gateway Screenshot Capture
 * ============================================================================
 * Purpose: Capture screenshots from Docker gateway AND validate all containers
 * Gateway: http://localhost:8080/<app-name>
 * Author: TUC ICT Department
 * Date: March 11, 2026
 *
 * Usage:
 *   1. Start Docker: docker-compose -f docker-compose-all-apps.yml up -d
 *   2. Run script: node capture-docker-gateway.js
 *
 * Benefits:
 *   - Validates all Docker containers are working
 *   - Captures real production screenshots
 *   - Fast (no build time per app)
 *   - Validates NGINX gateway routing
 * ============================================================================
 */

const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuration
const CONFIG = {
  gatewayUrl: 'http://localhost:8080',
  timeout: 15000,
  catalogueDir: 'catalogue',
  viewportWidth: 1920,
  viewportHeight: 1080,
  waitForNetworkIdle: true,
  concurrency: 3, // Process 3 apps at once
};

// Colors for terminal output
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
  skipped: 0,
  backendOnly: 0,
  startTime: Date.now(),
  successApps: [],
  failedApps: [],
  backendApps: [],
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Check if Docker is running and gateway is accessible
 */
async function checkDockerStatus() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('  TUC Docker Gateway Screenshot Capture & Validation', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  // Check Docker
  try {
    log('🐳 Checking Docker status...', 'blue');
    await execAsync('docker ps');
    log('✅ Docker is running\n', 'green');
  } catch (error) {
    log('❌ Docker is not running!', 'red');
    log('\nPlease start Docker first:', 'yellow');
    log('  docker-compose -f docker-compose-all-apps.yml up -d\n', 'cyan');
    process.exit(1);
  }

  // Check gateway
  try {
    log('🌐 Checking NGINX gateway...', 'blue');
    const response = await fetch(CONFIG.gatewayUrl);
    if (response.ok) {
      log(`✅ Gateway accessible at ${CONFIG.gatewayUrl}\n`, 'green');
    } else {
      throw new Error('Gateway returned non-200 status');
    }
  } catch (error) {
    log('❌ Gateway not accessible!', 'red');
    log('\nMake sure NGINX gateway is running on port 8080\n', 'yellow');
    process.exit(1);
  }
}

/**
 * Get all projects with package.json
 */
async function findAllProjects() {
  log('📦 Scanning for projects...', 'blue');

  const projects = [];
  const entries = await fs.readdir('.', { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const packageJsonPath = path.join(entry.name, 'package.json');

    try {
      await fs.access(packageJsonPath);
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

      // Check if it's a backend-only service (Express but no React)
      const hasExpress = packageJson.dependencies?.express || packageJson.dependencies?.['@types/express'];
      const hasReact = packageJson.dependencies?.react || packageJson.dependencies?.['react-dom'];

      const isBackendOnly = hasExpress && !hasReact;

      projects.push({
        name: entry.name,
        isBackendOnly,
        packageJson,
      });
    } catch (err) {
      // No package.json or invalid JSON
    }
  }

  const frontendApps = projects.filter(p => !p.isBackendOnly);
  const backendApps = projects.filter(p => p.isBackendOnly);

  log(`✅ Found ${projects.length} projects:`, 'green');
  log(`   • ${frontendApps.length} frontend apps (will capture screenshots)`, 'cyan');
  log(`   • ${backendApps.length} backend APIs (will skip)\n`, 'yellow');

  stats.backendApps = backendApps.map(p => p.name);

  return frontendApps;
}

/**
 * Capture screenshot from Docker gateway
 */
async function captureScreenshot(project, page, index, total) {
  const appUrl = `${CONFIG.gatewayUrl}/${project.name}`;
  const screenshotPath = path.join(CONFIG.catalogueDir, project.name, 'screenshot.png');

  log(`\n[${ index + 1 }/${total}] ${project.name}`, 'bright');
  log(`  → URL: ${appUrl}`, 'cyan');

  try {
    // Ensure catalogue directory exists
    await fs.mkdir(path.dirname(screenshotPath), { recursive: true });

    // Navigate to app
    const response = await page.goto(appUrl, {
      waitUntil: CONFIG.waitForNetworkIdle ? 'networkidle' : 'domcontentloaded',
      timeout: CONFIG.timeout,
    });

    if (!response || !response.ok()) {
      throw new Error(`HTTP ${response?.status() || 'N/A'}`);
    }

    // Wait a bit for React to render
    await page.waitForTimeout(2000);

    // Check if page has content (not just blank)
    const content = await page.textContent('body');
    if (!content || content.trim().length < 10) {
      log(`  ⚠️  Warning: Page appears blank`, 'yellow');
    }

    // Capture screenshot
    await page.screenshot({
      path: screenshotPath,
      fullPage: false,
    });

    log(`  ✅ SUCCESS: Screenshot saved`, 'green');
    stats.success++;
    stats.successApps.push(project.name);

    return true;

  } catch (error) {
    log(`  ❌ FAILED: ${error.message}`, 'red');
    stats.failed++;
    stats.failedApps.push({
      name: project.name,
      url: appUrl,
      error: error.message,
    });

    return false;
  }
}

/**
 * Process projects in batches for concurrency
 */
async function processInBatches(projects, browser) {
  const batches = [];
  for (let i = 0; i < projects.length; i += CONFIG.concurrency) {
    batches.push(projects.slice(i, i + CONFIG.concurrency));
  }

  let processedCount = 0;

  for (const batch of batches) {
    const promises = batch.map(async (project) => {
      const page = await browser.newPage({
        viewport: {
          width: CONFIG.viewportWidth,
          height: CONFIG.viewportHeight,
        },
      });

      await captureScreenshot(project, page, processedCount, projects.length);
      processedCount++;

      await page.close();
    });

    await Promise.all(promises);
  }
}

/**
 * Generate reports
 */
async function generateReports() {
  const duration = ((Date.now() - stats.startTime) / 1000).toFixed(1);

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('  📊 FINAL REPORT', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');

  log(`\n📈 Statistics:`, 'bright');
  log(`   Total Apps Scanned:    ${stats.total}`, 'cyan');
  log(`   ✅ Screenshots Captured: ${stats.success}`, 'green');
  log(`   ❌ Failed:               ${stats.failed}`, 'red');
  log(`   ⊘  Backend APIs (skipped): ${stats.backendOnly}`, 'yellow');
  log(`   ⏱️  Duration:              ${duration}s`, 'blue');

  const successRate = ((stats.success / stats.total) * 100).toFixed(1);
  log(`   📊 Success Rate:         ${successRate}%`, 'magenta');

  // Write success log
  if (stats.successApps.length > 0) {
    await fs.writeFile(
      'docker-validation-success.log',
      stats.successApps.join('\n'),
      'utf-8'
    );
    log(`\n✅ Success log: docker-validation-success.log`, 'green');
  }

  // Write failed log
  if (stats.failedApps.length > 0) {
    const failedReport = stats.failedApps
      .map(f => `${f.name}\n  URL: ${f.url}\n  Error: ${f.error}`)
      .join('\n\n');

    await fs.writeFile(
      'docker-validation-failed.log',
      failedReport,
      'utf-8'
    );
    log(`❌ Failed log: docker-validation-failed.log`, 'red');

    log(`\n⚠️  ${stats.failed} apps failed Docker validation:`, 'yellow');
    stats.failedApps.forEach(f => {
      log(`   • ${f.name} - ${f.error}`, 'red');
    });
  }

  // Write backend apps log
  if (stats.backendApps.length > 0) {
    await fs.writeFile(
      'backend-apis.log',
      stats.backendApps.join('\n'),
      'utf-8'
    );
    log(`\n📋 Backend APIs log: backend-apis.log (${stats.backendApps.length} APIs)`, 'yellow');
  }

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');

  if (stats.failed === 0) {
    log('🎉 ALL DOCKER CONTAINERS VALIDATED SUCCESSFULLY!', 'green');
  } else {
    log(`⚠️  ${stats.failed} containers need attention`, 'yellow');
  }

  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');
}

/**
 * Main execution
 */
async function main() {
  try {
    // Step 1: Check Docker and gateway
    await checkDockerStatus();

    // Step 2: Find all projects
    const projects = await findAllProjects();
    stats.total = projects.length;
    stats.backendOnly = stats.backendApps.length;

    if (projects.length === 0) {
      log('❌ No frontend projects found!', 'red');
      process.exit(1);
    }

    // Step 3: Launch browser
    log('🚀 Launching browser...', 'blue');
    const browser = await chromium.launch({
      headless: true,
    });
    log('✅ Browser ready\n', 'green');

    // Step 4: Process all projects
    log('📸 Starting screenshot capture...', 'bright');
    await processInBatches(projects, browser);

    // Step 5: Cleanup
    await browser.close();

    // Step 6: Generate reports
    await generateReports();

    // Exit with appropriate code
    process.exit(stats.failed > 0 ? 1 : 0);

  } catch (error) {
    log(`\n❌ Fatal Error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();
