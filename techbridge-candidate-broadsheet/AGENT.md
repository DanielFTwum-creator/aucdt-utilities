# techbridge-candidate-broadsheet - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for techbridge-candidate-broadsheet.

### FILE: CREATION.md
```md
# techbridge-candidate-broadsheet

## Purpose
[Auto-generated. Needs manual review and completion.]

## Stack
Node.js, TypeScript, Vite

## Setup
```bash
# Placeholder — needs manual update based on project type
```

## Key Decisions
- [Pending review]
- [Pending review]
- [Pending review]

## Open Questions
- [To be determined]
- [To be determined]

```

### FILE: Dockerfile
```text
FROM node:24-alpine
WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY src ./src
EXPOSE 4025
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD node -e "require('http').get('http://localhost:4025/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"
CMD ["node", "src/index.js"]

```

### FILE: docs/SRS.md
```md
﻿# System Requirements Specification (SRS)
## Project: tuc-candidate-broadsheet
**Version:** 1.0 (Auto-Generated Baseline)
**Date:** 2026-03-07

---

## 1. Introduction
### 1.1 Purpose
This document defines the baseline system requirements for **tuc-candidate-broadsheet**, ensuring alignment with the overarching Techbridge University College ecosystem standards.

### 1.2 Scope
This application provides utility functionality within the AUCDT ecosystem.

## 2. Institutional Compliance Mandates (Permanent)
To maintain alignment with the **Techbridge Scholarship Portal v2.0 Blueprint**, this project strictly adheres to the following constraints:

- **React Version:** Must operate on React 19.2.5.
- **Linguistic Standard:** Strict adherence to UK British English (e.g., *programme*, *colour*, *analyse*).
- **Security & Diagnostics:** All internal audit logs and test simulators must be isolated behind the `#/admin` hash route.
- **Deployment:** `vite.config.ts` must utilize relative base pathing (`base: './'`) to guarantee universal PWA hosting.
- **UI/UX Aesthetics:** Implementation of the "Warm Prestige" 6R aesthetic (TUC Gold, Cream, Ink) using `Playfair Display` and `Cormorant Garamond`.

## 3. Architecture & Tech Stack
- **Frontend Core:** React 19.2.5 + TypeScript
- **Build Tool:** Vite 7+
- **Styling:** Tailwind CSS v4

## 4. Revision History
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2026-03-07 | 1.0 | Initial Scaffolding | ReactUIRemediator Agent |

```

### FILE: package.json
```json
{
  "name": "techbridge-candidate-broadsheet",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "node src/index.js",
    "dev": "node src/index.js",
    "test:e2e": "playwright test"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.0"
  }
}

```

### FILE: services/api.ts
```typescript
import { EmailPayload } from '../types';

/**
 * Simulates the POST request to /aucdt-dev/sendMail
 * In a real environment, this would use fetch or axios.
 */
export const sendBroadsheetEmail = async (payload: EmailPayload): Promise<{ success: boolean; message: string }> => {
  console.log('Attempting to send payload to /aucdt-dev/sendMail:', JSON.stringify(payload, null, 2));

  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate API success
      console.log('Email sent successfully to', payload.to);
      resolve({
        success: true,
        message: 'Broadsheet submitted and email queued successfully.',
      });
    }, 1500);
  });
};
```

### FILE: services/auditService.ts
```typescript
import { AuditLogEntry } from '../types';

const STORAGE_KEY = 'aucdt_audit_logs';

export const logAction = (action: string, details: string, user: string = 'System') => {
  const newEntry: AuditLogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action,
    details,
    user
  };
  
  try {
    const existing = getLogs();
    // Keep last 100 logs to prevent overflow in local storage
    const updated = [newEntry, ...existing].slice(0, 100); 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save audit log", error);
  }
};

export const getLogs = (): AuditLogEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const clearLogs = () => {
  localStorage.removeItem(STORAGE_KEY);
  logAction('AUDIT_CLEAR', 'Audit logs cleared by admin', 'Admin');
};

```

### FILE: services/authService.ts
```typescript
const PASS_KEY = 'aucdt_admin_pass';
// Default password for initial setup
const DEFAULT_PASS = 'admin123'; 

export const checkPassword = [REDACTED_CREDENTIAL]
  const stored = localStorage.getItem(PASS_KEY) || DEFAULT_PASS;
  return input === stored;
};

export const setPassword = [REDACTED_CREDENTIAL]
  localStorage.setItem(PASS_KEY, newPass);
};

export const isDefaultPassword = [REDACTED_CREDENTIAL]
  return !localStorage.getItem(PASS_KEY);
};

```

### FILE: services/pdfGenerator.ts
```typescript
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BroadsheetBody, MAX_SCORES } from '../types';

