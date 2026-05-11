#!/usr/bin/env node
/**
 * TUC Design System Standardizer
 * Applies 4 canonical templates to all ~237 React apps in the monorepo.
 *
 * Usage:
 *   node scripts/standardize.js [--dry-run] [--only=html|css|nginx|docker] [--app=<dir>]
 *
 * Flags:
 *   --dry-run        Print what would change, write nothing
 *   --only=<cat>     Limit to one category: html, css, nginx, docker
 *   --app=<dir>      Process a single app directory only
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TEMPLATES = path.join(ROOT, 'templates');

// ─── CLI FLAGS ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const ONLY = args.find(a => a.startsWith('--only='))?.split('=')[1];
const APP_FILTER = args.find(a => a.startsWith('--app='))?.split('=')[1];

// ─── EXCLUDED DIRECTORIES ────────────────────────────────────────────────────
// Node.js backends, non-React scaffolds, already-correct apps, infra dirs
const EXCLUDED = new Set([
  // Node.js/MySQL backends (no React frontend)
  'accommodation-management',
  'alumni-network',
  'aucdt-msee-aptitude-test',
  'career-services',
  'complaint-resolution-system',
  'health-wellness-portal',
  'internship-program',
  'lecturer-assessment-portal',
  'library-management',
  'mentorship-program',
  'NEWSFEED',
  'research-portal',
  'scholarship-tracker',
  'student-payment-system',
  'student-success-coach',
  'techbridge-dashboard',
  'techbridge-sentinel-agent',
  'modern-product-dev-lifecycle',
  'tsapro-mapping-review',
  // Special exclusions
  'backend',           // TUC Auth API (Express+TS, no frontend)
  'aucdt-portal-tests',// Playwright E2E test suite
  'sentinel-agent',    // App #256 — already correct, master orchestrator
  // Infra / tooling dirs
  'scripts',
  'templates',
  'src',
  'docker',
  'node_modules',
  '.git',
  '.claude',
  'ai-utilities',
  'dist',
]);

// ─── LOAD TEMPLATES ──────────────────────────────────────────────────────────
const TPL_HTML   = fs.readFileSync(path.join(TEMPLATES, 'index.html.tpl'),  'utf8');
const TPL_CSS    = fs.readFileSync(path.join(TEMPLATES, 'index.css.tpl'),   'utf8');
const TPL_NGINX  = fs.readFileSync(path.join(TEMPLATES, 'nginx.conf.tpl'),  'utf8');
const TPL_DOCKER = fs.readFileSync(path.join(TEMPLATES, 'Dockerfile.tpl'),  'utf8');

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function toAppName(slug) {
  return slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

function safeRead(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); }
  catch { return null; }
}

function writeFile(filePath, content, label) {
  if (DRY_RUN) {
    console.log(`    [DRY] ${label} → ${path.relative(ROOT, filePath)}`);
    return true;
  }
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (e) {
    console.error(`    [ERR] ${label}: ${e.message}`);
    return false;
  }
}

// ─── APP DISCOVERY ───────────────────────────────────────────────────────────
function discoverApps() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(e => {
      if (!e.isDirectory()) return false;
      if (EXCLUDED.has(e.name)) return false;
      if (e.name.startsWith('.')) return false;
      // Must have index.html at root
      return fs.existsSync(path.join(ROOT, e.name, 'index.html'));
    })
    .map(e => ({ name: e.name, dir: path.join(ROOT, e.name) }));
}

// ─── HTML HANDLER ────────────────────────────────────────────────────────────
function handleHtml(appDir, appSlug) {
  const htmlPath = path.join(appDir, 'index.html');
  const current = safeRead(htmlPath);
  if (!current) return 'skip';

  // Already fully standardized?
  if (
    current.includes('G-FKXTELQ71R') &&
    current.includes('lang="en-GB"') &&
    current.includes('TUC_LOGO.png')
  ) return 'skip';

  // Extract the <script type="module"> entry point tag to preserve
  const entryMatch =
    current.match(/<script\s+type=["']module["'][^>]*src=["'][^"']+["'][^>]*>\s*<\/script>/i) ||
    current.match(/<script\s+type=["']module["'][^>]*\/>/i);
  const entryTag = entryMatch
    ? entryMatch[0]
    : '<script type="module" src="/src/main.tsx"></script>';

  const appName = toAppName(appSlug);
  const rendered = TPL_HTML
    .replace(/\{\{APP_NAME\}\}/g, appName)
    .replace(/\{\{APP_SLUG\}\}/g, appSlug)
    .replace('<!-- ENTRY_POINT_PLACEHOLDER -->', entryTag);

  return writeFile(htmlPath, rendered, 'index.html') ? 'updated' : 'error';
}

// ─── CSS HANDLER ─────────────────────────────────────────────────────────────
function handleCss(appDir) {
  const srcDir = path.join(appDir, 'src');
  if (!fs.existsSync(srcDir)) return 'skip';

  // Find main CSS file
  const candidates = ['index.css', 'App.css', 'main.css', 'global.css', 'style.css', 'styles.css'];
  let cssPath = null;
  for (const c of candidates) {
    const p = path.join(srcDir, c);
    if (fs.existsSync(p)) { cssPath = p; break; }
  }
  if (!cssPath) return 'skip';

  const current = safeRead(cssPath);
  if (!current) return 'skip';

  // Already fully standardized?
  if (current.includes('--color-tuc-maroon') && current.includes('@import "tailwindcss"')) {
    return 'skip';
  }

  // Extract custom @layer blocks to preserve
  const layerBlocks = [];
  const layerRegex = /@layer\s+[\w-]+\s*\{(?:[^{}]|\{[^{}]*\})*\}/g;
  let m;
  while ((m = layerRegex.exec(current)) !== null) {
    const block = m[0].trim();
    // Skip empty/trivial layer blocks
    if (block.length > 30) layerBlocks.push(block);
  }

  // Also extract any @keyframes blocks to preserve
  const keyframeBlocks = [];
  const kfRegex = /@keyframes\s+[\w-]+\s*\{(?:[^{}]|\{[^{}]*\})*\}/g;
  while ((m = kfRegex.exec(current)) !== null) {
    keyframeBlocks.push(m[0].trim());
  }

  let newCss = TPL_CSS;

  if (keyframeBlocks.length > 0) {
    newCss += '\n\n/* Preserved animations */\n' + keyframeBlocks.join('\n\n');
  }
  if (layerBlocks.length > 0) {
    newCss += '\n\n/* Preserved custom layers */\n' + layerBlocks.join('\n\n');
  }

  return writeFile(cssPath, newCss, path.basename(cssPath)) ? 'updated' : 'error';
}

