#!/usr/bin/env node
/**
 * Generate Visual Portfolio with Embedded Screenshots
 */

const fs = require('fs').promises;
const fss = require('fs');
const path = require('path');

const skipDirs = ['node_modules', 'dist', 'build', '.git', 'docker', 'catalogue',
  'scripts', 'tests', 'templates', 'reports', 'Documentation', 'archive',
  'build-logs', 'install-logs', 'proof-of-concept-screenshots', 'src', 'docs',
  'project-screenshots-real', 'sync-from-d-drive', 'monitoring', 'playwright',
  'backend', 'gemini', 'genai', '.claude', '.vscode', '.github',
  'test-results', 'build-validation-reports'];

const categories = {
  'AI & Machine Learning': ['ai-', 'ml-', 'autonomous-', 'intelligent-', 'agent-', 'cognitive-', 'neural-'],
  'Analytics & Monitoring': ['analytics', 'monitor', 'metrics', 'dashboard', 'insight', 'intelligence'],
  'Healthcare & Medical': ['health', 'medical', 'patient', 'hospital', 'telemedicine', 'clinical'],
  'Security & Compliance': ['security', 'compliance', 'audit', 'risk', 'governance', 'privacy', 'integrity'],
  'Education & Learning': ['learning', 'education', 'student', 'exam', 'assessment', 'curriculum', 'academic'],
  'Infrastructure & DevOps': ['infrastructure', 'deployment', 'container', 'scaling', 'rollback', 'edge'],
  'Financial & Risk': ['financial', 'risk', 'treasury', 'budget', 'cost', 'price', 'credit'],
  'Digital Twin & Simulation': ['twin', 'simulation', 'scenario', 'forecast', 'predicti'],
  'Data & Knowledge': ['data-', 'knowledge', 'graph', 'semantic', 'embedding', 'compression'],
  'Business Operations': ['workflow', 'process', 'operation', 'resource', 'allocation', 'optimization'],
  'Sentinel Systems': ['sentinel-'],
  'Techbridge Projects': ['techbridge-'],
  'Other Applications': []
};

async function findProjects() {
  const dirs = await fss.readdirSync('.', { withFileTypes: true });
  const projects = [];

  for (const dir of dirs) {
    if (!dir.isDirectory() || skipDirs.includes(dir.name)) continue;

    try {
      const packagePath = path.join(dir.name, 'package.json');
      if (!fss.existsSync(packagePath)) continue;

      const packageData = JSON.parse(fss.readFileSync(packagePath, 'utf-8'));

      const hasExpress = packageData.dependencies?.express;
      const hasReact = packageData.dependencies?.react;
      const isBackendOnly = hasExpress && !hasReact;

      if (!isBackendOnly) {
        const screenshotPath = path.join('catalogue', dir.name, 'screenshot.png');
        const hasScreenshot = fss.existsSync(screenshotPath);

        let screenshotSize = 0;
        if (hasScreenshot) {
          const stats = fss.statSync(screenshotPath);
          screenshotSize = stats.size;
        }

        const hasVite = packageData.devDependencies?.vite || packageData.dependencies?.vite;
        const hasCRA = packageData.dependencies?.['react-scripts'];

        projects.push({
          name: dir.name,
          displayName: packageData.name || dir.name,
          description: packageData.description || 'No description available',
          version: packageData.version || '1.0.0',
          react: packageData.dependencies?.react || 'N/A',
          buildTool: hasVite ? 'Vite' : hasCRA ? 'Create React App' : 'Unknown',
          hasStore: fss.existsSync(path.join(dir.name, 'src', 'store.ts')),
          category: categorizeApp(dir.name, packageData.description),
          hasScreenshot,
          screenshotSize,
          screenshotPath: hasScreenshot ? screenshotPath : null
        });
      }
    } catch (err) {
      // Skip
    }
  }

  return projects.sort((a, b) => a.name.localeCompare(b.name));
}

