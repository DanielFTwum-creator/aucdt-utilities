/**
 * Mass Fix Script for Broken Index.html Files
 * Applies working template to all 227 broken projects
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;
const BROKEN_LIST = path.join(BASE_DIR, 'BROKEN_PROJECTS.txt');
const TEMPLATE = path.join(BASE_DIR, 'TEMPLATE_index.html');

// Read broken projects list
const brokenProjects = fs.readFileSync(BROKEN_LIST, 'utf-8')
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0);

// Read template
const template = fs.readFileSync(TEMPLATE, 'utf-8');

console.log('🔧 Mass Fix Tool for Broken Index.html Files');
console.log('=============================================\n');
console.log(`Found ${brokenProjects.length} projects to fix\n`);

let fixed = 0;
let failed = 0;
const errors = [];

brokenProjects.forEach((projectName, index) => {
  try {
    // Determine project path
    let projectPath;
    if (projectName.startsWith('ai-utilities/')) {
      const subPath = projectName.replace('ai-utilities/', '');
      projectPath = path.join(BASE_DIR, 'ai-utilities', subPath);
    } else {
      projectPath = path.join(BASE_DIR, projectName);
    }

    const indexPath = path.join(projectPath, 'index.html');

    // Check if project exists
    if (!fs.existsSync(projectPath)) {
      console.log(`  ⚠️  [${index + 1}/${brokenProjects.length}] Skipping ${projectName} - directory not found`);
      failed++;
      errors.push({ project: projectName, error: 'Directory not found' });
      return;
    }

    // Generate title from project name
    const projectTitle = projectName
      .split('/').pop() // Get last part after slash
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Replace placeholder in template
    const customizedHTML = template.replace('__PROJECT_TITLE__', projectTitle);

    // Backup original if it exists
    if (fs.existsSync(indexPath)) {
      const backupPath = path.join(projectPath, 'index.html.backup');
      fs.copyFileSync(indexPath, backupPath);
    }

    // Write new index.html
    fs.writeFileSync(indexPath, customizedHTML);

    console.log(`  ✅ [${index + 1}/${brokenProjects.length}] Fixed: ${projectName}`);
    fixed++;

  } catch (error) {
    console.error(`  ❌ [${index + 1}/${brokenProjects.length}] Failed: ${projectName} - ${error.message}`);
    failed++;
    errors.push({ project: projectName, error: error.message });
  }
});

// Summary
console.log('\n=============================================');
console.log('FIX SUMMARY');
console.log('=============================================');
console.log(`Total Projects: ${brokenProjects.length}`);
console.log(`✅ Fixed: ${fixed}`);
console.log(`❌ Failed: ${failed}`);

if (errors.length > 0) {
  console.log('\n⚠️  Failed Projects:');
  errors.forEach(e => console.log(`  - ${e.project}: ${e.error}`));
}

// Save fix report
const reportPath = path.join(BASE_DIR, 'fix-report.json');
fs.writeFileSync(reportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  total: brokenProjects.length,
  fixed,
  failed,
  errors
}, null, 2));

console.log(`\n📄 Fix report saved: ${reportPath}`);
console.log('\n✨ Run validation again to verify all fixes!\n');
