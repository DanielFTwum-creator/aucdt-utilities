/**
 * Screenshot Gallery Generator for All 272 AUCDT Projects
 * Captures screenshots and generates interactive HTML gallery
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const chromium = require('playwright').chromium;

const BASE_DIR = __dirname;
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'project-screenshots');
const PORT_START = 5000;
const SCREENSHOT_TIMEOUT = 15000;
const SERVER_START_TIMEOUT = 20000;

// Create screenshots directory
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Find all projects with package.json and index.html
function findProjects() {
  const projects = [];
  const entries = fs.readdirSync(BASE_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === 'node_modules' || entry.name.startsWith('screenshots') ||
        entry.name.startsWith('.') || entry.name === 'backend') continue;

    const projectPath = path.join(BASE_DIR, entry.name);
    const packagePath = path.join(projectPath, 'package.json');
    const indexPath = path.join(projectPath, 'index.html');

    if (fs.existsSync(packagePath) && fs.existsSync(indexPath)) {
      projects.push({
        name: entry.name,
        path: projectPath,
        category: 'main'
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
          category: 'ai-utilities'
        });
      }
    }
  }

  return projects;
}

// Check if dependencies are installed
function hasNodeModules(projectPath) {
  return fs.existsSync(path.join(projectPath, 'node_modules'));
}

// Install dependencies quickly
async function installDependencies(projectPath, projectName) {
  return new Promise((resolve, reject) => {
    console.log(`    Installing dependencies...`);
    const install = spawn('pnpm', ['install', '--prefer-offline'], {
      cwd: projectPath,
      shell: true,
      stdio: 'pipe'
    });

    const timeout = setTimeout(() => {
      install.kill();
      reject(new Error('Install timeout (60s)'));
    }, 60000);

    install.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        console.log(`    ✅ Dependencies installed`);
        resolve();
      } else {
        reject(new Error(`Install failed with code ${code}`));
      }
    });

    install.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

// Start dev server
async function startDevServer(projectPath, port) {
  return new Promise((resolve, reject) => {
    const server = spawn('pnpm', ['dev', '--port', port.toString(), '--host'], {
      cwd: projectPath,
      shell: true,
      stdio: 'pipe'
    });

    let started = false;
    const timeout = setTimeout(() => {
      if (!started) {
        server.kill();
        reject(new Error('Server timeout'));
      }
    }, SERVER_START_TIMEOUT);

    server.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Local:') || output.includes('ready in')) {
        if (!started) {
          started = true;
          clearTimeout(timeout);
          setTimeout(() => resolve(server), 2000); // Wait 2s after server ready
        }
      }
    });

    server.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

// Take screenshot
async function takeScreenshot(page, url, outputPath, projectName) {
  try {
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: SCREENSHOT_TIMEOUT
    });

    await page.waitForTimeout(2000);

    await page.screenshot({
      path: outputPath,
      fullPage: false,
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });

    console.log(`    ✅ Screenshot captured`);
    return true;
  } catch (error) {
    console.log(`    ⚠️  Screenshot failed: ${error.message.substring(0, 60)}`);
    return false;
  }
}

// Generate HTML gallery
function generateGallery(results) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AUCDT-Utilities Project Gallery - 272 Projects</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; }
    .screenshot-card { transition: transform 0.2s; }
    .screenshot-card:hover { transform: scale(1.02); }
    .status-success { color: #10b981; }
    .status-failed { color: #ef4444; }
  </style>
</head>
<body class="bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 py-8">
    <header class="mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        AUCDT-Utilities Project Gallery
      </h1>
      <div class="bg-white rounded-lg shadow p-6 grid grid-cols-4 gap-4">
        <div>
          <div class="text-3xl font-bold text-blue-600">${results.total}</div>
          <div class="text-sm text-gray-600">Total Projects</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-green-600">${results.success.length}</div>
          <div class="text-sm text-gray-600">Screenshots Captured</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-red-600">${results.failed.length}</div>
          <div class="text-sm text-gray-600">Failed</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-purple-600">${Math.round((results.success.length / results.total) * 100)}%</div>
          <div class="text-sm text-gray-600">Success Rate</div>
        </div>
      </div>
      <p class="mt-4 text-gray-600">Generated: ${new Date().toLocaleString()}</p>
    </header>

    <div class="mb-8">
      <input
        type="text"
        id="searchInput"
        placeholder="Search projects..."
        class="w-full px-4 py-2 border rounded-lg"
        onkeyup="filterProjects()"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="projectGrid">
      ${results.success.map(proj => `
        <div class="screenshot-card bg-white rounded-lg shadow-md overflow-hidden project-item" data-name="${proj.name.toLowerCase()}">
          <img
            src="project-screenshots/${proj.screenshot}"
            alt="${proj.name}"
            class="w-full h-48 object-cover object-top"
            loading="lazy"
          />
          <div class="p-4">
            <h3 class="font-bold text-gray-900 mb-2">${proj.name}</h3>
            <div class="flex items-center justify-between text-sm">
              <span class="status-success">✓ Working</span>
              <span class="text-gray-500">${proj.category}</span>
            </div>
          </div>
        </div>
      `).join('')}

      ${results.failed.map(proj => `
        <div class="screenshot-card bg-white rounded-lg shadow-md overflow-hidden project-item" data-name="${proj.name.toLowerCase()}">
          <div class="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span class="text-gray-400 text-4xl">⚠️</span>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-gray-900 mb-2">${proj.name}</h3>
            <div class="flex items-center justify-between text-sm">
              <span class="status-failed">✗ Failed</span>
              <span class="text-gray-500">${proj.category}</span>
            </div>
            <p class="text-xs text-gray-500 mt-2">${proj.error.substring(0, 60)}</p>
          </div>
        </div>
      `).join('')}
    </div>
  </div>

  <script>
    function filterProjects() {
      const input = document.getElementById('searchInput');
      const filter = input.value.toLowerCase();
      const items = document.getElementsByClassName('project-item');

      for (let item of items) {
        const name = item.getAttribute('data-name');
        if (name.includes(filter)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      }
    }
  </script>
</body>
</html>`;

  const outputPath = path.join(SCREENSHOTS_DIR, 'index.html');
  fs.writeFileSync(outputPath, html);
  console.log(`\n📄 Gallery generated: ${outputPath}`);
}

// Main function
async function captureAllScreenshots() {
  console.log('📸 Screenshot Gallery Generator');
  console.log('================================\n');

  const projects = findProjects();
  console.log(`Found ${projects.length} projects\n`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const results = {
    total: projects.length,
    success: [],
    failed: []
  };

  let currentPort = PORT_START;

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    console.log(`\n[${i + 1}/${projects.length}] ${project.name}`);

    let server = null;
    try {
      // Install if needed
      if (!hasNodeModules(project.path)) {
        await installDependencies(project.path, project.name);
      }

      // Start server
      console.log(`    Starting server on port ${currentPort}...`);
      server = await startDevServer(project.path, currentPort);

      // Take screenshot
      const screenshotName = project.name.replace(/\//g, '_').replace(/[^a-z0-9_-]/gi, '-') + '.png';
      const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotName);

      const success = await takeScreenshot(page, `http://localhost:${currentPort}`, screenshotPath, project.name);

      if (success) {
        results.success.push({
          name: project.name,
          screenshot: screenshotName,
          category: project.category,
          port: currentPort
        });
      } else {
        throw new Error('Screenshot capture failed');
      }

    } catch (error) {
      console.log(`    ❌ Error: ${error.message}`);
      results.failed.push({
        name: project.name,
        category: project.category,
        error: error.message
      });
    } finally {
      if (server) {
        server.kill();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      currentPort++;
    }
  }

  await browser.close();

  // Generate gallery
  console.log('\n\n📊 FINAL RESULTS');
  console.log('================');
  console.log(`Total: ${results.total}`);
  console.log(`Success: ${results.success.length}`);
  console.log(`Failed: ${results.failed.length}`);
  console.log(`Success Rate: ${Math.round((results.success.length / results.total) * 100)}%`);

  generateGallery(results);

  // Save JSON report
  const reportPath = path.join(SCREENSHOTS_DIR, 'screenshot-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`📄 Report saved: ${reportPath}\n`);
}

// Run
captureAllScreenshots().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
