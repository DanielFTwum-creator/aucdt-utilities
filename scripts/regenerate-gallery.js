#!/usr/bin/env node
/**
 * Regenerate catalogue/PROJECT_GALLERY.html
 * Techbridge University College / TUC
 */
const fs   = require('fs');
const path = require('path');

const ROOT      = path.resolve(__dirname, '..');
const SHOTS_DIR = path.join(ROOT, 'catalogue', 'project-screenshots');
const OUT       = path.join(ROOT, 'catalogue', 'PROJECT_GALLERY.html');

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
  'techbridge-dashboard','techbridge-sentinel-agent','newsfeed',
  'lecturer-assessment-portal','modern-product-dev-lifecycle',
]);

function categorise(name) {
  const n = name.toLowerCase();
  if (n.includes('ai') || n.includes('llm') || n.includes('gpt') || n.includes('gemini') || n.includes('autonomous'))
    return { icon: '🤖', color: '#6366f1', label: 'AI / ML' };
  if (n.includes('dashboard') || n.includes('analytics') || n.includes('monitor') || n.includes('metrics'))
    return { icon: '📊', color: '#0ea5e9', label: 'Analytics' };
  if (n.includes('student') || n.includes('exam') || n.includes('assessment') || n.includes('course') || n.includes('learning') || n.includes('education') || n.includes('academic'))
    return { icon: '🎓', color: '#630f12', label: 'Education' };
  if (n.includes('finance') || n.includes('payment') || n.includes('fees') || n.includes('budget') || n.includes('billing') || n.includes('credit'))
    return { icon: '💳', color: '#059669', label: 'Finance' };
  if (n.includes('health') || n.includes('medical') || n.includes('hospital') || n.includes('clinical') || n.includes('patient'))
    return { icon: '🏥', color: '#e11d48', label: 'Health' };
  if (n.includes('portal') || n.includes('platform') || n.includes('hub') || n.includes('gateway'))
    return { icon: '🌐', color: '#d97706', label: 'Portal' };
  if (n.includes('image') || n.includes('video') || n.includes('media') || n.includes('photo') || n.includes('gallery') || n.includes('triptych') || n.includes('concert'))
    return { icon: '🎨', color: '#db2777', label: 'Media' };
  if (n.includes('chat') || n.includes('message') || n.includes('notification') || n.includes('mailer') || n.includes('news'))
    return { icon: '💬', color: '#16a34a', label: 'Comms' };
  if (n.includes('security') || n.includes('auth') || n.includes('vault') || n.includes('sentinel') || n.includes('governance'))
    return { icon: '🔐', color: '#1e293b', label: 'Security' };
  if (n.includes('map') || n.includes('twin') || n.includes('geo') || n.includes('city') || n.includes('urban') || n.includes('farm'))
    return { icon: '🗺️', color: '#0284c7', label: 'Digital Twin' };
  if (n.includes('supply') || n.includes('logistics') || n.includes('fleet') || n.includes('route'))
    return { icon: '🚛', color: '#7c3aed', label: 'Logistics' };
  if (n.includes('risk') || n.includes('fraud') || n.includes('compliance') || n.includes('audit'))
    return { icon: '⚠️', color: '#dc2626', label: 'Risk' };
  return { icon: '⚡', color: '#630f12', label: 'TUC App' };
}

function toTitle(name) {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\bAi\b/g, 'AI').replace(/\bTuc\b/g, 'TUC')
    .replace(/\bUi\b/g, 'UI').replace(/\bApi\b/g, 'API')
    .replace(/\bCkt\b/g, 'CKT').replace(/\bRpms\b/g, 'RPMS');
}

// Collect all apps
const apps = [];
const shots = new Set(fs.readdirSync(SHOTS_DIR).map(f => f.replace(/\.(png|svg)$/, '')));
for (const e of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!e.isDirectory() || SKIP.has(e.name) || e.name.startsWith('.')) continue;
  if (!fs.existsSync(path.join(ROOT, e.name, 'package.json'))) continue;
  const cat   = categorise(e.name);
  const title = toTitle(e.name);
  const imgFile = shots.has(e.name)
    ? (fs.existsSync(path.join(SHOTS_DIR, e.name + '.png')) ? e.name + '.png' : e.name + '.svg')
    : null;
  const isBackend = BACKEND_APPS.has(e.name);
  apps.push({ name: e.name, title, cat, imgFile, isBackend });
}
apps.sort((a, b) => a.name.localeCompare(b.name));

