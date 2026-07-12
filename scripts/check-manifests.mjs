#!/usr/bin/env node
/**
 * check-manifests.mjs — fleet guard for PWA manifest icons (Pattern 33).
 *
 * The AI-Studio scaffold ships manifest.json files that reference icon/screenshot
 * PNGs which were never added to the app, producing a console
 *   "Error while trying to use the following icon from the Manifest ... isn't a valid image"
 * on every load. This scans every app manifest and fails if any local icon/screenshot
 * src does not exist on disk, or if an icon is loaded from an external URL (Pattern 32:
 * no foreign round-trips at boot).
 *
 * Usage:  node scripts/check-manifests.mjs         # scan the whole fleet, exit 1 on any break
 *         node scripts/check-manifests.mjs <appdir> # scan one app
 * Exit code: 0 = all manifest assets resolve locally, 1 = problems found.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const ROOT = resolve(process.argv[2] ? process.argv[2] : '.');
const SCAN_ONE = !!process.argv[2];

/** Find manifest.json files, skipping node_modules/dist and the repo-root stray. */
function findManifests(base) {
  const out = [];
  const walk = (dir, depth) => {
    if (depth > 3) return;
    let entries = [];
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (e.name === 'node_modules' || e.name === 'dist' || e.name === '.git') continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p, depth + 1);
      else if (e.name === 'manifest.json') out.push(p);
    }
  };
  walk(base, 0);
  // The repo-root manifest (directly in base) is a stray, not a deployed app — skip it.
  return out.filter((m) => dirname(m) !== base || SCAN_ONE);
}

/** Collect every icon/screenshot/shortcut src in a manifest object. */
function collectSrcs(manifest) {
  const srcs = [];
  const push = (arr) => Array.isArray(arr) && arr.forEach((i) => i && i.src && srcs.push(i.src));
  push(manifest.icons);
  push(manifest.screenshots);
  if (Array.isArray(manifest.shortcuts)) manifest.shortcuts.forEach((s) => push(s.icons));
  return srcs;
}

let problems = 0;
const manifests = findManifests(ROOT);
for (const m of manifests) {
  // Manifest lives in <app>/public/manifest.json or <app>/manifest.json; assets resolve
  // against that directory (public/ is the web root, so "/foo.png" -> public/foo.png).
  const webRoot = dirname(m);
  let data;
  try { data = JSON.parse(readFileSync(m, 'utf8')); }
  catch (e) { console.log(`  ✗ ${m}: invalid JSON (${e.message})`); problems++; continue; }

  for (const src of collectSrcs(data)) {
    if (/^(https?:)?\/\//.test(src)) {
      console.log(`  ✗ ${m}: external icon URL "${src}" (Pattern 32 — bundle it locally)`);
      problems++;
      continue;
    }
    const rel = src.replace(/^\//, '');           // "/icon.png" and "icon.png" both -> webRoot/rel
    const candidate = join(webRoot, rel);
    if (!existsSync(candidate) || !statSync(candidate).isFile()) {
      console.log(`  ✗ ${dirname(m)}: manifest references missing "${src}"`);
      problems++;
    }
  }
}

if (problems === 0) {
  console.log(`✓ ${manifests.length} manifest(s) checked — all icon/screenshot assets resolve locally.`);
  process.exit(0);
} else {
  console.log(`\n${problems} manifest asset problem(s). Point icons at the app's favicon.svg (sizes "any") or add the file (Pattern 33).`);
  process.exit(1);
}
