#!/usr/bin/env node
/**
 * Phase 4 — Documentation & Diagrams Generator
 * Techbridge University College / TUC
 *
 * For each Vite/React project, generates into docs/:
 *   - architecture.svg    System Architecture diagram (SVG)
 *   - dataflow.svg        Data Flow diagram (SVG)
 *   - ADMIN_GUIDE.md      Admin section reference
 *   - DEPLOYMENT.md       Docker/pnpm deployment guide
 *   - TESTING.md          Test framework guide
 *
 * Usage:
 *   node scripts/phase4-docs-gen.js            # dry run
 *   node scripts/phase4-docs-gen.js --apply    # write changes
 *   node scripts/phase4-docs-gen.js --apply --app=tsapro
 *   node scripts/phase4-docs-gen.js --apply --only=svg
 *   node scripts/phase4-docs-gen.js --apply --only=md
 */

const fs   = require('fs');
const path = require('path');

const APPLY    = process.argv.includes('--apply');
const APP_ARG  = (process.argv.find(a => a.startsWith('--app=')) || '').replace('--app=', '');
const ONLY_ARG = (process.argv.find(a => a.startsWith('--only=')) || '').replace('--only=', '');
const ROOT     = path.resolve(__dirname, '..');
const DATE     = new Date().toISOString().split('T')[0];

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

// ── helpers ──────────────────────────────────────────────────────────────────

function readJson(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
  catch { return null; }
}

function isViteApp(dir) {
  const pkg = readJson(path.join(dir, 'package.json'));
  if (!pkg) return false;
  const all = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  return !!all['vite'];
}

function detectAppMeta(appDir) {
  const pkg       = readJson(path.join(appDir, 'package.json')) || {};
  const all       = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  const name      = pkg.name || path.basename(appDir);
  const title     = (pkg.description || name).replace(/AUCDT\s*/gi, 'TUC ');
  const hasTs     = !!all['typescript'];
  const hasTw     = !!all['tailwindcss'] || !!all['@tailwindcss/vite'];
  const hasRouter = !!all['react-router-dom'];
  const hasCharts = !!all['recharts'];
  const hasAuth   = !!all['jsonwebtoken'] || fs.existsSync(path.join(appDir, 'src', 'auth'));
  const hasAdmin  = (() => {
    try {
      const srcEntries = fs.readdirSync(path.join(appDir, 'src'), { withFileTypes: true });
      return srcEntries.some(e => /admin/i.test(e.name));
    } catch { return false; }
  })();
  const port = extractPort(appDir) || '5173';

  return { name, title, hasTs, hasTw, hasRouter, hasCharts, hasAuth, hasAdmin, port, pkg };
}

