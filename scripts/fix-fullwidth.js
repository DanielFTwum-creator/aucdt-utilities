const fs = require('fs');
const path = require('path');

function walkSync(dir) {
  const files = [];
  try {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, f.name);
      if (f.isDirectory() && f.name !== 'node_modules') {
        files.push(...walkSync(full));
      } else if (f.isFile() && (f.name.endsWith('.tsx') || f.name.endsWith('.ts') || f.name.endsWith('.jsx') || f.name.endsWith('.js'))) {
        files.push(full);
      }
    }
  } catch (e) {}
  return files;
}

const root = 'c:/Users/DELL/OneDrive/Documents/Downloads/Development/aucdt-utilities';
let fixed = 0;

for (const f of walkSync(root)) {
  try {
    const str = fs.readFileSync(f, 'utf8');
    // Full-width colon ：(U+FF1A)
    const fixed2 = str.replace(/：/g, ':');
    if (fixed2 !== str) {
      fs.writeFileSync(f, fixed2, 'utf8');
      console.log('Fixed: ' + path.relative(root, f));
      fixed++;
    }
  } catch (e) {}
}
console.log('Total: ' + fixed);
