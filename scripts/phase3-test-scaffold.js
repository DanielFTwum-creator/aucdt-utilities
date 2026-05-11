#!/usr/bin/env node
/**
 * Phase 3 — Testing Framework Scaffold
 * Techbridge University College / TUC
 *
 * For each Vite/React project that lacks a test framework, generates:
 *   - vitest.config.ts           Unit test config (jsdom, globals, coverage)
 *   - src/__tests__/setup.ts     @testing-library/jest-dom import
 *   - src/__tests__/App.test.tsx Smoke test (renders without crashing)
 *   - vitest.e2e.config.ts       E2E config stub (environment: node)
 *   - src/__tests__/App.e2e.ts   E2E test stub (Puppeteer-ready)
 *
 * Also patches package.json devDependencies + test/test:ui/test:coverage scripts.
 *
 * Usage:
 *   node scripts/phase3-test-scaffold.js            # dry run
 *   node scripts/phase3-test-scaffold.js --apply    # write changes
 *   node scripts/phase3-test-scaffold.js --apply --app=tsapro
 */

const fs   = require('fs');
const path = require('path');

const APPLY   = process.argv.includes('--apply');
const APP_ARG = (process.argv.find(a => a.startsWith('--app=')) || '').replace('--app=', '');
const ROOT    = path.resolve(__dirname, '..');

const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.pnpm-store',
  'aucdt-portal-tests', 'backend', 'scripts', 'templates', 'src',
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

// Test devDependencies to inject
const TEST_DEPS = {
  'vitest':                    '^3.0.0',
  '@vitest/ui':                '^3.0.0',
  '@vitest/coverage-v8':       '^3.0.0',
  '@testing-library/react':    '^16.3.2',
  '@testing-library/jest-dom': '^6.6.3',
  '@testing-library/user-event': '^14.6.1',
  'jsdom':                     '^26.1.0',
};

// ── helpers ──────────────────────────────────────────────────────────────────

function readJson(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
  catch { return null; }
}

function writeJson(filePath, obj) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const indent = raw.match(/^(\s+)"/m)?.[1]?.length || 2;
  fs.writeFileSync(filePath, JSON.stringify(obj, null, indent) + '\n');
}

function hasTestFramework(pkg) {
  const all = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  return !!(all['vitest'] || all['jest'] || all['@jest/core']);
}

function isViteApp(dir) {
  const pkg = readJson(path.join(dir, 'package.json'));
  if (!pkg) return false;
  const all = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  return !!all['vite'];
}

function isTypeScript(dir) {
  return fs.existsSync(path.join(dir, 'tsconfig.json'));
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
      if (fs.existsSync(clientDir) && isViteApp(clientDir)) {
        results.push(clientDir);
      }
      continue;
    }

    if (isViteApp(full)) {
      results.push(full);
    } else {
      results.push(...findApps(full, depth + 1));
    }
  }
  return results;
}

// ── file templates ────────────────────────────────────────────────────────────

function vitestConfig(appName) {
  return `import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — ${appName}
// TUC coverage target: >70% for core utilities
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['src/**/*.e2e.{ts,tsx}', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec,e2e}.{ts,tsx}', 'src/__tests__/**'],
      thresholds: {
        branches:   70,
        functions:  70,
        lines:      70,
        statements: 70,
      },
    },
  },
});
`;
}

function vitestE2eConfig(appName) {
  return `import { defineConfig } from 'vitest/config';

// Vitest E2E configuration — ${appName}
// E2E tests use Node environment (Puppeteer / Playwright)
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.e2e.{ts,tsx,js}'],
    testTimeout: 30000,
    hookTimeout: 15000,
    teardownTimeout: 10000,
  },
});
`;
}

function setupFile() {
  return `import '@testing-library/jest-dom';
`;
}

function appTestFile(ts) {
  const ext = ts ? 'tsx' : 'jsx';
  return `import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';

/**
 * Smoke test — verifies the root App component renders without throwing.
 * TUC Phase 3 scaffold — extend with project-specific assertions.
 */
describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });

  it('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});
`;
}

