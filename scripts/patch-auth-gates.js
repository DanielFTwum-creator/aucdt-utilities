#!/usr/bin/env node
/**
 * patch-auth-gates.js
 * Adds a lightweight auth gate (login screen) to apps that have no login page.
 * Injects an AuthGate component at the app's entry point — no routing changes.
 *
 * Credentials: admin / admin  (consistent with all other TUC apps)
 * Storage: sessionStorage (cleared on browser close — screenshot always sees login)
 *
 * Usage:
 *   node scripts/patch-auth-gates.js             # patch all apps missing login
 *   node scripts/patch-auth-gates.js --dry-run   # preview only
 *   node scripts/patch-auth-gates.js --app=kanban-app  # single app
 */

const fs   = require('fs');
const path = require('path');

const ROOT    = path.resolve(__dirname, '..');
const DRY_RUN = process.argv.includes('--dry-run');
const ONLY    = (process.argv.find(a => a.startsWith('--app=')) || '').replace('--app=', '') || null;

const SKIP = new Set([
  'node_modules', '.git', 'catalogue', 'scripts', 'archive', 'docs',
  'dist', 'build', 'tests', 'test-results', 'aucdt-portal-tests',
  'playwright-report', 'backend', 'docker', 'src', 'templates',
  'reports', 'build-logs', 'install-logs', 'build-validation-reports',
]);

const ACCENTS = [
  '#3b82f6','#7c3aed','#059669','#e11d48','#d97706',
  '#0891b2','#4f46e5','#0d9488','#ea580c','#db2777',
];

function toTitleCase(str) {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\bAi\b/g, 'AI').replace(/\bApi\b/g, 'API')
    .replace(/\bUi\b/g, 'UI').replace(/\bTuc\b/g, 'TUC');
}

function getAppMeta(appDir) {
  const pkgPath = path.join(appDir, 'package.json');
  if (!fs.existsSync(pkgPath)) return null;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const title = toTitleCase(path.basename(appDir));
  const desc = (pkg.description || '')
    .replace(/\s*App ID \d+/gi, '').replace(/\s{2,}/g, ' ').trim();
  return { title, description: desc };
}

// ── AuthGate component template (no external deps — inline styles only) ──────
function buildAuthGate(meta, accent, isTsx) {
  const ext = isTsx ? 'tsx' : 'jsx';
  const typeAnnotations = isTsx;
  const subtitle = meta.description && meta.description !== meta.title
    ? meta.description : 'Sign in to continue';

  return `import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_${meta.title.replace(/\s+/g, '_').toLowerCase()}';
const ACCENT   = '${accent}';

${typeAnnotations
  ? "export function AuthGate({ children }: { children: React.ReactNode }) {"
  : "export function AuthGate({ children }) {"}
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (authed) return <>{children}</>;

  const handleSubmit = (e${typeAnnotations ? ': React.FormEvent' : ''}) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
    } else {
      setError('Invalid credentials. Use admin / admin');
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{background:'#fff',padding:'36px',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.10)',width:'100%',maxWidth:'420px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
          <div style={{width:'38px',height:'38px',background:ACCENT,borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'20px',flexShrink:0}}>⚡</div>
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>${meta.title}</h1>
        </div>
        <p style={{fontSize:'13px',color:'#94a3b8',margin:'0 0 24px 0'}}>${subtitle}</p>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          {error && <p style={{color:'#ef4444',fontSize:'13px',margin:'0 0 12px 0'}}>{error}</p>}
          <button
            type="submit"
            style={{width:'100%',padding:'10px',background:ACCENT,color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}
          >
            Sign In
          </button>
        </form>
        <p style={{fontSize:'11px',color:'#cbd5e1',textAlign:'center',marginTop:'16px',marginBottom:0}}>Techbridge University College &nbsp;·&nbsp; admin / admin</p>
      </div>
    </div>
  );
}
`;
}

// ── Detect entry file ─────────────────────────────────────────────────────────
function detectEntry(appDir) {
  // Standard Vite: src/main.tsx or src/main.jsx
  for (const f of ['src/main.tsx','src/main.jsx','src/main.js','src/index.tsx','src/index.jsx','src/index.js']) {
    const full = path.join(appDir, f);
    if (fs.existsSync(full)) return { file: full, relDir: 'src', isTsx: f.endsWith('.tsx') || f.endsWith('.ts') };
  }
  // Root-level entry (index.tsx/jsx referenced from index.html)
  for (const f of ['index.tsx','index.jsx','index.js']) {
    const full = path.join(appDir, f);
    if (fs.existsSync(full)) return { file: full, relDir: '.', isTsx: f.endsWith('.tsx') };
  }
  return null;
}

