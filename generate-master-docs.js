#!/usr/bin/env node
/**
 * Generate Master Documentation for All Applications
 */

const fs = require('fs').promises;
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
  const dirs = await fs.readdir('.', { withFileTypes: true });
  const projects = [];

  for (const dir of dirs) {
    if (!dir.isDirectory() || skipDirs.includes(dir.name)) continue;

    try {
      const packagePath = path.join(dir.name, 'package.json');
      await fs.access(packagePath);
      const packageData = JSON.parse(await fs.readFile(packagePath, 'utf-8'));

      const hasExpress = packageData.dependencies?.express;
      const hasReact = packageData.dependencies?.react;
      const isBackendOnly = hasExpress && !hasReact;

      if (!isBackendOnly) {
        const hasVite = packageData.devDependencies?.vite || packageData.dependencies?.vite;
        const hasCRA = packageData.dependencies?.['react-scripts'];

        projects.push({
          name: dir.name,
          displayName: packageData.name || dir.name,
          description: packageData.description || 'No description available',
          version: packageData.version || '1.0.0',
          react: packageData.dependencies?.react || 'N/A',
          buildTool: hasVite ? 'Vite' : hasCRA ? 'Create React App' : 'Unknown',
          hasStore: await checkForStore(dir.name),
          category: categorizeApp(dir.name, packageData.description)
        });
      }
    } catch (err) {
      // Skip
    }
  }

  return projects.sort((a, b) => a.name.localeCompare(b.name));
}

async function checkForStore(projectName) {
  try {
    await fs.access(path.join(projectName, 'src', 'store.ts'));
    return true;
  } catch {
    return false;
  }
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
    const anchor = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    toc += `- [${category}](#${anchor}) (${apps.length} apps)\n`;
  }

  return toc + '\n';
}

function generateIndex(projects) {
  let index = '## Alphabetical Index\n\n';

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const projectsByLetter = {};

  alphabet.forEach(letter => projectsByLetter[letter] = []);

  projects.forEach(proj => {
    const firstLetter = proj.name[0].toUpperCase();
    if (projectsByLetter[firstLetter]) {
      projectsByLetter[firstLetter].push(proj);
    }
  });

  for (const letter of alphabet) {
    if (projectsByLetter[letter].length > 0) {
      index += `### ${letter}\n\n`;
      projectsByLetter[letter].forEach(proj => {
        const anchor = proj.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        index += `- [${proj.displayName}](#${anchor})\n`;
      });
      index += '\n';
    }
  }

  return index;
}

function generateCategorySection(category, apps) {
  const anchor = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  let section = `## ${category}\n\n`;
  section += `**Total Applications:** ${apps.length}\n\n`;
  section += '---\n\n';

  apps.forEach(app => {
    const appAnchor = app.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    section += `### ${app.displayName}\n\n`;
    section += `**Directory:** \`${app.name}\`\n\n`;
    section += `**Description:** ${app.description}\n\n`;
    section += `**Technical Details:**\n`;
    section += `- React Version: ${app.react}\n`;
    section += `- Build Tool: ${app.buildTool}\n`;
    section += `- State Management: ${app.hasStore ? 'Zustand Store' : 'React Hooks'}\n`;
    section += `- Version: ${app.version}\n\n`;
    section += `**Screenshot:** \`catalogue/${app.name}/screenshot.png\`\n\n`;
    section += `**Quick Start:**\n`;
    section += '```bash\n';
    section += `cd ${app.name}\n`;
    section += `pnpm install\n`;
    section += `pnpm run dev    # http://localhost:5173\n`;
    section += `pnpm run build  # Production build → dist/\n`;
    section += '```\n\n';
    section += '---\n\n';
  });

  return section;
}

