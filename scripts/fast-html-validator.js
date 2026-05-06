/**
 * Fast HTML Validator - Analyzes index.html files without starting servers
 * Categorizes projects and takes sample screenshots
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;

// Find all projects with index.html
function findProjects() {
  const projects = [];
  const entries = fs.readdirSync(BASE_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === 'node_modules' || entry.name.startsWith('screenshots') || entry.name.startsWith('.')) continue;

    const projectPath = path.join(BASE_DIR, entry.name);
    const indexPath = path.join(projectPath, 'index.html');

    if (fs.existsSync(indexPath)) {
      projects.push({
        name: entry.name,
        path: projectPath,
        indexPath
      });
    }
  }

  // Check ai-utilities subdirectory
  const aiUtilsPath = path.join(BASE_DIR, 'ai-utilities');
  if (fs.existsSync(aiUtilsPath)) {
    const aiEntries = fs.readdirSync(aiUtilsPath, { withFileTypes: true });
    for (const entry of aiEntries) {
      if (!entry.isDirectory()) continue;
      const projectPath = path.join(aiUtilsPath, entry.name);
      const indexPath = path.join(projectPath, 'index.html');

      if (fs.existsSync(indexPath)) {
        projects.push({
          name: `ai-utilities/${entry.name}`,
          path: projectPath,
          indexPath
        });
      }
    }
  }

  return projects;
}

// Analyze HTML file
function analyzeHTML(htmlPath) {
  const content = fs.readFileSync(htmlPath, 'utf-8');
  const lines = content.split('\n');

  const analysis = {
    lineCount: lines.length,
    hasTailwind: content.includes('tailwindcss.com'),
    hasStyleTag: content.includes('<style>'),
    hasImportmap: content.includes('importmap'),
    hasTUCTemplate: content.includes('Techbridge University College') && content.includes('og:title'),
    hasReact: content.includes('react'),
    hasVite: content.includes('vite'),
    hasCustomCSS: false,
    category: 'unknown'
  };

  // Check for custom CSS (more than 50 lines in style tag)
  const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
  if (styleMatch && styleMatch[1]) {
    const cssLines = styleMatch[1].split('\n').length;
    analysis.hasCustomCSS = cssLines > 50;
  }

  // Categorize
  if (analysis.lineCount < 100 && analysis.hasTUCTemplate && !analysis.hasStyleTag) {
    analysis.category = 'BROKEN_TEMPLATE'; // Just TUC SEO template, no actual app
  } else if (analysis.hasTailwind && analysis.hasCustomCSS) {
    analysis.category = 'WORKING_FULL'; // Has Tailwind + custom CSS
  } else if (analysis.hasStyleTag) {
    analysis.category = 'WORKING_PARTIAL'; // Has some styling
  } else if (analysis.hasImportmap || analysis.hasReact) {
    analysis.category = 'WORKING_BASIC'; // Has React setup
  } else {
    analysis.category = 'UNKNOWN'; // Need manual check
  }

  return analysis;
}

// Main function
function validateAll() {
  console.log('🚀 Fast HTML Validator for AUCDT-Utilities\n');

  const projects = findProjects();
  console.log(`📁 Found ${projects.length} projects with index.html\n`);

  const results = {
    BROKEN_TEMPLATE: [],
    WORKING_FULL: [],
    WORKING_PARTIAL: [],
    WORKING_BASIC: [],
    UNKNOWN: []
  };

  projects.forEach(project => {
    const analysis = analyzeHTML(project.indexPath);
    results[analysis.category].push({
      name: project.name,
      ...analysis
    });
  });

  // Print summary
  console.log('========================================');
  console.log('VALIDATION SUMMARY');
  console.log('========================================\n');

  console.log(`❌ BROKEN (TUC Template Only): ${results.BROKEN_TEMPLATE.length}`);
  console.log(`✅ WORKING (Full Styling): ${results.WORKING_FULL.length}`);
  console.log(`⚠️  WORKING (Partial Styling): ${results.WORKING_PARTIAL.length}`);
  console.log(`📦 WORKING (Basic Setup): ${results.WORKING_BASIC.length}`);
  console.log(`❓ UNKNOWN (Needs Review): ${results.UNKNOWN.length}`);

  console.log('\n========================================\n');

  // Show broken projects
  if (results.BROKEN_TEMPLATE.length > 0) {
    console.log(`\n🔴 BROKEN PROJECTS (${results.BROKEN_TEMPLATE.length}):`);
    console.log('========================================');
    results.BROKEN_TEMPLATE.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} (${p.lineCount} lines)`);
    });
  }

  // Show sample of working projects
  console.log(`\n\n✅ SAMPLE WORKING PROJECTS:`);
  console.log('========================================');
  results.WORKING_FULL.slice(0, 10).forEach((p, i) => {
    console.log(`${i + 1}. ${p.name} (${p.lineCount} lines)`);
  });

  // Save detailed report
  const reportPath = path.join(BASE_DIR, 'html-validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n\n📄 Detailed report saved: ${reportPath}\n`);

  return results;
}

// Run
const results = validateAll();

// Export broken projects list for fixing
const brokenList = path.join(BASE_DIR, 'BROKEN_PROJECTS.txt');
const brokenContent = results.BROKEN_TEMPLATE.map(p => p.name).join('\n');
fs.writeFileSync(brokenList, brokenContent);
console.log(`📝 Broken projects list: ${brokenList}\n`);
