#!/usr/bin/env node
/**
 * Generate HTML Portfolio from Visual Portfolio
 */

const fs = require('fs').promises;
const fss = require('fs');
const path = require('path');

const skipDirs = ['node_modules', 'dist', 'build', '.git', 'docker', 'catalogue',
  'scripts', 'tests', 'templates', 'reports', 'Documentation', 'archive',
  'build-logs', 'install-logs', 'proof-of-concept-screenshots', 'src', 'docs',
  'project-screenshots-real', 'sync-from-d-drive', 'monitoring', 'playwright',
  'backend', 'gemini', 'genai', '.claude', '.vscode', '.github',
  'test-results', 'build-validation-reports'];

const categories = {
  'AI & Machine Learning': ['ai-', 'ml-', 'autonomous-', 'intelligent-', 'agent-', 'cognitive-', 'neural-'],
  'Analytics & Monitoring': ['analytics', 'monitor', 'metrics', 'dashboard', 'insight', 'intelligence'],
  'Healthcare & Medical': ['health', 'medical', 'patient', 'hospital', 'telemedicine', 'clinical'],
  'Security & Compliance': ['security', 'compliance', 'audit', 'risk', 'governance', 'privacy', 'integrity'],
  'Education & Learning': ['learning', 'education', 'student', 'exam', 'assessment', 'curriculum', 'academic'],
  'Infrastructure & DevOps': ['infrastructure', 'deployment', 'container', 'scaling', 'rollback', 'edge'],
  'Financial & Risk': ['financial', 'risk', 'treasury', 'budget', 'cost', 'price', 'credit'],
  'Digital Twin & Simulation': ['twin', 'simulation', 'scenario', 'forecast', 'predicti'],
  'Data & Knowledge': ['data-', 'knowledge', 'graph', 'semantic', 'embedding', 'compression'],
  'Business Operations': ['workflow', 'process', 'operation', 'resource', 'allocation', 'optimization'],
  'Sentinel Systems': ['sentinel-'],
  'Techbridge Projects': ['techbridge-'],
  'Other Applications': []
};

async function findProjects() {
  const dirs = await fss.readdirSync('.', { withFileTypes: true });
  const projects = [];

  for (const dir of dirs) {
    if (!dir.isDirectory() || skipDirs.includes(dir.name)) continue;

    try {
      const packagePath = path.join(dir.name, 'package.json');
      if (!fss.existsSync(packagePath)) continue;

      const packageData = JSON.parse(fss.readFileSync(packagePath, 'utf-8'));

      const hasExpress = packageData.dependencies?.express;
      const hasReact = packageData.dependencies?.react;
      const isBackendOnly = hasExpress && !hasReact;

      if (!isBackendOnly) {
        const screenshotPath = path.join('catalogue', dir.name, 'screenshot.png');
        const hasScreenshot = fss.existsSync(screenshotPath);

        let screenshotSize = 0;
        if (hasScreenshot) {
          const stats = fss.statSync(screenshotPath);
          screenshotSize = stats.size;
        }

        const hasVite = packageData.devDependencies?.vite || packageData.dependencies?.vite;
        const hasCRA = packageData.dependencies?.['react-scripts'];

        projects.push({
          name: dir.name,
          displayName: packageData.name || dir.name,
          description: packageData.description || 'No description available',
          version: packageData.version || '1.0.0',
          react: packageData.dependencies?.react || 'N/A',
          buildTool: hasVite ? 'Vite' : hasCRA ? 'Create React App' : 'Unknown',
          hasStore: fss.existsSync(path.join(dir.name, 'src', 'store.ts')),
          category: categorizeApp(dir.name, packageData.description),
          hasScreenshot,
          screenshotSize,
          screenshotPath: hasScreenshot ? screenshotPath : null
        });
      }
    } catch (err) {
      // Skip
    }
  }

  return projects.sort((a, b) => a.name.localeCompare(b.name));
}

