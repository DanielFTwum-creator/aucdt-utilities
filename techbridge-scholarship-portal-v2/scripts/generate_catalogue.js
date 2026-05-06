import fs from 'fs';
import path from 'path';

const parentDir = path.resolve(process.cwd(), '..');
const projects = fs.readdirSync(parentDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.') && dirent.name !== 'node_modules')
  .map(dirent => dirent.name);

console.log(`📂 Cataloguing ${projects.length} potential utilities...`);

let appEntries = [];

for (const proj of projects) {
    const projPath = path.join(parentDir, proj);
    const pkgPath = path.join(projPath, 'package.json');
    const indexHtml = path.join(projPath, 'index.html');
    
    if (!fs.existsSync(indexHtml) && !fs.existsSync(pkgPath)) continue;

    let meta = {
        name: proj,
        version: '1.0.0',
        description: 'AUCDT Institutional Utility',
        isReact: false,
        isCompliant: false
    };

    if (fs.existsSync(pkgPath)) {
        try {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
            meta.name = pkg.name || proj;
            meta.version = pkg.version || '1.0.0';
            meta.description = pkg.description || meta.description;
            if ((pkg.dependencies && pkg.dependencies.react) || (pkg.devDependencies && pkg.devDependencies.react)) {
                meta.isReact = true;
                if (pkg.dependencies?.react === '19.2.4' || pkg.devDependencies?.react === '19.2.4') {
                    meta.isCompliant = true;
                }
            }
        } catch(e) {}
    }

    appEntries.push(meta);
}

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AUCDT Utilities Catalogue</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Bebas+Neue&display=swap" rel="stylesheet">
    <style>
        :root {
            --gold: #C8A84B;
            --ink: #0F0C07;
            --cream: #F2EBD9;
            --paper: #141210;
        }
        body {
            background-color: var(--ink);
            color: var(--cream);
            font-family: 'Cormorant Garamond', serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        header {
            padding: 100px 40px;
            text-align: center;
            border-bottom: 1px solid rgba(200,168,75,0.2);
            background: radial-gradient(circle at center, #1c1a16 0%, #0f0c07 100%);
            position: relative;
        }
        header::after {
            content: "";
            position: absolute;
            bottom: 0; left: 50%; transform: translateX(-50%);
            width: 200px; height: 4px; background: var(--gold);
        }
        h1 {
            font-family: 'Playfair Display', serif;
            font-size: 5rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -0.02em;
            margin: 0;
            color: #fff;
        }
        .subtitle {
            font-family: 'Bebas Neue', sans-serif;
            letter-spacing: 0.5em;
            color: var(--gold);
            font-size: 1.2rem;
            margin-top: 10px;
        }
        .container {
            max-width: 1600px;
            margin: 0 auto;
            padding: 80px 40px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            gap: 40px;
        }
        .app-card {
            background: var(--paper);
            border: 1px solid rgba(200,168,75,0.15);
            padding: 40px;
            position: relative;
            transition: all 0.4s ease;
            display: flex;
            flex-col: column;
            justify-content: space-between;
        }
        .app-card:hover {
            border-color: var(--gold);
            transform: translateY(-10px);
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .app-card h2 {
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            margin: 0 0 15px 0;
            color: var(--gold);
            text-transform: capitalize;
        }
        .app-card p {
            font-size: 1.1rem;
            opacity: 0.7;
            margin-bottom: 30px;
        }
        .badge {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 0.7rem;
            padding: 4px 12px;
            border: 1px solid var(--gold);
            color: var(--gold);
            letter-spacing: 0.1em;
            display: inline-block;
            margin-right: 10px;
        }
        .badge.compliant {
            background: var(--gold);
            color: var(--ink);
        }
        .footer-meta {
            margin-top: auto;
            border-top: 1px solid rgba(200,168,75,0.1);
            padding-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .version {
            font-family: monospace;
            font-size: 0.8rem;
            opacity: 0.4;
        }
    </style>
</head>
<body>
    <header>
        <h1>Institutional Registry</h1>
        <div class="subtitle">Techbridge University College • Utilities Catalogue</div>
    </header>
    
    <div class="container">
        <div class="grid">
            ${appEntries.map(app => `
                <div class="app-card">
                    <div>
                        <h2>${app.name.replace(/-/g, ' ')}</h2>
                        <p>${app.description}</p>
                    </div>
                    <div class="footer-meta">
                        <div>
                            <span class="badge">${app.isReact ? 'REACT CORE' : 'NODE SERVICE'}</span>
                            ${app.isCompliant ? '<span class="badge compliant">COMPLIANT</span>' : ''}
                        </div>
                        <span class="version">v${app.version}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(process.cwd(), 'docs', 'UTILITIES_CATALOGUE.html'), htmlContent, 'utf8');
console.log(`✅ Catalogue generated: docs/UTILITIES_CATALOGUE.html`);
