/**
 * AUCDT-Utilities Landing Page Screenshot Validator
 * Automatically captures screenshots of all project landing pages
 * to validate UI rendering and identify broken implementations
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const chromium = require('playwright').chromium;

const BASE_DIR = __dirname;
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots-validation');
const PORT_START = 4000;
const TIMEOUT = 15000; // 15 seconds per project

// Create screenshots directory
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Find all projects with package.json
function findProjects() {
  const projects = [];
  const entries = fs.readdirSync(BASE_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === 'node_modules' || entry.name === 'screenshots-validation') continue;

    const projectPath = path.join(BASE_DIR, entry.name);
    const packagePath = path.join(projectPath, 'package.json');
    const indexPath = path.join(projectPath, 'index.html');

    if (fs.existsSync(packagePath) && fs.existsSync(indexPath)) {
      projects.push({
        name: entry.name,
        path: projectPath,
        packagePath,
        indexPath
      });
    }
  }

  // Check ai-utilities subdirectory
  const aiUtilsPath = path.join(BASE_DIR, 'ai-utilities');
  if (fs.existsSync(aiUtilsPath)) {
    const aiEntries = fs.readdirSync(aiUtilsPath, { withFileTypes: true });
    for (const entry of aiEntries) {
      if (!entry.isDirectory()) continue;
      const projectPath = path.join(aiUtilsPath, entry.name);
      const packagePath = path.join(projectPath, 'package.json');
      const indexPath = path.join(projectPath, 'index.html');

      if (fs.existsSync(packagePath) && fs.existsSync(indexPath)) {
        projects.push({
          name: `ai-utilities/${entry.name}`,
          path: projectPath,
          packagePath,
          indexPath
        });
      }
    }
  }

  return projects;
}

// Start dev server for a project
function startDevServer(projectPath, port) {
  return new Promise((resolve, reject) => {
    console.log(`  Starting dev server on port ${port}...`);

    const server = spawn('pnpm', ['dev', '--port', port.toString()], {
      cwd: projectPath,
      shell: true,
      stdio: 'pipe'
    });

    let started = false;
    const timeout = setTimeout(() => {
      if (!started) {
        server.kill();
        reject(new Error('Server start timeout'));
      }
    }, TIMEOUT);

    server.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Local:') || output.includes('ready in')) {
        started = true;
        clearTimeout(timeout);
        resolve(server);
      }
    });

    server.stderr.on('data', (data) => {
      console.error(`  [SERVER ERROR] ${data.toString().substring(0, 200)}`);
    });

    server.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

// Take screenshot of a URL
async function takeScreenshot(browser, url, outputPath) {
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1920, height: 1080 });
    console.log(`  Navigating to ${url}...`);

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 10000
    });

    // Wait a bit for any animations
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: outputPath,
      fullPage: true
    });

    console.log(`  ✅ Screenshot saved: ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`  ❌ Screenshot failed: ${error.message}`);
  } finally {
    await page.close();
  }
}

// Check if project has node_modules
function hasNodeModules(projectPath) {
  return fs.existsSync(path.join(projectPath, 'node_modules'));
}

// Install dependencies
function installDependencies(projectPath) {
  return new Promise((resolve, reject) => {
    console.log(`  Installing dependencies...`);
    const install = spawn('pnpm', ['install'], {
      cwd: projectPath,
      shell: true,
      stdio: 'pipe'
    });

    install.on('close', (code) => {
      if (code === 0) {
        console.log(`  ✅ Dependencies installed`);
        resolve();
      } else {
        reject(new Error(`Install failed with code ${code}`));
      }
    });

    // Timeout after 2 minutes
    setTimeout(() => {
      install.kill();
      reject(new Error('Install timeout'));
    }, 120000);
  });
}

// Main validation function
async function validateProjects() {
  const projects = findProjects();
  console.log(`\n🔍 Found ${projects.length} projects to validate\n`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = {
    success: [],
    failed: [],
    total: projects.length
  };

  let currentPort = PORT_START;

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    console.log(`\n[${i + 1}/${projects.length}] Processing: ${project.name}`);

    try {
      // Check dependencies
      if (!hasNodeModules(project.path)) {
        console.log(`  ⚠️  No node_modules found, installing...`);
        await installDependencies(project.path);
      }

      // Start server
      const server = await startDevServer(project.path, currentPort);

      // Wait a bit for full startup
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Take screenshot
      const screenshotName = project.name.replace(/\//g, '_') + '.png';
      const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotName);

      await takeScreenshot(browser, `http://localhost:${currentPort}`, screenshotPath);

      // Kill server
      server.kill();

      results.success.push(project.name);
      currentPort++;

      // Wait before next project
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`  ❌ Failed: ${error.message}`);
      results.failed.push({ name: project.name, error: error.message });
      currentPort++;
    }
  }

  await browser.close();

  // Generate report
  console.log(`\n\n========================================`);
  console.log(`VALIDATION COMPLETE`);
  console.log(`========================================`);
  console.log(`Total Projects: ${results.total}`);
  console.log(`✅ Success: ${results.success.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`\nScreenshots saved to: ${SCREENSHOTS_DIR}`);

  if (results.failed.length > 0) {
    console.log(`\n⚠️  Failed Projects:`);
    results.failed.forEach(f => console.log(`  - ${f.name}: ${f.error}`));
  }

  // Save report
  const reportPath = path.join(SCREENSHOTS_DIR, 'validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Report saved: ${reportPath}\n`);
}

// Run validation
console.log('🚀 AUCDT-Utilities Landing Page Validator');
console.log('==========================================\n');

validateProjects().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