function extractPort(appDir) {
  // Try docker-compose-all-apps.yml for port mapping
  const composePath = path.join(ROOT, 'docker-compose-all-apps.yml');
  try {
    const compose  = fs.readFileSync(composePath, 'utf8');
    const baseName = path.basename(appDir);
    const re       = new RegExp(`${baseName}[\\s\\S]{0,300}?- "(\\d+):80"`, 'm');
    const m        = compose.match(re);
    if (m) return m[1];
  } catch { /* ignore */ }
  return null;
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

// ── SVG generators ────────────────────────────────────────────────────────────

function architectureSvg(meta) {
  const { title, hasAuth, hasAdmin, hasRouter, hasCharts, hasTw, hasTs, port } = meta;

  // Build component list dynamically
  const layers = [
    { label: 'Browser', color: '#f8fafc', border: '#94a3b8' },
    { label: `React 19${hasTs ? ' + TypeScript' : ''}`, color: '#dbeafe', border: '#3b82f6' },
    hasTw  && { label: 'Tailwind CSS 4', color: '#f0fdf4', border: '#22c55e' },
    hasRouter && { label: 'React Router DOM', color: '#fef3c7', border: '#f59e0b' },
    hasCharts && { label: 'Recharts 3', color: '#fdf4ff', border: '#a855f7' },
    hasAuth && { label: 'TUC Auth API (JWT)', color: '#fff1f2', border: '#f43f5e' },
    { label: 'Vite 7 + nginx:alpine', color: '#f1f5f9', border: '#64748b' },
    { label: `Docker  port ${port}:80`, color: '#0f172a', border: '#C8A84B', textColor: '#C8A84B' },
  ].filter(Boolean);

  const boxH   = 44;
  const gap    = 16;
  const width  = 480;
  const height = layers.length * (boxH + gap) + 80;

  const boxes = layers.map((layer, i) => {
    const y    = 40 + i * (boxH + gap);
    const tc   = layer.textColor || '#1e293b';
    return `
    <rect x="40" y="${y}" width="${width - 80}" height="${boxH}" rx="8"
          fill="${layer.color}" stroke="${layer.border}" stroke-width="2"/>
    <text x="${width / 2}" y="${y + boxH / 2 + 5}" text-anchor="middle"
          font-family="Inter,sans-serif" font-size="14" fill="${tc}" font-weight="500">
      ${escSvg(layer.label)}
    </text>`;
  }).join('');

  const arrows = layers.slice(1).map((_, i) => {
    const y1 = 40 + i * (boxH + gap) + boxH;
    const y2 = y1 + gap;
    return `<line x1="${width / 2}" y1="${y1}" x2="${width / 2}" y2="${y2}"
                  stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arr)"/>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8"/>
    </marker>
  </defs>
  <rect width="${width}" height="${height}" fill="#ffffff"/>
  <text x="${width / 2}" y="24" text-anchor="middle"
        font-family="'Playfair Display',serif" font-size="16" font-weight="700"
        fill="#0F0C07">${escSvg(title)} — Architecture</text>
  ${arrows}
  ${boxes}
</svg>`;
}

function dataflowSvg(meta) {
  const { title, hasAuth, hasRouter, hasCharts } = meta;

  // Nodes: [id, label, x, y, color, border]
  const nodes = [
    ['user',    'User\nBrowser',        220, 30,  '#dbeafe', '#3b82f6'],
    ['app',     'React App\n(SPA)',      220, 140, '#f0fdf4', '#22c55e'],
    ['router',  'React Router',         80,  250, '#fef3c7', '#f59e0b'],
    ['state',   'React State\n/ Context', 360, 250, '#fdf4ff', '#a855f7'],
    ...(hasAuth  ? [['auth',  'TUC Auth API\n(JWT)',    80,  360, '#fff1f2', '#f43f5e']] : []),
    ...(hasCharts? [['charts','Recharts\nComponents',  360, 360, '#e0f2fe', '#0284c7']] : []),
    ['storage', 'localStorage\n/ sessionStorage', 220, 360, '#f1f5f9', '#64748b'],
  ];

  const edges = [
    ['user',   'app',    'requests'],
    ['app',    'router', 'routes'],
    ['app',    'state',  'state'],
    ...(hasAuth   ? [['app', 'auth', 'login/token']] : []),
    ...(hasCharts ? [['state', 'charts', 'data']] : []),
    ['app',    'storage', 'persist'],
  ];

  const W = 480, H = 460;

  const nodeMap = Object.fromEntries(nodes.map(n => [n[0], n]));

  const edgeSvg = edges.map(([from, to, label]) => {
    const fn = nodeMap[from], tn = nodeMap[to];
    if (!fn || !tn) return '';
    const x1 = fn[2] + 60, y1 = fn[3] + 30;
    const x2 = tn[2] + 60, y2 = tn[3];
    const mx  = (x1 + x2) / 2, my = (y1 + y2) / 2;
    return `
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
          stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,3"
          marker-end="url(#arr2)"/>
    <text x="${mx}" y="${my - 4}" text-anchor="middle"
          font-family="Inter,sans-serif" font-size="10" fill="#64748b">${escSvg(label)}</text>`;
  }).join('');

  const nodeSvg = nodes.map(([, label, x, y, fill, stroke]) => {
    const lines = label.split('\n');
    const texts = lines.map((l, i) =>
      `<tspan x="${x + 60}" dy="${i === 0 ? 0 : 16}">${escSvg(l)}</tspan>`
    ).join('');
    const ty = y + 30 - (lines.length - 1) * 8;
    return `
    <rect x="${x}" y="${y}" width="120" height="50" rx="8"
          fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <text x="${x + 60}" y="${ty}" text-anchor="middle"
          font-family="Inter,sans-serif" font-size="12" fill="#1e293b">${texts}</text>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <marker id="arr2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8"/>
    </marker>
  </defs>
  <rect width="${W}" height="${H}" fill="#ffffff"/>
  <text x="${W / 2}" y="18" text-anchor="middle"
        font-family="'Playfair Display',serif" font-size="15" font-weight="700"
        fill="#0F0C07">${escSvg(title)} — Data Flow</text>
  ${edgeSvg}
  ${nodeSvg}
</svg>`;
}

function escSvg(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Markdown generators ───────────────────────────────────────────────────────

function adminGuide(meta) {
  const { title, name, hasAuth, port } = meta;
  return `# Admin Guide — ${title}

**Application:** ${name}
**Institution:** Techbridge University College (TUC)
**Date:** ${DATE}

---

## Accessing the Admin Section

Navigate to: \`http://localhost:${port}/#/admin\`

The admin section is password-protected. Default credentials are set via the \`VITE_ADMIN_PASSWORD\`
environment variable (see \`.env\`). Never commit credentials to version control.

---

## Admin Features

### Audit Log

All significant user actions are recorded in the Audit Log panel. Entries include:

| Field | Description |
|---|---|
| Timestamp | ISO 8601 UTC time of the action |
| User | User identifier or "guest" |
| Action | Action type (e.g. LOGIN, SUBMIT, EXPORT) |
| Detail | Additional context |

Audit log data is stored in \`localStorage\` under the key \`tuc_${name}_audit\`.

### Diagnostic Panel

The Diagnostic Panel provides:

- **System Info** — React version, build mode, environment variables (non-secret)
- **State Inspector** — Current application state snapshot
- **Network Monitor** — API call history and response codes
- **Test Runner** — Trigger manual smoke tests from the UI

### Theme Controls

Admins may switch between Light, Dark, and High-Contrast themes.
Theme selection persists via \`localStorage\`.

---

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| \`VITE_ADMIN_PASSWORD\` | Admin section password | (required) |
| \`VITE_API_URL\` | Backend API base URL | \`http://localhost:5000/api\` |
| \`VITE_GA_ID\` | Google Analytics tag | \`G-FKXTELQ71R\` |
${hasAuth ? `| \`VITE_AUTH_API\` | TUC Auth API URL | \`http://localhost:5000/api/auth\` |\n` : ''}
---

## Security Notes

- The admin route must not be linked from the public UI
- All diagnostic tools and audit logs are confined to \`#/admin\`
- No sensitive data may be logged to the browser console in production
- CSP headers enforced via nginx configuration

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — ${DATE}*
`;
}

function deploymentGuide(meta) {
  const { title, name, port, hasTs } = meta;
  return `# Deployment Guide — ${title}

**Application:** ${name}
**Institution:** Techbridge University College (TUC)
**Date:** ${DATE}

---

## Local Development

\`\`\`bash
cd ${name}
pnpm install
pnpm run dev        # http://localhost:5173
\`\`\`

${hasTs ? `\`\`\`bash\npnpm run build      # TypeScript compile + Vite bundle → dist/\n\`\`\`\n` : ''}

---

## Docker Deployment

### Build

\`\`\`bash
# From monorepo root
docker-compose -f docker-compose-all-apps.yml build ${name}
\`\`\`

### Run

\`\`\`bash
docker-compose -f docker-compose-all-apps.yml up ${name}
# App available at http://localhost:${port}
\`\`\`

### All services

\`\`\`bash
docker-compose -f docker-compose-all-apps.yml up
# Gateway: http://localhost:8080
\`\`\`

---

## Dockerfile

Multi-stage build pattern:

\`\`\`dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
\`\`\`

---

## Environment Variables

Create \`.env\` (never commit):

\`\`\`bash
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PASSWORD=changeme
VITE_GA_ID=G-FKXTELQ71R
\`\`\`

---

## Health Check

\`\`\`bash
curl http://localhost:${port}/health
# → healthy
\`\`\`

---

## Troubleshooting

| Issue | Fix |
|---|---|
| \`pnpm install\` fails | \`rm -rf node_modules pnpm-lock.yaml && npm install --legacy-peer-deps\` |
| Vite memory error | \`NODE_OPTIONS=--max-old-space-size=4096 pnpm run build\` |
| Port ${port} in use | Change port mapping in \`docker-compose-all-apps.yml\` |
| Blank page in Docker | Check \`nginx.conf\` — ensure \`try_files $uri $uri/ /index.html\` |

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — ${DATE}*
`;
}

function testingGuide(meta) {
  const { title, name } = meta;
  return `# Testing Guide — ${title}

**Application:** ${name}
**Institution:** Techbridge University College (TUC)
**Date:** ${DATE}
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

\`\`\`bash
cd ${name}
pnpm install           # ensure devDeps installed
pnpm test              # run unit tests (watch mode)
pnpm test:coverage     # coverage report → coverage/
pnpm test:ui           # Vitest UI at http://localhost:51204
pnpm test:e2e          # E2E stubs (node environment)
\`\`\`

---

## Test Structure

\`\`\`
src/
  __tests__/
    setup.ts            # @testing-library/jest-dom import
    App.test.tsx        # Root component smoke tests
    App.e2e.ts          # E2E stub (extend with Puppeteer)
vitest.config.ts        # Unit test config (jsdom)
vitest.e2e.config.ts    # E2E config (node)
\`\`\`

---

## Coverage Targets (TUC Standard)

| Metric | Target |
|---|---|
| Branches | ≥ 70% |
| Functions | ≥ 70% |
| Lines | ≥ 70% |
| Statements | ≥ 70% |

---

## Writing Tests

\`\`\`tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders heading', () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles button click', async () => {
    render(<MyComponent />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
\`\`\`

---

## E2E with Playwright (Recommended)

\`\`\`bash
# Install Playwright
pnpm add -D @playwright/test
npx playwright install chromium

# Run E2E
npx playwright test
\`\`\`

Extend \`src/__tests__/App.e2e.ts\` with Playwright page assertions once the app is running.

---

## Admin Section Test Dashboard

Access at \`http://localhost:5173/#/admin\` → Test Runner tab.

The diagnostic panel provides a manual smoke test runner for verifying core user flows
without leaving the browser.

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — ${DATE}*
`;
}

// ── scaffold a single app ─────────────────────────────────────────────────────

function processApp(appDir) {
  const meta    = detectAppMeta(appDir);
  const docsDir = path.join(appDir, 'docs');
  const rel     = path.relative(ROOT, appDir);

  const targets = [];

  if (!ONLY_ARG || ONLY_ARG === 'svg' || ONLY_ARG === 'all') {
    targets.push({ file: 'architecture.svg', content: architectureSvg(meta) });
    targets.push({ file: 'dataflow.svg',     content: dataflowSvg(meta) });
  }

  if (!ONLY_ARG || ONLY_ARG === 'md' || ONLY_ARG === 'all') {
    targets.push({ file: 'ADMIN_GUIDE.md',  content: adminGuide(meta) });
    targets.push({ file: 'DEPLOYMENT.md',   content: deploymentGuide(meta) });
    targets.push({ file: 'TESTING.md',      content: testingGuide(meta) });
  }

  // Check which are actually missing
  const needed = targets.filter(t => !fs.existsSync(path.join(docsDir, t.file)));

  if (needed.length === 0) return { rel, count: 0 };

  if (APPLY) {
    if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
    for (const { file, content } of needed) {
      fs.writeFileSync(path.join(docsDir, file), content);
    }
  }

  return { rel, count: needed.length, files: needed.map(t => t.file) };
}

// ── main ─────────────────────────────────────────────────────────────────────

let apps = findApps(ROOT);

if (APP_ARG) {
  apps = apps.filter(a => path.basename(a) === APP_ARG || a.includes(APP_ARG));
}

console.log(`\nFound ${apps.length} Vite/React apps\n`);

let totalApps  = 0;
let totalFiles = 0;
let skipped    = 0;

for (const appDir of apps) {
  const { rel, count, files } = processApp(appDir);

  if (count === 0) { skipped++; continue; }

  totalApps++;
  totalFiles += count;

  if (APPLY) {
    console.log(`  DOCS  ${rel}  [${files.join(', ')}]`);
  } else {
    console.log(`  WOULD DOC  ${rel}  (+${count} files)`);
  }
}

console.log(`\n${ APPLY ? 'Done.' : 'Re-run with --apply to write changes.' }`);
console.log(`Apps documented: ${totalApps}`);
console.log(`Files generated: ${totalFiles}`);
console.log(`Already complete (skipped): ${skipped}`);
