#!/usr/bin/env node
/**
 * Docker Expand — Add missing apps to docker-compose-all-apps.yml + nginx.conf
 * Techbridge University College / TUC
 *
 * The docker-compose-all-apps.yml was frozen at 109 services (Feb 2026).
 * ~181 new Vite/React apps have Dockerfiles but are not in the compose file.
 * This script appends the missing service entries and nginx location blocks.
 *
 * Usage:
 *   node scripts/docker-expand.js              # dry run — lists missing apps
 *   node scripts/docker-expand.js --apply      # write compose + nginx changes
 *   node scripts/docker-expand.js --apply --only=compose
 *   node scripts/docker-expand.js --apply --only=nginx
 */

const fs   = require('fs');
const path = require('path');

const APPLY    = process.argv.includes('--apply');
const ONLY_ARG = (process.argv.find(a => a.startsWith('--only=')) || '').replace('--only=', '');
const ROOT     = path.resolve(__dirname, '..');

const COMPOSE_PATH = path.join(ROOT, 'docker-compose-all-apps.yml');
const NGINX_PATH   = path.join(ROOT, 'docker', 'nginx', 'nginx-all-apps.conf');

// Directories that should NOT get Docker entries
const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.pnpm-store',
  'scripts', 'templates', 'thumbnail-generator', 'backend',
  'aucdt-portal-tests', 'tuc-portal-tests', 'docker',
  'docs', 'project-screenshots', 'catalogue',
]);

