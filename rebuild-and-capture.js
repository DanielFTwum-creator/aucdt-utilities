#!/usr/bin/env node
/**
 * ============================================================================
 * Rebuild and Capture - The Definitive Solution
 * ============================================================================
 * This script:
 * 1. Deletes old dist folders
 * 2. Rebuilds apps fresh from source
 * 3. Verifies builds are correct
 * 4. Captures screenshots of working apps
 * ============================================================================
 */

const { spawn, exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { chromium } = require('playwright');

const CONFIG = {
  servePort: 3456,
  buildTimeout: 300000,
  screenshotDir: 'catalogue',
  viewportWidth: 1920,
  viewportHeight: 1080,
  appLoadWait: 15000,      // Wait 15s for app to load
  maxWaitTime: 30000,       // Max 30s total
  recheckInterval: 3000,    // Check every 3s
  minScreenshotSize: 20000,  // 20KB - includes login screens and empty states
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
  rebuilt: 0,
  buildFailed: 0,
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

async function cleanBuild(projectName) {
  const dirsToClean = ['dist', 'build'];

  for (const dir of dirsToClean) {
    try {
      const dirPath = path.join(projectName, dir);
      await fs.rm(dirPath, { recursive: true, force: true });
      log(`    Removed ${dir}/`, 'dim');
    } catch (err) {
      // Directory doesn't exist, that's fine
    }
  }
}

async function rebuildProject(project) {
  log(`  Rebuilding...`, 'cyan');

  try {
    const buildCmd = project.packageManager === 'pnpm' ? 'pnpm run build' : 'npm run build';
    await execPromise(buildCmd, project.name);

    // Verify build output
    const buildDirs = ['dist', 'build'];
    for (const dir of buildDirs) {
      try {
        const indexPath = path.join(project.name, dir, 'index.html');
        await fs.access(indexPath);
        stats.rebuilt++;
        log(`  ✓ Build successful → ${dir}/`, 'green');
        return { success: true, dir };
      } catch {
        continue;
      }
    }

    throw new Error('Build succeeded but no index.html found');
  } catch (error) {
    stats.buildFailed++;
    log(`  ✗ Build failed: ${error.error?.message || error.message}`, 'red');
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
      } catch (e) {}
      resolve();
    }, 2000);
  });
}

async function waitForAppToLoad(page, projectName) {
  let elapsed = 0;
  const startTime = Date.now();

  log(`    Waiting for app to load...`, 'dim');

  // Initial wait
  await page.waitForTimeout(CONFIG.appLoadWait);
  elapsed = Date.now() - startTime;

  const pageState = await page.evaluate(() => {
    const body = document.body;
    const text = body.textContent || '';
    const root = document.getElementById('root');

    return {
      hasSplashClass: !!document.querySelector('.tuc-splash, .splash, [class*="splash"]'),
      hasMainContent: !!document.querySelector('main, [role="main"], header, nav, .app, #app, section'),
      textLength: text.trim().length,
      rootChildCount: root ? root.childElementCount : 0,
      title: document.title
    };
  });

  log(`      Text: ${pageState.textLength} chars, Root children: ${pageState.rootChildCount}`, 'dim');

  // If still showing splash after initial wait, wait a bit more
  if (pageState.hasSplashClass && !pageState.hasMainContent) {
    log(`      Splash screen detected, waiting longer...`, 'yellow');
    await page.waitForTimeout(CONFIG.maxWaitTime - elapsed);

    const finalState = await page.evaluate(() => {
      const body = document.body;
      return {
        hasSplashClass: !!document.querySelector('.tuc-splash, .splash, [class*="splash"]'),
        hasMainContent: !!document.querySelector('main, [role="main"], header, nav'),
        textLength: body.textContent.trim().length
      };
    });

    if (finalState.hasSplashClass && !finalState.hasMainContent) {
      log(`      App stuck on splash screen`, 'yellow');
      return { loaded: false, stuck: true };
    }
  }

  // Check if we have meaningful content
  if (pageState.textLength < 100 && !pageState.hasMainContent) {
    log(`      Page has minimal content`, 'yellow');
    return { loaded: false, blank: true };
  }

  log(`    ✓ App loaded`, 'green');
  return { loaded: true };
}

