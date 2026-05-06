/**
 * patch-favicons.mjs
 * Ensures every index.html in the monorepo uses the TUC logo as its favicon.
 * - Already correct  → skipped
 * - Has a different <link rel="icon"> → replaced
 * - Has no favicon   → injected after <meta charset …>
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";

const ROOT     = fileURLToPath(new URL("..", import.meta.url));
const FAVICON  = `<link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />`;
const SKIP_DIR = new Set(["node_modules", "dist", "build", ".git"]);

const stats = { correct: 0, replaced: 0, injected: 0, skipped: 0 };

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIR.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) { walk(full); continue; }
    if (entry === "index.html") process_file(full);
  }
}

function process_file(file) {
  const rel  = relative(ROOT, file);
  let   html = readFileSync(file, "utf8");

  // Already correct
  if (html.includes("TUC_LOGO.png")) { stats.correct++; return; }

  // Has a different icon link → replace it
  const iconRx = /<link[^>]+rel=["'](?:shortcut )?icon["'][^>]*\/?>/gi;
  if (iconRx.test(html)) {
    html = html.replace(iconRx, FAVICON);
    writeFileSync(file, html, "utf8");
    console.log(`  replaced  ${rel}`);
    stats.replaced++;
    return;
  }

  // No icon at all → inject after <meta charset …> if present, else after <head>
  const charsetRx = /(<meta\s+charset[^>]+>)/i;
  const headRx    = /(<head[^>]*>)/i;

  if (charsetRx.test(html)) {
    html = html.replace(charsetRx, `$1\n    ${FAVICON}`);
  } else if (headRx.test(html)) {
    html = html.replace(headRx, `$1\n    ${FAVICON}`);
  } else {
    console.log(`  SKIPPED (no <head>) ${rel}`);
    stats.skipped++;
    return;
  }

  writeFileSync(file, html, "utf8");
  console.log(`  injected  ${rel}`);
  stats.injected++;
}

walk(ROOT);

console.log(`
Done
  already correct : ${stats.correct}
  replaced        : ${stats.replaced}
  injected        : ${stats.injected}
  skipped (no head): ${stats.skipped}
`);
