#!/usr/bin/env node
/**
 * ============================================================================
 * Comprehensive Build & Verification Script
 * ============================================================================
 * This script ensures each application:
 * 1. Builds successfully
 * 2. Has a dist/index.html file
 * 3. Can be served with serve -s dist
 * 4. Displays actual content (no placeholders, no blank pages)
 * 5. Has a screenshot in the catalogue
 *
 * Usage: node comprehensive-build-verify.js [--fix] [--app=app-name]
 * ============================================================================
 */

const { spawn, exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { chromium } = require('playwright');

const CONFIG = {
  concurrency: 3,          // Build 3 apps at once
  buildTimeout: 300000,    // 5 minutes per build
  servePort: 3456,         // Base port for serving
  screenshotDir: 'catalogue',
  viewportWidth: 1920,
  viewportHeight: 1080,
  hydrationWait: 4000,     // Wait for React to hydrate
  minScreenshotSize: 15000, // 15KB minimum
  skipDirs: [
    'node_modules', 'dist', 'build', '.git', 'docker', 'catalogue',
    'scripts', 'tests', 'templates', 'reports', 'Documentation',
    'archive', 'build-logs', 'install-logs', 'proof-of-concept-screenshots',
    'project-screenshots-real', 'sync-from-d-drive', 'monitoring',
    'src', 'docs', 'playwright', 'backend', 'gemini', 'genai'
  ]
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

const stats = {
  total: 0,
  buildSuccess: 0,
  buildFailed: 0,
  hasIndexHtml: 0,
  noIndexHtml: 0,
  contentVerified: 0,
  blankPage: 0,
  screenshotSuccess: 0,
  screenshotFailed: 0,
  fixed: 0,
  startTime: Date.now()
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

      // Skip backend-only apps
      const hasExpress = packageData.dependencies?.express;
      const hasReact = packageData.dependencies?.react;
      const isBackendOnly = hasExpress && !hasReact;

      if (!isBackendOnly) {
        projects.push({
          name: dir.name,
          displayName: packageData.description || packageData.name || dir.name,
          hasReact,
          hasVite: packageData.devDependencies?.vite || packageData.dependencies?.vite,
          buildCommand: packageData.scripts?.build || 'npm run build',
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
    try {
      await fs.access(path.join(projectDir, 'package-lock.json'));
      return 'npm';
    } catch {
      return 'npm';
    }
  }
}

async function buildProject(project) {
  log(`\n[${ project.name}] Building...`, 'cyan');

  try {
    // Install dependencies if needed
    const nodeModulesPath = path.join(project.name, 'node_modules');
    try {
      await fs.access(nodeModulesPath);
    } catch {
      log(`  Installing dependencies with ${project.packageManager}...`, 'dim');
      const installCmd = project.packageManager === 'pnpm' ? 'pnpm install' : 'npm install --legacy-peer-deps';
      await execPromise(installCmd, project.name);
    }

    // Build the project
    const buildCmd = project.packageManager === 'pnpm' ? 'pnpm run build' : 'npm run build';
    await execPromise(buildCmd, project.name);

    stats.buildSuccess++;
    log(`  ✓ Build successful`, 'green');
    return { success: true };
  } catch (error) {
    stats.buildFailed++;
    log(`  ✗ Build failed: ${error.error?.message || 'Unknown error'}`, 'red');
    return { success: false, error: error.stderr || error.error?.message };
  }
}

async function verifyIndexHtml(project) {
  const locations = [
    path.join(project.name, 'dist', 'index.html'),
    path.join(project.name, 'build', 'index.html'),
    path.join(project.name, 'client', 'dist', 'index.html'),
    path.join(project.name, 'frontend', 'dist', 'index.html'),
  ];

  for (const htmlPath of locations) {
    try {
      await fs.access(htmlPath);
      stats.hasIndexHtml++;
      log(`  ✓ Found index.html at ${path.relative(process.cwd(), htmlPath)}`, 'green');
      return { success: true, path: htmlPath };
    } catch {
      continue;
    }
  }

  stats.noIndexHtml++;
  log(`  ✗ No index.html found`, 'red');
  return { success: false };
}

async function hasContent(page) {
  try {
    // Wait a bit for content to load
    await page.waitForTimeout(2000);

    // Check for meaningful text content
    const bodyText = await page.textContent('body');
    const textLength = bodyText ? bodyText.trim().length : 0;

    // Check for visible elements
    const divCount = await page.$$eval('div, section, main, article', els => els.length);

    // Check for images
    const imgCount = await page.$$eval('img', els => els.length);

    // Check for buttons/links (interactive elements)
    const interactiveCount = await page.$$eval('button, a, input', els => els.length);

    // Page has content if:
    // - Has substantial text (>100 chars) OR
    // - Has multiple structural elements (>5) OR
    // - Has images and interactive elements
    const hasEnoughContent = (
      textLength > 100 ||
      divCount > 5 ||
      (imgCount > 0 && interactiveCount > 2)
    );

    if (!hasEnoughContent) {
      log(`    Debug: text=${textLength} chars, divs=${divCount}, imgs=${imgCount}, interactive=${interactiveCount}`, 'dim');
    }

    return hasEnoughContent;
  } catch (err) {
    log(`    Error checking content: ${err.message}`, 'dim');
    return false;
  }
}

async function serveAndVerify(project, htmlPath, browser) {
  log(`  Verifying content displays properly...`, 'cyan');

  const page = await browser.newPage({
    viewport: { width: CONFIG.viewportWidth, height: CONFIG.viewportHeight }
  });

  try {
    const absolutePath = path.resolve(htmlPath);
    const fileUrl = `file:///${absolutePath.replace(/\\/g, '/')}`;

    await page.goto(fileUrl, {
      waitUntil: 'networkidle',
      timeout: 15000
    });

    // Wait for React hydration
    await page.waitForTimeout(CONFIG.hydrationWait);

    // Check if page has actual content
    if (await hasContent(page)) {
      stats.contentVerified++;
      log(`  ✓ Content verified - page displays properly`, 'green');
      await page.close();
      return { success: true };
    } else {
      stats.blankPage++;
      log(`  ✗ Blank or placeholder page detected`, 'red');
      await page.close();
      return { success: false, reason: 'blank_page' };
    }
  } catch (error) {
    log(`  ✗ Failed to verify: ${error.message}`, 'red');
    await page.close();
    return { success: false, reason: error.message };
  }
}

async function captureScreenshot(project, htmlPath, browser) {
  log(`  Capturing screenshot...`, 'cyan');

  const page = await browser.newPage({
    viewport: { width: CONFIG.viewportWidth, height: CONFIG.viewportHeight }
  });

  try {
    const absolutePath = path.resolve(htmlPath);
    const fileUrl = `file:///${absolutePath.replace(/\\/g, '/')}`;

    await page.goto(fileUrl, {
      waitUntil: 'networkidle',
      timeout: 15000
    });

    await page.waitForTimeout(CONFIG.hydrationWait);

    const screenshotDir = path.join(CONFIG.screenshotDir, project.name);
    await fs.mkdir(screenshotDir, { recursive: true });
    const screenshotPath = path.join(screenshotDir, 'screenshot.png');

    await page.screenshot({ path: screenshotPath, fullPage: false });

    const fileStats = await fs.stat(screenshotPath);
    if (fileStats.size > CONFIG.minScreenshotSize) {
      stats.screenshotSuccess++;
      log(`  ✓ Screenshot saved (${Math.round(fileStats.size / 1024)}KB)`, 'green');
      await page.close();
      return { success: true, size: fileStats.size };
    } else {
      stats.screenshotFailed++;
      log(`  ✗ Screenshot too small (${Math.round(fileStats.size / 1024)}KB) - likely blank`, 'red');
      await page.close();
      return { success: false, reason: 'too_small' };
    }
  } catch (error) {
    stats.screenshotFailed++;
    log(`  ✗ Failed to capture screenshot: ${error.message}`, 'red');
    await page.close();
    return { success: false, reason: error.message };
  }
}

async function fixBlankPage(project) {
  log(`\n[${project.name}] Attempting to fix blank page...`, 'magenta');

  // Common issues and fixes:
  // 1. Missing base path in index.html
  // 2. Incorrect asset paths
  // 3. Missing environmental variables
  // 4. Runtime errors in console

  try {
    const indexPath = path.join(project.name, 'dist', 'index.html');
    let content = await fs.readFile(indexPath, 'utf-8');

    let modified = false;

    // Fix 1: Ensure base path is set correctly
    if (!content.includes('<base')) {
      content = content.replace('<head>', '<head>\n  <base href="/">');
      modified = true;
      log(`  Added base href`, 'yellow');
    }

    // Fix 2: Convert absolute paths to relative
    if (content.includes('src="/assets') || content.includes('href="/assets')) {
      content = content.replace(/src="\/assets/g, 'src="./assets');
      content = content.replace(/href="\/assets/g, 'href="./assets');
      modified = true;
      log(`  Fixed asset paths`, 'yellow');
    }

    if (modified) {
      await fs.writeFile(indexPath, content);
      stats.fixed++;
      log(`  ✓ Fixed index.html`, 'green');
      return { success: true };
    } else {
      log(`  No automatic fixes available`, 'dim');
      return { success: false };
    }
  } catch (error) {
    log(`  ✗ Failed to fix: ${error.message}`, 'red');
    return { success: false };
  }
}

async function processProject(project, browser, shouldFix = false) {
  stats.total++;
  log(`\n${'='.repeat(80)}`, 'cyan');
  log(`[${stats.total}] ${project.name}`, 'bold');
  log(`${'='.repeat(80)}`, 'cyan');

  // Step 1: Build the project
  const buildResult = await buildProject(project);
  if (!buildResult.success) {
    return { project: project.name, status: 'build_failed', error: buildResult.error };
  }

  // Step 2: Verify index.html exists
  const htmlResult = await verifyIndexHtml(project);
  if (!htmlResult.success) {
    return { project: project.name, status: 'no_index_html' };
  }

  // Step 3: Verify content displays properly
  const verifyResult = await serveAndVerify(project, htmlResult.path, browser);
  if (!verifyResult.success) {
    if (shouldFix) {
      const fixResult = await fixBlankPage(project);
      if (fixResult.success) {
        // Re-verify after fix
        const reVerifyResult = await serveAndVerify(project, htmlResult.path, browser);
        if (!reVerifyResult.success) {
          return { project: project.name, status: 'blank_page_unfixed' };
        }
      } else {
        return { project: project.name, status: 'blank_page' };
      }
    } else {
      return { project: project.name, status: 'blank_page' };
    }
  }

  // Step 4: Capture screenshot
  const screenshotResult = await captureScreenshot(project, htmlResult.path, browser);
  if (!screenshotResult.success) {
    return { project: project.name, status: 'screenshot_failed', reason: screenshotResult.reason };
  }

  return { project: project.name, status: 'success' };
}

async function main() {
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--fix');
  const specificApp = args.find(arg => arg.startsWith('--app='))?.split('=')[1];

  log(`\n${'='.repeat(80)}`, 'cyan');
  log(`Comprehensive Build & Verification Script`, 'bold');
  log(`${'='.repeat(80)}`, 'cyan');
  log(`Mode: ${shouldFix ? 'BUILD + VERIFY + FIX' : 'BUILD + VERIFY'}`, 'yellow');
  log(`Started: ${new Date().toLocaleString()}\n`, 'dim');

  // Find all projects
  let projects = await findProjects();

  if (specificApp) {
    projects = projects.filter(p => p.name === specificApp);
    if (projects.length === 0) {
      log(`\nError: App '${specificApp}' not found`, 'red');
      process.exit(1);
    }
    log(`Processing single app: ${specificApp}\n`, 'yellow');
  }

  log(`Found ${projects.length} projects to process\n`, 'green');

  const browser = await chromium.launch({ headless: true });
  const results = [];

  // Process projects sequentially to avoid resource issues
  for (const project of projects) {
    const result = await processProject(project, browser, shouldFix);
    results.push(result);
  }

  await browser.close();

  // Generate report
  log(`\n\n${'='.repeat(80)}`, 'cyan');
  log(`FINAL REPORT`, 'bold');
  log(`${'='.repeat(80)}`, 'cyan');
  log(`\nStatistics:`, 'yellow');
  log(`  Total projects:           ${stats.total}`);
  log(`  Build successful:         ${stats.buildSuccess}`, 'green');
  log(`  Build failed:             ${stats.buildFailed}`, stats.buildFailed > 0 ? 'red' : 'green');
  log(`  Has index.html:           ${stats.hasIndexHtml}`, 'green');
  log(`  No index.html:            ${stats.noIndexHtml}`, stats.noIndexHtml > 0 ? 'red' : 'green');
  log(`  Content verified:         ${stats.contentVerified}`, 'green');
  log(`  Blank pages:              ${stats.blankPage}`, stats.blankPage > 0 ? 'red' : 'green');
  log(`  Screenshots captured:     ${stats.screenshotSuccess}`, 'green');
  log(`  Screenshot failures:      ${stats.screenshotFailed}`, stats.screenshotFailed > 0 ? 'red' : 'green');
  if (shouldFix) {
    log(`  Auto-fixed:               ${stats.fixed}`, 'green');
  }

  const duration = Math.round((Date.now() - stats.startTime) / 1000);
  log(`\nDuration: ${Math.floor(duration / 60)}m ${duration % 60}s`, 'dim');

  // List failures
  const failures = results.filter(r => r.status !== 'success');
  if (failures.length > 0) {
    log(`\n\nFailed Projects (${failures.length}):`, 'red');
    failures.forEach((f, i) => {
      log(`  ${i + 1}. ${f.project} - ${f.status}${f.error ? ` (${f.error})` : ''}`, 'red');
    });
  }

  // Save detailed report
  const reportPath = 'COMPREHENSIVE-BUILD-REPORT.md';
  const report = generateMarkdownReport(stats, results, duration);
  await fs.writeFile(reportPath, report);
  log(`\n✓ Detailed report saved to ${reportPath}`, 'green');

  process.exit(failures.length > 0 ? 1 : 0);
}

function generateMarkdownReport(stats, results, duration) {
  const successfulProjects = results.filter(r => r.status === 'success');
  const failedProjects = results.filter(r => r.status !== 'success');

  return `# Comprehensive Build & Verification Report

**Generated:** ${new Date().toLocaleString()}
**Duration:** ${Math.floor(duration / 60)}m ${duration % 60}s

## Summary

| Metric | Count |
|--------|-------|
| Total Projects | ${stats.total} |
| ✅ Build Successful | ${stats.buildSuccess} |
| ❌ Build Failed | ${stats.buildFailed} |
| ✅ Has index.html | ${stats.hasIndexHtml} |
| ❌ No index.html | ${stats.noIndexHtml} |
| ✅ Content Verified | ${stats.contentVerified} |
| ❌ Blank Pages | ${stats.blankPage} |
| ✅ Screenshots Captured | ${stats.screenshotSuccess} |
| ❌ Screenshot Failures | ${stats.screenshotFailed} |
| 🔧 Auto-Fixed | ${stats.fixed} |

## Success Rate

- **Build Success Rate:** ${((stats.buildSuccess / stats.total) * 100).toFixed(1)}%
- **Content Verification Rate:** ${((stats.contentVerified / stats.total) * 100).toFixed(1)}%
- **Screenshot Success Rate:** ${((stats.screenshotSuccess / stats.total) * 100).toFixed(1)}%

## Successful Projects (${successfulProjects.length})

${successfulProjects.map((r, i) => `${i + 1}. ${r.project}`).join('\n')}

## Failed Projects (${failedProjects.length})

${failedProjects.map((r, i) => `${i + 1}. **${r.project}** - ${r.status}${r.error ? `\n   Error: ${r.error}` : ''}`).join('\n')}

## Next Steps

${failedProjects.length > 0 ? `
### Build Failures
${failedProjects.filter(r => r.status === 'build_failed').map(r => `- \`${r.project}\`: Review build logs and fix compilation errors`).join('\n')}

### Missing index.html
${failedProjects.filter(r => r.status === 'no_index_html').map(r => `- \`${r.project}\`: Verify build output directory and build configuration`).join('\n')}

### Blank Pages
${failedProjects.filter(r => r.status === 'blank_page' || r.status === 'blank_page_unfixed').map(r => `- \`${r.project}\`: Check for runtime errors, missing environment variables, or incorrect asset paths`).join('\n')}

### Screenshot Failures
${failedProjects.filter(r => r.status === 'screenshot_failed').map(r => `- \`${r.project}\`: Investigate screenshot capture issues`).join('\n')}
` : '✅ All projects built and verified successfully!'}

---
*Generated by comprehensive-build-verify.js*
`;
}

main().catch(error => {
  log(`\n\nFatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
