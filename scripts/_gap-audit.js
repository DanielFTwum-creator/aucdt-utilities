#!/usr/bin/env node
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SKIP = new Set([
  'node_modules','.git','dist','build','scripts','templates','thumbnail-generator',
  'backend','aucdt-portal-tests','tuc-portal-tests','docker','docs','archive',
  'catalogue','project-screenshots','project-screenshots-real','monitoring',
  'reports','build-validation-reports','proof-of-concept-screenshots',
  'master-thumbnail-catalog','playwright','src','gemini','genai','sync-from-d-drive'
]);

const noDockerfile = [], noVitest = [], noARIA = [], noAdmin = [], noAuth = [];

function walkSrc(dir, test) {
  let found = false;
  try {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      if (found) break;
      if (f.isDirectory()) { found = walkSrc(path.join(dir, f.name), test); }
      else if (f.name.match(/\.(tsx|jsx|ts|js)$/)) {
        try {
          const c = fs.readFileSync(path.join(dir, f.name), 'utf8');
          if (test(c)) found = true;
        } catch { /* ignore */ }
      }
    }
  } catch { /* ignore */ }
  return found;
}

for (const e of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!e.isDirectory() || SKIP.has(e.name) || e.name.startsWith('.')) continue;
  const dir = path.join(ROOT, e.name);
  if (!fs.existsSync(path.join(dir, 'package.json'))) continue;

  if (!fs.existsSync(path.join(dir, 'Dockerfile'))) noDockerfile.push(e.name);
  if (!fs.existsSync(path.join(dir, 'vitest.config.ts'))) noVitest.push(e.name);

  const srcDir = path.join(dir, 'src');
  const hasSrc = fs.existsSync(srcDir);
  const searchDir = hasSrc ? srcDir : dir;

  if (!walkSrc(searchDir, c => c.includes('aria-')))                                    noARIA.push(e.name);
  if (!walkSrc(searchDir, c => c.includes('/admin') || c.includes('Admin')))            noAdmin.push(e.name);
  if (!walkSrc(searchDir, c => c.includes('AuthContext') || c.includes('useAuth') ||
                                c.includes('localStorage') || c.includes('token')))     noAuth.push(e.name);
}

console.log('\n== GAP AUDIT REPORT ==\n');
console.log(`No Dockerfile    : ${noDockerfile.length}`);
console.log(`No Vitest config : ${noVitest.length}`);
console.log(`No ARIA attrs    : ${noARIA.length}`);
console.log(`No Admin route   : ${noAdmin.length}`);
console.log(`No Auth          : ${noAuth.length}`);

if (noDockerfile.length) {
  console.log('\nApps missing Dockerfile:');
  noDockerfile.forEach(a => console.log(' ', a));
}
if (noVitest.length) {
  console.log('\nSample apps missing vitest.config.ts (first 10):');
  noVitest.slice(0, 10).forEach(a => console.log(' ', a));
}
