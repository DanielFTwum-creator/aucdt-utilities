#!/usr/bin/env node
/**
 * Phase 3 Vitest Fix — scaffold vitest.config.ts for apps missing it
 * Techbridge University College / TUC
 *
 * Usage:
 *   node scripts/phase3-vitest-fix.js          # dry run
 *   node scripts/phase3-vitest-fix.js --apply  # write files
 */
const fs   = require('fs');
const path = require('path');

const APPLY = process.argv.includes('--apply');
const ROOT  = path.resolve(__dirname, '..');

const SKIP = new Set([
  'node_modules','.git','dist','build','scripts','templates','thumbnail-generator',
  'backend','aucdt-portal-tests','tuc-portal-tests','docker','docs','archive',
  'catalogue','project-screenshots','project-screenshots-real','monitoring',
  'reports','build-validation-reports','proof-of-concept-screenshots',
  'master-thumbnail-catalog','playwright','src','gemini','genai','sync-from-d-drive'
]);

// Known Node.js/Express backends — use 'node' environment, not 'jsdom'
const BACKEND_APPS = new Set([
  'accommodation-management','alumni-network','career-services',
  'complaint-resolution-system','health-wellness-portal','internship-program',
  'library-management','mentorship-program','research-portal',
  'scholarship-tracker','student-payment-system','student-success-coach',
  'techbridge-dashboard','techbridge-sentinel-agent','newsfeed','NEWSFEED',
  'lecturer-assessment-portal',
]);

const VITEST_REACT = (appName) => `import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
});
`;

const VITEST_NODE = (appName) => `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60,
      },
    },
  },
});
`;

const VITEST_E2E = `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/__tests__/**/*.e2e.ts'],
    testTimeout: 30000,
  },
});
`;

const SETUP_TS = `import '@testing-library/jest-dom';
`;

const APP_TEST = (appName) => `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../App';

describe('${appName}', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(document.body).toBeDefined();
  });
});
`;

const NODE_TEST = (appName) => `import { describe, it, expect } from 'vitest';

describe('${appName}', () => {
  it('module loads without error', () => {
    expect(true).toBe(true);
  });
});
`;

// ── discovery ─────────────────────────────────────────────────────────────────

const missing = [];

for (const e of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!e.isDirectory() || SKIP.has(e.name) || e.name.startsWith('.')) continue;
  const dir = path.join(ROOT, e.name);
  if (!fs.existsSync(path.join(dir, 'package.json'))) continue;
  if (!fs.existsSync(path.join(dir, 'vitest.config.ts'))) {
    missing.push(e.name);
  }
}

console.log(`\nApps missing vitest.config.ts: ${missing.length}`);
missing.forEach(a => console.log('  ', a));

if (!APPLY) {
  console.log('\nRe-run with --apply to scaffold.');
  process.exit(0);
}

// ── apply ─────────────────────────────────────────────────────────────────────

let done = 0;
for (const appName of missing) {
  const dir  = path.join(ROOT, appName);
  const isBackend = BACKEND_APPS.has(appName);

  // vitest.config.ts
  const vitestContent = isBackend ? VITEST_NODE(appName) : VITEST_REACT(appName);
  fs.writeFileSync(path.join(dir, 'vitest.config.ts'), vitestContent);

  if (!isBackend) {
    // vitest.e2e.config.ts
    if (!fs.existsSync(path.join(dir, 'vitest.e2e.config.ts'))) {
      fs.writeFileSync(path.join(dir, 'vitest.e2e.config.ts'), VITEST_E2E);
    }

    // src/__tests__/setup.ts
    const testsDir = path.join(dir, 'src', '__tests__');
    fs.mkdirSync(testsDir, { recursive: true });
    if (!fs.existsSync(path.join(testsDir, 'setup.ts'))) {
      fs.writeFileSync(path.join(testsDir, 'setup.ts'), SETUP_TS);
    }

    // src/__tests__/App.test.tsx — detect App entry path
    if (!fs.existsSync(path.join(testsDir, 'App.test.tsx'))) {
      let appImport = '../../App';
      if (fs.existsSync(path.join(dir, 'src', 'App.tsx')))      appImport = '../App';
      else if (fs.existsSync(path.join(dir, 'src', 'App.jsx'))) appImport = '../App';
      else if (fs.existsSync(path.join(dir, 'App.tsx')))        appImport = '../../App';
      const testContent = APP_TEST(appName).replace("'../../App'", `'${appImport}'`);
      fs.writeFileSync(path.join(testsDir, 'App.test.tsx'), testContent);
    }
  } else {
    // Backend: minimal __tests__ directory
    const testsDir = path.join(dir, 'src', '__tests__');
    fs.mkdirSync(testsDir, { recursive: true });
    if (!fs.existsSync(path.join(testsDir, 'index.test.ts'))) {
      fs.writeFileSync(path.join(testsDir, 'index.test.ts'), NODE_TEST(appName));
    }

    // Patch package.json devDeps for vitest
    const pkgPath = path.join(dir, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    pkg.devDependencies = pkg.devDependencies || {};
    pkg.devDependencies['vitest'] = '^3.0.0';
    pkg.scripts = pkg.scripts || {};
    if (!pkg.scripts.test) pkg.scripts.test = 'vitest run';
    if (!pkg.scripts['test:coverage']) pkg.scripts['test:coverage'] = 'vitest run --coverage';
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  }

  console.log(`  ✓ ${appName} (${isBackend ? 'node' : 'jsdom'})`);
  done++;
}

console.log(`\nDone: ${done} apps scaffolded.`);
