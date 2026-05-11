/**
 * install-failed-apps.js
 * Reads the build-serve-screenshot report and runs pnpm install
 * on all apps that errored (excluding code 2 / dist-not-found).
 * Usage: node scripts/install-failed-apps.js
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REPORT = path.join(ROOT, 'catalogue', 'build-serve-screenshot-report.json');
const CONCURRENCY = 1;
const IS_WIN = process.platform === 'win32';

const r = JSON.parse(fs.readFileSync(REPORT, 'utf8'));
const apps = r.errors
  .filter(e => !e.error.includes('dist/ directory not found') && !e.error.includes('code 2'))
  .map(e => e.app);

console.log(`Installing ${apps.length} apps (concurrency ${CONCURRENCY})...\n`);

let done = 0;
const total = apps.length;
const queue = [...apps];
const results = { ok: [], fail: [] };

function installApp(app) {
  return new Promise(resolve => {
    const appDir = path.join(ROOT, app);
    const usePnpm = fs.existsSync(path.join(appDir, 'pnpm-lock.yaml'));
    const pm = usePnpm ? 'pnpm' : 'npm';
    const args = usePnpm
      ? ['install', '--no-frozen-lockfile', '--prefer-offline']
      : ['install', '--legacy-peer-deps'];

    const proc = spawn(pm, args, {
      cwd: appDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: IS_WIN,
      env: { ...process.env, NODE_ENV: 'development', CI: 'true' },
    });

    const timer = setTimeout(() => {
      try { proc.kill('SIGKILL'); } catch (_) {}
      results.fail.push(`${app} (timeout)`);
      console.log(`[${++done}/${total}] TIMEOUT  ${app}`);
      resolve();
    }, 300000);

    proc.on('close', code => {
      clearTimeout(timer);
      const idx = ++done;
      if (code === 0) {
        results.ok.push(app);
        process.stdout.write(`[${idx}/${total}] OK       ${app}\n`);
      } else {
        results.fail.push(`${app} (code ${code})`);
        process.stdout.write(`[${idx}/${total}] FAIL     ${app}\n`);
      }
      resolve();
    });

    proc.on('error', err => {
      clearTimeout(timer);
      results.fail.push(`${app} (${err.message})`);
      console.log(`[${++done}/${total}] ERR      ${app} — ${err.message}`);
      resolve();
    });
  });
}

async function worker() {
  while (queue.length) {
    const app = queue.shift();
    if (!app) break;
    await installApp(app);
  }
}

(async () => {
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  console.log(`\n✓ ${results.ok.length} ok   ✗ ${results.fail.length} failed`);
  if (results.fail.length) {
    console.log('Failed:');
    results.fail.forEach(f => console.log('  -', f));
  }
})();