// ─── NGINX HANDLER ───────────────────────────────────────────────────────────
function handleNginx(appDir) {
  const nginxPath = path.join(appDir, 'nginx.conf');
  if (!fs.existsSync(nginxPath)) return 'skip';

  const current = safeRead(nginxPath);
  if (!current) return 'skip';

  // Already has security headers?
  if (current.includes('X-Frame-Options')) return 'skip';

  return writeFile(nginxPath, TPL_NGINX, 'nginx.conf') ? 'updated' : 'error';
}

// ─── DOCKERFILE HANDLER ──────────────────────────────────────────────────────
function handleDockerfile(appDir) {
  const dockerPath = path.join(appDir, 'Dockerfile');
  if (!fs.existsSync(dockerPath)) return 'skip';

  const current = safeRead(dockerPath);
  if (!current) return 'skip';

  // Already uses pnpm?
  if (current.includes('pnpm')) return 'skip';

  // Only standardize Vite-based apps (has vite in package.json devDeps)
  const pkgPath = path.join(appDir, 'package.json');
  if (!fs.existsSync(pkgPath)) return 'skip';

  let isVite = false;
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    isVite = !!(pkg.devDependencies?.vite || pkg.dependencies?.vite);
  } catch { return 'skip'; }

  if (!isVite) return 'skip';

  return writeFile(dockerPath, TPL_DOCKER, 'Dockerfile') ? 'updated' : 'error';
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
function main() {
  const mode = DRY_RUN ? '[DRY-RUN]' : '[LIVE]';
  console.log(`\nTUC Design System Standardizer ${mode}`);
  if (ONLY)       console.log(`  Category filter : --only=${ONLY}`);
  if (APP_FILTER) console.log(`  App filter      : --app=${APP_FILTER}`);
  console.log('─'.repeat(70));

  let apps = discoverApps();

  if (APP_FILTER) {
    apps = apps.filter(a => a.name === APP_FILTER);
    if (apps.length === 0) {
      console.error(`\nApp "${APP_FILTER}" not found or is excluded.`);
      process.exit(1);
    }
  }

  console.log(`Processing ${apps.length} apps...\n`);

  const stats = {
    html:   { updated: 0, skipped: 0, error: 0 },
    css:    { updated: 0, skipped: 0, error: 0 },
    nginx:  { updated: 0, skipped: 0, error: 0 },
    docker: { updated: 0, skipped: 0, error: 0 },
    errors: [],
  };

  for (const app of apps) {
    const results = {};

    try {
      if (!ONLY || ONLY === 'html')   results.html   = handleHtml(app.dir, app.name);
      if (!ONLY || ONLY === 'css')    results.css    = handleCss(app.dir);
      if (!ONLY || ONLY === 'nginx')  results.nginx  = handleNginx(app.dir);
      if (!ONLY || ONLY === 'docker') results.docker = handleDockerfile(app.dir);
    } catch (e) {
      stats.errors.push(`${app.name}: ${e.message}`);
      console.error(`  [ERR] ${app.name}: ${e.message}`);
      continue;
    }

    const anyUpdated = Object.values(results).some(r => r === 'updated');
    if (anyUpdated || DRY_RUN) {
      const parts = Object.entries(results)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => {
          const sym = v === 'updated' ? '✓' : v === 'skip' ? '·' : '✗';
          return `${k}:${sym}`;
        })
        .join('  ');
      console.log(`  ${app.name.padEnd(52)} ${parts}`);
    }

    for (const [k, v] of Object.entries(results)) {
      if (!stats[k]) continue;
      if (v === 'updated') stats[k].updated++;
      else if (v === 'skip') stats[k].skipped++;
      else if (v === 'error') { stats[k].error++; stats.errors.push(`${app.name}/${k}`); }
    }
  }

  // ─── Summary ──────────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(70));
  console.log('SUMMARY');
  console.log('─'.repeat(70));
  const categories = [
    ['index.html',   'html'],
    ['src/index.css','css'],
    ['nginx.conf',   'nginx'],
    ['Dockerfile',   'docker'],
  ];
  for (const [label, key] of categories) {
    const s = stats[key];
    console.log(
      `  ${label.padEnd(16)}  updated: ${String(s.updated).padEnd(5)} skipped: ${String(s.skipped).padEnd(5)} errors: ${s.error}`
    );
  }

  if (stats.errors.length > 0) {
    console.log(`\n  ERRORS (${stats.errors.length}):`);
    stats.errors.forEach(e => console.log(`    ✗ ${e}`));
  }

  const totalUpdated = Object.values(stats).filter(v => typeof v === 'object' && 'updated' in v)
    .reduce((sum, s) => sum + s.updated, 0);

  console.log('\n' + '─'.repeat(70));
  if (DRY_RUN) {
    console.log(`  ⚠  DRY-RUN complete. ${totalUpdated} changes would be applied.`);
    console.log('     Re-run without --dry-run to write files.');
  } else {
    console.log(`  ✓  Standardization complete. ${totalUpdated} files updated.`);
  }
  console.log();
}

main();