export const generateBroadsheetPDF = (data: BroadsheetBody) => {
  // Initialize PDF (Portrait, mm, A4)
  const doc = new jsPDF();

  // Branding Colors
  const maroon: [number, number, number] = [88, 0, 0]; // #580000
  const gold: [number, number, number] = [251, 191, 36]; // #fbbf24

  // --- Header ---
  doc.setTextColor(maroon[0], maroon[1], maroon[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("TECHBRIDGE UNIVERSITY COLLEGE", 105, 15, { align: "center" });
  
  doc.setFontSize(11);
  doc.text("APPOINTMENTS AND PROMOTIONS COMMITTEE (APC)", 105, 22, { align: "center" });

  doc.setDrawColor(maroon[0], maroon[1], maroon[2]);
  doc.setLineWidth(0.5);
  doc.line(15, 26, 195, 26);

  // --- Title & Candidate Info ---
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("CANDIDATE BROADSHEET", 105, 35, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  let y = 45;
  doc.text(`Candidate Name:`, 15, y);
  doc.setFont("helvetica", "bold");
  doc.text(data.candidate.name.toUpperCase(), 50, y);
  doc.setFont("helvetica", "normal");
  
  doc.text(`Date: ${data.candidate.date}`, 150, y);

  y += 7;
  doc.text(`Position Applied For:`, 15, y);
  doc.setFont("helvetica", "bold");
  doc.text(data.candidate.position.toUpperCase(), 50, y);
  doc.setFont("helvetica", "normal");

  // --- Score Table ---
  const tableHead = [['Evaluation Criteria', 'Max Mark', 'Score']];
  const tableBody = [
    ['APPEARANCE', MAX_SCORES.appearance, data.scores.appearance.score],
    ['CONFIDENCE / MASTERY OF LANGUAGE', MAX_SCORES.confidence_language, data.scores.confidence_language.score],
    ['COMPETENCE IN AREA OF SPECIALIZATION', MAX_SCORES.competence_specialization, data.scores.competence_specialization.score],
    ['PERSONAL PLAN FOR TUC', MAX_SCORES.personal_plan, data.scores.personal_plan.score],
    ['TEACHING COMPETENCE', MAX_SCORES.teaching_competence, data.scores.teaching_competence.score],
    ['GENERAL KNOWLEDGE', MAX_SCORES.general_knowledge, data.scores.general_knowledge.score],
    ['TOTAL', '100', data.total]
  ];

  autoTable(doc, {
    startY: y + 10,
    head: tableHead,
    body: tableBody,
    theme: 'grid',
    headStyles: { 
        fillColor: maroon, 
        textColor: [255, 255, 255], 
        fontStyle: 'bold',
        halign: 'center'
    },
    styles: {
        fontSize: 10,
        cellPadding: 3,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
    },
    columnStyles: {
        0: { cellWidth: 'auto' }, // Criteria
        1: { cellWidth: 25, halign: 'center' }, // Max
        2: { cellWidth: 25, halign: 'center', fontStyle: 'bold' } // Score
    },
    didParseCell: (data) => {
        // Highlight Total Row
        if (data.row.index === 6) {
            data.cell.styles.fillColor = gold;
            data.cell.styles.textColor = maroon;
            data.cell.styles.fontStyle = 'bold';
        }
    }
  });

  // --- Signatures ---
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  doc.text(`Panel Member: ${data.panel.member}`, 15, finalY);
  doc.text(`Role: ${data.panel.role}`, 15, finalY + 5);
  
  doc.setLineWidth(0.2);
  doc.line(130, finalY, 190, finalY);
  doc.text("Signature", 130, finalY + 5);

  // --- Footer ---
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  const footerText = `Generated via TUC Digital Broadsheet System | ${new Date().toLocaleString()}`;
  doc.text(footerText, 105, 285, { align: "center" });

  // Save File
  const filename = `Broadsheet_${data.candidate.name.replace(/[^a-zA-Z0-9]/g, '_')}_${data.candidate.date}.pdf`;
  doc.save(filename);
};
```

### FILE: services/testRunner.ts
```typescript
import { TestScenario, TestResult } from '../types';
import html2canvas from 'html2canvas';

// Helper to wait
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to simulate typing
const simulateType = async (selector: string, value: string) => {
  const input = document.querySelector(selector) as HTMLInputElement | HTMLSelectElement;
  if (!input) throw new Error(`Element not found: ${selector}`);
  
  // React 16+ hack for changing inputs programmatically
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  )?.set;
  
  const nativeSelectValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLSelectElement.prototype,
    "value"
  )?.set;

  if (input instanceof HTMLInputElement && nativeInputValueSetter) {
    nativeInputValueSetter.call(input, value);
  } else if (input instanceof HTMLSelectElement && nativeSelectValueSetter) {
    nativeSelectValueSetter.call(input, value);
  } else {
    input.value = value;
  }

  const event = new Event('input', { bubbles: true });
  input.dispatchEvent(event);
  await wait(300);
};

// Define Critical User Journey
export const CRITICAL_USER_JOURNEY: TestScenario = {
  name: "Complete Scoring Workflow",
  description: "Validates form entry, scoring calculation, submission, and confirmation UI.",
  steps: [
    {
      id: 1,
      description: "Reset Form & Navigate to Home",
      action: async () => {
        // Ensure we are on the main form (crudely by reloading if needed, but here we assume SPA state)
        // In a real runner we might force route, but for this app, we just ensure inputs are clear-ish
        const nameInput = document.getElementById('fullName') as HTMLInputElement;
        if (nameInput && nameInput.value) {
           await simulateType('#fullName', '');
        }
      }
    },
    {
      id: 2,
      description: "Enter Candidate Details",
      action: async () => {
        await simulateType('#fullName', 'Automated Test Candidate');
        await simulateType('#position', 'Test Engineer');
        await simulateType('#date', '2025-01-01');
      }
    },
    {
      id: 3,
      description: "Enter Panel Details",
      action: async () => {
        await simulateType('#panelMember', 'Test Bot');
        await simulateType('#panelRole', 'QA');
      }
    },
    {
      id: 4,
      description: "Input Scores",
      action: async () => {
        // Appearance (Max 5) -> 4
        await simulateType('#score-appearance', '4');
        // Confidence (Max 15) -> 12
        await simulateType('#score-confidence', '12');
        // Competence (Max 40) -> 35
        await simulateType('#score-competence', '35');
      }
    },
    {
      id: 5,
      description: "Submit Broadsheet",
      action: async () => {
        const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (!submitBtn) throw new Error("Submit button not found");
        if (submitBtn.disabled) throw new Error("Submit button is disabled - form validation failed?");
        submitBtn.click();
        await wait(2000); // Wait for mock API
      }
    },
    {
      id: 6,
      description: "Verify Success State",
      action: async () => {
        const successMsg = document.body.innerText.includes('Submission Successful');
        if (!successMsg) throw new Error("Success message not found in DOM");
        
        // Take screenshot of success
        const canvas = await html2canvas(document.body);
        const dataUrl = canvas.toDataURL();
        // In a real app we'd save this, here we just confirm it generated
        if (!dataUrl.startsWith('data:image')) throw new Error("Screenshot generation failed");
      }
    }
  ]
};
```

### FILE: src/index.js
```javascript
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4025;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = <REDACTED>
const DB_NAME = process.env.DB_NAME || 'candidate_broadsheet';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS candidates (
        id VARCHAR(255) PRIMARY KEY, candidate_number VARCHAR(100),
        full_name VARCHAR(255), exam_center VARCHAR(255),
        status VARCHAR(50), created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_candidate_number (candidate_number), INDEX idx_status (status)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS results (
        id VARCHAR(255) PRIMARY KEY, candidate_id VARCHAR(255),
        subject VARCHAR(100), score INT, grade VARCHAR(2),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (candidate_id) REFERENCES candidates(id),
        INDEX idx_candidate (candidate_id), INDEX idx_grade (grade)
      )
    `);
    conn.release();
    console.log('Candidate Broadsheet DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'candidate-broadsheet' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/candidate') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const candId = `cand_${Date.now()}`;
          await conn.query(
            'INSERT INTO candidates (id, candidate_number, full_name, exam_center, status) VALUES (?, ?, ?, ?, ?)',
            [candId, data.number || '', data.name || '', data.center || '', 'registered']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, candidate_id: candId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/results')) {
      const conn = await pool.getConnection();
      const [results] = await conn.query('SELECT * FROM results ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(results));
      return;
    }

    res.writeHead(404);
    res.end('Not Found');
  } catch (e) {
    console.error('Request error:', e);
    res.writeHead(500);
    res.end(JSON.stringify({ error: e.message }));
  }
}

async function start() {
  await initDB();
  const server = http.createServer((req, res) => {
    handleRequest(req, res).catch(e => { res.writeHead(500); res.end('error'); });
  });
  server.listen(PORT, () => console.log(`Candidate Broadsheet API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });

```

### FILE: tests/puppeteer_cuj.js
```javascript
// tests/playwright_cuj.js
// Run with: node tests/playwright_cuj.js
const { chromium } = require('@playwright/test');

(async () => {
  console.log('🚀 Starting Playwright Critical User Journey Test...');
  
  const browser = await chromium.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  try {
    // 1. Navigate to App
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Loaded application');

    // 2. Fill Candidate Details
    await page.type('#fullName', 'Playwright Candidate');
    await page.type('#position', 'Senior Developer');
    console.log('✅ Entered candidate details');

    // 3. Fill Panel Details
    await page.type('#panelMember', 'Automated Tester');
    await page.select('#panelRole', 'QA');
    console.log('✅ Entered panel details');

    // 4. Input Scores
    // Assuming scores are plain number inputs
    await page.type('#score-appearance', '5');
    await page.type('#score-confidence', '15');
    await page.type('#score-competence', '35'); // Max is 40
    console.log('✅ Entered scores');

    // 5. Submit
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      console.log('✅ Clicked submit');
    } else {
      throw new Error('Submit button not found');
    }

    // 6. Verify Success
    await page.waitForSelector('.text-3xl.font-bold', { timeout: 5000 });
    const successText = await page.$eval('body', el => el.innerText);
    
    if (successText.includes('Submission Successful')) {
      console.log('🎉 TEST PASSED: Submission verified.');
      
      // Capture screenshot
      await page.screenshot({ path: 'test_success.png' });
      console.log('📸 Screenshot saved to test_success.png');
    } else {
      throw new Error('Success message not found');
    }

  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
```