// ── Check if already has any login/auth gate ──────────────────────────────────
function hasLoginPage(appDir) {
  const checks = [
    'src/pages/Login.tsx', 'src/pages/Login.jsx',
    'src/pages/auth/Login.tsx', 'src/pages/auth/Login.jsx',
    'src/AuthGate.tsx', 'src/AuthGate.jsx',
    'AuthGate.tsx', 'AuthGate.jsx',
  ];
  return checks.some(c => fs.existsSync(path.join(appDir, c)));
}

// ── Patch entry file to wrap <App> with <AuthGate> ────────────────────────────
function patchEntry(entryFile, gateImportPath, isTsx) {
  let content = fs.readFileSync(entryFile, 'utf8');

  // Already patched?
  if (content.includes('AuthGate')) return false;

  // Insert import after last existing import line
  const importLine = `import { AuthGate } from '${gateImportPath}';`;
  const lastImportIdx = [...content.matchAll(/^import .+$/gm)].pop();
  if (lastImportIdx) {
    const insertAt = lastImportIdx.index + lastImportIdx[0].length;
    content = content.slice(0, insertAt) + '\n' + importLine + content.slice(insertAt);
  } else {
    content = importLine + '\n' + content;
  }

  // Wrap root render — handles both createRoot().render() and ReactDOM.render()
  // Pattern: wrap the JSX passed to render with <AuthGate>...</AuthGate>
  content = content
    // createRoot(...).render(<X />) → createRoot(...).render(<AuthGate><X /></AuthGate>)
    .replace(
      /\.render\(\s*(<(?:React\.)?StrictMode>)([\s\S]*?)(<\/(?:React\.)?StrictMode>)\s*,?\s*\)/,
      (_, open, inner, close) =>
        `.render(\n  ${open}\n    <AuthGate>${inner.trim()}</AuthGate>\n  ${close}\n)`
    )
    // createRoot(...).render(<App />) without StrictMode
    .replace(
      /\.render\(\s*(<(?!AuthGate)[A-Z]\S*\s*\/>)\s*,?\s*\)/,
      (_, jsx) => `.render(\n  <AuthGate>${jsx}</AuthGate>\n)`
    )
    // ReactDOM.render(<App />, ...)
    .replace(
      /ReactDOM\.render\(\s*(<(?!AuthGate)[A-Z]\S*\s*\/>),/,
      (_, jsx) => `ReactDOM.render(\n  <AuthGate>${jsx}</AuthGate>,`
    );

  return content;
}

// ── Main ──────────────────────────────────────────────────────────────────────
const apps = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter(e => e.isDirectory() && !SKIP.has(e.name) && !e.name.startsWith('.'))
  .filter(e => fs.existsSync(path.join(ROOT, e.name, 'package.json')))
  .map(e => e.name)
  .sort()
  .filter(name => !ONLY || name === ONLY);

let patched = 0, skipped = 0, failed = 0;

apps.forEach((appName, idx) => {
  const appDir = path.join(ROOT, appName);

  // Skip if already has login/auth
  if (hasLoginPage(appDir)) { skipped++; return; }

  const entry = detectEntry(appDir);
  if (!entry) { console.log(`  skip ${appName} — no detectable entry`); failed++; return; }

  const meta   = getAppMeta(appDir);
  if (!meta) { failed++; return; }

  const accent = ACCENTS[idx % ACCENTS.length];
  const isTsx  = entry.isTsx;

  // Where to write AuthGate file
  const gateFileName = isTsx ? 'AuthGate.tsx' : 'AuthGate.jsx';
  const gateDir      = entry.relDir === 'src'
    ? path.join(appDir, 'src')
    : appDir;
  const gateFile     = path.join(gateDir, gateFileName);

  // Import path from entry file to AuthGate
  const entryDir     = path.dirname(entry.file);
  const gateRelPath  = './' + path.relative(entryDir, gateFile).replace(/\\/g, '/').replace(/\.(tsx?|jsx?)$/, '');

  const gateContent    = buildAuthGate(meta, accent, isTsx);
  const patchedContent = patchEntry(entry.file, gateRelPath, isTsx);

  if (patchedContent === false) {
    console.log(`  skip ${appName} — entry already has AuthGate`);
    skipped++;
    return;
  }

  if (DRY_RUN) {
    console.log(`[dry-run] ${appName} → AuthGate at ${path.relative(appDir, gateFile)} (${accent})`);
  } else {
    fs.writeFileSync(gateFile, gateContent, 'utf8');
    fs.writeFileSync(entry.file, patchedContent, 'utf8');
    console.log(`✓ ${appName} → ${path.relative(appDir, gateFile)} (${accent})`);
  }
  patched++;
});

console.log(`\n${DRY_RUN ? '[dry-run] ' : ''}Patched: ${patched}  Skipped: ${skipped}  Failed: ${failed}`);
