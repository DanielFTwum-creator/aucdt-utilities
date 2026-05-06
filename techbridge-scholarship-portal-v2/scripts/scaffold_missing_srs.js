import fs from 'fs';
import path from 'path';

const parentDir = path.resolve(process.cwd(), '..');
const projects = fs.readdirSync(parentDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.') && dirent.name !== 'node_modules')
  .map(dirent => dirent.name);

console.log(`🚀 Starting SRS Documentation Scaffolding across ${projects.length} projects...`);

let createdCount = 0;

for (const proj of projects) {
    const projPath = path.join(parentDir, proj);
    const docsPath = path.join(projPath, 'docs');
    const srsPath1 = path.join(docsPath, 'SRS.md');
    const srsPath2 = path.join(projPath, 'SRS.md');

    if (!fs.existsSync(srsPath1) && !fs.existsSync(srsPath2)) {
        if (!fs.existsSync(docsPath)) {
            fs.mkdirSync(docsPath, { recursive: true });
        }

        const srsTemplate = `# System Requirements Specification (SRS)
## Project: ${proj}
**Version:** 1.0 (Auto-Generated Baseline)
**Date:** ${new Date().toISOString().split('T')[0]}

---

## 1. Introduction
### 1.1 Purpose
This document defines the baseline system requirements for **${proj}**, ensuring alignment with the overarching Techbridge University College ecosystem standards.

### 1.2 Scope
This application provides utility functionality within the AUCDT ecosystem.

## 2. Institutional Compliance Mandates (Permanent)
To maintain alignment with the **Techbridge Scholarship Portal v2.0 Blueprint**, this project strictly adheres to the following constraints:

- **React Version:** Must operate on React 19.2.4.
- **Linguistic Standard:** Strict adherence to UK British English (e.g., *programme*, *colour*, *analyse*).
- **Security & Diagnostics:** All internal audit logs and test simulators must be isolated behind the \`#/admin\` hash route.
- **Deployment:** \`vite.config.ts\` must utilize relative base pathing (\`base: './'\`) to guarantee universal PWA hosting.
- **UI/UX Aesthetics:** Implementation of the "Warm Prestige" 6R aesthetic (TUC Gold, Cream, Ink) using \`Playfair Display\` and \`Cormorant Garamond\`.

## 3. Architecture & Tech Stack
- **Frontend Core:** React 19.2.4 + TypeScript
- **Build Tool:** Vite 7+
- **Styling:** Tailwind CSS v4

## 4. Revision History
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| ${new Date().toISOString().split('T')[0]} | 1.0 | Initial Scaffolding | ReactUIRemediator Agent |
`;
        
        fs.writeFileSync(srsPath1, srsTemplate, 'utf8');
        console.log(`✅ Created docs/SRS.md for: ${proj}`);
        createdCount++;
    }
}

console.log(`\n🎉 Scaffolded missing SRS documents for ${createdCount} projects.`);