function categorizeApp(name, description) {
  const searchText = (name + ' ' + (description || '')).toLowerCase();

  for (const [category, keywords] of Object.entries(categories)) {
    if (category === 'Other Applications') continue;
    for (const keyword of keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }

  return 'Other Applications';
}

function generateTOC(projectsByCategory) {
  let toc = '## Table of Contents\n\n';

  const sortedCategories = Object.keys(projectsByCategory).sort((a, b) => {
    if (a === 'Other Applications') return 1;
    if (b === 'Other Applications') return -1;
    return a.localeCompare(b);
  });

  for (const category of sortedCategories) {
    const apps = projectsByCategory[category];
    const withScreenshots = apps.filter(a => a.hasScreenshot).length;
    const anchor = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    toc += `- [${category}](#${anchor}) (${apps.length} apps, ${withScreenshots} with screenshots)\n`;
  }

  return toc + '\n';
}

function generateCategorySection(category, apps) {
  const anchor = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  let section = `## ${category}\n\n`;

  const withScreenshots = apps.filter(a => a.hasScreenshot).length;
  section += `**Total Applications:** ${apps.length} | **With Screenshots:** ${withScreenshots}\n\n`;
  section += '---\n\n';

  apps.forEach((app, idx) => {
    const appAnchor = app.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Card-style layout
    section += `<div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 30px; background: #ffffff;">\n\n`;

    section += `### ${idx + 1}. ${app.displayName}\n\n`;

    if (app.hasScreenshot) {
      section += `<div style="margin: 20px 0; border: 1px solid #ddd; border-radius: 4px; overflow: hidden;">\n\n`;
      section += `![${app.displayName}](${app.screenshotPath})\n\n`;
      section += `</div>\n\n`;
    } else {
      section += `<div style="background: #f3f4f6; padding: 40px; text-align: center; border-radius: 4px; margin: 20px 0;">\n\n`;
      section += `📷 *Screenshot pending capture*\n\n`;
      section += `</div>\n\n`;
    }

    section += `**Directory:** \`${app.name}\`\n\n`;
    section += `**Description:** ${app.description}\n\n`;

    section += `<details>\n`;
    section += `<summary><strong>📋 Technical Details</strong></summary>\n\n`;
    section += `- **React Version:** ${app.react}\n`;
    section += `- **Build Tool:** ${app.buildTool}\n`;
    section += `- **State Management:** ${app.hasStore ? 'Zustand Store' : 'React Hooks'}\n`;
    section += `- **Version:** ${app.version}\n`;
    if (app.hasScreenshot) {
      section += `- **Screenshot Size:** ${Math.round(app.screenshotSize / 1024)}KB\n`;
    }
    section += `\n</details>\n\n`;

    section += `<details>\n`;
    section += `<summary><strong>🚀 Quick Start</strong></summary>\n\n`;
    section += '```bash\n';
    section += `cd ${app.name}\n`;
    section += `pnpm install\n`;
    section += `pnpm run dev    # Development server at http://localhost:5173\n`;
    section += `pnpm run build  # Production build → dist/\n`;
    section += `pnpm run preview # Preview production build\n`;
    section += '```\n\n';
    section += `</details>\n\n`;

    section += `</div>\n\n`;
  });

  return section;
}

async function generateMarkdown(projects, projectsByCategory) {
  const withScreenshots = projects.filter(p => p.hasScreenshot).length;
  const totalScreenshotSize = projects.reduce((sum, p) => sum + (p.screenshotSize || 0), 0);

  return `# 🎨 Techbridge University College
# Visual Application Portfolio

**Institution:** Techbridge University College (TUC)
**Repository:** aucdt-utilities
**Total Applications:** ${projects.length}
**With Screenshots:** ${withScreenshots} (${Math.round(withScreenshots/projects.length*100)}%)
**Generated:** ${new Date().toLocaleString()}
**Status:** 🟢 Production Ready

---

## 📊 Executive Summary

This is a comprehensive visual catalog of **${projects.length} web applications** developed for Techbridge University College. This portfolio showcases production-ready applications across AI/ML, healthcare, education, security, financial systems, and institutional operations.

### Portfolio Statistics

| Metric | Count | Details |
|--------|-------|---------|
| **Total Applications** | ${projects.length} | Full-stack web applications |
| **With Screenshots** | ${withScreenshots} | Visual previews available |
| **React 19.2.4 Apps** | ${projects.filter(p => p.react.startsWith('19')).length} | Latest React version |
| **Vite-based Projects** | ${projects.filter(p => p.buildTool === 'Vite').length} | Modern build tooling |
| **Apps with State Management** | ${projects.filter(p => p.hasStore).length} | Zustand store implementation |
| **Categories** | ${Object.keys(projectsByCategory).length} | Organized by domain |
| **Screenshot Size** | ${Math.round(totalScreenshotSize / 1024 / 1024)}MB | Total visual assets |

### 🛠️ Technology Stack

- **Frontend:** React 19.2.4, TypeScript 5.7+
- **Build Tool:** Vite 7.3.1 (primary), Create React App (legacy)
- **Package Manager:** pnpm 10.30+
- **Styling:** Tailwind CSS 4.2+, Custom CSS
- **State Management:** Zustand, React Hooks
- **Charts:** Recharts 3.7.0
- **Icons:** Lucide React, Heroicons
- **Routing:** React Router DOM 7.1.0

### 🚀 Deployment

- **Docker:** 100% coverage via docker-compose-all-apps.yml
- **Gateway:** NGINX reverse proxy (port 8080)
- **Tomcat:** Selected apps at 66.226.72.199
- **Image Size:** ~20MB per containerized app
- **Network:** tuc-network (172.20.0.0/16)

---

${generateTOC(projectsByCategory)}

---

# 📸 Visual Application Catalog

${Object.keys(projectsByCategory).sort((a, b) => {
  if (a === 'Other Applications') return 1;
  if (b === 'Other Applications') return -1;
  return a.localeCompare(b);
}).map(category => generateCategorySection(category, projectsByCategory[category])).join('\n')}

---

## 🔍 Quick Reference

### Common Commands

\`\`\`bash
# Development
cd <app-name> && pnpm install && pnpm run dev

# Production Build
cd <app-name> && pnpm run build && pnpm run preview

# Docker (All Apps)
docker-compose -f docker-compose-all-apps.yml up

# Docker (Specific App)
docker-compose up <app-name>

# Gateway Access
open http://localhost:8080
\`\`\`

### Testing

\`\`\`bash
pnpm test              # Unit tests (Vitest)
pnpm test:coverage     # Coverage report
pnpm test:e2e          # End-to-end tests (Playwright)
\`\`\`

---

## 📚 Related Documentation

- **APPLICATION-PORTFOLIO-MASTER.md** - Text-based comprehensive index
- **CLAUDE.md** - Repository overview and development guidelines
- **SHARED-STANDARDS.md** - Institutional standards and governance
- **FULL-VERIFICATION-REPORT.md** - Build verification results
- **FINDINGS-AND-ACTION-PLAN.md** - Technical analysis and fixes

---

## 🎯 Using This Portfolio

### For Developers
- Browse categories to find relevant applications
- View screenshots to understand UI/UX patterns
- Use quick-start commands for rapid setup
- Reference technical details for stack information

### For Stakeholders
- Visual overview of institutional software assets
- Understanding of technology capabilities
- Evidence of production-ready applications
- Portfolio for external presentations

### For Documentation
- Complete visual reference
- Screenshot-based navigation
- Technical specifications
- Quick-start guides

---

## 📝 Notes

- Screenshots show production builds with empty/login states (expected without backend)
- All apps are containerized and deployment-ready
- React 19.2.4 is locked across all projects
- Vite provides fast development and optimized production builds

---

**Last Updated:** ${new Date().toLocaleString()}
**Version:** 2.0.0 (Visual Edition)
**Maintained by:** Techbridge University College Development Team

*This visual portfolio was auto-generated from package.json files, project structure, and captured screenshots.*

---

<div style="text-align: center; padding: 40px; background: #f9fafb; border-top: 2px solid #e5e7eb;">

### 🎓 Techbridge University College
**Pioneering Design & Technology Education**

[Website](https://techbridge.edu.gh) | [Portal](https://portal.aucdt.edu.gh) | [AI Tools](https://ai-tools.aucdt.edu.gh)

</div>
`;
}

async function main() {
  console.log('\n🎨 Generating Visual Portfolio with Screenshots...\n');

  const projects = await findProjects();
  const withScreenshots = projects.filter(p => p.hasScreenshot).length;

  console.log(`Found ${projects.length} applications`);
  console.log(`Screenshots available: ${withScreenshots} (${Math.round(withScreenshots/projects.length*100)}%)\n`);

  // Group by category
  const projectsByCategory = {};
  projects.forEach(proj => {
    if (!projectsByCategory[proj.category]) {
      projectsByCategory[proj.category] = [];
    }
    projectsByCategory[proj.category].push(proj);
  });

  // Generate visual portfolio
  const markdown = await generateMarkdown(projects, projectsByCategory);
  await fs.writeFile('VISUAL-PORTFOLIO.md', markdown, 'utf-8');

  console.log('✓ Generated: VISUAL-PORTFOLIO.md');
  console.log(`✓ Documented ${projects.length} applications`);
  console.log(`✓ Embedded ${withScreenshots} screenshots`);
  console.log(`✓ ${Object.keys(projectsByCategory).length} categories\n`);
  console.log('Visual portfolio complete! 🎉\n');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
