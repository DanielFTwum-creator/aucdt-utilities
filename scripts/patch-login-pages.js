#!/usr/bin/env node
/**
 * patch-login-pages.js
 * Updates generic "Admin Login" pages across all apps with app-specific
 * name, description, and accent colour derived from the app's package.json.
 *
 * Usage:
 *   node scripts/patch-login-pages.js             # patch all
 *   node scripts/patch-login-pages.js --dry-run   # preview only
 */

const fs   = require('fs');
const path = require('path');

const ROOT    = path.resolve(__dirname, '..');
const DRY_RUN = process.argv.includes('--dry-run');

// Accent colour palette — assigned by app index so each app looks distinct
const ACCENTS = [
  { bg: 'bg-blue-600',    hover: 'hover:bg-blue-700',    ring: 'focus:ring-blue-500',    text: 'text-blue-600'    },
  { bg: 'bg-violet-600',  hover: 'hover:bg-violet-700',  ring: 'focus:ring-violet-500',  text: 'text-violet-600'  },
  { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700', ring: 'focus:ring-emerald-500', text: 'text-emerald-600' },
  { bg: 'bg-rose-600',    hover: 'hover:bg-rose-700',    ring: 'focus:ring-rose-500',    text: 'text-rose-600'    },
  { bg: 'bg-amber-600',   hover: 'hover:bg-amber-700',   ring: 'focus:ring-amber-500',   text: 'text-amber-600'   },
  { bg: 'bg-cyan-600',    hover: 'hover:bg-cyan-700',    ring: 'focus:ring-cyan-500',    text: 'text-cyan-600'    },
  { bg: 'bg-indigo-600',  hover: 'hover:bg-indigo-700',  ring: 'focus:ring-indigo-500',  text: 'text-indigo-600'  },
  { bg: 'bg-teal-600',    hover: 'hover:bg-teal-700',    ring: 'focus:ring-teal-500',    text: 'text-teal-600'    },
  { bg: 'bg-orange-600',  hover: 'hover:bg-orange-700',  ring: 'focus:ring-orange-500',  text: 'text-orange-600'  },
  { bg: 'bg-pink-600',    hover: 'hover:bg-pink-700',    ring: 'focus:ring-pink-500',    text: 'text-pink-600'    },
];

function toTitleCase(str) {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\bAi\b/g, 'AI')
    .replace(/\bApi\b/g, 'API')
    .replace(/\bUi\b/g, 'UI')
    .replace(/\bUrl\b/g, 'URL')
    .replace(/\bTuc\b/g, 'TUC');
}

function getAppMeta(appDir) {
  const pkgPath = path.join(appDir, 'package.json');
  if (!fs.existsSync(pkgPath)) return null;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  // Use dir name as title — it's always the most specific identifier
  const title = toTitleCase(path.basename(appDir));
  // Clean description: strip trailing "App ID xxx" and generic category noise
  const desc = (pkg.description || '')
    .replace(/\s*App ID \d+/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return { title, description: desc };
}

function buildLoginPage(meta, accent) {
  // Derive a short subtitle: if description equals title, omit it
  const subtitle = meta.description && meta.description !== meta.title
    ? meta.description
    : 'Sign in to continue';

  return `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../authStore';
import { Shield } from 'lucide-react';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      login(username);
      navigate('/admin/diagnostics');
    } else {
      alert('Invalid credentials. Use admin/admin');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="${accent.text}" size={32} />
          <h1 className="text-2xl font-bold text-slate-900">${meta.title}</h1>
        </div>
        <p className="text-sm text-slate-500 mb-6">${subtitle}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 ${accent.ring} focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 ${accent.ring} focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full ${accent.bg} text-white py-2 rounded-lg ${accent.hover} font-medium"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
`;
}

const GENERIC = 'Admin Login';

let patched = 0;
let skipped = 0;
let idx = 0;

const apps = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter(e => e.isDirectory() && !e.name.startsWith('.'))
  .map(e => e.name)
  .sort();

for (const appName of apps) {
  const loginPath = path.join(ROOT, appName, 'src', 'pages', 'Login.tsx');
  if (!fs.existsSync(loginPath)) continue;

  const current = fs.readFileSync(loginPath, 'utf8');
  if (!current.includes(GENERIC)) {
    skipped++;
    continue;
  }

  const meta   = getAppMeta(path.join(ROOT, appName));
  if (!meta) continue;

  const accent  = ACCENTS[idx % ACCENTS.length];
  const updated = buildLoginPage(meta, accent);
  idx++;

  if (DRY_RUN) {
    console.log(`[dry-run] ${appName} → "${meta.title}" (${accent.bg})`);
  } else {
    fs.writeFileSync(loginPath, updated, 'utf8');
    console.log(`✓ ${appName} → "${meta.title}" (${accent.bg})`);
  }
  patched++;
}

console.log(`\n${DRY_RUN ? '[dry-run] ' : ''}Patched: ${patched}  Skipped (already custom): ${skipped}`);
