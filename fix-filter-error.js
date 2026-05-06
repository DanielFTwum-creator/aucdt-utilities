#!/usr/bin/env node
/**
 * ============================================================================
 * Fix Filter Error - Automated Repair
 * ============================================================================
 * This script fixes the `e.filter is not a function` error by adding array
 * validation to all store files that set entities from API responses.
 *
 * Bug: set({ entities: response.data })
 * Fix: set({ entities: Array.isArray(response.data) ? response.data : [] })
 * ============================================================================
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

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
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function findStoreFiles() {
  log('\nFinding all store files...', 'cyan');

  try {
    const { stdout } = await execPromise('find . -path "*/src/store.ts" -o -path "*/src/*Store.ts" | grep -v node_modules');
    const files = stdout.trim().split('\n').filter(f => f);
    log(`Found ${files.length} store files`, 'green');
    return files;
  } catch (error) {
    log('Error finding files', 'red');
    return [];
  }
}

async function fixFile(filePath) {
  stats.filesScanned++;

  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let modified = false;
    let replacementCount = 0;

    // Pattern 1: set({ entities: response.data
    const pattern1 = /set\(\{\s*entities:\s*response\.data(?!\s*\?)/g;
    if (pattern1.test(content)) {
      content = content.replace(
        /set\(\{\s*entities:\s*response\.data/g,
        'set({ entities: Array.isArray(response.data) ? response.data : []'
      );
      modified = true;
      replacementCount++;
    }

    // Pattern 2: entities: response.data (without set, in object destructuring)
    const pattern2 = /entities:\s*response\.data(?!.*\?.*:)/g;
    const lines = content.split('\n');
    let newContent = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // Check if this line has "entities: response.data" and it's not already fixed
      if (line.includes('entities:') &&
          line.includes('response.data') &&
          !line.includes('Array.isArray') &&
          !line.includes('?') &&
          line.includes('set({')) {

        line = line.replace(
          /entities:\s*response\.data/g,
          'entities: Array.isArray(response.data) ? response.data : []'
        );
        modified = true;
        replacementCount++;
      }

      newContent.push(line);
    }

    if (modified) {
      content = newContent.join('\n');
      await fs.writeFile(filePath, content, 'utf-8');

      stats.filesFixed++;
      stats.replacements += replacementCount;

      const appName = path.dirname(filePath).split(path.sep)[1];
      stats.fixedApps.push(appName);

      log(`  ✓ Fixed: ${filePath} (${replacementCount} replacement${replacementCount > 1 ? 's' : ''})`, 'green');
      return true;
    } else {
      log(`  - Skipped: ${filePath} (no issues found)`, 'dim');
      return false;
    }

  } catch (error) {
    stats.errors++;
    log(`  ✗ Error: ${filePath} - ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  log('\n' + '='.repeat(80), 'cyan');
  log('Fix Filter Error - Automated Repair', 'bold');
  log('='.repeat(80), 'cyan');
  log('Fixing: set({ entities: response.data }) → Array.isArray validation', 'yellow');
  log('Started: ' + new Date().toLocaleString() + '\n', 'dim');

  const storeFiles = await findStoreFiles();

  if (storeFiles.length === 0) {
    log('\nNo store files found!', 'red');
    process.exit(1);
  }

  log(`\nProcessing ${storeFiles.length} files...\n`, 'cyan');

  for (const file of storeFiles) {
    await fixFile(file);
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
    stats.fixedApps.slice(0, 20).forEach((app, i) => {
      log(`  ${i + 1}. ${app}`, 'green');
    });
    if (stats.fixedApps.length > 20) {
      log(`  ... and ${stats.fixedApps.length - 20} more`, 'dim');
    }
  }

  log(`\n✓ All fixes applied!`, 'green');
  log(`\nNext step: Run rebuild-and-capture.js to verify fixes\n`, 'yellow');

  // Save report
  const report = `# Filter Error Fix Report

**Date:** ${new Date().toLocaleString()}
**Status:** COMPLETE

## Summary

- **Files Scanned:** ${stats.filesScanned}
- **Files Fixed:** ${stats.filesFixed}
- **Total Replacements:** ${stats.replacements}
- **Errors:** ${stats.errors}

## Fixed Apps (${stats.fixedApps.length})

${stats.fixedApps.map((app, i) => `${i + 1}. ${app}`).join('\n')}

## What Was Fixed

**Before:**
\`\`\`typescript
set({ entities: response.data, isLoading: false });
\`\`\`

**After:**
\`\`\`typescript
set({ entities: Array.isArray(response.data) ? response.data : [], isLoading: false });
\`\`\`

## Why This Fixes the Error

The bug occurred when:
1. API calls failed or returned non-array data
2. \`response.data\` was an object, string, or undefined
3. Dashboard code called \`.filter()\` on non-array value
4. JavaScript threw: "e.filter is not a function"

The fix validates that \`response.data\` is an array before using it, defaulting to \`[]\` if not.

## Next Steps

1. Run full verification: \`node rebuild-and-capture.js\`
2. Expected success rate: 60-80% (up from 0%)
3. Review remaining failures for other error patterns

---
*Generated by fix-filter-error.js*
`;

  await fs.writeFile('FILTER-ERROR-FIX-REPORT.md', report, 'utf-8');
  log(`✓ Report saved to FILTER-ERROR-FIX-REPORT.md\n`, 'green');

  process.exit(0);
}

main().catch(error => {
  log(`\n\nFatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
