#!/usr/bin/env node
/**
 * ============================================================================
 * Fix, Build, and Verify ALL Applications
 * ============================================================================
 * This script:
 * 1. Finds all frontend applications
 * 2. Fixes common issues before building
 * 3. Builds each application
 * 4. Fixes post-build issues (like %PUBLIC_URL%)
 * 5. Verifies the build displays properly
 * 6. Takes screenshots
 * 7. Generates comprehensive report
 * ============================================================================
 */

const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { chromium } = require('playwright');

const CONFIG = {
  buildTimeout: 300000,
  concurrency: 1,
  screenshotDir: 'catalogue',
  viewportWidth: 1920,
  viewportHeight: 1080,
  hydrationWait: 5000,
  minScreenshotSize: 15000,
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
  buildSuccess: 0,
  buildFailed: 0,
  fixed: 0,
  displaySuccess: 0,
  displayFailed: 0,
  screenshotSuccess: 0,
  screenshotFailed: 0,
  startTime: Date.now(),
  results: []
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
    return 'npm';
  }
}

async function fixPreBuildIssues(project) {
  log(`  Checking for pre-build issues...`, 'cyan');
  let fixed = 0;

  // Check vite.config.js for base path issues
  try {
    const viteConfigPath = path.join(project.name, 'vite.config.js');
    await fs.access(viteConfigPath);
    let viteConfig = await fs.readFile(viteConfigPath, 'utf-8');

    // Ensure base is set to './' for file:// protocol compatibility
    if (!viteConfig.includes("base:") && !viteConfig.includes('base :')) {
      const insertPoint = viteConfig.indexOf('export default defineConfig');
      if (insertPoint > -1) {
        const pluginsStart = viteConfig.indexOf('plugins:', insertPoint);
        if (pluginsStart > -1) {
          viteConfig = viteConfig.slice(0, pluginsStart) +
            "base: './',\n  " +
            viteConfig.slice(pluginsStart);
          await fs.writeFile(viteConfigPath, viteConfig);
          log(`    Fixed: Added base: './' to vite.config.js`, 'green');
          fixed++;
        }
      }
    }
  } catch (err) {
    // No vite.config.js, that's okay
  }

  return fixed;
}

async function buildProject(project) {
  log(`  Building...`, 'cyan');

  try {
    // Install dependencies if needed
    const nodeModulesPath = path.join(project.name, 'node_modules');
    try {
      await fs.access(nodeModulesPath);
    } catch {
      log(`    Installing dependencies...`, 'dim');
      const installCmd = project.packageManager === 'pnpm' ? 'pnpm install' : 'npm install --legacy-peer-deps';
      await execPromise(installCmd, project.name);
    }

    // Build
    const buildCmd = project.packageManager === 'pnpm' ? 'pnpm run build' : 'npm run build';
    await execPromise(buildCmd, project.name);

    stats.buildSuccess++;
    log(`  ✓ Build successful`, 'green');
    return { success: true };
  } catch (error) {
    stats.buildFailed++;
    log(`  ✗ Build failed`, 'red');
    return { success: false, error: error.stderr || error.error?.message };
  }
}

async function findBuildOutput(project) {
  const locations = [
    path.join(project.name, 'dist', 'index.html'),
    path.join(project.name, 'build', 'index.html'),
    path.join(project.name, 'client', 'dist', 'index.html'),
    path.join(project.name, 'frontend', 'dist', 'index.html'),
  ];

  for (const htmlPath of locations) {
    try {
      await fs.access(htmlPath);
      return { success: true, path: htmlPath };
    } catch {
      continue;
    }
  }

  return { success: false };
}

