const fs = require('fs');
const path = require('path');

const blueprintFile = path.join(__dirname, '../AGENT_ultimate_blueprint.md');
const targetDir = path.join(__dirname, '../biochemai-pure-clone');

if (!fs.existsSync(blueprintFile)) {
    console.error('Blueprint file not found');
    process.exit(1);
}

const content = fs.readFileSync(blueprintFile, 'utf-8');
const lines = content.split('\n');

let currentFile = null;
let currentContent = [];
let inCodeBlock = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('### FILE: ')) {
        currentFile = line.substring('### FILE: '.length).trim();
        continue;
    }
    
    if (currentFile && line.startsWith('```')) {
        if (!inCodeBlock) {
            inCodeBlock = true;
            currentContent = [];
        } else {
            inCodeBlock = false;
            const fullPath = path.join(targetDir, currentFile);
            fs.mkdirSync(path.dirname(fullPath), { recursive: true });
            fs.writeFileSync(fullPath, currentContent.join('\n'));
            console.log(`Wrote: ${currentFile}`);
            currentFile = null;
        }
        continue;
    }
    
    if (inCodeBlock) {
        currentContent.push(line);
    }
}

console.log('Extraction complete!');