// Build cards HTML
const cards = apps.map(({ name, title, cat, imgFile, isBackend }) => {
  const imgSrc = imgFile ? `project-screenshots/${imgFile}` : '';
  const badge  = isBackend ? '🖥️ Node / Express' : '⚛️ React + Vite';
  return `
    <div class="project-card" data-name="${name}" data-category="${cat.label}" data-color="${cat.color}">
      <div class="card-img-wrap">
        <img
          src="${imgSrc || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}"
          alt="${title}"
          loading="lazy"
          data-appname="${name}"
          data-title="${title}"
          data-color="${cat.color}"
          data-icon="${cat.icon}"
          onerror="imgError(this)"
          onload="imgLoad(this)"
        >
        <div class="card-overlay">
          <span class="card-icon">${cat.icon}</span>
        </div>
      </div>
      <div class="project-info">
        <div class="project-name">${title}</div>
        <div class="project-meta">
          <span class="badge" style="background:${cat.color}20;color:${cat.color};border:1px solid ${cat.color}40">${cat.icon} ${cat.label}</span>
          <span class="badge-tech">${badge}</span>
        </div>
      </div>
    </div>`.trim();
}).join('\n    ');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Techbridge University College — App Catalogue (${apps.length} Apps)</title>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --maroon: #630f12;
      --gold:   #ffcb05;
      --cream:  #f5f5dc;
      --dark:   #0f172a;
    }

    body {
      font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
      background: var(--dark);
      min-height: 100vh;
      color: #e2e8f0;
    }

    /* ── Header ── */
    .header {
      background: linear-gradient(135deg, var(--maroon) 0%, #3d0709 100%);
      padding: 48px 40px 40px;
      border-bottom: 3px solid var(--gold);
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at 80% 50%, rgba(255,203,5,0.08) 0%, transparent 60%);
    }
    .header-inner { max-width: 1800px; margin: 0 auto; position: relative; }
    .header h1 {
      font-size: clamp(22px, 4vw, 40px);
      font-weight: 900;
      color: white;
      letter-spacing: -0.5px;
      margin-bottom: 6px;
    }
    .header h1 span { color: var(--gold); }
    .header-sub { font-size: 14px; color: rgba(255,255,255,0.6); margin-bottom: 24px; }
    .stats-row { display: flex; gap: 20px; flex-wrap: wrap; }
    .stat-pill {
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.15);
      padding: 8px 18px;
      border-radius: 100px;
      font-size: 13px;
      font-weight: 600;
      color: white;
      backdrop-filter: blur(10px);
    }
    .stat-pill span { color: var(--gold); }

    /* ── Controls ── */
    .controls {
      background: #1e293b;
      padding: 20px 40px;
      border-bottom: 1px solid #334155;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .controls-inner {
      max-width: 1800px; margin: 0 auto;
      display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
    }
    .search-wrap { position: relative; flex: 1; min-width: 240px; max-width: 480px; }
    .search-wrap svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); opacity: 0.4; }
    .search-input {
      width: 100%;
      padding: 10px 16px 10px 42px;
      font-size: 14px;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 10px;
      color: white;
      outline: none;
      transition: border-color 0.2s;
    }
    .search-input:focus { border-color: var(--gold); }
    .search-input::placeholder { color: #64748b; }
    .filter-btns { display: flex; gap: 6px; flex-wrap: wrap; }
    .filter-btn {
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px solid #334155;
      background: transparent;
      color: #94a3b8;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .filter-btn:hover, .filter-btn.active {
      background: var(--maroon);
      border-color: var(--maroon);
      color: white;
    }
    .count-badge {
      margin-left: auto;
      font-size: 12px;
      color: #64748b;
      white-space: nowrap;
    }
    .count-badge strong { color: var(--gold); }

    /* ── Gallery ── */
    .gallery-wrap { padding: 32px 40px 60px; max-width: 1800px; margin: 0 auto; }
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 20px;
    }

    /* ── Card ── */
    .project-card {
      background: #1e293b;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #334155;
      transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
      cursor: pointer;
    }
    .project-card:hover {
      transform: translateY(-6px);
      border-color: rgba(255,203,5,0.4);
      box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,203,5,0.1);
    }
    .card-img-wrap {
      position: relative;
      width: 100%;
      height: 220px;
      overflow: hidden;
      background: #0f172a;
    }
    .card-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.4s ease;
    }
    .project-card:hover .card-img-wrap img { transform: scale(1.04); }
    .card-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 50%);
      display: flex; align-items: flex-end; padding: 12px;
      opacity: 0;
      transition: opacity 0.25s ease;
    }
    .project-card:hover .card-overlay { opacity: 1; }
    .card-icon { font-size: 28px; }

    .project-info { padding: 16px; }
    .project-name {
      font-size: 15px;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 10px;
      line-height: 1.3;
    }
    .project-meta { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 600;
    }
    .badge-tech {
      font-size: 11px;
      color: #64748b;
      font-weight: 500;
    }
    .open-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      margin-top: 10px;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      background: var(--maroon);
      color: var(--gold);
      text-decoration: none;
      transition: background 0.2s, transform 0.15s;
      letter-spacing: 0.3px;
    }
    .open-btn:hover { background: #7a1317; transform: scale(1.03); }

    /* ── Empty ── */
    .no-results {
      display: none;
      grid-column: 1/-1;
      text-align: center;
      padding: 80px 20px;
      color: #64748b;
    }
    .no-results h2 { font-size: 24px; margin-bottom: 8px; }

    /* ── Footer ── */
    .footer {
      text-align: center;
      padding: 32px;
      font-size: 13px;
      color: #475569;
      border-top: 1px solid #1e293b;
    }
    .footer strong { color: var(--gold); }
  </style>
</head>
<body>

  <header class="header">
    <div class="header-inner">
      <h1>Techbridge <span>University College</span> — App Catalogue</h1>
      <p class="header-sub">Institutional Monorepo · Refresh Directive v5.0 · TUC-Utilities</p>
      <div class="stats-row">
        <div class="stat-pill"><span>${apps.length}</span> Applications</div>
        <div class="stat-pill"><span>100%</span> Docker Coverage</div>
        <div class="stat-pill"><span>100%</span> SRS Coverage</div>
        <div class="stat-pill">Gateway: <span>localhost:8080</span></div>
      </div>
    </div>
  </header>

  <div class="controls">
    <div class="controls-inner">
      <div class="search-wrap">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
        </svg>
        <input type="text" class="search-input" id="searchInput" placeholder="Search apps…" autocomplete="off">
      </div>
      <div class="filter-btns" id="filterBtns">
        <button class="filter-btn active" data-cat="">All</button>
        <button class="filter-btn" data-cat="AI / ML">🤖 AI</button>
        <button class="filter-btn" data-cat="Education">🎓 Education</button>
        <button class="filter-btn" data-cat="Analytics">📊 Analytics</button>
        <button class="filter-btn" data-cat="Finance">💳 Finance</button>
        <button class="filter-btn" data-cat="Health">🏥 Health</button>
        <button class="filter-btn" data-cat="Portal">🌐 Portal</button>
        <button class="filter-btn" data-cat="Security">🔐 Security</button>
      </div>
      <div class="count-badge">Showing <strong id="visibleCount">${apps.length}</strong> of ${apps.length}</div>
    </div>
  </div>

  <div class="gallery-wrap">
    <div class="gallery" id="gallery">
      ${cards}
      <div class="no-results" id="noResults">
        <h2>No apps found</h2>
        <p>Try a different search term or filter</p>
      </div>
    </div>
  </div>

  <footer class="footer">
    <strong>Techbridge University College</strong> · Formerly AsanSka University College of Design &amp; Technology ·
    ${apps.length} apps · Refresh Directive Phase 5 Complete
  </footer>

  <script>
    const GATEWAY = 'http://localhost:8080';
    const TOTAL = ${apps.length};

    // ── Image fallback: canvas placeholder ─────────────────────────────────────
    function imgError(img) {
      // Try SVG sibling first
      const src = img.src || '';
      if (src.endsWith('.png')) {
        const svgSrc = src.replace('.png', '.svg');
        img.onerror = () => drawCanvas(img);
        img.src = svgSrc;
        return;
      }
      drawCanvas(img);
    }

    function imgLoad(img) {
      // Replace predominantly-white images (blank screenshots) with canvas
      if (img.naturalWidth === 0) { drawCanvas(img); return; }
      const c = document.createElement('canvas');
      c.width = 40; c.height = 25;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, 40, 25);
      const d = ctx.getImageData(0, 0, 40, 25).data;
      let white = 0;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i] > 240 && d[i+1] > 240 && d[i+2] > 240) white++;
      }
      if (white / (40 * 25) > 0.85) drawCanvas(img);
    }

    function drawCanvas(img) {
      const appName = img.dataset.appname || '';
      const title   = img.dataset.title   || appName;
      const color   = img.dataset.color   || '#630f12';
      const icon    = img.dataset.icon    || '⚡';

      const canvas = document.createElement('canvas');
      canvas.width  = 800;
      canvas.height = 500;
      const ctx = canvas.getContext('2d');

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 800, 500);
      grad.addColorStop(0, color);
      grad.addColorStop(1, darken(color, 0.4));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 500);

      // Decorative circles
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.beginPath(); ctx.arc(680, -40, 180, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(120, 540, 200, 0, Math.PI*2); ctx.fill();

      // Glass card
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      roundRect(ctx, 60, 40, 680, 300, 20);
      ctx.fill();

      // Icon
      ctx.font = '72px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(icon, 400, 155);

      // Title
      ctx.fillStyle = 'white';
      ctx.font = 'bold 26px system-ui';
      const words = title.split(' ');
      const lines = [];
      let line = '';
      for (const w of words) {
        const test = (line ? line + ' ' : '') + w;
        if (ctx.measureText(test).width > 560 && line) { lines.push(line); line = w; }
        else line = test;
      }
      if (line) lines.push(line);
      const lh = 34;
      const startY = 205 - ((lines.length - 1) * lh) / 2;
      lines.forEach((l, i) => ctx.fillText(l, 400, startY + i * lh));

      // Category label background
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      roundRect(ctx, 316, 295, 168, 30, 15);
      ctx.fill();

      // Footer bar
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(0, 420, 800, 80);

      ctx.fillStyle = '#ffcb05';
      ctx.font = 'bold 14px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText('TECHBRIDGE UNIVERSITY COLLEGE', 40, 460);

      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '11px system-ui';
      ctx.fillText('Institutional App Catalogue', 40, 480);

      // TUC logo mark
      ctx.fillStyle = '#630f12';
      roundRect(ctx, 720, 428, 44, 44, 8);
      ctx.fill();
      ctx.fillStyle = '#ffcb05';
      ctx.font = 'bold 22px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('T', 742, 458);

      // Replace img with canvas
      canvas.style.cssText = img.style.cssText;
      canvas.className = img.className;
      img.parentNode.replaceChild(canvas, img);
    }

    function darken(hex, amount) {
      const n = parseInt(hex.slice(1), 16);
      const r = Math.max(0, (n >> 16) - Math.round(255 * amount));
      const g = Math.max(0, ((n >> 8) & 0xff) - Math.round(255 * amount));
      const b = Math.max(0, (n & 0xff) - Math.round(255 * amount));
      return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
    }

    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    // ── Open App button injection ──────────────────────────────────────────────
    document.querySelectorAll('.project-card').forEach(card => {
      const name = card.dataset.name;
      const info = card.querySelector('.project-info');
      const btn  = document.createElement('a');
      btn.href = GATEWAY + '/' + name + '/';
      btn.target = '_blank';
      btn.rel = 'noopener';
      btn.className = 'open-btn';
      btn.innerHTML = '&#9654; Open App';
      btn.addEventListener('click', e => e.stopPropagation());
      info.appendChild(btn);
    });

    // ── Search + filter ────────────────────────────────────────────────────────
    let activeFilter = '';
    const searchInput = document.getElementById('searchInput');
    const gallery     = document.getElementById('gallery');
    const noResults   = document.getElementById('noResults');
    const countEl     = document.getElementById('visibleCount');

    document.getElementById('filterBtns').addEventListener('click', e => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.cat;
      applyFilters();
    });

    searchInput.addEventListener('input', applyFilters);

    function applyFilters() {
      const q = searchInput.value.toLowerCase().trim();
      let visible = 0;
      document.querySelectorAll('.project-card').forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const cat  = card.dataset.category || '';
        const matchSearch = !q || name.includes(q);
        const matchFilter = !activeFilter || cat === activeFilter;
        const show = matchSearch && matchFilter;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      noResults.style.display = visible === 0 ? 'grid' : 'none';
      countEl.textContent = visible;
    }
  </script>
</body>
</html>`;

fs.writeFileSync(OUT, html);
console.log(`Generated ${OUT}`);
console.log(`Total cards: ${apps.length}`);
