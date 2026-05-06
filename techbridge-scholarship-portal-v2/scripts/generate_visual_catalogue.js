import fs from 'fs';
import path from 'path';
import playwright from '@playwright/test';

const parentDir = path.resolve(process.cwd(), '..');
const projects = fs.readdirSync(parentDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.') && dirent.name !== 'node_modules')
  .map(dirent => dirent.name);

const screenshotsDir = path.join(process.cwd(), 'docs', 'screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

function findIndexHtml(dir, depth = 0) {
    if (depth > 3) return null;
    try {
        const files = fs.readdirSync(dir);
        if (files.includes('index.html')) return path.join(dir, 'index.html');
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory() && file !== 'node_modules' && file !== 'dist' && file !== '.git') {
                const found = findIndexHtml(fullPath, depth + 1);
                if (found) return found;
            }
        }
    } catch(e) {}
    return null;
}

(async () => {
    console.log(`📂 Capturing visual state for ${projects.length} utilities...`);
    const browser = await chromium.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files'],
        defaultViewport: { width: 1280, height: 800 }
    });

    let appEntries = [];
    const chunkSize = 5;

    for (let i = 0; i < projects.length; i += chunkSize) {
        const chunk = projects.slice(i, i + chunkSize);
        await Promise.all(chunk.map(async (proj) => {
            const projPath = path.join(parentDir, proj);
            const pkgPath = path.join(projPath, 'package.json');
            const targetHtml = findIndexHtml(projPath);

            let meta = {
                name: proj,
                version: '1.0.0',
                description: 'AUCDT Institutional Utility',
                isReact: false,
                isCompliant: false,
                imagePath: null
            };

            if (fs.existsSync(pkgPath)) {
                try {
                    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
                    meta.name = pkg.name || proj;
                    meta.version = pkg.version || '1.0.0';
                    meta.description = pkg.description || meta.description;
                    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
                    if (deps.react) {
                        meta.isReact = true;
                        if (deps.react.includes('19.2.4')) meta.isCompliant = true;
                    }
                } catch(e) {}
            }

            const safeImageName = proj.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
            if (targetHtml && !fs.existsSync(path.join(screenshotsDir, safeImageName))) {
                try {
                    const page = await browser.newPage();
                    await page.setRequestInterception(true);
                    page.on('request', (r) => (['image', 'media', 'font'].includes(r.resourceType()) ? r.abort() : r.continue()));
                    await page.goto(`file://${targetHtml}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
                    await new Promise(r => setTimeout(r, 1000)); 
                    await page.screenshot({ path: path.join(screenshotsDir, safeImageName) });
                    await page.close();
                    meta.imagePath = `screenshots/${safeImageName}`;
                    console.log(`✅ Captured: ${proj}`);
                } catch (e) {
                    console.log(`⚠️ Skip: ${proj}`);
                }
            } else if (fs.existsSync(path.join(screenshotsDir, safeImageName))) {
                meta.imagePath = `screenshots/${safeImageName}`;
            }
            appEntries.push(meta);
        }));
    }

    await browser.close();
    appEntries.sort((a, b) => a.name.localeCompare(b.name));

    // Grouping for TOC
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const groups = alphabet.map(letter => ({
        letter,
        apps: appEntries.filter(a => a.name.toUpperCase().startsWith(letter))
    })).filter(g => g.apps.length > 0);

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AUCDT Institutional Utilities Registry</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Bebas+Neue&display=swap" rel="stylesheet">
    <style>
        :root { --gold: #C8A84B; --ink: #0F0C07; --cream: #F2EBD9; --paper: #141210; }
        * { scroll-behavior: smooth; }
        body { background-color: var(--ink); color: var(--cream); font-family: 'Cormorant Garamond', serif; margin: 0; padding: 0; line-height: 1.6; }
        
        header { 
            padding: 40px; text-align: center; border-bottom: 1px solid rgba(200,168,75,0.2); 
            background: radial-gradient(circle at center, #1c1a16 0%, #0f0c07 100%); position: sticky; top: 0; z-index: 100;
            backdrop-blur: 15px;
        }
        h1 { font-family: 'Playfair Display', serif; font-size: 2.5rem; font-weight: 900; text-transform: uppercase; margin: 0; color: #fff; }
        
        /* SEARCH & INDEX */
        .controls { max-width: 1200px; margin: 20px auto 0; display: flex; flex-direction: column; gap: 15px; }
        .search-row { display: flex; gap: 10px; }
        #searchBar { flex-grow: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(200,168,75,0.3); padding: 12px 20px; color: var(--cream); font-size: 1.1rem; outline: none; }
        
        .jump-index { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 10px; padding: 10px; border-top: 1px solid rgba(200,168,75,0.1); }
        .jump-link { color: var(--gold); text-decoration: none; font-family: 'Bebas Neue'; font-size: 0.9rem; padding: 2px 8px; border: 1px solid transparent; transition: all 0.2s; }
        .jump-link:hover { border-color: var(--gold); background: rgba(200,168,75,0.1); }

        .container { max-width: 1800px; margin: 0 auto; padding: 40px; display: grid; grid-template-columns: 250px 1fr; gap: 40px; }
        
        /* SIDEBAR TOC */
        .sidebar { position: sticky; top: 250px; height: calc(100vh - 300px); overflow-y: auto; padding-right: 20px; border-right: 1px solid rgba(200,168,75,0.1); }
        .sidebar h3 { font-family: 'Bebas Neue'; letter-spacing: 0.2em; color: var(--gold); font-size: 1rem; margin-bottom: 20px; border-bottom: 1px solid var(--gold); padding-bottom: 5px; }
        .toc-list { list-style: none; padding: 0; margin: 0; }
        .toc-item { margin-bottom: 8px; }
        .toc-link { color: var(--cream); text-decoration: none; font-size: 0.85rem; opacity: 0.5; transition: all 0.2s; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .toc-link:hover { opacity: 1; color: var(--gold); padding-left: 5px; }

        .main-content { min-width: 0; }
        .group-header { 
            font-family: 'Playfair Display'; font-size: 4rem; color: var(--gold); opacity: 0.1; 
            margin: 60px 0 20px; border-bottom: 1px solid rgba(200,168,75,0.2); line-height: 1;
            position: sticky; top: 200px; z-index: 10; background: var(--ink); padding: 10px 0;
        }

        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 30px; }
        .app-card { background: var(--paper); border: 1px solid rgba(200,168,75,0.15); display: flex; flex-direction: column; transition: all 0.3s; overflow: hidden; }
        .app-card:hover { border-color: var(--gold); transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.6); }
        
        .screenshot { width: 100%; height: 180px; background: #000; overflow: hidden; }
        .screenshot img { width: 100%; height: 100%; object-fit: cover; object-position: top; opacity: 0.6; transition: opacity 0.4s; }
        .app-card:hover .screenshot img { opacity: 1; }
        
        .content { padding: 25px; flex-grow: 1; }
        h2 { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: var(--gold); margin: 0 0 10px 0; text-transform: capitalize; }
        .badge { font-family: 'Bebas Neue', sans-serif; font-size: 0.6rem; padding: 2px 8px; border: 1px solid var(--gold); color: var(--gold); letter-spacing: 0.1em; margin-right: 5px; }
        .badge.compliant { background: var(--gold); color: var(--ink); }
        .footer { margin-top: 15px; border-top: 1px solid rgba(200,168,75,0.1); padding-top: 10px; display: flex; justify-content: space-between; font-size: 0.7rem; opacity: 0.4; font-family: monospace; }
    </style>
</head>
<body>
    <header>
        <h1>Institutional Registry</h1>
        <div class="controls">
            <div class="search-row">
                <input type="text" id="searchBar" placeholder="Search institutional utilities..." onkeyup="filterApps()">
            </div>
            <div class="jump-index">
                ${groups.map(g => `<a href="#group-${g.letter}" class="jump-link">${g.letter}</a>`).join('')}
            </div>
        </div>
    </header>

    <div class="container">
        <aside class="sidebar">
            <h3>Table of Contents</h3>
            <ul class="toc-list">
                ${appEntries.map(app => `
                    <li class="toc-item">
                        <a href="#app-${app.name}" class="toc-link" title="${app.name}">${app.name.replace(/-/g, ' ')}</a>
                    </li>
                `).join('')}
            </ul>
        </aside>

        <main class="main-content">
            ${groups.map(group => `
                <div id="group-${group.letter}" class="group-header">${group.letter}</div>
                <div class="grid">
                    ${group.apps.map(app => `
                        <div class="app-card" id="app-${app.name}" data-name="${app.name.toLowerCase()}">
                            <div class="screenshot">
                                ${app.imagePath ? `<img src="${app.imagePath}" loading="lazy" />` : `<div style="height:100%; display:flex; align-items:center; justify-content:center; color:rgba(200,168,75,0.2); font-family:Bebas Neue;">HEADLESS</div>`}
                            </div>
                            <div class="content">
                                <h2>${app.name.replace(/-/g, ' ')}</h2>
                                <div class="badges">
                                    <span class="badge">${app.isReact ? 'REACT' : 'NODE'}</span>
                                    ${app.isCompliant ? '<span class="badge compliant">COMPLIANT</span>' : ''}
                                </div>
                                <div class="footer">
                                    <span>REG: TUC-2026-UTIL</span>
                                    <span>v${app.version}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        </main>
    </div>

    <script>
        function filterApps() {
            const query = document.getElementById('searchBar').value.toLowerCase();
            const cards = document.querySelectorAll('.app-card');
            cards.forEach(card => {
                const name = card.getAttribute('data-name');
                card.style.display = name.includes(query) ? 'flex' : 'none';
            });
            // Hide empty group headers
            document.querySelectorAll('.group-header').forEach(header => {
                const nextGrid = header.nextElementSibling;
                const visibleCards = nextGrid.querySelectorAll('.app-card[style="display: flex;"]').length;
                header.style.display = visibleCards === 0 && query !== '' ? 'none' : 'block';
            });
        }
    </script>
</body>
</html>`;

    fs.writeFileSync(path.join(process.cwd(), 'docs', 'UTILITIES_CATALOGUE.html'), htmlContent, 'utf8');
    console.log(`\n✅ Catalogue with TOC generated: docs/UTILITIES_CATALOGUE.html`);
})();
