#!/usr/bin/env node
/**
 * Phase 2 — Wire Auth into main.tsx / main.jsx / index.tsx
 * Techbridge University College / TUC
 *
 * Strategy (non-destructive):
 *   1. Creates src/AppWithAuth.tsx — wraps existing App with BrowserRouter,
 *      AuthProvider, and /login + /admin routes.
 *   2. Patches the app entry file to import AppWithAuth instead of App
 *      (only if AppWithAuth is not already imported).
 *
 * Usage:
 *   node scripts/phase2-wire-auth.js          # dry run
 *   node scripts/phase2-wire-auth.js --apply  # write files
 *   node scripts/phase2-wire-auth.js --apply --app=<name>
 */
const fs   = require('fs');
const path = require('path');

const APPLY   = process.argv.includes('--apply');
const APP_ARG = (process.argv.find(a => a.startsWith('--app=')) || '').replace('--app=', '');
const ROOT    = path.resolve(__dirname, '..');

const SKIP = new Set([
  'node_modules','.git','dist','build','scripts','templates','thumbnail-generator',
  'backend','aucdt-portal-tests','tuc-portal-tests','docker','docs','archive',
  'catalogue','project-screenshots','project-screenshots-real','monitoring',
  'reports','build-validation-reports','proof-of-concept-screenshots',
  'master-thumbnail-catalog','playwright','src','gemini','genai','sync-from-d-drive'
]);

const BACKEND_APPS = new Set([
  'accommodation-management','alumni-network','career-services',
  'complaint-resolution-system','health-wellness-portal','internship-program',
  'library-management','mentorship-program','research-portal',
  'scholarship-tracker','student-payment-system','student-success-coach',
  'techbridge-dashboard','techbridge-sentinel-agent','newsfeed','NEWSFEED',
  'lecturer-assessment-portal','modern-product-dev-lifecycle','tsapro-mapping-review',
]);

// ── AppWithAuth template ───────────────────────────────────────────────────────

const appWithAuth = (appName, appImportPath) => `import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import App from '${appImportPath}';

export default function AppWithAuth() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
`;

// ── helpers ───────────────────────────────────────────────────────────────────

function findEntryFile(srcDir) {
  const candidates = ['main.tsx','main.jsx','main.ts','main.js','index.tsx','index.jsx'];
  for (const c of candidates) {
    const fp = path.join(srcDir, c);
    if (fs.existsSync(fp)) return fp;
  }
  return null;
}

function findAppImport(entryContent) {
  // Detect what the entry file imports as the root component
  const m = entryContent.match(/import\s+\w+\s+from\s+['"]([^'"]*App[^'"]*)['"]/);
  return m ? m[1] : './App';
}

function hasAuthProvider(srcDir) {
  const awPath = path.join(srcDir, 'AppWithAuth.tsx');
  if (fs.existsSync(awPath)) return true;
  try {
    const entry = findEntryFile(srcDir);
    if (!entry) return false;
    const c = fs.readFileSync(entry, 'utf8');
    return c.includes('AuthProvider') || c.includes('AppWithAuth');
  } catch { return false; }
}

function hasAuthFiles(srcDir) {
  return fs.existsSync(path.join(srcDir, 'contexts', 'AuthContext.tsx')) &&
         fs.existsSync(path.join(srcDir, 'pages', 'LoginPage.tsx'));
}

function patchEntry(entryPath, appImport) {
  let content = fs.readFileSync(entryPath, 'utf8');

  // Already wired?
  if (content.includes('AppWithAuth')) return false;

  // Replace App import with AppWithAuth
  const oldAppImportRe = /import\s+App\s+from\s+['"][^'"]*['"]/;
  const newAppImport = `import AppWithAuth from './AppWithAuth'`;

  if (oldAppImportRe.test(content)) {
    content = content.replace(oldAppImportRe, newAppImport);
  } else {
    // Prepend import
    content = `${newAppImport};\n` + content;
  }

  // Replace <App /> with <AppWithAuth />
  content = content.replace(/<App\s*\/>/g, '<AppWithAuth />');
  content = content.replace(/<App>/g, '<AppWithAuth>');
  content = content.replace(/<\/App>/g, '</AppWithAuth>');

  fs.writeFileSync(entryPath, content);
  return true;
}

// ── discovery ─────────────────────────────────────────────────────────────────

const targets = [];
for (const e of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!e.isDirectory() || SKIP.has(e.name) || e.name.startsWith('.')) continue;
  if (APP_ARG && e.name !== APP_ARG) continue;
  if (BACKEND_APPS.has(e.name)) continue;
  const dir    = path.join(ROOT, e.name);
  const srcDir = path.join(dir, 'src');
  if (!fs.existsSync(path.join(dir, 'package.json'))) continue;
  if (!fs.existsSync(srcDir)) continue;
  if (!hasAuthFiles(srcDir)) continue;        // auth files must exist
  if (hasAuthProvider(srcDir)) continue;      // skip already wired
  const entry = findEntryFile(srcDir);
  if (!entry) continue;
  targets.push({ name: e.name, dir, srcDir, entry });
}

console.log(`\nApps to wire: ${targets.length}`);
if (!APPLY) {
  targets.slice(0, 20).forEach(t => console.log('  ', t.name));
  if (targets.length > 20) console.log(`  ... and ${targets.length - 20} more`);
  console.log('\nRe-run with --apply to write files.');
  process.exit(0);
}

// ── apply ─────────────────────────────────────────────────────────────────────

let wired = 0, skipped = 0;
for (const { name, srcDir, entry } of targets) {
  try {
    const entryContent = fs.readFileSync(entry, 'utf8');
    const appImport    = findAppImport(entryContent);

    // Write AppWithAuth.tsx
    const awPath = path.join(srcDir, 'AppWithAuth.tsx');
    fs.writeFileSync(awPath, appWithAuth(name, appImport));

    // Patch entry file
    const patched = patchEntry(entry, appImport);

    console.log(`  ✓ ${name} (${path.basename(entry)}${patched ? ' patched' : ' — entry unchanged'})`);
    wired++;
  } catch (err) {
    console.log(`  ✗ ${name} — ${err.message}`);
    skipped++;
  }
}

console.log(`\nDone: ${wired} wired, ${skipped} skipped/errors.`);
