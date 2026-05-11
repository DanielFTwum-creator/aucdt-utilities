const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '..', 'src');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/#1A3C6B/g, '#4A5340');
    content = content.replace(/#153055/g, '#3A4232'); // hover color
    content = content.replace(/#C9A84C/g, '#D97706'); // matching the orange highlight

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            replaceInFile(fullPath);
        }
    });
}

processDirectory(directoryPath);
console.log('Color replacement complete.');
