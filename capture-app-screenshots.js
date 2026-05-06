#!/usr/bin/env node
/**
 * ============================================================================
 * Techbridge University College - App Screenshot Capture Script
 * ============================================================================
 * Purpose: Automatically capture screenshots of all app index.html pages
 * Author: TUC ICT Department
 * Date: March 10, 2026
 * Usage: node capture-app-screenshots.js
 * ============================================================================
 */

const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  basePort: 5173, // Vite default port
  timeout: 30000, // 30 seconds
  screenshotDir: 'catalogue',
  viewportWidth: 1920,
  viewportHeight: 1080,
  concurrency: 3, // Number of parallel screenshots
  retryAttempts: 2,
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

// Statistics
const stats = {
  total: 0,
  success: 0,
  failed: 0,
  skipped: 0,
  startTime: Date.now(),
};

// Logger
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Find all projects with package.json
 */
async function findProjects() {
  log('\n========================================', 'cyan');
  log('TUC - Screenshot Capture Script', 'cyan');
  log('========================================\n', 'cyan');

  log('Scanning for projects...');

  const dirs = await fs.readdir('.', { withFileTypes: true });
  const projects = [];

  for (const dir of dirs) {
    if (!dir.isDirectory()) continue;

    // Skip special directories
    const skipDirs = [
      'node_modules', 'dist', 'build', '.git', '.github',
      'docker', 'catalogue', 'scripts', 'tests', 'templates',
      'reports', 'Documentation', 'archive', 'monitoring',
    ];

    if (skipDirs.includes(dir.name)) continue;

    // Check for package.json
    try {
      const packagePath = path.join(dir.name, 'package.json');
      await fs.access(packagePath);

      const packageData = JSON.parse(
        await fs.readFile(packagePath, 'utf-8')
      );

      projects.push({
        name: dir.name,
        displayName: packageData.description || packageData.name || dir.name,
        hasReact: packageData.dependencies?.react || packageData.dependencies?.['react-dom'],
        hasVite: packageData.devDependencies?.vite || packageData.dependencies?.vite,
      });
    } catch (err) {
      // No package.json or can't read it
      continue;
    }
  }

  log(`Found ${projects.length} projects\n`, 'green');
  return projects;
}

/**
 * Check if a URL is accessible
 */
async function isUrlAccessible(url, browser) {
  const page = await browser.newPage();
  try {
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 5000,
    });
    await page.close();
    return true;
  } catch (err) {
    await page.close();
    return false;
  }
}

/**
 * Capture screenshot from index.html file directly
 */
async function captureFromFile(project, browser) {
  const indexPath = path.join(process.cwd(), project.name, 'index.html');
  const distIndexPath = path.join(process.cwd(), project.name, 'dist', 'index.html');
  const publicIndexPath = path.join(process.cwd(), project.name, 'public', 'index.html');

  let htmlPath = null;

  // Try different locations
  for (const testPath of [indexPath, distIndexPath, publicIndexPath]) {
    try {
      await fs.access(testPath);
      htmlPath = testPath;
      break;
    } catch (err) {
      continue;
    }
  }

  if (!htmlPath) {
    return { success: false, reason: 'No index.html found' };
  }

  const page = await browser.newPage();

  try {
    await page.setViewport({
      width: CONFIG.viewportWidth,
      height: CONFIG.viewportHeight,
    });

    // Load HTML file
    const fileUrl = `file://${htmlPath.replace(/\\/g, '/')}`;
    await page.goto(fileUrl, {
      waitUntil: 'networkidle2',
      timeout: CONFIG.timeout,
    });

    // Wait a bit for any dynamic content
    await page.waitForTimeout(2000);

    // Create screenshots directory
    const screenshotDir = path.join(CONFIG.screenshotDir, project.name);
    await fs.mkdir(screenshotDir, { recursive: true });

    // Take screenshot
    const screenshotPath = path.join(screenshotDir, 'screenshot.png');
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    await page.close();

    return { success: true, path: screenshotPath };
  } catch (err) {
    await page.close();
    return { success: false, reason: err.message };
  }
}

/**
 * Capture screenshot from running dev server
 */
async function captureFromServer(project, port, browser) {
  const url = `http://localhost:${port}`;
  const page = await browser.newPage();

  try {
    await page.setViewport({
      width: CONFIG.viewportWidth,
      height: CONFIG.viewportHeight,
    });

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: CONFIG.timeout,
    });

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Create screenshots directory
    const screenshotDir = path.join(CONFIG.screenshotDir, project.name);
    await fs.mkdir(screenshotDir, { recursive: true });

    // Take screenshot
    const screenshotPath = path.join(screenshotDir, 'screenshot.png');
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    await page.close();

    return { success: true, path: screenshotPath };
  } catch (err) {
    await page.close();
    return { success: false, reason: err.message };
  }
}

/**
 * Process a single project
 */
