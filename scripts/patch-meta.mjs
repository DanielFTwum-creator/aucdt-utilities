/**
 * patch-meta.mjs
 *
 * Injects TUC-standard <head> meta tags into every index.html in the monorepo,
 * modelled on the canonical techbridge.edu.gh headers.
 *
 * Rules
 * ──────
 * • Idempotent — already-present tags are never duplicated
 * • Per-app: og:title / twitter:title pulled from existing <title>
 * • Per-app: og:description / twitter:description / meta description pulled
 *   from existing description meta (falls back to generic TUC copy)
 * • <html lang="en-GB"> is ensured on every file
 * • All injected tags grouped into labelled blocks for readability
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";

const ROOT     = fileURLToPath(new URL("..", import.meta.url));
const SKIP_DIR = new Set(["node_modules", "dist", "build", ".git", "datahub-env"]);

const TUC_DESC =
  "Techbridge University College (TUC) is a premier private institution in Accra " +
  "pioneering innovative and progressive higher education in design and entrepreneurship.";

const TUC_KEYWORDS =
  "Techbridge University College, TUC, design education, technology education, " +
  "Accra university, Ghana university, product design, entrepreneurship, " +
  "private university Ghana, design school";

// ── helpers ──────────────────────────────────────────────────────────────────

function extract(html, rx) {
  const m = html.match(rx);
  return m ? m[1].trim() : null;
}

function hasTag(html, pattern) {
  return new RegExp(pattern, "i").test(html);
}

function ensureHtmlLang(html) {
  return html
    .replace(/<html([^>]*)lang=["'][^"']*["']/i, '<html$1lang="en-GB"')
    .replace(/<html(?![^>]*lang=)([^>]*)>/i,     '<html$1 lang="en-GB">');
}

// Build the block of tags to inject, skipping anything already present
function buildBlock(html, title, desc) {
  const lines = [];
  const add   = (tag, guard) => { if (!hasTag(html, guard)) lines.push(tag); };

  lines.push("    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->");

  // IE compat
  add(`    <meta http-equiv="X-UA-Compatible" content="IE=edge" />`,
      `http-equiv=["']X-UA-Compatible`);

  // Basic SEO
  lines.push("    <!-- SEO -->");
  add(`    <meta name="description" content="${desc}" />`,
      `name=["']description`);
  add(`    <meta name="keywords" content="${TUC_KEYWORDS}" />`,
      `name=["']keywords`);
  add(`    <meta name="author" content="Techbridge University College" />`,
      `name=["']author`);
  add(`    <meta name="publisher" content="Techbridge University College" />`,
      `name=["']publisher`);
  add(`    <link rel="canonical" href="https://www.techbridge.edu.gh/" />`,
      `rel=["']canonical`);
  add(`    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`,
      `name=["']robots`);

  // Geographic
  lines.push("    <!-- Geographic -->");
  add(`    <meta name="language" content="English" />`,                `name=["']language`);
  add(`    <meta name="geo.region" content="GH-AA" />`,               `name=["']geo\\.region`);
  add(`    <meta name="geo.placename" content="Accra" />`,            `name=["']geo\\.placename`);
  add(`    <meta name="geo.position" content="5.6037;-0.1870" />`,    `name=["']geo\\.position`);
  add(`    <meta name="ICBM" content="5.6037, -0.1870" />`,           `name=["']ICBM`);

  // Open Graph
  lines.push("    <!-- Open Graph -->");
  add(`    <meta property="og:type" content="website" />`,            `property=["']og:type`);
  add(`    <meta property="og:url" content="https://www.techbridge.edu.gh/" />`, `property=["']og:url`);
  add(`    <meta property="og:site_name" content="Techbridge University College" />`, `property=["']og:site_name`);
  add(`    <meta property="og:title" content="${title}" />`,           `property=["']og:title`);
  add(`    <meta property="og:description" content="${desc}" />`,      `property=["']og:description`);
  add(`    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />`, `property=["']og:image["' ]`);
  add(`    <meta property="og:image:width" content="1200" />`,        `property=["']og:image:width`);
  add(`    <meta property="og:image:height" content="630" />`,        `property=["']og:image:height`);
  add(`    <meta property="og:image:alt" content="Techbridge University College Logo" />`, `property=["']og:image:alt`);
  add(`    <meta property="og:locale" content="en_GB" />`,            `property=["']og:locale`);

  // Twitter Card
  lines.push("    <!-- Twitter Card -->");
  add(`    <meta name="twitter:card" content="summary_large_image" />`, `name=["']twitter:card`);
  add(`    <meta name="twitter:site" content="@TUCGhana" />`,          `name=["']twitter:site`);
  add(`    <meta name="twitter:creator" content="@TUCGhana" />`,       `name=["']twitter:creator`);
  add(`    <meta name="twitter:title" content="${title}" />`,           `name=["']twitter:title`);
  add(`    <meta name="twitter:description" content="${desc}" />`,      `name=["']twitter:description`);
  add(`    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />`, `name=["']twitter:image["' ]`);
  add(`    <meta name="twitter:image:alt" content="Techbridge University College Logo" />`, `name=["']twitter:image:alt`);

  // Theme
  lines.push("    <!-- Theme -->");
  add(`    <meta name="theme-color" content="#630f12" />`,             `name=["']theme-color`);
  add(`    <meta name="msapplication-TileColor" content="#630f12" />`, `name=["']msapplication-TileColor`);
  add(`    <meta name="copyright" content="Techbridge University College" />`, `name=["']copyright`);
  add(`    <meta name="referrer" content="origin-when-cross-origin" />`, `name=["']referrer`);

  lines.push("    <!-- ────────────────────────────────────────────────────────────── -->");

  // If every real tag was already present, return empty (nothing to inject)
  const realLines = lines.filter(l => !l.trim().startsWith("<!--") && l.trim());
  return realLines.length === 0 ? null : lines.join("\n");
}

// ── per-file processing ───────────────────────────────────────────────────────

const stats = { patched: 0, unchanged: 0, skipped: 0 };

function processFile(file) {
  const rel = relative(ROOT, file);
  let html  = readFileSync(file, "utf8");

  if (!/<head/i.test(html)) { stats.skipped++; return; }

  const title = extract(html, /<title[^>]*>([^<]+)<\/title>/i) ?? "Techbridge University College";
  const desc  = extract(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
             ?? extract(html, /<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i)
             ?? TUC_DESC;

  const block = buildBlock(html, title.replace(/"/g, "&quot;"), desc.replace(/"/g, "&quot;"));

  // Fix html lang
  const fixed = ensureHtmlLang(html);

  if (!block && fixed === html) { stats.unchanged++; return; }

  let output = fixed;

  if (block) {
    // Inject right after <meta charset …> or after <head …>
    const charsetRx = /(<meta\s+charset[^>]+>)/i;
    const headRx    = /(<head[^>]*>)/i;

    if (charsetRx.test(output)) {
      output = output.replace(charsetRx, `$1\n${block}`);
    } else {
      output = output.replace(headRx, `$1\n${block}`);
    }
  }

  writeFileSync(file, output, "utf8");
  console.log(`  patched  ${rel}`);
  stats.patched++;
}

// ── walk ──────────────────────────────────────────────────────────────────────

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIR.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) { walk(full); continue; }
    if (entry === "index.html") processFile(full);
  }
}

walk(ROOT);

console.log(`
Done
  patched    : ${stats.patched}
  unchanged  : ${stats.unchanged}
  skipped    : ${stats.skipped}
`);
