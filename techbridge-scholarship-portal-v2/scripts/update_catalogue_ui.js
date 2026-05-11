import fs from 'fs';
import path from 'path';

const parentDir = path.resolve(process.cwd(), '..');
const projects = fs.readdirSync(parentDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.') && dirent.name !== 'node_modules')
  .map(dirent => dirent.name);

const screenshotsDir = path.join(process.cwd(), 'docs', 'screenshots');

let appEntries = [];

for (const proj of projects) {
    const projPath = path.join(parentDir, proj);
    const pkgPath = path.join(projPath, 'package.json');
    const safeImageName = proj.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
    const imageExists = fs.existsSync(path.join(screenshotsDir, safeImageName));

    let meta = {
        name: proj,
        version: '1.0.0',
        description: 'AUCDT Institutional Utility',
        isReact: false,
        isCompliant: false,
        imagePath: imageExists ? `screenshots/${safeImageName}` : null
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
    appEntries.push(meta);
}

appEntries.sort((a, b) => a.name.localeCompare(b.name));

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AUCDT Institutional Utilities Registry</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Bebas+Neue&display=swap" rel="stylesheet">
    <style>
        :root { --gold: #C8A84B; --ink: #0F0C07; --cream: #F2EBD9; --paper: #141210; }
        body { background-color: var(--ink); color: var(--cream); font-family: 'Cormorant Garamond', serif; margin: 0; padding: 0; line-height: 1.6; overflow-x: hidden; }
        
        header { 
            padding: 60px 40px; text-align: center; border-bottom: 1px solid rgba(200,168,75,0.2); 
            background: radial-gradient(circle at center, #1c1a16 0%, #0f0c07 100%); position: sticky; top: 0; z-index: 100;
            backdrop-blur: 10px;
        }
        h1 { font-family: 'Playfair Display', serif; font-size: 3rem; font-weight: 900; text-transform: uppercase; margin: 0; color: #fff; letter-spacing: -0.02em; }
        .subtitle { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.5em; color: var(--gold); font-size: 1rem; margin-top: 5px; }

        /* SEARCH & FILTER CONTROLS */
        .controls {
            max-width: 800px; margin: 30px auto 0; display: flex; gap: 15px;
        }
        #searchBar {
            flex-grow: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(200,168,75,0.3);
            padding: 15px 25px; color: var(--cream); font-family: 'Cormorant Garamond'; font-size: 1.2rem;
            outline: none; transition: border-color 0.3s;
        }
        #searchBar:focus { border-color: var(--gold); box-shadow: 0 0 15px rgba(200,168,75,0.2); }
        .filter-btn {
            background: none; border: 1px solid rgba(200,168,75,0.3); color: var(--gold);
            font-family: 'Bebas Neue'; padding: 0 20px; cursor: pointer; transition: all 0.3s;
            letter-spacing: 0.1em;
        }
        .filter-btn.active { background: var(--gold); color: var(--ink); border-color: var(--gold); }

        .container { max-width: 1800px; margin: 0 auto; padding: 40px; }
        .stats { margin-bottom: 30px; font-family: 'Bebas Neue'; color: var(--gold); opacity: 0.6; letter-spacing: 0.2em; font-size: 0.9rem; }

        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 30px; }
        .app-card { 
            background: var(--paper); border: 1px solid rgba(200,168,75,0.15); display: flex; flex-direction: column; 
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); overflow: hidden;
        }
        .app-card.hidden { display: none; }
        .app-card:hover { border-color: var(--gold); transform: translateY(-8px); box-shadow: 0 20px 60px rgba(0,0,0,0.7); }
        
        .screenshot { width: 100%; height: 200px; background: #000; overflow: hidden; border-bottom: 1px solid rgba(200,168,75,0.1); }
        .screenshot img { width: 100%; height: 100%; object-fit: cover; object-position: top; opacity: 0.6; transition: opacity 0.4s; }
        .app-card:hover .screenshot img { opacity: 1; }
        .placeholder { height: 100%; display: flex; align-items: center; justify-content: center; background: #0d0c0a; color: rgba(200,168,75,0.15); font-family: 'Bebas Neue'; font-size: 1.2rem; }

        .content { padding: 30px; flex-grow: 1; display: flex; flex-direction: column; }
        h2 { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: var(--gold); margin: 0 0 10px 0; text-transform: capitalize; }
        p { font-size: 1rem; opacity: 0.6; margin: 0 0 20px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        
        .badges { margin-bottom: 20px; }
        .badge { font-family: 'Bebas Neue', sans-serif; font-size: 0.65rem; padding: 3px 10px; border: 1px solid var(--gold); color: var(--gold); letter-spacing: 0.1em; margin-right: 5px; }
        .badge.compliant { background: var(--gold); color: var(--ink); }
        
        .footer { margin-top: auto; border-top: 1px solid rgba(200,168,75,0.1); padding-top: 15px; display: flex; justify-content: space-between; font-size: 0.75rem; opacity: 0.4; font-family: monospace; }
    </style>
</head>
<body>
    <header>
        <h1>Institutional Visual Registry</h1>
        <div class="subtitle">Ecosystem Discovery & Compliance Audit</div>
        <div class="controls">
            <input type="text" id="searchBar" placeholder="Search by project name or description..." onkeyup="filterApps()">
            <button class="filter-btn" id="btnAll" onclick="setFilter('all')">ALL</button>
            <button class="filter-btn" id="btnReact" onclick="setFilter('react')">REACT</button>
            <button class="filter-btn" id="btnCompliant" onclick="setFilter('compliant')">COMPLIANT</button>
        </div>
    </header>

    <div class="container">
        <div class="stats" id="statsDisplay">Displaying ${appEntries.length} Utilities</div>
        <div class="grid" id="appGrid">
            ${appEntries.map(app => `
                <div class="app-card" data-name="${app.name.toLowerCase()}" data-desc="${app.description.toLowerCase()}" data-react="${app.isReact}" data-compliant="${app.isCompliant}">
                    <div class="screenshot">
                        ${app.imagePath 
                            ? `<img src="${app.imagePath}" alt="${app.name}" />` 
                            : `<div class="placeholder">HEADLESS SERVICE</div>`
                        }
                    </div>
                    <div class="content">
                        <h2>${app.name.replace(/-/g, ' ')}</h2>
                        <p>${app.description}</p>
                        <div class="badges">
                            <span class="badge">${app.isReact ? 'REACT CORE' : 'NODE SERVICE'}</span>
                            ${app.isCompliant ? '<span class="badge compliant">COMPLIANT (19.2.4)</span>' : ''}
                        </div>
                        <div class="footer">
                            <span>REG: TUC-2026-UTIL</span>
                            <span>v${app.version}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>

    <script>
        let currentFilter = 'all';

        function setFilter(filter) {
            currentFilter = filter;
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('btn' + filter.charAt(0).toUpperCase() + filter.slice(1)).classList.add('active');
            filterApps();
        }

        function filterApps() {
            const query = document.getElementById('searchBar').value.toLowerCase();
            const cards = document.querySelectorAll('.app-card');
            let count = 0;

            cards.forEach(card => {
                const name = card.getAttribute('data-name');
                const desc = card.getAttribute('data-desc');
                const isReact = card.getAttribute('data-react') === 'true';
                const isCompliant = card.getAttribute('data-compliant') === 'true';

                let matchesFilter = true;
                if (currentFilter === 'react' && !isReact) matchesFilter = false;
                if (currentFilter === 'compliant' && !isCompliant) matchesFilter = false;

                const matchesSearch = name.includes(query) || desc.includes(query);

                if (matchesFilter && matchesSearch) {
                    card.classList.remove('hidden');
                    count++;
                } else {
                    card.classList.add('hidden');
                }
            });

            document.getElementById('statsDisplay').innerText = \`Displaying \${count} Utilities\`;
        }

        // Initialize button state
        document.getElementById('btnAll').classList.add('active');
    </script>
</body>
</html>`;

fs.writeFileSync(path.join(process.cwd(), 'docs', 'UTILITIES_CATALOGUE.html'), htmlContent, 'utf8');
console.log(`✅ Catalogue updated with search & organisation: docs/UTILITIES_CATALOGUE.html`);
