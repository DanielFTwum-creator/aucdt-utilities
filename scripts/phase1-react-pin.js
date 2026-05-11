#!/usr/bin/env node
/**
 * Phase 1a — React 19.2.4 Version Pin
 * Techbridge University College / TUC
 *
 * Scans all package.json files in the monorepo and pins:
 *   react, react-dom          → "19.2.4"
 *   @types/react              → "^19.1.8"
 *   @types/react-dom          → "^19.1.5"
 *
 * Usage:
 *   node scripts/phase1-react-pin.js            # dry run
 *   node scripts/phase1-react-pin.js --apply    # write changes
 */

const fs   = require('fs');
const path = require('path');

const APPLY   = process.argv.includes('--apply');
const ROOT    = path.resolve(__dirname, '..');

// Target exact versions
const PIN = {
  'react':            '19.2.4',
  'react-dom':        '19.2.4',
  '@types/react':     '^19.1.8',
  '@types/react-dom': '^19.1.5',
};

// Dirs to skip entirely
const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.pnpm-store',
  'aucdt-portal-tests', 'backend', 'thumbnail-generator',
]);

// ── helpers ──────────────────────────────────────────────────────────────────

function findPackageJsons(dir, depth = 0) {
  if (depth > 3) return [];
  const results = [];
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch { return []; }

  for (const e of entries) {
    if (SKIP_DIRS.has(e.name)) continue;
    if (e.isDirectory()) {
      results.push(...findPackageJsons(path.join(dir, e.name), depth + 1));
    } else if (e.name === 'package.json') {
      results.push(path.join(dir, e.name));
    }
  }
  return results;
}

function pinPackage(pkgPath) {
  let raw;
  try { raw = fs.readFileSync(pkgPath, 'utf8'); }
  catch { return null; }

  let pkg;
  try { pkg = JSON.parse(raw); }
  catch { return null; }

  const sections = ['dependencies', 'devDependencies', 'peerDependencies'];
  const changes  = [];

  for (const section of sections) {
    if (!pkg[section]) continue;
    for (const [pkg_name, target] of Object.entries(PIN)) {
      const current = pkg[section][pkg_name];
      if (current === undefined) continue;
      if (current === target) continue;
      changes.push({ section, pkg_name, from: current, to: target });
      pkg[section][pkg_name] = target;
    }
  }

  if (changes.length === 0) return null;

  if (APPLY) {
    // Preserve original indentation
    const indent = raw.match(/^(\s+)"/m)?.[1] || '  ';
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, indent.length === 4 ? 4 : 2) + '\n');
  }

  return changes;
}

// ── main ─────────────────────────────────────────────────────────────────────

const pkgFiles = findPackageJsons(ROOT);
console.log(`\nScanning ${pkgFiles.length} package.json files...\n`);

const results  = [];
let totalChanges = 0;

for (const pkgPath of pkgFiles) {
  const changes = pinPackage(pkgPath);
  if (!changes) continue;
  const rel = path.relative(ROOT, pkgPath);
  results.push({ rel, changes });
  totalChanges += changes.length;
}

// ── report ───────────────────────────────────────────────────────────────────

if (results.length === 0) {
  console.log('All projects already compliant. Nothing to do.');
} else {
  console.log(`${ APPLY ? 'UPDATED' : 'DRY RUN —' } ${results.length} package.json files, ${totalChanges} version pins:\n`);
  for (const { rel, changes } of results) {
    console.log(`  ${rel}`);
    for (const { section, pkg_name, from, to } of changes) {
      console.log(`    [${section}] ${pkg_name}: ${from} → ${to}`);
    }
  }
}

console.log(`\n${ APPLY ? 'Done.' : 'Re-run with --apply to write changes.' }`);
console.log(`Projects to update: ${results.length}`);
console.log(`Total pin operations: ${totalChanges}`);
