import fs from 'fs';
import path from 'path';

const parentDir = path.resolve(process.cwd(), '..');
const projects = fs.readdirSync(parentDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.') && dirent.name !== 'node_modules')
  .map(dirent => dirent.name);

console.log(`🚀 Applying Universal Branded Entry standard to ${projects.length} projects...`);

const splashStyles = `
    <style id="tuc-splash-styles">
      body { background-color: #0F0C07 !important; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: serif; overflow: hidden; }
      .tuc-splash { text-align: center; border: 1px solid rgba(200,168,75,0.2); padding: 60px; background: #141210; position: relative; }
      .tuc-splash::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #C8A84B; }
      .tuc-logo { color: #C8A84B; font-size: 3rem; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px; display: block; }
      .tuc-status { color: #D4C4A0; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.4em; font-size: 0.7rem; opacity: 0.6; }
      .tuc-loading { margin-top: 30px; height: 1px; width: 100px; background: rgba(200,168,75,0.2); margin-left: auto; margin-right: auto; position: relative; overflow: hidden; }
      .tuc-loading::after { content: ""; position: absolute; left: -100%; width: 50%; height: 100%; background: #C8A84B; animation: tuc-load 2s infinite; }
      @keyframes tuc-load { to { left: 150%; } }
    </style>
`;

const splashHtml = (name) => `
    <div id="root">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">${name.replace(/-/g, ' ')}</div>
        <div class="tuc-loading"></div>
      </div>
    </div>
`;

let count = 0;

for (const proj of projects) {
    const projPath = path.join(parentDir, proj);
    const indexPath = path.join(projPath, 'index.html');

    if (fs.existsSync(indexPath)) {
        let content = fs.readFileSync(indexPath, 'utf8');
        let modified = false;

        // 1. Fix Relative Pathing for source entry
        if (content.includes('src="/src/index.tsx"')) {
            content = content.replace('src="/src/index.tsx"', 'src="./src/index.tsx"');
            modified = true;
        }
        if (content.includes('src="/index.tsx"')) {
            content = content.replace('src="/index.tsx"', 'src="./src/index.tsx"');
            modified = true;
        }

        // 2. Inject Branded Splash if not present
        if (!content.includes('tuc-splash-styles')) {
            content = content.replace('</head>', `${splashStyles}</head>`);
            content = content.replace('<div id="root"></div>', splashHtml(proj));
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(indexPath, content, 'utf8');
            console.log(`✅ Standardised index.html for: ${proj}`);
            count++;
        }
    }
}

console.log(`\n🎉 Universal Branded Entry applied to ${count} projects.`);
