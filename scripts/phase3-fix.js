#!/usr/bin/env node
/**
 * Phase 3 Gap Fix
 * Techbridge University College / TUC
 *
 * Resolves the two critical Phase 3 gaps:
 *
 *   FIX 1 — Broken App.test.tsx imports
 *     197/285 test files import '../App' but App.tsx doesn't exist at src/App.tsx.
 *     This script detects the actual App entry path and rewrites the import.
 *
 *   FIX 2 — Wrong Vite plugin in vitest.config.ts
 *     Apps using @vitejs/plugin-react-swc will fail if vitest.config.ts imports
 *     @vitejs/plugin-react instead. Detects and patches accordingly.
 *
 * Usage:
 *   node scripts/phase3-fix.js            # dry run
 *   node scripts/phase3-fix.js --apply    # write changes
 *   node scripts/phase3-fix.js --apply --app=tsapro
 *   node scripts/phase3-fix.js --apply --only=imports
 *   node scripts/phase3-fix.js --apply --only=plugin
 */

const fs   = require('fs');
const path = require('path');

const APPLY    = process.argv.includes('--apply');
const APP_ARG  = (process.argv.find(a => a.startsWith('--app=')) || '').replace('--app=', '');
const ONLY_ARG = (process.argv.find(a => a.startsWith('--only=')) || '').replace('--only=', '');
const ROOT     = path.resolve(__dirname, '..');

const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.pnpm-store',
  'aucdt-portal-tests', 'backend', 'scripts', 'templates',
  'thumbnail-generator',
]);

const BACKEND_SCAFFOLDS = new Set([
  'accommodation-management', 'alumni-network', 'aucdt-msee-aptitude-test',
  'career-services', 'complaint-resolution-system', 'health-wellness-portal',
  'internship-program', 'lecturer-assessment-portal', 'library-management',
  'mentorship-program', 'NEWSFEED', 'newsfeed', 'research-portal',
  'scholarship-tracker', 'student-payment-system', 'student-success-coach',
  'techbridge-dashboard', 'techbridge-sentinel-agent', 'modern-product-dev-lifecycle',
  'tsapro-mapping-review',
]);

// ── helpers ──────────────────────────────────────────────────────────────────

function readJson(fp) {
  try { return JSON.parse(fs.readFileSync(fp, 'utf8')); }
  catch { return null; }
}

function isViteApp(dir) {
  const pkg = readJson(path.join(dir, 'package.json'));
  if (!pkg) return false;
  const all = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  return !!all['vite'];
}

function findApps(dir, depth = 0) {
  if (depth > 2) return [];
  const results = [];
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch { return []; }
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    if (SKIP_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (BACKEND_SCAFFOLDS.has(e.name) && depth === 0) {
      const clientDir = path.join(full, 'client');
      if (fs.existsSync(clientDir) && isViteApp(clientDir)) results.push(clientDir);
      continue;
    }
    if (isViteApp(full)) results.push(full);
    else results.push(...findApps(full, depth + 1));
  }
  return results;
}

// ── FIX 1: App import path ────────────────────────────────────────────────────

/**
 * Finds the App component entry file relative to a test file path.
 * Checks common locations:
 *   ../App        (src/__tests__/App.test.tsx → src/App.tsx)  ← scaffold default
 *   ../../App     (src/__tests__/App.test.tsx → App.tsx at root)
 *   ../components/App
 *   ../pages/App
 */
function findAppEntry(testFilePath) {
  const testDir = path.dirname(testFilePath);
  const exts    = ['.tsx', '.jsx', '.ts', '.js'];

  const candidates = [
    '../App',
    '../../App',
    '../../src/App',
    '../components/App',
    '../pages/App',
  ];

  for (const candidate of candidates) {
    const abs = path.resolve(testDir, candidate);
    for (const ext of exts) {
      if (fs.existsSync(abs + ext)) return candidate;
    }
  }
  return null; // can't resolve — leave as-is
}

