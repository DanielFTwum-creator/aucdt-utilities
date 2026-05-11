#!/usr/bin/env node
/**
 * Phase 2 — High-Contrast Theme Patch
 * Techbridge University College / TUC
 *
 * Finds all ThemeContext/ThemeProvider files missing 'high-contrast' and patches them.
 * Also patches Theme type definitions (types.ts / types/index.ts).
 *
 * Usage:
 *   node scripts/phase2-highcontrast.js            # dry run
 *   node scripts/phase2-highcontrast.js --apply    # write changes
 *   node scripts/phase2-highcontrast.js --apply --app=tsapro
 */

const fs   = require('fs');
const path = require('path');

const APPLY   = process.argv.includes('--apply');
const APP_ARG = (process.argv.find(a => a.startsWith('--app=')) || '').replace('--app=', '');
const ROOT    = path.resolve(__dirname, '..');

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.pnpm-store']);

// ── helpers ──────────────────────────────────────────────────────────────────

function walk(dir, pattern, maxDepth = 4, depth = 0) {
  if (depth > maxDepth) return [];
  const results = [];
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch { return []; }
  for (const e of entries) {
    if (SKIP_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) results.push(...walk(full, pattern, maxDepth, depth + 1));
    else if (pattern.test(e.name)) results.push(full);
  }
  return results;
}

function hasHighContrast(content) {
  return /high.contrast|highContrast/i.test(content);
}

// ── patch strategies ──────────────────────────────────────────────────────────

/**
 * Patch a Theme type: 'light' | 'dark'  →  'light' | 'dark' | 'high-contrast'
 */
function patchThemeType(content) {
  // Already has it
  if (hasHighContrast(content)) return null;

  // Match common patterns
  const patterns = [
    // type Theme = 'light' | 'dark';
    [/type\s+Theme\s*=\s*(['"]light['"]\s*\|\s*['"]dark['"])/g,
     `type Theme = 'light' | 'dark' | 'high-contrast'`],
    // type Theme = 'dark' | 'light';
    [/type\s+Theme\s*=\s*(['"]dark['"]\s*\|\s*['"]light['"])/g,
     `type Theme = 'dark' | 'light' | 'high-contrast'`],
    // Theme = 'light' | 'dark' (without type keyword, e.g. in interface)
    [/(theme:\s*['"]light['"]\s*\|\s*['"]dark['"])/g,
     `theme: 'light' | 'dark' | 'high-contrast'`],
  ];

  let patched = content;
  let changed = false;
  for (const [re, replacement] of patterns) {
    const next = patched.replace(re, replacement);
    if (next !== patched) { patched = next; changed = true; }
  }
  return changed ? patched : null;
}

/**
 * Patch a ThemeContext/ThemeProvider to add high-contrast handling.
 */
function patchThemeProvider(content) {
  if (hasHighContrast(content)) return null;

  let patched = content;
  let changed = false;

  // 1. Patch theme type literal in context files that define it inline
  //    'light' | 'dark'  →  'light' | 'dark' | 'high-contrast'
  const typePatch = patchThemeType(patched);
  if (typePatch) { patched = typePatch; changed = true; }

  // 2. Patch classList remove to include theme-high-contrast
  //    root.classList.remove('theme-light', 'theme-dark')
  const removeRe = /classList\.remove\(\s*['"]theme-light['"]\s*,\s*['"]theme-dark['"]\s*\)/g;
  const removeMatch = patched.match(removeRe);
  if (removeMatch) {
    patched = patched.replace(removeRe,
      `classList.remove('theme-light', 'theme-dark', 'theme-high-contrast')`);
    changed = true;
  }

  // 3. If there's body style setting for light/dark, add high-contrast branch
  //    Look for: } else { ... backgroundColor dark ... }  pattern  (the final else)
  //    We insert a high-contrast branch before the final else
  const darkBodyRe = /(} else \{[\s\S]*?backgroundColor[\s\S]*?(?:#0f0f23|#1e293b|#111827|#0f172a|#030712|dark)['";\s\S]*?\n\s*\})/;
  if (!hasHighContrast(patched) && darkBodyRe.test(patched)) {
    patched = patched.replace(darkBodyRe, (match) => {
      return `} else if (theme === 'high-contrast') {\n        document.body.style.backgroundColor = '#000000';\n        document.body.style.color = '#ffff00';\n    ${match}`;
    });
    changed = true;
  }

  // 4. Simpler pattern: if no body style block, patch the classList.add line
  //    to also set data-theme attribute for CSS var targeting
  if (changed && !/data-theme/i.test(patched)) {
    patched = patched.replace(
      /(root\.classList\.add\(`theme-\$\{theme\}`\))/,
      `$1;\n    root.setAttribute('data-theme', theme)`
    );
  }

  return changed ? patched : null;
}

/**
 * Patch an index.css that has .theme-dark but not .theme-high-contrast
 */
function patchCss(content) {
  if (hasHighContrast(content)) return null;

  // Find the last .theme-dark block and append high-contrast after it
  const darkBlockRe = /\.theme-dark\s*\{[^}]*\}/s;
  if (!darkBlockRe.test(content)) return null;

  const hcBlock = `
.theme-high-contrast {
  --bg-primary: #000000;
  --bg-secondary: #0a0a0a;
  --text-primary: #ffff00;
  --text-secondary: #ffffff;
  --border-color: #ffff00;
  --accent-color: #ffff00;
  --link-color: #00ffff;
  --focus-ring: #ffff00;
}

[data-theme="high-contrast"] body,
.theme-high-contrast body {
  background-color: #000000 !important;
  color: #ffff00 !important;
}
`;

  return content.replace(darkBlockRe, (match) => match + hcBlock);
}

// ── discovery + patch ─────────────────────────────────────────────────────────

const themeFiles    = walk(ROOT, /ThemeContext|ThemeProvider/i).filter(f => /\.(tsx?|jsx?)$/.test(f));
const typeFiles     = walk(ROOT, /types\.(ts|tsx)$|types\/index\.(ts|tsx)$/);
const cssFiles      = walk(ROOT, /index\.css$/);

let appFilter = null;
if (APP_ARG) {
  appFilter = p => p.includes(`/${APP_ARG}/`) || p.includes(`\\${APP_ARG}\\`);
}

const allTargets = [
  ...themeFiles.map(f => ({ file: f, patcher: patchThemeProvider })),
  ...typeFiles.map(f  => ({ file: f, patcher: patchThemeType })),
  ...cssFiles.map(f   => ({ file: f, patcher: patchCss })),
].filter(({ file }) => appFilter ? appFilter(file) : true);

console.log(`\nScanning ${allTargets.length} files for high-contrast gaps...\n`);

let patched = 0;
let skipped = 0;

for (const { file, patcher } of allTargets) {
  let content;
  try { content = fs.readFileSync(file, 'utf8'); }
  catch { continue; }

  const result = patcher(content);
  if (!result) { skipped++; continue; }

  const rel = path.relative(ROOT, file);
  if (APPLY) {
    fs.writeFileSync(file, result);
    console.log(`  PATCHED  ${rel}`);
  } else {
    console.log(`  WOULD PATCH  ${rel}`);
  }
  patched++;
}

console.log(`\n${ APPLY ? 'Done.' : 'Re-run with --apply to write changes.' }`);
console.log(`Files patched: ${patched}`);
console.log(`Already compliant / skipped: ${skipped}`);
