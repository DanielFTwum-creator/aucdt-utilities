#!/usr/bin/env node
/**
 * generate-gallery.js
 * Rebuilds catalogue/index.html from the current state of
 * catalogue/project-screenshots/ and each app's package.json.
 *
 * Each card shows two screenshots:
 *   {appname}.png       — public view (login page / landing)
 *   {appname}-admin.png — admin view (post-login dashboard)
 *
 * Usage:  node scripts/generate-gallery.js
 */

const fs   = require('fs');
const path = require('path');

const ROOT      = path.resolve(__dirname, '..');
const SHOTS_DIR = path.join(ROOT, 'catalogue', 'project-screenshots');
const OUT       = path.join(ROOT, 'catalogue', 'index.html');

const SKIP = new Set([
  'node_modules', '.git', 'catalogue', 'scripts', 'archive', 'docs',
  'dist', 'build', 'tests', 'test-results', 'backend', 'docker',
  'src', 'templates', 'reports', 'build-logs', 'install-logs',
  'build-validation-reports',
]);

function toTitleCase(str) {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\bAi\b/g, 'AI')
    .replace(/\bApi\b/g, 'API')
    .replace(/\bUi\b/g, 'UI')
    .replace(/\bTuc\b/g, 'TUC');
}

function getAppMeta(appDir) {
  const pkgPath = path.join(appDir, 'package.json');
  if (!fs.existsSync(pkgPath)) return null;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const desc = (pkg.description || '')
    .replace(/\s*App ID \d+/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return { title: toTitleCase(path.basename(appDir)), description: desc };
}

function shotInfo(filePath) {
  if (!fs.existsSync(filePath)) return { exists: false, size: 0 };
  const size = fs.statSync(filePath).size;
  return { exists: true, size };
}

const apps = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter(e => e.isDirectory() && !SKIP.has(e.name) && !e.name.startsWith('.'))
  .filter(e => fs.existsSync(path.join(ROOT, e.name, 'package.json')))
  .map(e => {
    const meta      = getAppMeta(path.join(ROOT, e.name));
    const pubShot   = shotInfo(path.join(SHOTS_DIR, e.name + '.png'));
    const adminShot = shotInfo(path.join(SHOTS_DIR, e.name + '-admin.png'));
    return {
      name: e.name,
      title: meta.title,
      description: meta.description,
      pub: pubShot,
      admin: adminShot,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const total    = apps.length;
const captured = apps.filter(a => a.pub.exists && a.pub.size > 5000).length;
const blank    = apps.filter(a => a.pub.exists && a.pub.size <= 5000).length;
const missing  = apps.filter(a => !a.pub.exists).length;
const adminOk  = apps.filter(a => a.admin.exists && a.admin.size > 5000).length;
const pct      = ((captured / total) * 100).toFixed(1);

// ── Card builder ─────────────────────────────────────────────────────────────
function imgOrPlaceholder(src, alt, label, hasIt) {
  const img = hasIt
    ? '<img src="' + src + '" alt="' + alt + '" class="shot" loading="lazy" onerror="this.parentNode.classList.add(\'no-img\')">'
    : '';
  const badge = '<span class="shot-label">' + label + '</span>';
  return '<div class="shot-wrap' + (hasIt ? '' : ' no-img') + '">'
    + img
    + badge
    + (hasIt ? '' : '<div class="shot-placeholder"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg><span>No screenshot</span></div>')
    + '</div>';
}

const cards = apps.map(app => {
  const pubSrc   = 'project-screenshots/' + app.name + '.png';
  const adminSrc = 'project-screenshots/' + app.name + '-admin.png';
  const pubOk    = app.pub.exists && app.pub.size > 5000;
  const adminOk_ = app.admin.exists && app.admin.size > 5000;
  const descHtml = app.description ? '<div class="card-desc">' + app.description + '</div>' : '';

  return '<div class="card" data-name="' + app.name + '">'
    + '<div class="shots-row">'
    + imgOrPlaceholder(pubSrc,   app.title, 'Public',  pubOk)
    + imgOrPlaceholder(adminSrc, app.title, 'Admin',   adminOk_)
    + '</div>'
    + '<div class="card-title">' + app.title + '</div>'
    + '<div class="card-info">' + descHtml + '<div class="card-name">' + app.name + '</div></div>'
    + '</div>';
}).join('\n');

// ── Styles ───────────────────────────────────────────────────────────────────
const css = [
  '* { margin: 0; padding: 0; box-sizing: border-box; }',
  'body { font-family: Inter, "Segoe UI", system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; }',
  '.header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 40px; text-align: center; border-radius: 16px; margin-bottom: 32px; border: 1px solid #334155; }',
  '.header h1 { font-size: 2.5em; margin-bottom: 8px; background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }',
  '.header p { color: #94a3b8; font-size: 1.1em; margin-bottom: 24px; }',
  '.stats { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }',
  '.stat { background: #0f172a; padding: 14px 24px; border-radius: 12px; border: 1px solid #334155; min-width: 120px; text-align: center; }',
  '.stat-number { font-size: 1.8em; font-weight: 700; }',
  '.stat-label { font-size: 0.78em; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }',
  '.search-wrap { margin-bottom: 32px; text-align: center; }',
  '.search-wrap input { width: 100%; max-width: 560px; padding: 12px 20px; border-radius: 12px; border: 1px solid #334155; background: #1e293b; color: #f8fafc; font-size: 1em; outline: none; }',
  '.search-wrap input:focus { border-color: #38bdf8; }',
  '.count-label { color: #64748b; font-size: 0.85em; margin-top: 8px; }',
  '.gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 24px; }',
  '.card { background: #1e293b; border-radius: 14px; overflow: hidden; border: 1px solid #334155; transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s; }',
  '.card:hover { transform: translateY(-4px); border-color: #38bdf8; box-shadow: 0 12px 32px -8px rgba(56,189,248,0.2); }',
  /* two-panel screenshot row */
  '.shots-row { display: grid; grid-template-columns: 1fr 1fr; height: 180px; }',
  '.shot-wrap { position: relative; overflow: hidden; background: #0f172a; border-bottom: 1px solid #334155; }',
  '.shot-wrap:first-child { border-right: 1px solid #334155; }',
  '.shot { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; display: block; }',
  '.card:hover .shot { transform: scale(1.04); }',
  '.shot-label { position: absolute; top: 6px; left: 6px; font-size: 0.65em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; background: rgba(15,23,42,0.82); color: #94a3b8; padding: 2px 7px; border-radius: 6px; pointer-events: none; }',
  '.no-img .shot-label { color: #475569; }',
  '.shot-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #475569; gap: 8px; font-size: 0.7em; }',
  '.shot-placeholder svg { width: 32px; height: 32px; opacity: 0.3; }',
  '.card-title { padding: 12px 16px 4px; font-size: 1em; font-weight: 600; color: #f1f5f9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
  '.card-desc { color: #94a3b8; font-size: 0.78em; line-height: 1.45; margin-bottom: 5px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }',
  '.card-name { font-family: monospace; font-size: 0.72em; color: #475569; }',
  '.card-info { padding: 4px 16px 14px; }',
  '.footer { text-align: center; margin-top: 60px; color: #475569; border-top: 1px solid #1e293b; padding-top: 24px; font-size: 0.82em; }',
  '.hidden { display: none !important; }',
  '.stat-green { color: #22c55e; }',
  '.stat-indigo { color: #818cf8; }',
  '.stat-red { color: #ef4444; }',
  '.stat-amber { color: #f59e0b; }',
  '.stat-sky { color: #38bdf8; }',
].join('\n');

// ── HTML assembly ─────────────────────────────────────────────────────────────
const html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n'
  + '<meta charset="UTF-8">\n'
  + '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
  + '<title>TUC Application Portfolio \u2014 Techbridge University College</title>\n'
  + '<style>\n' + css + '\n</style>\n</head>\n<body>\n'
  + '<div class="header">\n'
  + '  <h1>Techbridge University College</h1>\n'
  + '  <p>Application Portfolio</p>\n'
  + '  <div class="stats">\n'
  + '    <div class="stat"><div class="stat-number">' + total + '</div><div class="stat-label">Total Apps</div></div>\n'
  + '    <div class="stat"><div class="stat-number stat-green">' + captured + '</div><div class="stat-label">Public Shot</div></div>\n'
  + '    <div class="stat"><div class="stat-number stat-indigo">' + adminOk + '</div><div class="stat-label">Admin Shot</div></div>\n'
  + '    <div class="stat"><div class="stat-number stat-red">' + missing + '</div><div class="stat-label">Missing</div></div>\n'
  + '    <div class="stat"><div class="stat-number stat-amber">' + blank + '</div><div class="stat-label">Blank</div></div>\n'
  + '    <div class="stat"><div class="stat-number stat-sky">' + pct + '%</div><div class="stat-label">Coverage</div></div>\n'
  + '  </div>\n</div>\n'
  + '<div class="search-wrap">\n'
  + '  <input type="text" id="search" placeholder="Search ' + total + ' apps\u2026" oninput="filterCards(this.value)">\n'
  + '  <div class="count-label" id="count-label">Showing all ' + total + ' apps</div>\n'
  + '</div>\n'
  + '<div class="gallery" id="gallery">\n' + cards + '\n</div>\n'
  + '<div class="footer">Generated ' + new Date().toLocaleString() + ' &nbsp;\u00b7&nbsp; Techbridge University College &nbsp;\u00b7&nbsp; ' + captured + '/' + total + ' public &nbsp;\u00b7&nbsp; ' + adminOk + '/' + total + ' admin</div>\n'
  + '<script>\n'
  + 'function filterCards(q) {\n'
  + '  var lower = q.toLowerCase().trim(), visible = 0;\n'
  + '  document.querySelectorAll(".card").forEach(function(c) {\n'
  + '    var match = !lower || c.dataset.name.includes(lower) || c.textContent.toLowerCase().includes(lower);\n'
  + '    c.classList.toggle("hidden", !match);\n'
  + '    if (match) visible++;\n'
  + '  });\n'
  + '  document.getElementById("count-label").textContent = lower ? "Showing " + visible + " of ' + total + ' apps" : "Showing all ' + total + ' apps";\n'
  + '}\n'
  + '</script>\n</body>\n</html>';

fs.writeFileSync(OUT, html, 'utf8');
console.log('Gallery written to ' + OUT);
console.log(total + ' apps | ' + captured + ' public | ' + adminOk + ' admin | ' + missing + ' missing | ' + blank + ' blank | ' + pct + '% coverage');
