#!/usr/bin/env node
const chromium = require('playwright').chromium;
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, '../project-screenshots');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

// Get project metadata
function getProjectInfo(projectDir) {
  const pkgPath = path.join(projectDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    return {
      name: pkg.name || path.basename(projectDir),
      description: pkg.description || 'No description',
      version: pkg.version || '1.0.0',
      hasBackend: fs.existsSync(path.join(projectDir, 'backend')),
      hasDockerfile: fs.existsSync(path.join(projectDir, 'Dockerfile')),
      hasSRS: fs.existsSync(path.join(projectDir, 'SRS.md'))
    };
  }
  return null;
}

async function generatePreviewCard(projectDir, projectName) {
  const info = getProjectInfo(projectDir);
  if (!info) return false;

  const displayName = projectName.split('-').map(w =>
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ');

  const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1920px;
      height: 1080px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .card {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 24px;
      padding: 80px;
      max-width: 1200px;
      box-shadow: 0 40px 80px rgba(0,0,0,0.3);
    }
    h1 {
      font-size: 72px;
      margin-bottom: 24px;
      color: #1a1a1a;
    }
    .description {
      font-size: 32px;
      color: #666;
      margin-bottom: 48px;
      line-height: 1.5;
    }
    .badges {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    .badge {
      padding: 12px 24px;
      border-radius: 24px;
      font-size: 20px;
      font-weight: 600;
    }
    .badge.react { background: #61dafb; color: #000; }
    .badge.docker { background: #2496ed; color: #fff; }
    .badge.backend { background: #68a063; color: #fff; }
    .badge.srs { background: #fbbf24; color: #000; }
    .version {
      margin-top: 48px;
      font-size: 24px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>${displayName}</h1>
    <div class="description">${info.description}</div>
    <div class="badges">
      <span class="badge react">⚛️ React + Vite</span>
      ${info.hasDockerfile ? '<span class="badge docker">🐳 Docker</span>' : ''}
      ${info.hasBackend ? '<span class="badge backend">🔧 Backend API</span>' : ''}
      ${info.hasSRS ? '<span class="badge srs">📋 SRS</span>' : ''}
    </div>
    <div class="version">v${info.version}</div>
  </div>
</body>
</html>`;

  const browser = await chromium.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setContent(html);
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `${projectName}.png`)
  });
  await browser.close();

  return true;
}

async function main() {
  const rootDir = path.join(__dirname, '..');
  const projects = fs.readdirSync(rootDir)
    .filter(item => {
      const fullPath = path.join(rootDir, item);
      return fs.statSync(fullPath).isDirectory()
        && fs.existsSync(path.join(fullPath, 'package.json'))
        && !item.startsWith('.')
        && !['node_modules', 'docker', 'scripts', 'templates'].includes(item);
    });

  console.log(`Generating preview cards for ${projects.length} projects...\n`);

  let done = 0;
  for (const project of projects) {
    try {
      await generatePreviewCard(path.join(rootDir, project), project);
      done++;
      if (done % 10 === 0) console.log(`✓ ${done}/${projects.length}`);
    } catch (e) {
      console.log(`✗ ${project}`);
    }
  }

  console.log(`\n✓ Generated ${done}/${projects.length} preview cards`);
}

main().catch(console.error);
