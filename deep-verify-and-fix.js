#!/usr/bin/env node
/**
 * ============================================================================
 * Deep Verification and Auto-Fix Script
 * ============================================================================
 * This script verifies that each app:
 * 1. Has a unique build (not copied from another app)
 * 2. Serves actual content (not blank pages)
 * 3. Shows the correct app when served
 *
 * It will auto-fix common issues and report apps needing manual intervention
 * ============================================================================
 */

const { spawn, exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { chromium } = require('playwright');
const crypto = require('crypto');

const CONFIG = {
  servePort: 3456,
  buildTimeout: 300000,
  screenshotDir: 'catalogue',
  viewportWidth: 1920,
  viewportHeight: 1080,
  appLoadWait: 8000,
  minScreenshotSize: 50000,  // 50KB minimum for real content
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
  uniqueContent: 0,
  duplicateContent: 0,
  blankPages: 0,
  buildErrors: 0,
  serveErrors: 0,
  autoFixed: 0,
  needsManualFix: 0,
  screenshotSuccess: 0,
  startTime: Date.now(),
  results: [],
  contentHashes: new Map(),  // Track unique content by hash
  issuesByType: {
    missingBuild: [],
    duplicateBuild: [],
    blankPage: [],
    serveError: [],
    buildError: []
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

async function getFileHash(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    // Hash the content to detect duplicates
    return crypto.createHash('md5').update(content).digest('hex');
  } catch (err) {
    return null;
  }
}

async function checkBuildUniqueness(project) {
  const buildDirs = ['dist', 'build'];

  for (const dir of buildDirs) {
    try {
      const indexPath = path.join(project.name, dir, 'index.html');
      await fs.access(indexPath);

      const hash = await getFileHash(indexPath);
      if (!hash) {
        return { unique: false, reason: 'Could not read index.html', dir };
      }

      // Check if this content hash exists for another project
      if (stats.contentHashes.has(hash)) {
        const originalProject = stats.contentHashes.get(hash);
        return {
          unique: false,
          reason: `Duplicate of ${originalProject}`,
          dir,
          hash
        };
      }

      stats.contentHashes.set(hash, project.name);
      return { unique: true, dir, hash };

    } catch {
      continue;
    }
  }

  return { unique: false, reason: 'No build found', dir: null };
}

async function buildProject(project) {
  log(`  Building...`, 'cyan');

  try {
    const buildCmd = project.packageManager === 'pnpm' ? 'pnpm run build' : 'npm run build';
    await execPromise(buildCmd, project.name);

    const buildDirs = ['dist', 'build'];
    for (const dir of buildDirs) {
      try {
        const indexPath = path.join(project.name, dir, 'index.html');
        await fs.access(indexPath);
        log(`  ✓ Build successful`, 'green');
        return { success: true, dir };
      } catch {
        continue;
      }
    }

    throw new Error('Build succeeded but no index.html found');
  } catch (error) {
    log(`  ✗ Build failed: ${error.error?.message || error.message}`, 'red');
    stats.buildErrors++;
    stats.issuesByType.buildError.push(project.name);
    return { success: false, error: error.error?.message || error.message };
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
      } catch (e) {
        // Process already dead
      }
      resolve();
    }, 2000);
  });
}

async function verifyPageContent(page, projectName) {
  try {
    const content = await page.evaluate(() => {
      const body = document.body;
      const text = body.textContent || '';
      const html = body.innerHTML;

      return {
        textLength: text.trim().length,
        hasContent: body.querySelectorAll('div, section, main, article, header, nav').length > 5,
        hasOnlySkipLink: text.trim() === 'Skip to main content' || text.trim().length < 50,
        title: document.title,
        htmlLength: html.length
      };
    });

    const isBlank = content.hasOnlySkipLink || content.textLength < 100;
    const hasRealContent = content.hasContent && content.htmlLength > 5000;

    return {
      isBlank,
      hasRealContent,
      title: content.title,
      textLength: content.textLength
    };
  } catch (err) {
    return { isBlank: true, hasRealContent: false, error: err.message };
  }
}