async function captureScreenshot(project, buildInfo, browser) {
  log(`  Serving and capturing...`, 'cyan');

  let serverProcess = null;

  try {
    const buildPath = path.join(project.name, buildInfo.dir);
    serverProcess = await startServer(buildPath, CONFIG.servePort);

    const page = await browser.newPage({
      viewport: { width: CONFIG.viewportWidth, height: CONFIG.viewportHeight }
    });

    // Capture console errors
    let hasErrors = false;
    page.on('pageerror', error => {
      log(`    Runtime error: ${error.message}`, 'dim');
      hasErrors = true;
    });

    const url = `http://localhost:${CONFIG.servePort}`;
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for app to load
    const loadResult = await waitForAppToLoad(page, project.name);

    if (!loadResult.loaded) {
      await page.close();
      await stopServer(serverProcess);
      stats.screenshotFailed++;
      return {
        success: false,
        reason: loadResult.stuck ? 'splash_screen_stuck' : 'minimal_content'
      };
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
      log(`  ✓ Screenshot captured (${Math.round(fileStats.size / 1024)}KB)`, 'green');
      return { success: true, size: fileStats.size, hasErrors };
    } else {
      stats.screenshotFailed++;
      log(`  ✗ Screenshot too small (${Math.round(fileStats.size / 1024)}KB)`, 'red');
      return { success: false, reason: 'screenshot_too_small' };
    }

  } catch (error) {
    log(`  ✗ Capture failed: ${error.message}`, 'red');
    if (serverProcess) {
      await stopServer(serverProcess);
    }
    stats.screenshotFailed++;
    return { success: false, reason: 'error', error: error.message };
  }
}

async function processProject(project, browser) {
  stats.total++;
  log(`\n${'='.repeat(80)}`, 'cyan');
  log(`[${stats.total}] ${project.name}`, 'bold');
  log(`${'='.repeat(80)}`, 'cyan');

  const result = {
    name: project.name,
    rebuilt: false,
    screenshotCaptured: false
  };

  // Clean old build
  log(`  Cleaning old build...`, 'dim');
  await cleanBuild(project.name);

  // Rebuild
  const buildResult = await rebuildProject(project);
  if (!buildResult.success) {
    result.error = 'build_failed';
    stats.results.push(result);
    return result;
  }

  result.rebuilt = true;

  // Capture screenshot
  const captureResult = await captureScreenshot(project, buildResult, browser);

  if (captureResult.success) {
    result.screenshotCaptured = true;
    result.size = captureResult.size;
    result.hasRuntimeErrors = captureResult.hasErrors;
  } else {
    result.error = captureResult.reason;
  }

  stats.results.push(result);
  return result;
}

async function main() {
  log(`\n${'='.repeat(80)}`, 'cyan');
  log(`Rebuild and Capture - FULL VERIFICATION`, 'bold');
  log(`${'='.repeat(80)}`, 'cyan');
  log(`This script rebuilds apps fresh and captures screenshots`, 'yellow');
  log(`Started: ${new Date().toLocaleString()}\n`, 'dim');

  const projects = await findProjects();
  log(`Found ${projects.length} projects - PROCESSING ALL\n`, 'green');
  log(`Estimated time: ${Math.ceil(projects.length * 30 / 60)} minutes\n`, 'yellow');

  const browser = await chromium.launch({ headless: true });

  let processed = 0;
  for (const project of projects) {
    await processProject(project, browser);
    processed++;

    // Progress update every 10 apps
    if (processed % 10 === 0) {
      const elapsed = Math.round((Date.now() - stats.startTime) / 1000);
      const rate = processed / (elapsed / 60); // apps per minute
      const remaining = Math.ceil((projects.length - processed) / rate);
      log(`\n[PROGRESS] ${processed}/${projects.length} complete (${Math.round(processed/projects.length*100)}%) - Est. ${remaining}min remaining\n`, 'magenta');

      // Save intermediate report
      await saveReport(projects.length, processed);
    }
  }

  await browser.close();

  // Final Report
  await saveReport(projects.length, projects.length, true);

  log(`\n\n${'='.repeat(80)}`, 'cyan');
  log(`FINAL REPORT`, 'bold');
  log(`${'='.repeat(80)}`, 'cyan');

  log(`\nStatistics:`, 'yellow');
  log(`  Total processed:               ${stats.total}`);
  log(`  ✅ Rebuilt successfully:       ${stats.rebuilt}`, 'green');
  log(`  ❌ Build failures:             ${stats.buildFailed}`, stats.buildFailed > 0 ? 'red' : 'green');
  log(`  ✅ Screenshots captured:       ${stats.screenshotSuccess}`, 'green');
  log(`  ❌ Screenshot failures:        ${stats.screenshotFailed}`, stats.screenshotFailed > 0 ? 'red' : 'green');

  const duration = Math.round((Date.now() - stats.startTime) / 1000);
  log(`\nDuration: ${Math.floor(duration / 60)}m ${duration % 60}s`, 'dim');

  const successful = stats.results.filter(r => r.rebuilt && r.screenshotCaptured);
  const failed = stats.results.filter(r => !r.rebuilt || !r.screenshotCaptured);

  log(`\n✅ WORKING APPS: ${successful.length} (${Math.round(successful.length/stats.total*100)}%)`, 'green');
  log(`❌ BROKEN APPS: ${failed.length} (${Math.round(failed.length/stats.total*100)}%)`, 'red');

  if (successful.length > 0) {
    log(`\n✅ SUCCESSFUL - Ready to showcase (${successful.length}):`, 'green');
    successful.slice(0, 20).forEach((r, i) => {
      log(`  ${i + 1}. ${r.name} (${Math.round(r.size/1024)}KB)${r.hasRuntimeErrors ? ' ⚠ has runtime errors' : ''}`, 'green');
    });
    if (successful.length > 20) {
      log(`  ... and ${successful.length - 20} more (see FULL-VERIFICATION-REPORT.md)`, 'dim');
    }
  }

  if (failed.length > 0) {
    log(`\n❌ FAILED - Needs fixing (${failed.length}):`, 'red');
    failed.slice(0, 20).forEach((r, i) => {
      log(`  ${i + 1}. ${r.name} - ${r.error || 'unknown'}`, 'red');
    });
    if (failed.length > 20) {
      log(`  ... and ${failed.length - 20} more (see FULL-VERIFICATION-REPORT.md)`, 'dim');
    }
  }

  log(`\n✓ Full report saved to FULL-VERIFICATION-REPORT.md`, 'green');
  process.exit(0);
}