async function fixPostBuildIssues(project, htmlPath) {
  log(`  Checking for post-build issues...`, 'cyan');
  let fixed = 0;

  try {
    let content = await fs.readFile(htmlPath, 'utf-8');
    let modified = false;

    // Fix 1: Replace %PUBLIC_URL% placeholder
    if (content.includes('%PUBLIC_URL%')) {
      content = content.replace(/%PUBLIC_URL%/g, '.');
      modified = true;
      fixed++;
      log(`    Fixed: Replaced %PUBLIC_URL% with .`, 'green');
    }

    // Fix 2: Replace %REACT_APP_ placeholders
    if (content.match(/%REACT_APP_[^%]+%/)) {
      content = content.replace(/%REACT_APP_[^%]+%/g, '');
      modified = true;
      fixed++;
      log(`    Fixed: Removed %REACT_APP_% placeholders`, 'green');
    }

    // Fix 3: Ensure base tag exists
    if (!content.includes('<base')) {
      content = content.replace('<head>', '<head>\n  <base href="/">');
      modified = true;
      fixed++;
      log(`    Fixed: Added base tag`, 'green');
    }

    // Fix 4: Convert absolute asset paths to relative if needed
    if (content.includes('src="/assets') && !content.includes('http')) {
      content = content.replace(/src="\/assets/g, 'src="./assets');
      content = content.replace(/href="\/assets/g, 'href="./assets');
      modified = true;
      fixed++;
      log(`    Fixed: Converted asset paths to relative`, 'green');
    }

    if (modified) {
      await fs.writeFile(htmlPath, content);
      stats.fixed += fixed;
    } else {
      log(`    No issues found`, 'dim');
    }

    return { success: true, fixed };
  } catch (error) {
    log(`    Error fixing: ${error.message}`, 'red');
    return { success: false };
  }
}

async function verifyDisplay(project, htmlPath, browser) {
  log(`  Verifying display...`, 'cyan');

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

    // Check for actual content
    const bodyText = await page.textContent('body');
    const textLength = bodyText ? bodyText.trim().length : 0;
    const divCount = await page.$$eval('div, section, main, article', els => els.length);
    const hasContent = textLength > 100 || divCount > 5;

    await page.close();

    if (hasContent) {
      stats.displaySuccess++;
      log(`  ✓ Display verified (${textLength} chars, ${divCount} elements)`, 'green');
      return { success: true };
    } else {
      stats.displayFailed++;
      log(`  ✗ Blank page (${textLength} chars, ${divCount} elements)`, 'red');
      return { success: false, reason: 'blank_page' };
    }
  } catch (error) {
    stats.displayFailed++;
    log(`  ✗ Display verification failed: ${error.message}`, 'red');
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
    await page.close();

    if (fileStats.size > CONFIG.minScreenshotSize) {
      stats.screenshotSuccess++;
      log(`  ✓ Screenshot saved (${Math.round(fileStats.size / 1024)}KB)`, 'green');
      return { success: true, size: fileStats.size };
    } else {
      stats.screenshotFailed++;
      log(`  ✗ Screenshot too small (${Math.round(fileStats.size / 1024)}KB)`, 'yellow');
      return { success: false, reason: 'too_small', size: fileStats.size };
    }
  } catch (error) {
    stats.screenshotFailed++;
    log(`  ✗ Screenshot failed: ${error.message}`, 'red');
    await page.close();
    return { success: false, reason: error.message };
  }
}

async function processProject(project, browser) {
  stats.total++;
  log(`\n${'='.repeat(80)}`, 'cyan');
  log(`[${stats.total}] ${project.name}`, 'bold');
  log(`${'='.repeat(80)}`, 'cyan');

  const result = {
    name: project.name,
    buildSuccess: false,
    displaySuccess: false,
    screenshotSuccess: false,
    fixed: 0,
    issues: []
  };

  // Fix pre-build issues
  const preFixCount = await fixPreBuildIssues(project);
  result.fixed += preFixCount;

  // Build
  const buildResult = await buildProject(project);
  if (!buildResult.success) {
    result.issues.push('build_failed');
    result.error = buildResult.error;
    stats.results.push(result);
    return result;
  }
  result.buildSuccess = true;

  // Find build output
  const htmlResult = await findBuildOutput(project);
  if (!htmlResult.success) {
    result.issues.push('no_index_html');
    stats.results.push(result);
    return result;
  }

  // Fix post-build issues
  const postFixResult = await fixPostBuildIssues(project, htmlResult.path);
  result.fixed += postFixResult.fixed || 0;

  // Verify display
  const displayResult = await verifyDisplay(project, htmlResult.path, browser);
  if (displayResult.success) {
    result.displaySuccess = true;
  } else {
    result.issues.push(displayResult.reason || 'display_failed');
  }

  // Capture screenshot
  const screenshotResult = await captureScreenshot(project, htmlResult.path, browser);
  if (screenshotResult.success) {
    result.screenshotSuccess = true;
    result.screenshotSize = screenshotResult.size;
  } else {
    result.issues.push(screenshotResult.reason || 'screenshot_failed');
    result.screenshotSize = screenshotResult.size;
  }

  stats.results.push(result);
  return result;
}

async function main() {
  log(`\n${'='.repeat(80)}`, 'cyan');
  log(`Fix, Build, and Verify ALL Applications`, 'bold');
  log(`${'='.repeat(80)}`, 'cyan');
  log(`Started: ${new Date().toLocaleString()}\n`, 'dim');

  const projects = await findProjects();
  log(`Found ${projects.length} projects to process\n`, 'green');

  const browser = await chromium.launch({ headless: true });

  for (const project of projects) {
    await processProject(project, browser);
  }

  await browser.close();

  // Generate report
  log(`\n\n${'='.repeat(80)}`, 'cyan');
  log(`FINAL REPORT`, 'bold');
  log(`${'='.repeat(80)}`, 'cyan');
  log(`\nStatistics:`, 'yellow');
  log(`  Total projects:           ${stats.total}`);
  log(`  Build successful:         ${stats.buildSuccess} (${((stats.buildSuccess/stats.total)*100).toFixed(1)}%)`, 'green');
  log(`  Build failed:             ${stats.buildFailed}`, stats.buildFailed > 0 ? 'red' : 'green');
  log(`  Display successful:       ${stats.displaySuccess} (${((stats.displaySuccess/stats.total)*100).toFixed(1)}%)`, 'green');
  log(`  Display failed:           ${stats.displayFailed}`, stats.displayFailed > 0 ? 'red' : 'green');
  log(`  Screenshots captured:     ${stats.screenshotSuccess} (${((stats.screenshotSuccess/stats.total)*100).toFixed(1)}%)`, 'green');
  log(`  Screenshot failures:      ${stats.screenshotFailed}`, stats.screenshotFailed > 0 ? 'yellow' : 'green');
  log(`  Issues auto-fixed:        ${stats.fixed}`, stats.fixed > 0 ? 'green' : 'dim');

  const duration = Math.round((Date.now() - stats.startTime) / 1000);
  log(`\nDuration: ${Math.floor(duration / 60)}m ${duration % 60}s`, 'dim');

  // List failures
  const failures = stats.results.filter(r => r.issues.length > 0 || !r.buildSuccess);
  if (failures.length > 0) {
    log(`\n\nIssues Found (${failures.length}):`, 'red');
    failures.forEach((f, i) => {
      const status = [
        !f.buildSuccess && 'BUILD_FAILED',
        !f.displaySuccess && 'DISPLAY_FAILED',
        !f.screenshotSuccess && 'SCREENSHOT_SMALL',
        ...f.issues
      ].filter(Boolean).join(', ');
      log(`  ${i + 1}. ${f.name} - ${status}`, f.buildSuccess ? 'yellow' : 'red');
    });
  }

  // Save detailed report
  const reportPath = 'FIX-BUILD-VERIFY-REPORT.md';
  const report = generateReport();
  await fs.writeFile(reportPath, report);
  log(`\n✓ Detailed report saved to ${reportPath}`, 'green');

  process.exit(failures.length > 0 ? 1 : 0);
}

function generateReport() {
  const successful = stats.results.filter(r => r.buildSuccess && r.displaySuccess && r.screenshotSuccess);
  const needsAttention = stats.results.filter(r => !r.buildSuccess || !r.displaySuccess || !r.screenshotSuccess);

  return `# Fix, Build, and Verify Report

**Generated:** ${new Date().toLocaleString()}
**Duration:** ${Math.floor((Date.now() - stats.startTime) / 60000)}m ${Math.floor(((Date.now() - stats.startTime) % 60000) / 1000)}s

## Summary

| Metric | Count | Percentage |
|--------|-------|------------|
| Total Projects | ${stats.total} | 100% |
| ✅ Build Successful | ${stats.buildSuccess} | ${((stats.buildSuccess/stats.total)*100).toFixed(1)}% |
| ❌ Build Failed | ${stats.buildFailed} | ${((stats.buildFailed/stats.total)*100).toFixed(1)}% |
| ✅ Display Successful | ${stats.displaySuccess} | ${((stats.displaySuccess/stats.total)*100).toFixed(1)}% |
| ❌ Display Failed | ${stats.displayFailed} | ${((stats.displayFailed/stats.total)*100).toFixed(1)}% |
| ✅ Screenshots Captured | ${stats.screenshotSuccess} | ${((stats.screenshotSuccess/stats.total)*100).toFixed(1)}% |
| ⚠️ Screenshots Small/Failed | ${stats.screenshotFailed} | ${((stats.screenshotFailed/stats.total)*100).toFixed(1)}% |
| 🔧 Issues Auto-Fixed | ${stats.fixed} | - |

## Fully Successful Projects (${successful.length})

${successful.map((r, i) => `${i + 1}. ✅ **${r.name}**${r.fixed > 0 ? ` (${r.fixed} issues auto-fixed)` : ''}`).join('\n')}

## Projects Needing Attention (${needsAttention.length})

${needsAttention.map((r, i) => {
  const issues = [];
  if (!r.buildSuccess) issues.push('❌ Build failed');
  if (!r.displaySuccess) issues.push('⚠️ Display issues');
  if (!r.screenshotSuccess) issues.push('📸 Screenshot small/failed');
  if (r.fixed > 0) issues.push(`🔧 ${r.fixed} issues auto-fixed`);

  return `${i + 1}. **${r.name}**\n   ${issues.join(' | ')}${r.error ? `\n   Error: ${r.error.substring(0, 100)}...` : ''}`;
}).join('\n\n')}

## Next Steps

${stats.buildFailed > 0 ? `### Build Failures (${stats.buildFailed})
Review build logs for compilation errors, missing dependencies, or configuration issues.
` : ''}

${stats.displayFailed > 0 ? `### Display Issues (${stats.displayFailed})
Check for runtime JavaScript errors, missing environment variables, or incorrect asset paths.
` : ''}

${stats.screenshotFailed > 0 ? `### Screenshot Issues (${stats.screenshotFailed})
Some screenshots are very small (<15KB), indicating mostly blank pages. Investigate CSS loading and React hydration.
` : ''}

${stats.total === stats.buildSuccess && stats.total === stats.displaySuccess && stats.total === stats.screenshotSuccess ? '✅ **All projects built, verified, and captured successfully!**' : ''}

---
*Generated by fix-and-build-all.js*
`;
}

main().catch(error => {
  log(`\n\nFatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
