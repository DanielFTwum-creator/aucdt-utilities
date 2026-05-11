import fs from 'fs';
import path from 'path';

const targetDir = process.argv[2];
if (!targetDir) {
  console.error("Please provide a target directory (e.g., ../academic-performance-app).");
  process.exit(1);
}

const resolvedDir = path.resolve(process.cwd(), targetDir);
console.log(`🚀 Starting Phase 1 & 2 Remediation for: ${resolvedDir}`);

// 1. Update package.json (React 19.2.4)
const pkgPath = path.join(resolvedDir, 'package.json');
if (fs.existsSync(pkgPath)) {
  let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  let modified = false;
  
  if (pkg.dependencies) {
    if (pkg.dependencies.react) {
      pkg.dependencies.react = "19.2.4";
      modified = true;
    }
    if (pkg.dependencies['react-dom']) {
      pkg.dependencies['react-dom'] = "19.2.4";
      modified = true;
    }
  }
  
  if (pkg.devDependencies) {
    if (pkg.devDependencies['@types/react']) {
      pkg.devDependencies['@types/react'] = "^19.2.14";
      modified = true;
    }
    if (pkg.devDependencies['@types/react-dom']) {
      pkg.devDependencies['@types/react-dom'] = "^19.2.3";
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log(`✅ [Phase 1] Updated package.json to React 19.2.4`);
  } else {
    console.log(`⚠️ [Phase 1] React dependencies not found or already up to date.`);
  }
}

// 2. Update vite.config.ts/js (Relative Paths & Tailwind v4)
const viteTsPath = path.join(resolvedDir, 'vite.config.ts');
const viteJsPath = path.join(resolvedDir, 'vite.config.js');
const vitePath = fs.existsSync(viteTsPath) ? viteTsPath : (fs.existsSync(viteJsPath) ? viteJsPath : null);

if (vitePath) {
  let viteConfig = fs.readFileSync(vitePath, 'utf8');
  let configModified = false;
  
  // Enforce Relative Paths
  if (!viteConfig.includes("base: './'") && !viteConfig.includes('base: "./"')) {
    if (viteConfig.includes("base: '/'")) {
      viteConfig = viteConfig.replace("base: '/'", "base: './'");
      configModified = true;
    } else if (viteConfig.includes('base: "/"')) {
      viteConfig = viteConfig.replace('base: "/"', "base: './'");
      configModified = true;
    } else if (viteConfig.includes('plugins: [')) {
      viteConfig = viteConfig.replace('plugins: [', "base: './',\n  plugins: [");
      configModified = true;
    }
  }

  // Inject Tailwind v4 Vite Plugin if missing
  if (!viteConfig.includes('@tailwindcss/vite')) {
      viteConfig = `import tailwindcss from '@tailwindcss/vite';\n` + viteConfig;
      viteConfig = viteConfig.replace('plugins: [', 'plugins: [\n    tailwindcss(),');
      configModified = true;
  }
  
  if (configModified) {
    fs.writeFileSync(vitePath, viteConfig);
    console.log(`✅ [Phase 1] Updated ${path.basename(vitePath)} (Relative Paths + Tailwind v4 Plugin)`);
  }
}

// 2.5 Ensure Tailwind v4 dependencies are in package.json
if (fs.existsSync(pkgPath)) {
    let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    let pkgModified = false;
    if (!pkg.devDependencies) pkg.devDependencies = {};
    
    if (!pkg.devDependencies['tailwindcss']) {
        pkg.devDependencies['tailwindcss'] = '^4.2.1';
        pkgModified = true;
    }
    if (!pkg.devDependencies['@tailwindcss/vite']) {
        pkg.devDependencies['@tailwindcss/vite'] = '^4.2.1';
        pkgModified = true;
    }
    
    if (pkgModified) {
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
        console.log(`✅ [Phase 1] Added Tailwind v4 dependencies to package.json`);
    }
}

// 2.6 Clean up index.css (Tailwind v4 compatibility)
const cssPath = path.join(resolvedDir, 'src', 'index.css');
if (fs.existsSync(cssPath)) {
    let css = fs.readFileSync(cssPath, 'utf8');
    if (css.includes('@layer components') || css.includes('bg-primary-500')) {
        const cleanCss = `@import "tailwindcss";

@theme {
  --color-tuc-maroon: #630f12;
  --color-tuc-gold: #ffcb05;
  --color-tuc-beige: #f5f5dc;
  --color-tuc-green: #3db54a;
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
  background-color: #F2EBD9;
  color: #0F0C07;
}

.tuc-btn-primary {
  background-color: #C8A84B;
  color: #0F0C07;
  padding: 12px 24px;
  font-family: serif;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: bold;
  border: none;
  cursor: pointer;
}
`;
        fs.writeFileSync(cssPath, cleanCss, 'utf8');
        console.log(`✅ [Phase 1] Sanitised index.css for Tailwind v4`);
    }
}

// 3. Linguistic UK English Fixes (Safe UI strings)
const dictionary = {
  '\\bPrograms\\b': 'Programmes',
  '\\bprograms\\b': 'programmes',
  '\\bColor\\b': 'Colour',
  '\\bCenter\\b': 'Centre',
  '\\bAnalyze\\b': 'Analyse',
  '\\bCatalog\\b': 'Catalogue'
  // Note: Skipping 'program' lowercase to avoid breaking code variables like 'const program = ...'
};

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      // Skip node_modules and dist
      if (file !== 'node_modules' && file !== 'dist') {
        processDirectory(fullPath);
      }
    } else if (['.js', '.jsx', '.ts', '.tsx', '.html'].includes(path.extname(fullPath))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      for (const [us, uk] of Object.entries(dictionary)) {
        const regex = new RegExp(us, 'g');
        if (regex.test(content)) {
          content = content.replace(regex, uk);
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log(`✅ [Phase 2] Updated UK English spelling in: ${file}`);
      }
    }
  }
}

processDirectory(path.join(resolvedDir, 'src'));
processDirectory(path.join(resolvedDir, 'public'));
const indexHtml = path.join(resolvedDir, 'index.html');
if (fs.existsSync(indexHtml)) {
  processDirectory(resolvedDir); // catches index.html at root
}

console.log(`🎉 Automated Remediation complete for ${targetDir}`);
