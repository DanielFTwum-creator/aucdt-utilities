#!/usr/bin/env node
/**
 * ============================================================================
 * CONSISTENT File-Based Screenshot Capture - TUC Monorepo
 * ============================================================================
 * Strategy: ONLY file-based capture for 100% consistency
 *
 * Benefits:
 *   - Consistent initial state for all apps
 *   - No dependency on Docker/servers running
 *   - No network timeouts or API failures
 *   - Perfectly reproducible results
 *   - Fastest possible capture
 *
 * Expected time: < 3 minutes for all apps
 * ============================================================================
 */

const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

const CONFIG = {
  screenshotDir: 'catalogue',
  viewportWidth: 1920,
  viewportHeight: 1080,
  timeout: 5000,
  concurrency: 8,  // Increased since no network calls
  minSize: 5000,
  waitTime: 1500,  // Wait for React hydration
};

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  dim: '\x1b[2m',
};

const stats = {
  total: 0,
  success: 0,
  failed: 0,
  startTime: Date.now(),
};

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
    'src', 'docs', 'playwright'
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
        projects.push({
          name: dir.name,
          displayName: packageData.description || packageData.name || dir.name,
          hasReact: hasReact,
          hasVite: packageData.devDependencies?.vite || packageData.dependencies?.vite,
        });
      }
    } catch (err) {
      continue;
    }
  }

  return projects;
}

async function captureFromFile(project, page) {
  // Try multiple possible locations for index.html
  const locations = [
    // Built output (most common)
    path.join(process.cwd(), project.name, 'dist', 'index.html'),
    path.join(process.cwd(), project.name, 'build', 'index.html'),

    // Root level
    path.join(process.cwd(), project.name, 'index.html'),

    // Public folder
    path.join(process.cwd(), project.name, 'public', 'index.html'),

    // Client subfolder (fullstack apps)
    path.join(process.cwd(), project.name, 'client', 'dist', 'index.html'),
    path.join(process.cwd(), project.name, 'client', 'build', 'index.html'),
    path.join(process.cwd(), project.name, 'client', 'index.html'),

    // Frontend subfolder
    path.join(process.cwd(), project.name, 'frontend', 'dist', 'index.html'),
    path.join(process.cwd(), project.name, 'frontend', 'build', 'index.html'),
  ];

  for (const htmlPath of locations) {
    try {
      await fs.access(htmlPath);

      // Convert to file:// URL
      const fileUrl = `file://${htmlPath.replace(/\\/g, '/')}`;

      // Navigate to the file
      await page.goto(fileUrl, {
        waitUntil: 'domcontentloaded',
        timeout: CONFIG.timeout
      });

      // Wait for React/Vue to hydrate
      await page.waitForTimeout(CONFIG.waitTime);

      // Create screenshot directory
      const screenshotDir = path.join(CONFIG.screenshotDir, project.name);
      await fs.mkdir(screenshotDir, { recursive: true });

      // Capture screenshot
      const screenshotPath = path.join(screenshotDir, 'screenshot.png');
      await page.screenshot({
        path: screenshotPath,
        fullPage: false  // Viewport only for consistency
      });

      // Verify screenshot is valid (not blank)
      const fileStats = await fs.stat(screenshotPath);
      if (fileStats.size > CONFIG.minSize) {
        return {
          success: true,
          size: fileStats.size,
          source: path.relative(process.cwd(), htmlPath)
        };
      }
    } catch (err) {
      // Try next location
      continue;
    }
  }

  return { success: false };
}

async function captureProject(project, browser) {
  const context = await browser.newContext({
    viewport: {
      width: CONFIG.viewportWidth,
      height: CONFIG.viewportHeight
    },
    bypassCSP: true,
    ignoreHTTPSErrors: true,
    // Disable some resources for faster loading
    javaScriptEnabled: true,
  });

  const page = await context.newPage();

  try {
    const result = await captureFromFile(project, page);

    if (result.success) {
      stats.success++;
      return {
        ...result,
        project: project.name,
        displayName: project.displayName
      };
    }

    stats.failed++;
    return {
      success: false,
      project: project.name,
      reason: 'No index.html found in dist/, build/, or root'
    };

  } catch (err) {
    stats.failed++;
    return {
      success: false,
      project: project.name,
      error: err.message
    };
  } finally {
    await context.close();
  }
}