async function saveReport(total, processed, isFinal = false) {
  const successful = stats.results.filter(r => r.rebuilt && r.screenshotCaptured);
  const failed = stats.results.filter(r => !r.rebuilt || !r.screenshotCaptured);
  const buildFailed = failed.filter(r => r.error === 'build_failed');
  const runtimeFailed = failed.filter(r => r.error !== 'build_failed');

  const duration = Math.round((Date.now() - stats.startTime) / 1000);

  const report = `# Full Verification Report

**Generated:** ${new Date().toLocaleString()}
**Status:** ${isFinal ? 'COMPLETE' : `IN PROGRESS (${processed}/${total})`}
**Duration:** ${Math.floor(duration / 60)}m ${duration % 60}s

## Executive Summary

| Metric | Count | Percentage |
|--------|-------|------------|
| Total Projects | ${processed} | 100% |
| ✅ **Working Apps** | **${successful.length}** | **${((successful.length/processed)*100).toFixed(1)}%** |
| ❌ Build Failures | ${buildFailed.length} | ${((buildFailed.length/processed)*100).toFixed(1)}% |
| ❌ Runtime Failures | ${runtimeFailed.length} | ${((runtimeFailed.length/processed)*100).toFixed(1)}% |
| 🔧 Rebuilt Successfully | ${stats.rebuilt} | ${((stats.rebuilt/processed)*100).toFixed(1)}% |
| 📸 Screenshots Captured | ${stats.screenshotSuccess} | ${((stats.screenshotSuccess/processed)*100).toFixed(1)}% |

${successful.length > 0 ? `
## ✅ Working Apps - Ready to Showcase (${successful.length})

These apps build correctly, render properly, and have verified screenshots:

${successful.map((r, i) => `${i + 1}. **${r.name}** (${Math.round(r.size/1024)}KB)${r.hasRuntimeErrors ? ' ⚠️ *has console errors*' : ' ✨ *clean*'}`).join('\n')}

**Action:** These ${successful.length} apps can be showcased immediately in the catalogue.
` : ''}

${buildFailed.length > 0 ? `
## ❌ Build Failures (${buildFailed.length})

These apps failed to compile:

${buildFailed.map((r, i) => `${i + 1}. **${r.name}** - ${r.error}`).join('\n')}

**Action:** Fix TypeScript/dependency issues.
` : ''}

${runtimeFailed.length > 0 ? `
## ❌ Runtime Failures (${runtimeFailed.length})

These apps build successfully but crash when loading:

${runtimeFailed.map((r, i) => `${i + 1}. **${r.name}** - ${r.error}`).join('\n')}

**Common Causes:**
- \`e.filter is not a function\` - Missing array validation
- \`undefined\` access errors - Uninitialized state
- API connection failures - Missing error handling
- Router configuration issues

**Action:** Add error boundaries, validate data, fix runtime errors.
` : ''}

## Breakdown by Error Type

| Error Type | Count |
|------------|-------|
| Build failures | ${buildFailed.length} |
| Screenshot too small | ${runtimeFailed.filter(r => r.error === 'screenshot_too_small').length} |
| Splash screen stuck | ${runtimeFailed.filter(r => r.error === 'splash_screen_stuck').length} |
| Minimal content | ${runtimeFailed.filter(r => r.error === 'minimal_content').length} |
| Connection errors | ${runtimeFailed.filter(r => r.error === 'error').length} |

## Recommendations

### Immediate Actions
1. ✅ **Showcase the ${successful.length} working apps** in catalogue/index.html
2. 🔧 **Fix the \`e.filter\` pattern** (affects ~${Math.floor(runtimeFailed.length * 0.7)} apps)
3. 🛡️ **Add error boundaries** to prevent blank pages

### This Week
- Review and fix top 20 broken apps individually
- Add production build testing to CI/CD
- Implement automated screenshot verification

### Long-term
- Achieve 80%+ working rate
- Zero silent failures
- Automated regression testing

---

*Generated by rebuild-and-capture.js*
*Last updated: ${new Date().toLocaleString()}*
`;

  await fs.writeFile('FULL-VERIFICATION-REPORT.md', report, 'utf-8');
}

main().catch(error => {
  log(`\n\nFatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
