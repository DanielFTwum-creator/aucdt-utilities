import fs from 'fs';
import path from 'path';

const parentDir = path.resolve(process.cwd(), '..');
const projects = fs.readdirSync(parentDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.') && dirent.name !== 'node_modules')
  .map(dirent => dirent.name);

console.log(`🚀 Smart-Standardising Entry Points for ${projects.length} projects...`);

for (const proj of projects) {
    const projPath = path.join(parentDir, proj);
    const indexPath = path.join(projPath, 'index.html');

    if (fs.existsSync(indexPath)) {
        // 1. Detect actual entry point
        const possibleEntries = [
            'src/main.tsx',
            'src/index.tsx',
            'main.tsx',
            'index.tsx',
            'src/main.jsx',
            'src/index.jsx',
            'main.jsx',
            'index.jsx'
        ];

        let actualEntry = null;
        for (const entry of possibleEntries) {
            if (fs.existsSync(path.join(projPath, entry))) {
                actualEntry = `./${entry}`;
                break;
            }
        }

        if (actualEntry) {
            let content = fs.readFileSync(indexPath, 'utf8');
            
            // 2. Robust Regex Replacement for ANY script type="module" src
            // This replaces whatever was there with the corrected relative path
            const scriptRegex = /<script\s+type="module"\s+src="[^"]+"\s*><\/script>/i;
            const newScriptTag = `<script type="module" src="${actualEntry}"></script>`;
            
            if (scriptRegex.test(content)) {
                content = content.replace(scriptRegex, newScriptTag);
            } else {
                // If no tag found, inject it before </head>
                content = content.replace('</head>', `    ${newScriptTag}\n</head>`);
            }

            fs.writeFileSync(indexPath, content, 'utf8');
            console.log(`✅ [${proj}] -> ${actualEntry}`);
        } else {
            console.log(`⚠️ [${proj}] -> No JS/TSX entry point detected.`);
        }
    }
}

console.log(`\n🎉 Smart standardisation complete.`);