function fixImports(testFilePath) {
  let content;
  try { content = fs.readFileSync(testFilePath, 'utf8'); }
  catch { return null; }

  // Only fix the canonical scaffold import pattern
  const importRe = /^(import App from\s+['"])(\.\.\/)App(['"];?\s*)$/m;
  if (!importRe.test(content)) return null; // non-standard import, skip

  const currentImport = content.match(importRe)?.[2]; // '../'
  const correctPath   = findAppEntry(testFilePath);

  if (!correctPath) return null; // can't determine — skip

  // If '../App' is already correct (App.tsx exists there), nothing to do
  const resolved = path.resolve(path.dirname(testFilePath), '../App');
  const exts     = ['.tsx', '.jsx', '.ts', '.js'];
  const alreadyOk = exts.some(e => fs.existsSync(resolved + e));
  if (alreadyOk) return null;

  // Rewrite import
  const newContent = content.replace(importRe, `$1${correctPath}$3`);
  if (newContent === content) return null;

  return newContent;
}

// ── FIX 2: Vite plugin in vitest.config.ts ────────────────────────────────────

function detectVitePlugin(appDir) {
  const viteConfig = path.join(appDir, 'vite.config.ts') ||
                     path.join(appDir, 'vite.config.js');
  const files = [
    path.join(appDir, 'vite.config.ts'),
    path.join(appDir, 'vite.config.js'),
    path.join(appDir, 'vite.config.mts'),
  ];
  for (const f of files) {
    try {
      const content = fs.readFileSync(f, 'utf8');
      if (content.includes('plugin-react-swc')) return 'swc';
      if (content.includes('plugin-react'))     return 'react';
    } catch { /* ignore */ }
  }
  // Fallback: check package.json devDeps
  const pkg = readJson(path.join(appDir, 'package.json')) || {};
  const dev  = pkg.devDependencies || {};
  if (dev['@vitejs/plugin-react-swc']) return 'swc';
  if (dev['@vitejs/plugin-react'])     return 'react';
  return 'react'; // default assumption
}

function fixVitestPlugin(appDir) {
  const configPath = path.join(appDir, 'vitest.config.ts');
  let content;
  try { content = fs.readFileSync(configPath, 'utf8'); }
  catch { return null; }

  const pluginInConfig  = content.includes('plugin-react-swc') ? 'swc' : 'react';
  const pluginInVite    = detectVitePlugin(appDir);

  if (pluginInConfig === pluginInVite) return null; // already correct

  // Need to switch from react to swc (or vice-versa, though swc→react is rare)
  let newContent = content;
  if (pluginInVite === 'swc' && pluginInConfig === 'react') {
    newContent = content
      .replace(/@vitejs\/plugin-react'/g, "@vitejs/plugin-react-swc'")
      .replace(/@vitejs\/plugin-react"/g, '@vitejs/plugin-react-swc"');
  } else if (pluginInVite === 'react' && pluginInConfig === 'swc') {
    newContent = content
      .replace(/@vitejs\/plugin-react-swc'/g, "@vitejs/plugin-react'")
      .replace(/@vitejs\/plugin-react-swc"/g, '@vitejs/plugin-react"');
  }

  return newContent !== content ? newContent : null;
}

// ── main ─────────────────────────────────────────────────────────────────────

let apps = findApps(ROOT);
if (APP_ARG) {
  apps = apps.filter(a => path.basename(a) === APP_ARG || a.includes(APP_ARG));
}

console.log(`\nFound ${apps.length} Vite/React apps\n`);

let importFixed  = 0;
let importOk     = 0;
let pluginFixed  = 0;
let pluginOk     = 0;

for (const appDir of apps) {
  const rel = path.relative(ROOT, appDir);

  // FIX 1 — imports
  if (!ONLY_ARG || ONLY_ARG === 'imports') {
    const testFiles = [
      path.join(appDir, 'src', '__tests__', 'App.test.tsx'),
      path.join(appDir, 'src', '__tests__', 'App.test.jsx'),
    ];
    for (const tf of testFiles) {
      if (!fs.existsSync(tf)) continue;
      const fixed = fixImports(tf);
      if (fixed) {
        if (APPLY) {
          fs.writeFileSync(tf, fixed);
          console.log(`  IMPORT FIX  ${rel}`);
        } else {
          const entry = findAppEntry(tf);
          console.log(`  WOULD FIX IMPORT  ${rel}  (../App → ${entry})`);
        }
        importFixed++;
      } else {
        importOk++;
      }
    }
  }

  // FIX 2 — plugin
  if (!ONLY_ARG || ONLY_ARG === 'plugin') {
    const fixed = fixVitestPlugin(appDir);
    if (fixed) {
      if (APPLY) {
        fs.writeFileSync(path.join(appDir, 'vitest.config.ts'), fixed);
        console.log(`  PLUGIN FIX  ${rel}  (→ ${detectVitePlugin(appDir)})`);
      } else {
        console.log(`  WOULD FIX PLUGIN  ${rel}  (→ ${detectVitePlugin(appDir)})`);
      }
      pluginFixed++;
    } else {
      pluginOk++;
    }
  }
}

console.log(`\n${ APPLY ? 'Done.' : 'Re-run with --apply to write changes.' }`);
if (!ONLY_ARG || ONLY_ARG === 'imports') {
  console.log(`Import fixes applied: ${importFixed}  |  Already correct: ${importOk}`);
}
if (!ONLY_ARG || ONLY_ARG === 'plugin') {
  console.log(`Plugin fixes applied: ${pluginFixed}  |  Already correct: ${pluginOk}`);
}