function categorizeApp(name, description) {
  const searchText = (name + ' ' + (description || '')).toLowerCase();

  for (const [category, keywords] of Object.entries(categories)) {
    if (category === 'Other Applications') continue;
    for (const keyword of keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }

  return 'Other Applications';
}

function generateHTML(projects, projectsByCategory) {
  const withScreenshots = projects.filter(p => p.hasScreenshot).length;

  const categoryCards = Object.keys(projectsByCategory).sort((a, b) => {
    if (a === 'Other Applications') return 1;
    if (b === 'Other Applications') return -1;
    return a.localeCompare(b);
  }).map(category => {
    const apps = projectsByCategory[category];
    const anchor = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const appCards = apps.map((app, idx) => `
      <div class="app-card">
        <div class="app-header">
          <h3>${idx + 1}. ${app.displayName}</h3>
          <span class="app-badge">${app.buildTool}</span>
        </div>

        ${app.hasScreenshot ? `
          <div class="screenshot-container">
            <img src="${app.screenshotPath}" alt="${app.displayName}" loading="lazy">
          </div>
        ` : `
          <div class="screenshot-placeholder">
            <span>📷</span>
            <p>Screenshot pending</p>
          </div>
        `}

        <div class="app-details">
          <p class="app-description">${app.description}</p>

          <div class="app-meta">
            <span><strong>📁 Directory:</strong> <code>${app.name}</code></span>
            <span><strong>⚛️ React:</strong> ${app.react}</span>
            <span><strong>🔧 Build:</strong> ${app.buildTool}</span>
            <span><strong>💾 State:</strong> ${app.hasStore ? 'Zustand' : 'Hooks'}</span>
            ${app.hasScreenshot ? `<span><strong>📸 Size:</strong> ${Math.round(app.screenshotSize / 1024)}KB</span>` : ''}
          </div>

          <details class="quick-start">
            <summary>🚀 Quick Start</summary>
            <pre><code>cd ${app.name}
pnpm install
pnpm run dev    # http://localhost:5173
pnpm run build  # Production build</code></pre>
          </details>
        </div>
      </div>
    `).join('\n');

    return `
      <section id="${anchor}" class="category-section">
        <h2>${category}</h2>
        <p class="category-stats">
          ${apps.length} applications | ${apps.filter(a => a.hasScreenshot).length} with screenshots
        </p>
        <div class="apps-grid">
          ${appCards}
        </div>
      </section>
    `;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Techbridge University College - Application Portfolio</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --primary: #630f12;
      --secondary: #ffcb05;
      --bg: #fdfcf0;
      --card-bg: #ffffff;
      --text: #1a1a1a;
      --text-light: #6b7280;
      --border: #e5e7eb;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
    }

    .header {
      background: linear-gradient(135deg, var(--primary) 0%, #8b1618 100%);
      color: white;
      padding: 60px 20px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .header h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
      font-weight: 800;
    }

    .header p {
      font-size: 1.2rem;
      opacity: 0.9;
    }

    .stats {
      background: white;
      padding: 40px 20px;
      text-align: center;
      border-bottom: 1px solid var(--border);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .stat-card {
      padding: 20px;
    }

    .stat-card h3 {
      font-size: 2.5rem;
      color: var(--primary);
      margin-bottom: 5px;
    }

    .stat-card p {
      color: var(--text-light);
      font-size: 0.9rem;
    }

    .nav {
      background: white;
      padding: 20px;
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 2px solid var(--border);
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .nav-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
    }

    .nav-link {
      padding: 8px 16px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      text-decoration: none;
      color: var(--text);
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .nav-link:hover {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .category-section {
      margin-bottom: 60px;
    }

    .category-section h2 {
      font-size: 2rem;
      color: var(--primary);
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 3px solid var(--secondary);
    }

    .category-stats {
      color: var(--text-light);
      margin-bottom: 30px;
    }

    .apps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 30px;
    }

    .app-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .app-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.1);
    }

    .app-header {
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border);
    }

    .app-header h3 {
      font-size: 1.1rem;
      color: var(--primary);
    }

    .app-badge {
      background: var(--primary);
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .screenshot-container {
      width: 100%;
      height: 300px;
      overflow: hidden;
      background: #f3f4f6;
    }

    .screenshot-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .screenshot-placeholder {
      height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f9fafb;
      color: var(--text-light);
    }

    .screenshot-placeholder span {
      font-size: 3rem;
      margin-bottom: 10px;
    }

    .app-details {
      padding: 20px;
    }

    .app-description {
      color: var(--text-light);
      margin-bottom: 15px;
      line-height: 1.5;
    }

    .app-meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 15px;
      font-size: 0.85rem;
    }

    .app-meta code {
      background: var(--bg);
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Monaco', monospace;
    }

    .quick-start {
      margin-top: 15px;
      border-top: 1px solid var(--border);
      padding-top: 15px;
    }

    .quick-start summary {
      cursor: pointer;
      font-weight: 600;
      color: var(--primary);
      user-select: none;
    }

    .quick-start pre {
      margin-top: 10px;
      background: #1e293b;
      color: #e2e8f0;
      padding: 15px;
      border-radius: 6px;
      overflow-x: auto;
      font-size: 0.85rem;
    }

    .footer {
      background: var(--primary);
      color: white;
      text-align: center;
      padding: 40px 20px;
      margin-top: 60px;
    }

    .footer h3 {
      margin-bottom: 10px;
    }

    @media (max-width: 768px) {
      .apps-grid {
        grid-template-columns: 1fr;
      }

      .header h1 {
        font-size: 1.8rem;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  </style>
</head>
<body>
  <header class="header">
    <h1>🎨 Techbridge University College</h1>
    <p>Visual Application Portfolio - ${projects.length} Production-Ready Applications</p>
  </header>

  <section class="stats">
    <div class="stats-grid">
      <div class="stat-card">
        <h3>${projects.length}</h3>
        <p>Total Applications</p>
      </div>
      <div class="stat-card">
        <h3>${withScreenshots}</h3>
        <p>With Screenshots</p>
      </div>
      <div class="stat-card">
        <h3>${projects.filter(p => p.react.startsWith('19')).length}</h3>
        <p>React 19.2.4</p>
      </div>
      <div class="stat-card">
        <h3>${Object.keys(projectsByCategory).length}</h3>
        <p>Categories</p>
      </div>
    </div>
  </section>

  <nav class="nav">
    <div class="nav-content">
      ${Object.keys(projectsByCategory).sort((a, b) => {
        if (a === 'Other Applications') return 1;
        if (b === 'Other Applications') return -1;
        return a.localeCompare(b);
      }).map(category => {
        const anchor = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const count = projectsByCategory[category].length;
        return `<a href="#${anchor}" class="nav-link">${category} (${count})</a>`;
      }).join('\n      ')}
    </div>
  </nav>

  <main class="container">
    ${categoryCards}
  </main>

  <footer class="footer">
    <h3>Techbridge University College</h3>
    <p>Pioneering Design & Technology Education</p>
    <p style="margin-top: 20px; opacity: 0.8;">Generated: ${new Date().toLocaleString()}</p>
  </footer>

  <script>
    // Smooth scrolling for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Lazy load images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  </script>
</body>
</html>`;
}

async function main() {
  console.log('\n📄 Generating HTML Portfolio...\n');

  const projects = await findProjects();
  const withScreenshots = projects.filter(p => p.hasScreenshot).length;

  console.log(`Found ${projects.length} applications`);
  console.log(`Screenshots available: ${withScreenshots}\n`);

  // Group by category
  const projectsByCategory = {};
  projects.forEach(proj => {
    if (!projectsByCategory[proj.category]) {
      projectsByCategory[proj.category] = [];
    }
    projectsByCategory[proj.category].push(proj);
  });

  const html = generateHTML(projects, projectsByCategory);
  await fs.writeFile('portfolio.html', html, 'utf-8');

  console.log('✓ Generated: portfolio.html');
  console.log(`✓ ${projects.length} applications`);
  console.log(`✓ ${withScreenshots} screenshots embedded`);
  console.log('\nOpen portfolio.html in your browser! 🌐\n');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
