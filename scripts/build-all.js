/**
 * build-all.js — parallel build all Vite apps
 * Usage: node scripts/build-all.js [--concurrency=4] [--install] [--only-missing]
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const args = Object.fromEntries(process.argv.slice(2).map(a => {
  const [k, v] = a.replace(/^--/, '').split('=');
  return [k, v ?? true];
}));

const CONCURRENCY = parseInt(args.concurrency ?? '4', 10);
const DO_INSTALL = !!args.install;
const ONLY_MISSING = !!args['only-missing'];
const SKIP = new Set(['node_modules', '.git', 'catalogue', 'scripts', 'archive', 'backend', 'dist', 'build', 'tests', 'aucdt-portal-tests']);

function getApps() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(e => e.isDirectory() && !SKIP.has(e.name) && !e.name.startsWith('.'))
    .filter(e => fs.existsSync(path.join(ROOT, e.name, 'vite.config.ts')) || fs.existsSync(path.join(ROOT, e.name, 'vite.config.js')))
    .filter(e => {
      if (!ONLY_MISSING) return true;
      return !fs.existsSync(path.join(ROOT, e.name, 'dist', 'index.html'));
    })
    .map(e => e.name)
    .sort();
}

async function buildApp(name) {
  const dir = path.join(ROOT, name);
  const hasNM = fs.existsSync(path.join(dir, 'node_modules'));

  if (DO_INSTALL && !hasNM) {
    await run('pnpm', ['install', '--prefer-offline'], dir, `${name}:install`);
  } else if (!hasNM) {
    return { name, status: 'skipped', reason: 'no node_modules' };
  }

  try {
    await run('pnpm', ['run', 'build'], dir, `${name}:build`);
    return { name, status: 'ok' };
  } catch (e) {
    return { name, status: 'error', error: e.message };
  }
}

function run(cmd, cmdArgs, cwd, label) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, cmdArgs, { cwd, shell: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    proc.stderr.on('data', d => { stderr += d; });
    proc.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`${label} exited ${code}: ${stderr.slice(-200)}`));
    });
  });
}

(async () => {
  const apps = getApps();
  console.log(`Building ${apps.length} apps (concurrency=${CONCURRENCY}, install=${DO_INSTALL})`);

  const queue = [...apps];
  let done = 0, ok = 0, errors = 0, skipped = 0;
  const total = apps.length;
  const failures = [];

  async function worker() {
    while (queue.length) {
      const name = queue.shift();
      if (!name) break;
      const r = await buildApp(name);
      done++;
      if (r.status === 'ok') { ok++; process.stdout.write(`[${done}/${total}] ✓ ${name}\n`); }
      else if (r.status === 'skipped') { skipped++; process.stdout.write(`[${done}/${total}] ○ ${name} (${r.reason})\n`); }
      else { errors++; failures.push(name); process.stdout.write(`[${done}/${total}] ✗ ${name}: ${r.error?.slice(0,80)}\n`); }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  console.log(`\nDone: ${ok} built, ${skipped} skipped, ${errors} errors`);
  if (failures.length) console.log('Failed:', failures.join(', '));
})();
