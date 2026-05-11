#!/usr/bin/env node
/**
 * Simple Filter Error Fix
 */

const fs = require('fs').promises;
const fss = require('fs');
const path = require('path');

const stats = {
  filesScanned: 0,
  filesFixed: 0,
  replacements: 0,
  errors: 0,
  fixedApps: []
};

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function findProjects() {
  const dirs = await fs.readdir('.', { withFileTypes: true });
  const projects = [];

  const skipDirs = ['node_modules', 'dist', 'build', '.git', 'docker', 'catalogue',
    'scripts', 'tests', 'templates', 'reports', 'Documentation'];

  for (const dir of dirs) {
    if (!dir.isDirectory() || skipDirs.includes(dir.name)) continue;

    try {
      const storePath = path.join(dir.name, 'src', 'store.ts');
      if (fss.existsSync(storePath)) {
        projects.push({ name: dir.name, storePath });
      }
    } catch (err) {
      // Skip
    }
  }

  return projects;
}

async function fixFile(filePath) {
  stats.filesScanned++;

  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let modified = false;
    let replacementCount = 0;

    // Pattern: set({ entities: response.data (not already fixed)
    if (content.includes('entities: response.data') && !content.includes('Array.isArray(response.data)')) {
      const originalContent = content;

      // Replace the pattern
      content = content.replace(
        /(\s+)entities:\s*response\.data(?!.*\?)/g,
        '$1entities: Array.isArray(response.data) ? response.data : []'
      );

      if (content !== originalContent) {
        await fs.writeFile(filePath, content, 'utf-8');
        modified = true;

        // Count replacements
        const matches = originalContent.match(/entities:\s*response\.data/g);
        replacementCount = matches ? matches.length : 1;

        stats.filesFixed++;
        stats.replacements += replacementCount;

        return { fixed: true, count: replacementCount };
      }
    }

    return { fixed: false, count: 0 };

  } catch (error) {
    stats.errors++;
    log(`  ✗ Error: ${filePath} - ${error.message}`, 'red');
    return { fixed: false, count: 0, error: error.message };
  }
}

async function main() {
  log('\n' + '='.repeat(80), 'cyan');
  log('Fix Filter Error - Simple Version', 'bold');
  log('='.repeat(80), 'cyan');
  log('Started: ' + new Date().toLocaleString() + '\n', 'dim');

  log('Finding projects with store.ts files...', 'cyan');
  const projects = await findProjects();
  log(`Found ${projects.length} projects\n`, 'green');

  for (const project of projects) {
    const result = await fixFile(project.storePath);

    if (result.fixed) {
      stats.fixedApps.push(project.name);
      log(`  ✓ ${project.name} (${result.count} fix${result.count > 1 ? 'es' : ''})`, 'green');
    } else if (result.error) {
      log(`  ✗ ${project.name} - ${result.error}`, 'red');
    } else {
      log(`  - ${project.name} (no issues or already fixed)`, 'dim');
    }
  }

  // Report
  log('\n' + '='.repeat(80), 'cyan');
  log('REPAIR COMPLETE', 'bold');
  log('='.repeat(80), 'cyan');

  log(`\nStatistics:`, 'yellow');
  log(`  Files scanned:              ${stats.filesScanned}`);
  log(`  ✅ Files fixed:             ${stats.filesFixed}`, 'green');
  log(`  🔧 Total replacements:      ${stats.replacements}`, 'green');
  log(`  ❌ Errors:                  ${stats.errors}`, stats.errors > 0 ? 'red' : 'green');

  if (stats.fixedApps.length > 0) {
    log(`\n✅ Fixed Apps (${stats.fixedApps.length}):`, 'green');
    stats.fixedApps.slice(0, 30).forEach((app, i) => {
      log(`  ${i + 1}. ${app}`, 'green');
    });
    if (stats.fixedApps.length > 30) {
      log(`  ... and ${stats.fixedApps.length - 30} more`, 'dim');
    }
  }

  log(`\n✓ All fixes applied!`, 'green');
  log(`\nNext step: Run rebuild-and-capture.js to verify fixes\n`, 'yellow');

  process.exit(0);
}

main().catch(error => {
  log(`\n\nFatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