async function main() {
  console.log('Generating Master Documentation...\n');

  const projects = await findProjects();
  console.log(`Found ${projects.length} applications\n`);

  // Group by category
  const projectsByCategory = {};
  projects.forEach(proj => {
    if (!projectsByCategory[proj.category]) {
      projectsByCategory[proj.category] = [];
    }
    projectsByCategory[proj.category].push(proj);
  });

  // Generate documentation
  let doc = `# Techbridge University College - Application Portfolio
# Complete Documentation & Index

**Institution:** Techbridge University College (TUC)
**Repository:** aucdt-utilities
**Total Applications:** ${projects.length}
**Generated:** ${new Date().toLocaleString()}
**Status:** Production Ready

---

## Executive Summary

This repository contains **${projects.length} web applications** developed for Techbridge University College. The portfolio spans multiple domains including AI/ML, healthcare, education, security, financial systems, and institutional operations.

### Portfolio Statistics

| Metric | Count |
|--------|-------|
| **Total Applications** | ${projects.length} |
| **React 19.2.4 Apps** | ${projects.filter(p => p.react.startsWith('19')).length} |
| **Vite-based Projects** | ${projects.filter(p => p.buildTool === 'Vite').length} |
| **Apps with Zustand Store** | ${projects.filter(p => p.hasStore).length} |
| **Categories** | ${Object.keys(projectsByCategory).length} |

### Technology Stack

- **Frontend:** React 19.2.4, TypeScript 5.7+
- **Build Tool:** Vite 7.3.1 (primary), Create React App (legacy)
- **Package Manager:** pnpm 10.30+
- **Styling:** Tailwind CSS 4.2+
- **State Management:** Zustand, React Hooks
- **Charts:** Recharts 3.7.0
- **Icons:** Lucide React, Heroicons

### Deployment

- **Docker:** 100% coverage - docker-compose-all-apps.yml
- **Gateway:** NGINX reverse proxy (port 8080)
- **Tomcat:** Selected apps deployed to 66.226.72.199

---

${generateTOC(projectsByCategory)}

---

${generateIndex(projects)}

---

# Application Catalog by Category

${Object.keys(projectsByCategory).sort((a, b) => {
  if (a === 'Other Applications') return 1;
  if (b === 'Other Applications') return -1;
  return a.localeCompare(b);
}).map(category => generateCategorySection(category, projectsByCategory[category])).join('\n')}

---

## Quick Reference Commands

### Development
\`\`\`bash
# Start any app in dev mode
cd <app-name>
pnpm install
pnpm run dev

# Access at http://localhost:5173
\`\`\`

### Production Build
\`\`\`bash
cd <app-name>
pnpm run build   # Builds to dist/
pnpm run preview # Test production build
\`\`\`

### Docker
\`\`\`bash
# Start all apps
docker-compose -f docker-compose-all-apps.yml up

# Start specific app
docker-compose up <app-name>

# Gateway access
open http://localhost:8080
\`\`\`

### Testing
\`\`\`bash
pnpm test              # Run unit tests
pnpm test:coverage     # With coverage
pnpm test:e2e          # End-to-end tests
\`\`\`

---

## Navigation Tips

### By Category
Use the [Table of Contents](#table-of-contents) to browse applications by domain.

### Alphabetically
Use the [Alphabetical Index](#alphabetical-index) to find apps by name.

### Search
Use browser search (Ctrl+F / Cmd+F) to find specific apps or technologies.

---

## Related Documentation

- **CLAUDE.md** - Repository overview and development guidelines
- **SHARED-STANDARDS.md** - Institutional standards and governance
- **GEMINI.md** - Multi-agent workflow documentation
- **CAMPUS_DEPLOYMENT_GUIDE.md** - Campus-wide deployment instructions
- **FULL-VERIFICATION-REPORT.md** - Build verification and screenshot report

---

## Support & Contribution

For issues, questions, or contributions:
- Review app-specific README files (if present)
- Check CLAUDE.md for development standards
- Ensure React 19.2.4 compatibility
- Follow Techbridge branding guidelines

---

**Last Updated:** ${new Date().toLocaleString()}
**Version:** 1.0.0
**Maintained by:** Techbridge University College Development Team

*This documentation was auto-generated from package.json files and project structure.*
`;

  await fs.writeFile('APPLICATION-PORTFOLIO-MASTER.md', doc, 'utf-8');

  console.log('✓ Generated: APPLICATION-PORTFOLIO-MASTER.md');
  console.log(`✓ Documented ${projects.length} applications`);
  console.log(`✓ ${Object.keys(projectsByCategory).length} categories`);
  console.log('\nDocumentation complete!');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