function appE2eFile(appName) {
  return `import { describe, it, expect } from 'vitest';

/**
 * E2E stub — ${appName}
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('${appName} E2E', () => {
  it('placeholder — replace with Puppeteer test', () => {
    // TODO: launch browser, navigate to http://localhost:5173, assert UI
    expect(true).toBe(true);
  });
});
`;
}

// ── scaffold a single app ─────────────────────────────────────────────────────

function scaffoldApp(appDir) {
  const pkgPath = path.join(appDir, 'package.json');
  const pkg     = readJson(pkgPath);
  if (!pkg) return false;

  if (hasTestFramework(pkg)) return false; // already has tests

  const ts      = isTypeScript(appDir);
  const appName = pkg.name || path.basename(appDir);
  const testDir = path.join(appDir, 'src', '__tests__');
  const ext     = ts ? 'tsx' : 'jsx';

  const files = [
    { path: path.join(appDir, 'vitest.config.ts'),           content: vitestConfig(appName) },
    { path: path.join(appDir, 'vitest.e2e.config.ts'),       content: vitestE2eConfig(appName) },
    { path: path.join(testDir, 'setup.ts'),                  content: setupFile() },
    { path: path.join(testDir, `App.test.${ext}`),           content: appTestFile(ts) },
    { path: path.join(testDir, 'App.e2e.ts'),                content: appE2eFile(appName) },
  ];

  if (!APPLY) return true; // dry run — just report

  // Create __tests__ dir if needed
  if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

  // Write scaffold files (don't overwrite existing)
  for (const { path: fp, content } of files) {
    if (!fs.existsSync(fp)) {
      fs.writeFileSync(fp, content);
    }
  }

  // Patch package.json — devDependencies
  pkg.devDependencies = pkg.devDependencies || {};
  for (const [dep, ver] of Object.entries(TEST_DEPS)) {
    if (!pkg.devDependencies[dep]) {
      pkg.devDependencies[dep] = ver;
    }
  }

  // Patch scripts
  pkg.scripts = pkg.scripts || {};
  if (!pkg.scripts.test)             pkg.scripts.test            = 'vitest';
  if (!pkg.scripts['test:ui'])       pkg.scripts['test:ui']      = 'vitest --ui';
  if (!pkg.scripts['test:coverage']) pkg.scripts['test:coverage']= 'vitest run --coverage';
  if (!pkg.scripts['test:e2e'])      pkg.scripts['test:e2e']     = 'vitest run --config vitest.e2e.config.ts';

  writeJson(pkgPath, pkg);

  return true;
}

// ── main ─────────────────────────────────────────────────────────────────────

let apps = findApps(ROOT);

if (APP_ARG) {
  apps = apps.filter(a => path.basename(a) === APP_ARG || a.includes(APP_ARG));
}

console.log(`\nFound ${apps.length} Vite/React apps\n`);

let scaffolded = 0;
let skipped    = 0;

for (const appDir of apps) {
  const rel    = path.relative(ROOT, appDir);
  const result = scaffoldApp(appDir);

  if (!result) {
    skipped++;
    continue;
  }

  if (APPLY) {
    console.log(`  SCAFFOLDED  ${rel}`);
  } else {
    console.log(`  WOULD SCAFFOLD  ${rel}`);
  }
  scaffolded++;
}

console.log(`\n${ APPLY ? 'Done.' : 'Re-run with --apply to write changes.' }`);
console.log(`Apps scaffolded: ${scaffolded}`);
console.log(`Already have tests (skipped): ${skipped}`);

if (APPLY && scaffolded > 0) {
  console.log(`\nNext steps:`);
  console.log(`  cd <app> && pnpm install   # install new devDeps`);
  console.log(`  pnpm test                  # run unit tests`);
  console.log(`  pnpm test:coverage         # generate coverage report`);
}