async function captureScreenshot(project, buildInfo, browser) {
  log(`  Serving and verifying content...`, 'cyan');

  let serverProcess = null;

  try {
    const buildPath = path.join(project.name, buildInfo.dir);
    serverProcess = await startServer(buildPath, CONFIG.servePort);

    const page = await browser.newPage({
      viewport: { width: CONFIG.viewportWidth, height: CONFIG.viewportHeight }
    });

    const url = `http://localhost:${CONFIG.servePort}`;
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for app to load
    await page.waitForTimeout(CONFIG.appLoadWait);

    // Verify content
    const contentCheck = await verifyPageContent(page, project.name);

    if (contentCheck.isBlank) {
      log(`  ⚠ Page is blank or minimal content`, 'yellow');
      stats.blankPages++;
      stats.issuesByType.blankPage.push(project.name);
      await page.close();
      await stopServer(serverProcess);
      return { success: false, reason: 'blank_page', contentCheck };
    }

    if (!contentCheck.hasRealContent) {
      log(`  ⚠ Page loaded but content seems insufficient`, 'yellow');
      stats.blankPages++;
      stats.issuesByType.blankPage.push(project.name);
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
      stats.uniqueContent++;
      log(`  ✓ Screenshot captured (${Math.round(fileStats.size / 1024)}KB) - Real content verified`, 'green');
      return {
        success: true,
        size: fileStats.size,
        contentCheck,
        hasRealContent: contentCheck.hasRealContent
      };
    } else {
      log(`  ✗ Screenshot too small (${Math.round(fileStats.size / 1024)}KB)`, 'red');
      return { success: false, reason: 'screenshot_too_small', size: fileStats.size };
    }

  } catch (error) {
    log(`  ✗ Capture failed: ${error.message}`, 'red');
    if (serverProcess) {
      await stopServer(serverProcess);
    }
    stats.serveErrors++;
    stats.issuesByType.serveError.push(project.name);
    return { success: false, reason: 'serve_error', error: error.message };
  }
}

async function processProject(project, browser) {
  stats.total++;
  log(`\n${'='.repeat(80)}`, 'cyan');
  log(`[${stats.total}] ${project.name}`, 'bold');
  log(`${'='.repeat(80)}`, 'cyan');

  const result = {
    name: project.name,
    buildUnique: false,
    contentVerified: false,
    screenshotCaptured: false,
    issues: []
  };

  // Check if build exists and is unique
  const uniquenessCheck = await checkBuildUniqueness(project);

  if (!uniquenessCheck.unique) {
    log(`  ⚠ ${uniquenessCheck.reason}`, 'yellow');

    if (uniquenessCheck.reason === 'No build found') {
      stats.issuesByType.missingBuild.push(project.name);
      result.issues.push('no_build');

      // Try to build
      const buildResult = await buildProject(project);
      if (!buildResult.success) {
        result.error = 'build_failed';
        stats.results.push(result);
        return result;
      }

      // Re-check uniqueness after build
      const recheckUnique = await checkBuildUniqueness(project);
      if (!recheckUnique.unique) {
        stats.duplicateContent++;
        stats.issuesByType.duplicateBuild.push({
          project: project.name,
          duplicateOf: recheckUnique.reason
        });
        result.issues.push('duplicate_content');
        result.error = recheckUnique.reason;
        stats.results.push(result);
        return result;
      }

      stats.autoFixed++;
      uniquenessCheck.unique = true;
      uniquenessCheck.dir = buildResult.dir;
    } else {
      // Duplicate content detected
      stats.duplicateContent++;
      stats.issuesByType.duplicateBuild.push({
        project: project.name,
        duplicateOf: uniquenessCheck.reason
      });
      result.issues.push('duplicate_content');
      result.error = uniquenessCheck.reason;
      stats.results.push(result);
      return result;
    }
  }

  result.buildUnique = true;
  log(`  ✓ Build is unique`, 'green');

  // Capture screenshot and verify content
  const captureResult = await captureScreenshot(project, uniquenessCheck, browser);

  if (captureResult.success) {
    result.screenshotCaptured = true;
    result.contentVerified = captureResult.hasRealContent;
    result.size = captureResult.size;
    result.contentInfo = captureResult.contentCheck;
  } else {
    result.error = captureResult.reason;
    result.issues.push(captureResult.reason);
    stats.needsManualFix++;
  }

  stats.results.push(result);
  return result;
}

