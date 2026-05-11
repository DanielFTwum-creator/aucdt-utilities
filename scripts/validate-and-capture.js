#!/usr/bin/env node
/**
 * Build, serve, and capture screenshots of all projects
 * Provides undisputed proof that each app can build and run
 */

const { spawn } = require('child_process');
const chromium = require('playwright').chromium;
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SCREENSHOT_DIR = path.join(ROOT_DIR, 'project-screenshots-real');
const REPORT_DIR = path.join(ROOT_DIR, 'build-validation-reports');
const LOG_FILE = path.join(ROOT_DIR, 'BUILD_VALIDATION_LOG.txt');

// Create directories
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
fs.mkdirSync(REPORT_DIR, { recursive: true });

const results = {
  total: 0,
  buildSuccess: 0,
  buildFailed: 0,
  screenshotSuccess: 0,
  screenshotFailed: 0,
  projects: []
};

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, logMessage);
  console.log(message);
}

async function buildProject(projectDir, projectName) {
  return new Promise((resolve) => {
    const buildLogPath = path.join(REPORT_DIR, `${projectName}_build.log`);
    const buildLog = fs.createWriteStream(buildLogPath);

    log(`Building ${projectName}...`);

    const build = spawn('npm', ['run', 'build'], {
      cwd: projectDir,
      shell: true,
      stdio: 'pipe'
    });

    build.stdout.pipe(buildLog);
    build.stderr.pipe(buildLog);

    build.on('close', (code) => {
      buildLog.end();
      if (code === 0) {
        log(`✓ ${projectName} build succeeded`);
        resolve({ success: true, logPath: buildLogPath });
      } else {
        log(`✗ ${projectName} build failed (exit code: ${code})`);
        resolve({ success: false, logPath: buildLogPath, exitCode: code });
      }
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      build.kill();
      buildLog.end();
      log(`✗ ${projectName} build timeout (5 min)`);
      resolve({ success: false, logPath: buildLogPath, error: 'timeout' });
    }, 300000);
  });
}

async function captureRunningApp(projectDir, projectName, port) {
  return new Promise((resolve) => {
    const distPath = path.join(projectDir, 'dist');

    // Check if dist exists
    if (!fs.existsSync(distPath)) {
      log(`✗ ${projectName} - dist folder not found`);
      resolve({ success: false, error: 'no_dist' });
      return;
    }

    log(`Serving ${projectName} on port ${port}...`);

    // Start serve
    const server = spawn('npx', ['serve', '-s', 'dist', '-l', port], {
      cwd: projectDir,
      shell: true,
      stdio: 'pipe'
    });

    // Wait for server to start, then capture
    setTimeout(async () => {
      try {
        const browser = await chromium.launch({
          headless: 'new',
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });

        log(`Capturing ${projectName} from http://localhost:${port}`);

        await page.goto(`http://localhost:${port}`, {
          waitUntil: 'networkidle2',
          timeout: 15000
        });

        // Wait for any animations/renders
        await page.waitForTimeout(2000);

        const screenshotPath = path.join(SCREENSHOT_DIR, `${projectName}.png`);
        await page.screenshot({
          path: screenshotPath,
          fullPage: false
        });

        await browser.close();
        server.kill();

        log(`✓ ${projectName} screenshot captured`);
        resolve({ success: true, screenshotPath, port });

      } catch (error) {
        server.kill();
        log(`✗ ${projectName} screenshot failed: ${error.message}`);
        resolve({ success: false, error: error.message });
      }
    }, 3000);
  });
}

async function validateProject(projectDir, projectName, port) {
  const result = {
    name: projectName,
    buildSuccess: false,
    screenshotSuccess: false,
    buildLog: null,
    screenshotPath: null,
    errors: []
  };

  // Step 1: Build
  const buildResult = await buildProject(projectDir, projectName);
  result.buildSuccess = buildResult.success;
  result.buildLog = buildResult.logPath;

  if (!buildResult.success) {
    result.errors.push(`Build failed: ${buildResult.error || 'exit code ' + buildResult.exitCode}`);
    return result;
  }

  // Step 2: Serve and capture
  const captureResult = await captureRunningApp(projectDir, projectName, port);
  result.screenshotSuccess = captureResult.success;
  result.screenshotPath = captureResult.screenshotPath;
  result.port = captureResult.port;

  if (!captureResult.success) {
    result.errors.push(`Screenshot failed: ${captureResult.error}`);
  }

  return result;
}