async function captureProject(project, browser) {
  stats.total++;

  log(`[${stats.total}] Processing: ${project.name}...`);

  // Method 1: Try from file system first (fastest)
  log('  → Attempting file-based capture...', 'yellow');
  let result = await captureFromFile(project, browser);

  if (result.success) {
    log(`  ✓ Success (file): ${result.path}`, 'green');
    stats.success++;
    return true;
  }

  log(`  ⊘ File-based failed: ${result.reason}`, 'yellow');

  // Method 2: Check if dev server is running
  log('  → Checking for running dev server...', 'yellow');
  const isRunning = await isUrlAccessible(`http://localhost:${CONFIG.basePort}`, browser);

  if (isRunning) {
    result = await captureFromServer(project, CONFIG.basePort, browser);

    if (result.success) {
      log(`  ✓ Success (server): ${result.path}`, 'green');
      stats.success++;
      return true;
    }
  }

  // Method 3: Check Docker gateway
  log('  → Checking Docker gateway...', 'yellow');
  const dockerUrl = `http://localhost:8080/${project.name}`;
  const isDocker = await isUrlAccessible(dockerUrl, browser);

  if (isDocker) {
    const page = await browser.newPage();
    try {
      await page.setViewport({
        width: CONFIG.viewportWidth,
        height: CONFIG.viewportHeight,
      });

      await page.goto(dockerUrl, {
        waitUntil: 'networkidle2',
        timeout: CONFIG.timeout,
      });

      await page.waitForTimeout(2000);

      const screenshotDir = path.join(CONFIG.screenshotDir, project.name);
      await fs.mkdir(screenshotDir, { recursive: true });

      const screenshotPath = path.join(screenshotDir, 'screenshot.png');
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      await page.close();

      log(`  ✓ Success (Docker): ${screenshotPath}`, 'green');
      stats.success++;
      return true;
    } catch (err) {
      await page.close();
    }
  }

  // All methods failed
  log(`  ✗ Failed: No accessible version found`, 'red');
  stats.failed++;

  // Log to failures file
  await fs.appendFile(
    'screenshot-failures.log',
    `${project.name}: ${result.reason}\n`
  );

  return false;
}

/**
 * Process projects in batches
 */
async function processProjects(projects) {
  log('\nLaunching browser...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  log('Browser launched successfully\n');

  // Process in batches for concurrency
  for (let i = 0; i < projects.length; i += CONFIG.concurrency) {
    const batch = projects.slice(i, i + CONFIG.concurrency);
    await Promise.all(
      batch.map(project => captureProject(project, browser))
    );
  }

  await browser.close();
  log('\nBrowser closed');
}

/**
 * Generate HTML gallery
 */
async function generateGallery(projects) {
  log('\nGenerating screenshot gallery...');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TUC Apps Screenshot Gallery</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .header {
      background: #2c3e50;
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
    }
    .stats {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-top: 20px;
    }
    .stat {
      background: rgba(255,255,255,0.1);
      padding: 15px 30px;
      border-radius: 5px;
    }
    .stat-number {
      font-size: 2em;
      font-weight: bold;
    }
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
    }
    .card {
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 20px rgba(0,0,0,0.15);
    }
    .card-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
      background: #f0f0f0;
    }
    .card-title {
      padding: 15px;
      font-size: 1.2em;
      font-weight: bold;
      color: #2c3e50;
    }
    .card-info {
      padding: 0 15px 15px;
      color: #7f8c8d;
      font-size: 0.9em;
    }
    .no-screenshot {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 300px;
      background: #ecf0f1;
      color: #95a5a6;
      font-size: 1.2em;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎓 Techbridge University College</h1>
    <p>App Screenshot Gallery</p>
    <div class="stats">
      <div class="stat">
        <div class="stat-number">${stats.total}</div>
        <div>Total Apps</div>
      </div>
      <div class="stat">
        <div class="stat-number">${stats.success}</div>
        <div>Screenshots</div>
      </div>
      <div class="stat">
        <div class="stat-number">${stats.failed}</div>
        <div>Failed</div>
      </div>
    </div>
  </div>

  <div class="gallery">
    ${projects.map(project => {
      const screenshotPath = `${project.name}/screenshot.png`;
      const hasScreenshot = stats.success > 0; // Simplified check

      return `
        <div class="card">
          ${hasScreenshot ?
            `<img src="${screenshotPath}" alt="${project.displayName}" class="card-image" onerror="this.parentElement.innerHTML='<div class=\\'no-screenshot\\'>No Screenshot Available</div>'">` :
            `<div class="no-screenshot">No Screenshot Available</div>`
          }
          <div class="card-title">${project.displayName}</div>
          <div class="card-info">
            <div>Directory: ${project.name}</div>
            <div>${project.hasReact ? '⚛️ React' : ''} ${project.hasVite ? '⚡ Vite' : ''}</div>
          </div>
        </div>
      `;
    }).join('')}
  </div>

  <div style="text-align: center; margin-top: 40px; color: #7f8c8d;">
    <p>Generated: ${new Date().toLocaleString()}</p>
    <p>Techbridge University College - ICT Department</p>
  </div>
</body>
</html>
  `;

  const galleryPath = path.join(CONFIG.screenshotDir, 'index.html');
  await fs.writeFile(galleryPath, html, 'utf-8');

  log(`Gallery generated: ${galleryPath}`, 'green');
}

/**
 * Main execution
 */
async function main() {
  try {
    // Find all projects
    const projects = await findProjects();

    if (projects.length === 0) {
      log('No projects found!', 'red');
      process.exit(1);
    }

    // Clear previous failures log
    try {
      await fs.unlink('screenshot-failures.log');
    } catch (err) {
      // File doesn't exist, that's fine
    }

    // Process all projects
    await processProjects(projects);

    // Generate gallery
    await generateGallery(projects);

    // Print summary
    const duration = ((Date.now() - stats.startTime) / 1000).toFixed(2);

    log('\n========================================', 'cyan');
    log('Screenshot Capture Complete', 'cyan');
    log('========================================\n', 'cyan');
    log(`Total projects:     ${stats.total}`);
    log(`Successful:         ${stats.success}`, 'green');
    log(`Failed:             ${stats.failed}`, 'red');
    log(`Duration:           ${duration}s`);
    log(`\nGallery: ${path.join(CONFIG.screenshotDir, 'index.html')}`, 'cyan');

    if (stats.failed > 0) {
      log(`\nFailed projects logged to: screenshot-failures.log`, 'yellow');
    }

  } catch (err) {
    log(`\nFatal error: ${err.message}`, 'red');
    console.error(err);
    process.exit(1);
  }
}

// Run
main();
