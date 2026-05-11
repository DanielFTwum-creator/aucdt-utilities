#!/usr/bin/env node
/**
 * ============================================================================
 * Techbridge University College - Production Screenshot Capture Script
 * ============================================================================
 * Purpose: Capture screenshots from BUILT apps (dist folder)
 * Author: TUC ICT Department
 * Date: March 11, 2026
 * Usage: node capture-production-screenshots.js
 * ============================================================================
 */

const { chromium } = require('@playwright/test');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  timeout: 30000,
  screenshotDir: 'catalogue-production',
  viewportWidth: 1920,
  viewportHeight: 1080,
  concurrency: 5, // Process 5 apps at once
};

// Colors
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
  startTime: Date.now(),
  failedApps: [],
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Find all projects with successful builds
 */
async function findBuiltProjects() {
  log('\n========================================', 'cyan');
  log('TUC - Production Screenshot Capture', 'cyan');
  log('========================================\n', 'cyan');

  const projects = [];

  // Read from build-successes.log
  try {
    const successLog = await fs.readFile('build-successes.log', 'utf-8');
    const lines = successLog.split('\n').filter(line => line.trim());

    for (const line of lines) {
      // Extract app name from "[1] ✓ BUILD SUCCESS: app-name"
      const match = line.match(/BUILD SUCCESS: (.+)/);
      if (match) {
        const appName = match[1].trim();
        const distPath = path.join(process.cwd(), appName, 'dist', 'index.html');

        try {
          await fs.access(distPath);
          projects.push({ name: appName, distPath });
        } catch (err) {
          log(`  ⚠ Warning: ${appName} built but dist/index.html not found`, 'yellow');
        }
      }
    }
  } catch (err) {
    log('Error: build-successes.log not found. Run build-and-screenshot-all.sh first.', 'red');
    process.exit(1);
  }

  log(`Found ${projects.length} built projects\n`, 'green');
  return projects;
}

/**
 * Capture screenshot from built app
 */
async function captureScreenshot(project, page) {
  const fileUrl = `file://${project.distPath.replace(/\\/g, '/')}`;

  try {
    await page.goto(fileUrl, {
      waitUntil: 'networkidle',
      timeout: CONFIG.timeout,
    });

    // Wait for React to render
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Extra time for React hydration

    const screenshotDir = path.join(CONFIG.screenshotDir, project.name);
    await fs.mkdir(screenshotDir, { recursive: true });

    const screenshotPath = path.join(screenshotDir, 'screenshot.png');
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    return { success: true, path: screenshotPath };
  } catch (err) {
    return { success: false, reason: err.message };
  }
}

/**
 * Process a batch of projects
 */
async function processBatch(projects, startIdx, batchSize) {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: CONFIG.viewportWidth, height: CONFIG.viewportHeight },
    ignoreHTTPSErrors: true,
  });

  const promises = [];
  const endIdx = Math.min(startIdx + batchSize, projects.length);

  for (let i = startIdx; i < endIdx; i++) {
    const project = projects[i];
    const page = await context.newPage();

    promises.push(
      captureScreenshot(project, page).then(result => {
        if (result.success) {
          stats.success++;
          log(`  ✓ [${i + 1}/${projects.length}] ${project.name}`, 'green');
        } else {
          stats.failed++;
          stats.failedApps.push({ name: project.name, reason: result.reason });
          log(`  ✗ [${i + 1}/${projects.length}] ${project.name} - ${result.reason}`, 'red');
        }
        return page.close();
      })
    );
  }

  await Promise.all(promises);
  await browser.close();
}

/**
 * Main execution
 */