async function processBatch(projects, browser) {
  const batches = [];
  for (let i = 0; i < projects.length; i += CONFIG.concurrency) {
    batches.push(projects.slice(i, i + CONFIG.concurrency));
  }

  let processed = 0;

  for (const batch of batches) {
    const results = await Promise.all(
      batch.map(project => captureProject(project, browser))
    );

    results.forEach((result, idx) => {
      const num = processed + idx + 1;
      const progressBar = `[${num}/${stats.total}]`;

      if (result.success) {
        const sizeKB = (result.size / 1024).toFixed(1);
        const sourceHint = path.basename(path.dirname(result.source));
        log(
          `${progressBar} ✓ ${result.project.padEnd(45)} ${colors.dim}(${sourceHint}, ${sizeKB}KB)${colors.reset}`,
          'green'
        );
      } else {
        log(
          `${progressBar} ✗ ${result.project.padEnd(45)} ${colors.dim}${result.reason || result.error || ''}${colors.reset}`,
          'red'
        );
      }
    });

    processed += batch.length;
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
  <title>TUC Apps Screenshot Gallery - File-Based Consistent Renders</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      padding: 40px;
    }
    .header {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      padding: 40px;
      text-align: center;
      border-radius: 16px;
      margin-bottom: 40px;
      border: 1px solid #334155;
    }
    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .subtitle {
      color: #94a3b8;
      font-size: 1.1em;
      margin-bottom: 8px;
    }
    .badge {
      display: inline-block;
      background: #0ea5e920;
      color: #0ea5e9;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.85em;
      font-weight: 600;
      border: 1px solid #0ea5e940;
      margin-top: 12px;
    }
    .stats {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 24px;
      flex-wrap: wrap;
    }
    .stat {
      background: #1e293b;
      padding: 12px 24px;
      border-radius: 12px;
      border: 1px solid #334155;
      min-width: 150px;
    }
    .stat-number {
      font-size: 1.8em;
      font-weight: bold;
      color: #f8fafc;
    }
    .stat-label {
      font-size: 0.9em;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 30px;
    }
    .card {
      background: #1e293b;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #334155;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .card:hover {
      transform: translateY(-8px);
      border-color: #38bdf8;
      box-shadow: 0 12px 24px -8px rgba(56, 189, 248, 0.3);
    }
    .card-image-container {
      position: relative;
      height: 240px;
      background: #0f172a;
      overflow: hidden;
    }
    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
    }
    .card:hover .card-image {
      transform: scale(1.05);
    }
    .card-title {
      padding: 20px 20px 8px;
      font-size: 1.25em;
      font-weight: 600;
      color: #f1f5f9;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .card-info {
      padding: 0 20px 20px;
      color: #94a3b8;
      font-size: 0.875em;
    }
    .tag {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.75em;
      font-weight: 600;
      margin-right: 6px;
    }
    .tag-react {
      background: #0ea5e920;
      color: #0ea5e9;
      border: 1px solid #0ea5e940;
    }
    .tag-vite {
      background: #f59e0b20;
      color: #f59e0b;
      border: 1px solid #f59e0b40;
    }
    .no-screenshot {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      background: #0f172a;
      color: #475569;
      font-size: 1em;
      flex-direction: column;
      gap: 12px;
    }
    .no-screenshot svg {
      width: 48px;
      height: 48px;
      opacity: 0.5;
    }
    .footer {
      text-align: center;
      margin-top: 60px;
      color: #475569;
      border-top: 1px solid #334155;
      padding-top: 30px;
    }
    .footer-metrics {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .footer-metric {
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }
    .footer-metric strong {
      color: #38bdf8;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎓 Techbridge University College</h1>
    <p class="subtitle">Institutional Application Ecosystem</p>
    <div class="badge">✨ File-Based Consistent Renders</div>
    <div class="stats">
      <div class="stat">
        <div class="stat-number">${stats.total}</div>
        <div class="stat-label">Total Apps</div>
      </div>
      <div class="stat">
        <div class="stat-number" style="color: #22c55e;">${stats.success}</div>
        <div class="stat-label">Captured</div>
      </div>
      <div class="stat">
        <div class="stat-number" style="color: #ef4444;">${stats.failed}</div>
        <div class="stat-label">Failed</div>
      </div>
      <div class="stat">
        <div class="stat-number" style="color: #818cf8;">${successRate}%</div>
        <div class="stat-label">Success Rate</div>
      </div>
    </div>
  </div>

  <div class="gallery">
    ${projects.map(project => `
      <div class="card">
        <div class="card-image-container">
          <img src="${project.name}/screenshot.png" alt="${project.displayName}" class="card-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
          <div class="no-screenshot" style="display: none;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>No Screenshot Available</span>
          </div>
        </div>
        <div class="card-title">${project.displayName}</div>
        <div class="card-info">
          <div style="margin-bottom: 8px; font-family: monospace; font-size: 0.8em; color: #64748b;">
            /${project.name}
          </div>
          <div>
            ${project.hasReact ? '<span class="tag tag-react">REACT</span>' : ''}
            ${project.hasVite ? '<span class="tag tag-vite">VITE</span>' : ''}
          </div>
        </div>
      </div>
    `).join('')}
  </div>

  <div class="footer">
    <div class="footer-metrics">
      <div class="footer-metric">Method: <strong>File-Based Only</strong></div>
      <div class="footer-metric">Duration: <strong>${duration}s</strong></div>
      <div class="footer-metric">Speed: <strong>${(stats.total / duration).toFixed(1)} apps/sec</strong></div>
      <div class="footer-metric">Generated: <strong>${new Date().toLocaleString()}</strong></div>
    </div>
    <p style="margin-top: 12px; font-size: 0.9em;">
      All screenshots captured from static build artifacts for consistency
    </p>
    <p style="margin-top: 8px;">
      &copy; ${new Date().getFullYear()} Techbridge University College - ICT Department
    </p>
  </div>
</body>
</html>`;

  await fs.writeFile(path.join(CONFIG.screenshotDir, 'index.html'), html, 'utf-8');
  log(`\n✅ Gallery generated: ${path.join(CONFIG.screenshotDir, 'index.html')}`, 'green');
}

async function main() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('  FILE-BASED Screenshot Capture (100% Consistent)', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  const projects = await findProjects();
  stats.total = projects.length;

  log(`📦 Found ${projects.length} frontend projects`, 'green');
  log(`⚙️  Concurrency: ${CONFIG.concurrency} parallel captures`, 'cyan');
  log(`📸 Source: Static build files only\n`, 'yellow');

  log('🚀 Launching browser...', 'cyan');
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
    ]
  });
  log('✅ Browser ready\n', 'green');

  log('📸 Capturing screenshots...\n', 'cyan');
  await processBatch(projects, browser);

  await browser.close();
  await generateGallery(projects);

  const duration = ((Date.now() - stats.startTime) / 1000).toFixed(1);
  const successRate = ((stats.success / stats.total) * 100).toFixed(1);

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('  📊 FINAL REPORT', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  log(`Total Apps:         ${stats.total}`);
  log(`✅ Success:          ${stats.success} (${successRate}%)`, 'green');
  log(`❌ Failed:           ${stats.failed}`, stats.failed > 0 ? 'red' : 'dim');
  log(`⏱️  Duration:         ${duration}s`);
  log(`⚡ Speed:            ${(stats.total / duration).toFixed(1)} apps/second`);
  log(`📊 Consistency:      100% file-based (no network variance)`, 'magenta');

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  if (stats.failed === 0) {
    log('🎉 ALL SCREENSHOTS CAPTURED SUCCESSFULLY!', 'green');
  } else {
    log(`⚠️  ${stats.failed} apps need attention (likely missing dist/ folder)`, 'yellow');
  }

  process.exit(stats.failed > 0 ? 1 : 0);
}

main().catch(err => {
  log(`\n❌ Fatal error: ${err.message}`, 'red');
  console.error(err);
  process.exit(1);
});
