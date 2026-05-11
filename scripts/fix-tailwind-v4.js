/**
 * Batch fix Tailwind v3 → v4 for apps whose CSS was migrated to v4 syntax
 * but still have Tailwind v3 installed.
 *
 * For each app:
 * 1. If postcss.config.js has tailwindcss plugin → remove it
 * 2. If package.json has tailwindcss v3 → upgrade to v4 + add @tailwindcss/vite
 * 3. If vite.config.ts exists → add @tailwindcss/vite plugin if not present
 */
const fs = require('fs');
const path = require('path');

const ROOT = 'c:/Users/DELL/OneDrive/Documents/Downloads/Development/aucdt-utilities';

function findApps() {
  const apps = [];
  for (const name of fs.readdirSync(ROOT)) {
    const dir = path.join(ROOT, name);
    try {
      const stat = fs.statSync(dir);
      if (!stat.isDirectory()) continue;
      if (name === 'node_modules' || name === 'scripts' || name === 'templates' || name === 'backend') continue;
      if (!fs.existsSync(path.join(dir, 'package.json'))) continue;
      apps.push({ name, dir });
    } catch (e) {}
  }
  return apps;
}

function fixPostcssConfig(dir, appName) {
  const postcssPath = path.join(dir, 'postcss.config.js');
  const postcssPathTs = path.join(dir, 'postcss.config.ts');
  const configPath = fs.existsSync(postcssPath) ? postcssPath : fs.existsSync(postcssPathTs) ? postcssPathTs : null;
  if (!configPath) return false;

  const content = fs.readFileSync(configPath, 'utf8');
  if (!content.includes('tailwindcss')) return false;

  // Remove tailwindcss plugin from postcss config
  let newContent = content
    .replace(/\s*tailwindcss:\s*\{\s*\},?\n?/g, '\n')
    .replace(/,\s*\n\s*\}/g, '\n}')
    .replace(/\{\s*\n\s*\}/g, '{}');

  if (newContent !== content) {
    fs.writeFileSync(configPath, newContent, 'utf8');
    console.log(`  postcss fixed: ${appName}`);
    return true;
  }
  return false;
}

function fixPackageJson(dir, appName) {
  const pkgPath = path.join(dir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  const deps = pkg.dependencies || {};
  const devDeps = pkg.devDependencies || {};

  // Check if tailwindcss is v3
  const twVersionDev = devDeps['tailwindcss'] || '';
  const twVersionDep = deps['tailwindcss'] || '';
  const twVersion = twVersionDev || twVersionDep;

  const isV3 = twVersion && (twVersion.includes('v3') || twVersion.startsWith('3') || twVersion.startsWith('^3'));
  const hasV4 = twVersion && (twVersion.includes('4') || twVersion.startsWith('^4'));
  const hasTwVitePlugin = devDeps['@tailwindcss/vite'] || deps['@tailwindcss/vite'];

  if (!isV3 && !(!hasV4 && !hasTwVitePlugin)) return false;

  let changed = false;

  if (isV3) {
    // Upgrade tailwindcss to v4
    if (devDeps['tailwindcss']) {
      devDeps['tailwindcss'] = '^4.0.0';
      changed = true;
    } else if (deps['tailwindcss']) {
      deps['tailwindcss'] = '^4.0.0';
      changed = true;
    }
  }

  if (!hasTwVitePlugin) {
    devDeps['@tailwindcss/vite'] = '^4.0.0';
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    console.log(`  package.json fixed: ${appName}`);
  }
  return changed;
}

function fixViteConfig(dir, appName) {
  const vcPath = path.join(dir, 'vite.config.ts');
  const vcPathJs = path.join(dir, 'vite.config.js');
  const configPath = fs.existsSync(vcPath) ? vcPath : fs.existsSync(vcPathJs) ? vcPathJs : null;
  if (!configPath) return false;

  const content = fs.readFileSync(configPath, 'utf8');
  if (content.includes('@tailwindcss/vite')) return false; // already done

  // Add import and plugin
  let newContent = content;

  // Add import after last import line
  if (!newContent.includes("import tailwindcss from '@tailwindcss/vite'")) {
    newContent = newContent.replace(
      /(import .+ from .+\n)(?!import)/,
      (match) => match + "import tailwindcss from '@tailwindcss/vite'\n"
    );
  }

  // Add tailwindcss() to plugins array
  newContent = newContent.replace(
    /plugins:\s*\[([^\]]*)\]/,
    (match, plugins) => {
      if (plugins.includes('tailwindcss()')) return match;
      const trimmed = plugins.trim();
      const newPlugins = trimmed ? `${trimmed}, tailwindcss()` : 'tailwindcss()';
      return `plugins: [${newPlugins}]`;
    }
  );

  if (newContent !== content) {
    fs.writeFileSync(configPath, newContent, 'utf8');
    console.log(`  vite.config fixed: ${appName}`);
    return true;
  }
  return false;
}

function hasTailwindV4CSS(dir) {
  // Check if any CSS file uses v4 syntax
  const cssFiles = [
    path.join(dir, 'src/index.css'),
    path.join(dir, 'src/App.css'),
    path.join(dir, 'src/styles/global.css'),
    path.join(dir, 'index.css'),
  ];
  for (const f of cssFiles) {
    if (fs.existsSync(f)) {
      const content = fs.readFileSync(f, 'utf8');
      if (content.includes('@import "tailwindcss"') || content.includes("@import 'tailwindcss'")) {
        return true;
      }
    }
  }
  return false;
}

const apps = findApps();
let fixed = 0;

for (const { name, dir } of apps) {
  if (!hasTailwindV4CSS(dir)) continue;

  const pkgPath = path.join(dir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const devDeps = pkg.devDependencies || {};
  const deps = pkg.dependencies || {};
  const twVersion = devDeps['tailwindcss'] || deps['tailwindcss'] || '';

  const isV3 = twVersion && (twVersion.includes('v3') || /^[v]?3/.test(twVersion) || twVersion.startsWith('^3'));
  const hasTwVitePlugin = devDeps['@tailwindcss/vite'] || deps['@tailwindcss/vite'];

  if (!isV3 && hasTwVitePlugin) continue; // Already v4 with plugin

  console.log(`\nFixing: ${name} (tw=${twVersion}, hasTwVite=${!!hasTwVitePlugin})`);
  const p1 = fixPostcssConfig(dir, name);
  const p2 = fixPackageJson(dir, name);
  const p3 = fixViteConfig(dir, name);
  if (p1 || p2 || p3) fixed++;
}

console.log(`\nTotal apps fixed: ${fixed}`);