async function main() {
  log('=== BUILD VALIDATION AND SCREENSHOT CAPTURE ===');
  log('Goal: Prove each app can build and serve successfully\n');

  // Clear previous log
  if (fs.existsSync(LOG_FILE)) {
    fs.unlinkSync(LOG_FILE);
  }

  // Get all projects
  const projects = fs.readdirSync(ROOT_DIR)
    .filter(item => {
      const fullPath = path.join(ROOT_DIR, item);
      return fs.statSync(fullPath).isDirectory()
        && fs.existsSync(path.join(fullPath, 'package.json'))
        && fs.existsSync(path.join(fullPath, 'index.html'))
        && !item.startsWith('.')
        && !['node_modules', 'docker', 'scripts', 'templates', 'docs', 'reports', 'project-screenshots', 'project-screenshots-real', 'build-validation-reports'].includes(item);
    });

  results.total = projects.length;
  log(`Found ${projects.length} projects to validate\n`);

  let port = 5000;
  let processed = 0;

  for (const project of projects) {
    processed++;
    log(`\n[${processed}/${projects.length}] Processing ${project}...`);

    const projectPath = path.join(ROOT_DIR, project);
    const result = await validateProject(projectPath, project, port++);

    results.projects.push(result);

    if (result.buildSuccess) results.buildSuccess++;
    else results.buildFailed++;

    if (result.screenshotSuccess) results.screenshotSuccess++;
    else results.screenshotFailed++;

    // Progress update every 10
    if (processed % 10 === 0) {
      log(`\n--- Progress: ${processed}/${projects.length} ---`);
      log(`Builds: ${results.buildSuccess} success, ${results.buildFailed} failed`);
      log(`Screenshots: ${results.screenshotSuccess} success, ${results.screenshotFailed} failed\n`);
    }
  }

  // Generate summary report
  generateSummaryReport();

  log('\n=== VALIDATION COMPLETE ===');
  log(`Total Projects: ${results.total}`);
  log(`Build Success: ${results.buildSuccess} (${(results.buildSuccess/results.total*100).toFixed(1)}%)`);
  log(`Build Failed: ${results.buildFailed}`);
  log(`Screenshot Success: ${results.screenshotSuccess} (${(results.screenshotSuccess/results.total*100).toFixed(1)}%)`);
  log(`Screenshot Failed: ${results.screenshotFailed}`);
  log(`\nReports saved to: ${REPORT_DIR}`);
  log(`Screenshots saved to: ${SCREENSHOT_DIR}`);
  log(`Full log: ${LOG_FILE}`);
}

function generateSummaryReport() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Build Validation Report - ${results.total} Projects</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #f5f5f5;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    h1 {
      font-size: 36px;
      color: #1a1a1a;
      margin-bottom: 20px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      max-width: 1000px;
      margin: 0 auto 40px;
    }
    .stat {
      background: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .stat-value {
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    .stat-value.success { color: #10b981; }
    .stat-value.failed { color: #ef4444; }
    .stat-value.total { color: #3b82f6; }
    .stat-label {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .projects {
      max-width: 1400px;
      margin: 0 auto;
    }
    .project {
      background: white;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .project.success {
      border-left: 4px solid #10b981;
    }
    .project.failed {
      border-left: 4px solid #ef4444;
    }
    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .project-name {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
    }
    .badges {
      display: flex;
      gap: 8px;
    }
    .badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge.success {
      background: #d1fae5;
      color: #065f46;
    }
    .badge.failed {
      background: #fee2e2;
      color: #991b1b;
    }
    .project-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 12px;
    }
    .detail {
      font-size: 14px;
      color: #666;
    }
    .detail strong {
      color: #1a1a1a;
    }
    .screenshot {
      margin-top: 12px;
    }
    .screenshot img {
      max-width: 100%;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .errors {
      background: #fee2e2;
      color: #991b1b;
      padding: 12px;
      border-radius: 4px;
      margin-top: 12px;
      font-size: 14px;
    }
    .footer {
      text-align: center;
      margin-top: 60px;
      padding: 20px;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔍 Build Validation Report</h1>
    <p>Undisputed proof that each app can build and serve successfully</p>
  </div>

  <div class="stats">
    <div class="stat">
      <div class="stat-value total">${results.total}</div>
      <div class="stat-label">Total Projects</div>
    </div>
    <div class="stat">
      <div class="stat-value success">${results.buildSuccess}</div>
      <div class="stat-label">Builds Passed</div>
    </div>
    <div class="stat">
      <div class="stat-value failed">${results.buildFailed}</div>
      <div class="stat-label">Builds Failed</div>
    </div>
    <div class="stat">
      <div class="stat-value success">${results.screenshotSuccess}</div>
      <div class="stat-label">Screenshots Captured</div>
    </div>
  </div>

  <div class="projects">
    ${results.projects.map(p => `
      <div class="project ${p.buildSuccess && p.screenshotSuccess ? 'success' : 'failed'}">
        <div class="project-header">
          <div class="project-name">${p.name}</div>
          <div class="badges">
            <span class="badge ${p.buildSuccess ? 'success' : 'failed'}">
              ${p.buildSuccess ? '✓ Build' : '✗ Build'}
            </span>
            <span class="badge ${p.screenshotSuccess ? 'success' : 'failed'}">
              ${p.screenshotSuccess ? '✓ Screenshot' : '✗ Screenshot'}
            </span>
          </div>
        </div>

        ${p.buildSuccess ? `
          <div class="project-details">
            <div class="detail"><strong>Build Log:</strong> <a href="build-validation-reports/${p.name}_build.log" target="_blank">View</a></div>
            ${p.port ? `<div class="detail"><strong>Port:</strong> ${p.port}</div>` : ''}
          </div>
        ` : ''}

        ${p.errors.length > 0 ? `
          <div class="errors">
            ${p.errors.map(e => `<div>• ${e}</div>`).join('')}
          </div>
        ` : ''}

        ${p.screenshotSuccess ? `
          <div class="screenshot">
            <img src="project-screenshots-real/${p.name}.png" alt="${p.name} screenshot" loading="lazy">
          </div>
        ` : ''}
      </div>
    `).join('\n')}
  </div>

  <div class="footer">
    Generated on ${new Date().toLocaleString()} | AUCDT Utilities Build Validation
  </div>
</body>
</html>`;

  const reportPath = path.join(ROOT_DIR, 'BUILD_VALIDATION_REPORT.html');
  fs.writeFileSync(reportPath, html);
  log(`\n✓ Summary report generated: ${reportPath}`);
}

main().catch(error => {
  log(`FATAL ERROR: ${error.message}`);
  console.error(error);
  process.exit(1);
});
