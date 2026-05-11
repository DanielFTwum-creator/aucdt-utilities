#!/usr/bin/env node
/**
 * Generate SVG placeholder thumbnails for apps missing screenshots.
 * Techbridge University College / TUC
 * Output: catalogue/project-screenshots/<appname>.png  (SVG saved as .png path)
 *         → actually saved as .svg, gallery will fallback to these
 */
const fs   = require('fs');
const path = require('path');

const ROOT      = path.resolve(__dirname, '..');
const SHOTS_DIR = path.join(ROOT, 'catalogue', 'project-screenshots');

const SKIP = new Set([
  'node_modules','.git','dist','build','scripts','templates','thumbnail-generator',
  'backend','aucdt-portal-tests','tuc-portal-tests','docker','docs','archive',
  'catalogue','project-screenshots','project-screenshots-real','monitoring',
  'reports','build-validation-reports','proof-of-concept-screenshots',
  'master-thumbnail-catalog','playwright','src','gemini','genai','sync-from-d-drive'
]);

// Category detection → icon + gradient
function categorise(name) {
  const n = name.toLowerCase();
  if (n.includes('ai') || n.includes('llm') || n.includes('gpt') || n.includes('gemini'))
    return { icon: '🤖', grad: ['#6366f1','#8b5cf6'], label: 'AI / ML' };
  if (n.includes('dashboard') || n.includes('analytics') || n.includes('monitor'))
    return { icon: '📊', grad: ['#0ea5e9','#6366f1'], label: 'Analytics' };
  if (n.includes('student') || n.includes('exam') || n.includes('assessment') || n.includes('course'))
    return { icon: '🎓', grad: ['#630f12','#9b1c22'], label: 'Education' };
  if (n.includes('finance') || n.includes('payment') || n.includes('fees') || n.includes('budget'))
    return { icon: '💳', grad: ['#059669','#0d9488'], label: 'Finance' };
  if (n.includes('health') || n.includes('medical') || n.includes('hospital') || n.includes('clinical'))
    return { icon: '🏥', grad: ['#e11d48','#f43f5e'], label: 'Health' };
  if (n.includes('portal') || n.includes('platform') || n.includes('hub'))
    return { icon: '🌐', grad: ['#d97706','#f59e0b'], label: 'Portal' };
  if (n.includes('map') || n.includes('location') || n.includes('geo') || n.includes('twin'))
    return { icon: '🗺️', grad: ['#0284c7','#0369a1'], label: 'Spatial' };
  if (n.includes('image') || n.includes('video') || n.includes('media') || n.includes('photo') || n.includes('gallery'))
    return { icon: '🎨', grad: ['#db2777','#9333ea'], label: 'Media' };
  if (n.includes('chat') || n.includes('message') || n.includes('notification') || n.includes('mailer'))
    return { icon: '💬', grad: ['#16a34a','#15803d'], label: 'Comms' };
  if (n.includes('security') || n.includes('auth') || n.includes('vault') || n.includes('sentinel'))
    return { icon: '🔐', grad: ['#1e293b','#334155'], label: 'Security' };
  return { icon: '⚡', grad: ['#630f12','#ffcb05'], label: 'TUC App' };
}

function toTitle(appName) {
  return appName
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\bAi\b/g, 'AI')
    .replace(/\bTuc\b/g, 'TUC')
    .replace(/\bUi\b/g, 'UI')
    .replace(/\bApi\b/g, 'API');
}

function makeSvg(appName) {
  const { icon, grad, label } = categorise(appName);
  const title = toTitle(appName);
  // Wrap title at ~28 chars
  const words = title.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > 26) { if (line) lines.push(line); line = w; }
    else line = (line + ' ' + w).trim();
  }
  if (line) lines.push(line);
  const lineHeight = 28;
  const textY = 155 - ((lines.length - 1) * lineHeight) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${grad[0]}"/>
      <stop offset="100%" style="stop-color:${grad[1]}"/>
    </linearGradient>
    <linearGradient id="card" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(255,255,255,0.18)"/>
      <stop offset="100%" style="stop-color:rgba(255,255,255,0.06)"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="500" fill="url(#bg)"/>

  <!-- Decorative circles -->
  <circle cx="680" cy="-40" r="180" fill="rgba(255,255,255,0.06)"/>
  <circle cx="120" cy="540" r="200" fill="rgba(255,255,255,0.05)"/>
  <circle cx="760" cy="480" r="120" fill="rgba(255,255,255,0.04)"/>

  <!-- Card -->
  <rect x="60" y="40" width="680" height="300" rx="20" fill="url(#card)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>

  <!-- Icon -->
  <text x="400" y="130" text-anchor="middle" font-size="64" font-family="system-ui">${icon}</text>

  <!-- App title -->
  ${lines.map((l, i) => `<text x="400" y="${textY + i * lineHeight}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="700" fill="white" opacity="0.95">${escXml(l)}</text>`).join('\n  ')}

  <!-- Category badge -->
  <rect x="320" y="290" width="160" height="28" rx="14" fill="rgba(255,255,255,0.2)"/>
  <text x="400" y="309" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="600" fill="white" letter-spacing="1">${escXml(label.toUpperCase())}</text>

  <!-- TUC footer bar -->
  <rect x="0" y="420" width="800" height="80" fill="rgba(0,0,0,0.35)"/>
  <text x="40" y="466" font-family="system-ui, sans-serif" font-size="14" font-weight="800" fill="#ffcb05" letter-spacing="2">TECHBRIDGE UNIVERSITY COLLEGE</text>
  <text x="40" y="486" font-family="system-ui, sans-serif" font-size="11" fill="rgba(255,255,255,0.6)">Institutional App Catalogue · ${new Date().getFullYear()}</text>

  <!-- TUC logo mark -->
  <rect x="720" y="428" width="44" height="44" rx="8" fill="#630f12"/>
  <text x="742" y="457" text-anchor="middle" font-family="system-ui" font-size="20" font-weight="900" fill="#ffcb05">T</text>
</svg>`;
}

function escXml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Generate for all apps missing a PNG screenshot ────────────────────────────

const existing = new Set(fs.readdirSync(SHOTS_DIR).map(f => f.replace(/\.(png|svg)$/,'')));
let generated = 0;

for (const e of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!e.isDirectory() || SKIP.has(e.name) || e.name.startsWith('.')) continue;
  if (!fs.existsSync(path.join(ROOT, e.name, 'package.json'))) continue;
  if (!existing.has(e.name)) {
    const svg = makeSvg(e.name);
    fs.writeFileSync(path.join(SHOTS_DIR, e.name + '.svg'), svg);
    console.log(`  generated ${e.name}.svg`);
    generated++;
  }
}

console.log(`\nGenerated ${generated} SVG placeholders.`);