async function main() {
  const projects = await findBuiltProjects();
  stats.total = projects.length;

  if (projects.length === 0) {
    log('No built projects found. Exiting.', 'yellow');
    return;
  }

  // Create screenshot directory
  await fs.mkdir(CONFIG.screenshotDir, { recursive: true });

  // Process in batches
  for (let i = 0; i < projects.length; i += CONFIG.concurrency) {
    const batchNum = Math.floor(i / CONFIG.concurrency) + 1;
    const totalBatches = Math.ceil(projects.length / CONFIG.concurrency);

    log(`\nBatch ${batchNum}/${totalBatches}:`, 'cyan');
    await processBatch(projects, i, CONFIG.concurrency);
  }

  // Calculate duration
  const duration = ((Date.now() - stats.startTime) / 1000).toFixed(2);

  // Print summary
  log('\n========================================', 'cyan');
  log('Screenshot Capture Complete', 'cyan');
  log('========================================\n', 'cyan');

  log(`Total projects:       ${stats.total}`);
  log(`Successful:           ${stats.success}`, 'green');
  log(`Failed:               ${stats.failed}`, stats.failed > 0 ? 'red' : 'green');
  log(`Success rate:         ${((stats.success / stats.total) * 100).toFixed(1)}%`);
  log(`Duration:             ${duration}s`);
  log(`Screenshots saved to: ${CONFIG.screenshotDir}/\n`);

  // List failed apps
  if (stats.failedApps.length > 0) {
    log('\nFailed apps:', 'yellow');
    stats.failedApps.forEach(app => {
      log(`  - ${app.name}: ${app.reason}`, 'yellow');
    });
  }

  // Generate gallery
  log('\nGenerating production screenshot gallery...', 'cyan');
  await generateGallery(projects);
  log(`✓ Gallery saved to: ${CONFIG.screenshotDir}/index.html\n`, 'green');
}

/**
 * Generate HTML gallery
 */
async function generateGallery(projects) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AUCDT-Utilities - Production App Gallery</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        header {
            text-align: center;
            color: white;
            margin-bottom: 40px;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        .subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        .stats {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin: 20px 0;
            flex-wrap: wrap;
        }
        .stat-card {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            padding: 15px 30px;
            border-radius: 12px;
            color: white;
            text-align: center;
        }
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            display: block;
        }
        .stat-label {
            font-size: 0.9rem;
            opacity: 0.9;
        }
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 30px;
            margin-top: 40px;
        }
        .card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }
        .card-image {
            width: 100%;
            height: 250px;
            object-fit: cover;
            object-position: top;
            background: #f5f5f5;
        }
        .card-content {
            padding: 20px;
        }
        .card-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
        }
        .card-badge {
            display: inline-block;
            background: #4CAF50;
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        .failed-badge {
            background: #f44336;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🚀 AUCDT-Utilities Production Gallery</h1>
            <p class="subtitle">Built & Deployed Applications from Techbridge University College</p>
            <div class="stats">
                <div class="stat-card">
                    <span class="stat-number">${projects.length}</span>
                    <span class="stat-label">Total Apps</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${stats.success}</span>
                    <span class="stat-label">Screenshots Captured</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${((stats.success / stats.total) * 100).toFixed(1)}%</span>
                    <span class="stat-label">Success Rate</span>
                </div>
            </div>
        </header>

        <div class="gallery">
${projects.map((project, i) => {
  const succeeded = !stats.failedApps.some(f => f.name === project.name);
  return `            <div class="card">
                <img src="${project.name}/screenshot.png" alt="${project.name}" class="card-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22350%22 height=%22250%22%3E%3Crect fill=%22%23ddd%22 width=%22350%22 height=%22250%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'">
                <div class="card-content">
                    <h3 class="card-title">${project.name}</h3>
                    <span class="card-badge ${succeeded ? '' : 'failed-badge'}">${succeeded ? 'Built' : 'Failed'}</span>
                </div>
            </div>`;
}).join('\n')}
        </div>
    </div>
</body>
</html>`;

  await fs.writeFile(path.join(CONFIG.screenshotDir, 'index.html'), html);
}

main().catch(err => {
  log(`\nFatal error: ${err.message}`, 'red');
  process.exit(1);
});