async function main() {
  log(`\n${'='.repeat(80)}`, 'cyan');
  log(`Deep Verification and Auto-Fix Script`, 'bold');
  log(`${'='.repeat(80)}`, 'cyan');
  log(`This script verifies unique content and auto-fixes common issues`, 'yellow');
  log(`Started: ${new Date().toLocaleString()}\n`, 'dim');

  const projects = await findProjects();
  log(`Found ${projects.length} projects to process\n`, 'green');

  const browser = await chromium.launch({ headless: true });

  for (const project of projects) {
    await processProject(project, browser);
  }

  await browser.close();

  // Generate comprehensive report
  generateReport();

  process.exit(stats.needsManualFix > 0 || stats.duplicateContent > 0 || stats.blankPages > 0 ? 1 : 0);
}

function generateReport() {
  log(`\n\n${'='.repeat(80)}`, 'cyan');
  log(`DEEP VERIFICATION REPORT`, 'bold');
  log(`${'='.repeat(80)}`, 'cyan');

  log(`\nStatistics:`, 'yellow');
  log(`  Total projects:                ${stats.total}`);
  log(`  ✅ Unique content verified:    ${stats.uniqueContent}`, 'green');
  log(`  ⚠️  Duplicate content:          ${stats.duplicateContent}`, stats.duplicateContent > 0 ? 'red' : 'green');
  log(`  ⚠️  Blank pages:                ${stats.blankPages}`, stats.blankPages > 0 ? 'red' : 'green');
  log(`  ❌ Build errors:               ${stats.buildErrors}`, stats.buildErrors > 0 ? 'red' : 'green');
  log(`  ❌ Serve errors:               ${stats.serveErrors}`, stats.serveErrors > 0 ? 'red' : 'green');
  log(`  🔧 Auto-fixed:                 ${stats.autoFixed}`, 'cyan');
  log(`  🔨 Needs manual fix:           ${stats.needsManualFix}`, stats.needsManualFix > 0 ? 'yellow' : 'green');
  log(`  📸 Screenshots captured:       ${stats.screenshotSuccess}`, 'green');

  const duration = Math.round((Date.now() - stats.startTime) / 1000);
  log(`\nDuration: ${Math.floor(duration / 60)}m ${duration % 60}s`, 'dim');

  // Detailed issue breakdown
  if (stats.issuesByType.duplicateBuild.length > 0) {
    log(`\n\n⚠️  DUPLICATE BUILDS (${stats.issuesByType.duplicateBuild.length}):`, 'red');
    stats.issuesByType.duplicateBuild.forEach((item, i) => {
      log(`  ${i + 1}. ${item.project} → ${item.duplicateOf}`, 'red');
    });
    log(`\n  ACTION REQUIRED: These projects have identical builds. Rebuild each individually.`, 'yellow');
  }

  if (stats.issuesByType.blankPage.length > 0) {
    log(`\n\n⚠️  BLANK PAGES (${stats.issuesByType.blankPage.length}):`, 'yellow');
    stats.issuesByType.blankPage.slice(0, 20).forEach((name, i) => {
      log(`  ${i + 1}. ${name}`, 'yellow');
    });
    if (stats.issuesByType.blankPage.length > 20) {
      log(`  ... and ${stats.issuesByType.blankPage.length - 20} more`, 'dim');
    }
    log(`\n  ACTION REQUIRED: These apps load but show minimal/no content. Check for:`, 'yellow');
    log(`    - Runtime JavaScript errors`, 'dim');
    log(`    - Missing environment variables`, 'dim');
    log(`    - API connection issues`, 'dim');
    log(`    - Routing problems (base URL configuration)`, 'dim');
  }

  if (stats.issuesByType.buildError.length > 0) {
    log(`\n\n❌ BUILD ERRORS (${stats.issuesByType.buildError.length}):`, 'red');
    stats.issuesByType.buildError.forEach((name, i) => {
      log(`  ${i + 1}. ${name}`, 'red');
    });
    log(`\n  ACTION REQUIRED: Fix TypeScript/build errors in these projects`, 'yellow');
  }

  const successful = stats.results.filter(r => r.buildUnique && r.screenshotCaptured && r.contentVerified);
  log(`\n\n✅ VERIFIED WORKING APPS (${successful.length}):`, 'green');
  log(`These apps have unique builds and display real content:`, 'dim');
  successful.slice(0, 10).forEach((r, i) => {
    log(`  ${i + 1}. ${r.name} (${Math.round(r.size/1024)}KB)`, 'green');
  });
  if (successful.length > 10) {
    log(`  ... and ${successful.length - 10} more`, 'dim');
  }

  // Save detailed report
  const reportPath = 'DEEP-VERIFICATION-REPORT.md';
  const reportContent = generateMarkdownReport();
  require('fs').writeFileSync(reportPath, reportContent);
  log(`\n✓ Detailed report saved to ${reportPath}`, 'green');
}

