const fs = require('fs');
const path = require('path');

const root = process.cwd();
const outCsv = path.join(root, 'repo_audit_full.csv');
const outJson = path.join(root, 'repo_audit_full.json');

const ignoreDirs = new Set(['node_modules', '.git', '.github', 'dist', 'build', 'coverage']);

function isTextFile(file) {
  return /\.(md|mdx|txt|json|js|ts|jsx|tsx|py|yml|yaml|html|htm|tex)$/i.test(file);
}

function walk(dir, cb) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const full = path.join(dir, it.name);
    if (it.isDirectory()) {
      if (ignoreDirs.has(it.name)) continue;
      walk(full, cb);
    } else if (it.isFile()) {
      cb(full);
    }
  }
}

// collect projects (dirs with package.json at any depth under root, but prefer top-level folders)
const projectDirs = new Map();

walk(root, (file) => {
  const rel = path.relative(root, file).replace(/\\\\/g, '/');
  if (rel.split('/').length <= 3 && path.basename(file) === 'package.json') {
    // use parent dir as project name
    const proj = path.dirname(rel);
    projectDirs.set(proj || '.', path.join(root, proj || '.'));
  }
});

// also include any immediate subdirectory that has package.json in first 2 levels
const entries = fs.readdirSync(root, { withFileTypes: true });
for (const e of entries) {
  if (!e.isDirectory()) continue;
  const candidate = path.join(root, e.name);
  const pj = path.join(candidate, 'package.json');
  if (fs.existsSync(pj)) projectDirs.set(e.name, candidate);
}

// fallback: if projectDirs empty, try any package.json anywhere
if (projectDirs.size === 0) {
  walk(root, (file) => {
    if (path.basename(file) === 'package.json') {
      const rel = path.relative(root, path.dirname(file)).replace(/\\\\/g, '/');
      projectDirs.set(rel, path.join(root, rel));
    }
  });
}

const srsFiles = [];
const serverFiles = [];
const testFiles = [];
const ciFiles = [];

walk(root, (file) => {
  const rel = path.relative(root, file).replace(/\\\\/g, '/');
  const name = path.basename(file).toLowerCase();
  if (/srs/i.test(path.basename(file)) || /srs/i.test(rel)) srsFiles.push(rel);
  if (/\b(server|index)\.(js|ts|py)$/.test(name) || /\/backend\//i.test(rel) || /app\.py$/i.test(name)) serverFiles.push(rel);
  if (/\.test\.|__tests__|/i.test(rel) && isTextFile(rel) && /test/i.test(rel)) testFiles.push(rel);
  if (rel === 'bitbucket-pipelines.yml' || rel.includes('.github/workflows') || /\.gitlab-ci\.yml$/i.test(rel)) ciFiles.push(rel);
});

function findMatches(list, proj) {
  const hits = list.filter(p => p.startsWith(proj + '/') || p === proj || p.startsWith(proj + '/'));
  // also match if proj appears in path
  const alt = list.filter(p => p.includes('/' + proj + '/') || p.startsWith(proj + '/'));
  const merged = Array.from(new Set([...hits, ...alt]));
  return merged;
}

const rows = [];
for (const [proj, dirPath] of projectDirs.entries()) {
  const srs = srsFiles.filter(p => p.startsWith(proj + '/') || p.includes('/' + proj + '/') || p.startsWith(proj + '/'));
  const backend = serverFiles.filter(p => p.startsWith(proj + '/') || p.includes('/' + proj + '/') );
  const tests = testFiles.filter(p => p.startsWith(proj + '/') || p.includes('/' + proj + '/'));
  const cis = ciFiles.filter(p => p.startsWith(proj + '/') || p.includes('/' + proj + '/'));

  rows.push({
    project: proj,
    has_SRS: srs.length > 0 ? 'Yes' : 'No',
    SRS_paths: srs.join(';'),
    has_backend: backend.length > 0 ? 'Yes' : 'No',
    backend_paths: backend.join(';'),
    has_tests: tests.length > 0 ? 'Yes' : 'No',
    test_paths: tests.join(';'),
    has_CI: cis.length > 0 ? 'Yes' : 'No',
    ci_paths: cis.join(';')
  });
}

// Also include srs-only folders not in projectDirs
for (const s of srsFiles) {
  const top = s.split('/')[0];
  if (!projectDirs.has(top)) {
    rows.push({ project: top, has_SRS: 'Yes', SRS_paths: s, has_backend: 'No', backend_paths: '', has_tests: 'No', test_paths: '', has_CI: 'No', ci_paths: '' });
  }
}

const csv = ['project,has_SRS,SRS_paths,has_backend,backend_paths,has_tests,test_paths,has_CI,ci_paths'];
for (const r of rows) {
  const line = [r.project, r.has_SRS, `"${r.SRS_paths}"`, r.has_backend, `"${r.backend_paths}"`, r.has_tests, `"${r.test_paths}"`, r.has_CI, `"${r.ci_paths}"`].join(',');
  csv.push(line);
}
fs.writeFileSync(outCsv, csv.join('\n'));
fs.writeFileSync(outJson, JSON.stringify(rows, null, 2));

console.log('Audit complete. Results written to:', outCsv);
console.log('JSON written to:', outJson);