// Known backends — use Dockerfile.fullstack instead of Dockerfile.vite
const BACKEND_APPS = new Set([
  'accommodation-management', 'alumni-network', 'career-services',
  'complaint-resolution-system', 'health-wellness-portal', 'internship-program',
  'library-management', 'mentorship-program', 'research-portal',
  'scholarship-tracker', 'student-payment-system', 'student-success-coach',
  'techbridge-dashboard', 'techbridge-sentinel-agent', 'newsfeed', 'NEWSFEED',
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

function hasDockerfile(dir) {
  return fs.existsSync(path.join(dir, 'Dockerfile'));
}

function getExistingServices(composeContent) {
  const services = new Set();
  // Match top-level service names (2-space indent, ends with colon, no sub-indent)
  const re = /^  ([a-zA-Z0-9][a-zA-Z0-9_-]+):/gm;
  let m;
  while ((m = re.exec(composeContent)) !== null) {
    services.add(m[1]);
  }
  return services;
}

function getExistingNginxLocations(nginxContent) {
  const locations = new Set();
  const re = /location \/([^/\s{]+)\//g;
  let m;
  while ((m = re.exec(nginxContent)) !== null) {
    locations.add(m[1]);
  }
  return locations;
}

// ── template generators ───────────────────────────────────────────────────────

function composeEntry(appName, isBackend) {
  const dockerfile = isBackend ? '../Dockerfile.fullstack' : '../Dockerfile.vite';
  // Sanitize service name (docker service names can't have spaces/special chars)
  const serviceName = appName.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
  return `
  ${serviceName}:
    build:
      context: ./${appName}
      dockerfile: ${dockerfile}
    container_name: ${serviceName}
    environment:
      - NODE_ENV=production
    networks:
      - tuc-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    profiles:
      - standard
      - full
`;
}

function nginxLocationBlock(appName) {
  const serviceName = appName.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
  // Use slug derived from app name for the URL path
  const urlSlug = serviceName;
  return `
    location /${urlSlug}/ {
        proxy_pass http://${serviceName}/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
`;
}

// ── discovery ─────────────────────────────────────────────────────────────────

function findCandidateApps() {
  const results = [];
  let entries;
  try { entries = fs.readdirSync(ROOT, { withFileTypes: true }); }
  catch { return []; }

  for (const e of entries) {
    if (!e.isDirectory()) continue;
    if (SKIP_DIRS.has(e.name)) continue;
    if (e.name.startsWith('.')) continue;
    const full = path.join(ROOT, e.name);
    // Must have a Dockerfile (or be a Vite app — we'll add Dockerfile note)
    if (!hasDockerfile(full) && !isViteApp(full)) continue;
    results.push(e.name);
  }

  // Also check ai-utilities sub-apps
  const aiUtils = path.join(ROOT, 'ai-utilities');
  if (fs.existsSync(aiUtils)) {
    try {
      const subEntries = fs.readdirSync(aiUtils, { withFileTypes: true });
      for (const e of subEntries) {
        if (!e.isDirectory()) continue;
        if (e.name.startsWith('.')) continue;
        const full = path.join(aiUtils, e.name);
        if (!hasDockerfile(full) && !isViteApp(full)) continue;
        results.push(`ai-utilities/${e.name}`);
      }
    } catch { /* ignore */ }
  }

  return results;
}

// ── main ─────────────────────────────────────────────────────────────────────

let composeContent, nginxContent;
try { composeContent = fs.readFileSync(COMPOSE_PATH, 'utf8'); }
catch { console.error('Cannot read docker-compose-all-apps.yml'); process.exit(1); }
try { nginxContent = fs.readFileSync(NGINX_PATH, 'utf8'); }
catch { console.warn('Cannot read docker/nginx/nginx.conf — nginx updates skipped'); nginxContent = null; }

const existingServices  = getExistingServices(composeContent);
const existingLocations = nginxContent ? getExistingNginxLocations(nginxContent) : new Set();

console.log(`\nExisting compose services: ${existingServices.size}`);
console.log(`Existing nginx routes:     ${existingLocations.size}`);

const candidates = findCandidateApps();
console.log(`Candidate apps found:      ${candidates.length}\n`);

const missingFromCompose = [];
const missingFromNginx   = [];

for (const appName of candidates) {
  const serviceName = appName.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
  // Also check by basename for ai-utilities/* entries
  const baseName = path.basename(appName).replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();

  if (!existingServices.has(serviceName) && !existingServices.has(baseName)) {
    missingFromCompose.push(appName);
  }
  if (nginxContent && !existingLocations.has(serviceName) && !existingLocations.has(baseName)) {
    missingFromNginx.push(appName);
  }
}

console.log(`Missing from docker-compose: ${missingFromCompose.length}`);
console.log(`Missing from nginx:          ${missingFromNginx.length}`);

if (!APPLY) {
  console.log('\nSample missing apps:');
  missingFromCompose.slice(0, 15).forEach(a => console.log(`  ${a}`));
  if (missingFromCompose.length > 15) console.log(`  ... and ${missingFromCompose.length - 15} more`);
  console.log('\nRe-run with --apply to write changes.');
  process.exit(0);
}

// ── apply compose changes ─────────────────────────────────────────────────────

if (!ONLY_ARG || ONLY_ARG === 'compose') {
  if (missingFromCompose.length > 0) {
    // Build new service entries
    const newEntries = missingFromCompose
      .map(appName => composeEntry(appName, BACKEND_APPS.has(path.basename(appName))))
      .join('');

    // Insert before the 'networks:' section
    const updated = composeContent.replace(
      /^networks:/m,
      `${newEntries}\nnetworks:`
    );

    // Update header comment counts
    const newTotal    = existingServices.size - 1 + missingFromCompose.length; // -1 for nginx-gateway
    const updatedHdr  = updated
      .replace(/Total Projects: \d+/, `Total Projects: ${newTotal}`)
      .replace(/Services Configured: \d+/, `Services Configured: ${newTotal}`)
      .replace(/# Last Updated: .+/, `# Last Updated: ${new Date().toISOString().split('T')[0]}`);

    fs.writeFileSync(COMPOSE_PATH, updatedHdr);
    console.log(`\nCOMPOSE: Added ${missingFromCompose.length} service entries to docker-compose-all-apps.yml`);
  } else {
    console.log('\nCOMPOSE: Already complete — no new entries needed.');
  }
}

// ── apply nginx changes ───────────────────────────────────────────────────────

if (nginxContent && (!ONLY_ARG || ONLY_ARG === 'nginx')) {
  if (missingFromNginx.length > 0) {
    const newBlocks = missingFromNginx
      .map(appName => nginxLocationBlock(appName))
      .join('');

    // Insert before closing brace of server block
    const updated = nginxContent.replace(
      /(\n\})\s*$/,
      `${newBlocks}\n}\n`
    );

    fs.writeFileSync(NGINX_PATH, updated);
    console.log(`NGINX:   Added ${missingFromNginx.length} location blocks to nginx.conf`);
  } else {
    console.log('NGINX:   Already complete — no new routes needed.');
  }
}

console.log('\nDone.');
console.log('Next: docker-compose -f docker-compose-all-apps.yml build --parallel');
console.log('      docker-compose -f docker-compose-all-apps.yml up -d');