function generateMarkdownReport() {
  const successful = stats.results.filter(r => r.buildUnique && r.screenshotCaptured && r.contentVerified);
  const needsFix = stats.results.filter(r => !r.buildUnique || !r.contentVerified || !r.screenshotCaptured);

  return `# Deep Verification Report

**Generated:** ${new Date().toLocaleString()}
**Duration:** ${Math.floor((Date.now() - stats.startTime) / 60000)}m ${Math.floor(((Date.now() - stats.startTime) % 60000) / 1000)}s

## Executive Summary

| Metric | Count | Percentage |
|--------|-------|------------|
| Total Projects | ${stats.total} | 100% |
| ✅ Verified Working | ${successful.length} | ${((successful.length/stats.total)*100).toFixed(1)}% |
| ⚠️ Duplicate Content | ${stats.duplicateContent} | ${((stats.duplicateContent/stats.total)*100).toFixed(1)}% |
| ⚠️ Blank Pages | ${stats.blankPages} | ${((stats.blankPages/stats.total)*100).toFixed(1)}% |
| ❌ Build Errors | ${stats.buildErrors} | ${((stats.buildErrors/stats.total)*100).toFixed(1)}% |
| ❌ Serve Errors | ${stats.serveErrors} | ${((stats.serveErrors/stats.total)*100).toFixed(1)}% |
| 🔧 Auto-Fixed | ${stats.autoFixed} | ${((stats.autoFixed/stats.total)*100).toFixed(1)}% |
| 🔨 Needs Manual Fix | ${stats.needsManualFix} | ${((stats.needsManualFix/stats.total)*100).toFixed(1)}% |

## ✅ Verified Working Apps (${successful.length})

These apps have unique builds and display real content:

${successful.map((r, i) => `${i + 1}. **${r.name}** (${Math.round(r.size/1024)}KB) - ${r.contentInfo?.title || 'No title'}`).join('\n')}

## ⚠️ Duplicate Builds (${stats.issuesByType.duplicateBuild.length})

${stats.issuesByType.duplicateBuild.length > 0 ? stats.issuesByType.duplicateBuild.map((item, i) =>
  `${i + 1}. **${item.project}** → Duplicate of \`${item.duplicateOf}\``
).join('\n') : '*None*'}

**Fix:** Rebuild these projects individually to generate unique content.

## ⚠️ Blank Pages (${stats.issuesByType.blankPage.length})

${stats.issuesByType.blankPage.length > 0 ? stats.issuesByType.blankPage.map((name, i) =>
  `${i + 1}. **${name}**`
).join('\n') : '*None*'}

**Common Causes:**
- Runtime JavaScript errors (check browser console)
- Missing environment variables (VITE_API_KEY, etc.)
- Incorrect base URL in vite.config.js
- API endpoint unreachable
- Router configuration issues

## ❌ Build Errors (${stats.issuesByType.buildError.length})

${stats.issuesByType.buildError.length > 0 ? stats.issuesByType.buildError.map((name, i) =>
  `${i + 1}. **${name}**`
).join('\n') : '*None*'}

**Fix:** Review build logs and fix TypeScript/compilation errors.

## ❌ Serve Errors (${stats.issuesByType.serveError.length})

${stats.issuesByType.serveError.length > 0 ? stats.issuesByType.serveError.map((name, i) =>
  `${i + 1}. **${name}**`
).join('\n') : '*None*'}

## Next Steps

1. **Duplicate Builds**: Delete dist folders and rebuild individually
2. **Blank Pages**: Check vite.config.js base URL and browser console errors
3. **Build Errors**: Fix TypeScript/dependency issues
4. **Serve Errors**: Investigate port conflicts and file permissions

---
*Generated by deep-verify-and-fix.js*
`;
}

main().catch(error => {
  log(`\n\nFatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
