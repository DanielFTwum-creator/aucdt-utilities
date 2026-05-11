const fs = require('fs');
const path = require('path');

const ROOT = path.resolve('C:/Development/aucdt-utilities');
const results = { fixed: [], skipped: [], errors: [] };

const dirs = fs.readdirSync(ROOT).filter(d => {
  const full = path.join(ROOT, d);
  try {
    return fs.statSync(full).isDirectory() &&
      (fs.existsSync(path.join(full, 'vite.config.ts')) || fs.existsSync(path.join(full, 'vite.config.js')));
  } catch(e) { return false; }
});

for (const dir of dirs) {
  const full = path.join(ROOT, dir);
  const htmlPath = path.join(full, 'index.html');

  try {
    if (!fs.existsSync(htmlPath)) { results.skipped.push(`${dir}: no index.html`); continue; }
    const html = fs.readFileSync(htmlPath, 'utf8');
    if (!html.includes('cdn.tailwindcss.com')) { results.skipped.push(`${dir}: clean`); continue; }

    // 1. Remove CDN script + inline tailwind.config from index.html
    let newHtml = html
      .replace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>\s*/g, '')
      .replace(/<script>\s*tailwind\.config\s*=[\s\S]*?<\/script>\s*/g, '');
    fs.writeFileSync(htmlPath, newHtml);

    // 2. Create/prepend index.css with Tailwind import
    const cssPath = path.join(full, 'index.css');
    const twImport = '@import "tailwindcss";\n\n';
    if (fs.existsSync(cssPath)) {
      const existing = fs.readFileSync(cssPath, 'utf8');
      if (!existing.includes('@import "tailwindcss"')) {
        fs.writeFileSync(cssPath, twImport + existing);
      }
    } else {
      fs.writeFileSync(cssPath, twImport);
    }

    // 3. Update vite.config — add @tailwindcss/vite plugin
    const cfgPath = fs.existsSync(path.join(full, 'vite.config.ts'))
      ? path.join(full, 'vite.config.ts')
      : path.join(full, 'vite.config.js');
    let cfg = fs.readFileSync(cfgPath, 'utf8');

    if (!cfg.includes('@tailwindcss/vite')) {
      // Insert import after the first import line
      cfg = cfg.replace(/^(import .+\n)/m, `$1import tailwindcss from '@tailwindcss/vite';\n`);
      // Add tailwindcss() to plugins array — handles various spacing
      cfg = cfg.replace(/plugins:\s*\[(\s*react\(\)\s*)\]/gs, 'plugins: [react(), tailwindcss()]');
      fs.writeFileSync(cfgPath, cfg);
    }

    // 4. Add deps to package.json (no install — done separately)
    const pkgPath = path.join(full, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      pkg.devDependencies = pkg.devDependencies || {};
      let changed = false;
      if (!pkg.devDependencies['tailwindcss'] && !pkg.dependencies?.['tailwindcss']) {
        pkg.devDependencies['tailwindcss'] = '^4.2.2'; changed = true;
      }
      if (!pkg.devDependencies['@tailwindcss/vite'] && !pkg.dependencies?.['@tailwindcss/vite']) {
        pkg.devDependencies['@tailwindcss/vite'] = '^4.2.2'; changed = true;
      }
      if (changed) fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    }

    results.fixed.push(dir);
  } catch (e) {
    results.errors.push(`${dir}: ${e.message}`);
  }
}

console.log(`\nFixed:        ${results.fixed.length} apps`);
console.log(`Already clean: ${results.skipped.filter(s => s.includes('clean')).length} apps`);
console.log(`No index.html: ${results.skipped.filter(s => s.includes('no index')).length} apps`);
if (results.errors.length) {
  console.log(`\nErrors (${results.errors.length}):`);
  results.errors.forEach(e => console.log('  ', e));
}
