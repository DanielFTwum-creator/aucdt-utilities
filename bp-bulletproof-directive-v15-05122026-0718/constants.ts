import { Framework } from './types';

const CONTEXT_BLOCK = `CONTEXT (read before executing):
- Industry: Software Engineering
- Role: IT Department / Development Team
- Documentation standard: IEEE 830 / IEEE 29148 SRS format
- Language: UK British English in all output
- SRS naming convention: SRS-YYYY-NNN
- Incident ID format: INC-YYYY-NNN
- All diagrams: SVG format, embedded in SRS
- All documents: saved in /docs directory
- Code standards: production-ready only — no placeholders
- Frontend: React · TypeScript · Tailwind CSS
- Backend: Java (Spring Boot) · Node.js (Express) · Python (FastAPI)
- Database: MySQL · PostgreSQL
- Infrastructure: Ubuntu · Docker · Nginx`;

export const SINGLE_SHOT_CLAUDE = `CRITICAL: EXECUTE ALL ITEMS BELOW - USE THIS CHECKLIST APPROACH

PROJECT: [SPECIFY PROJECT NAME]
${CONTEXT_BLOCK}

PROJECT REFRESH CHECKLIST - CONFIRM EACH ITEM:

☐ 1. FOUNDATION
   - Generate IEEE SRS document for current state
   - Reset project to clean baseline

☐ 2. SECURITY & ACCESSIBILITY  
   - Implement password-protected Admin section
   - Add audit logging for admin actions
   - Add full accessibility support + themes (Light/Dark/High-contrast)

☐ 3. TESTING
   - Integrate self-testing capabilities
   - Create Playwright test suite
   - Add interactive test tab with screenshot capture

☐ 4. DOCUMENTATION
   - Generate System Architecture SVG
   - Generate Database Architecture SVG  
   - Create Admin Guide, Deployment Guide, Testing Guide

☐ 5. FINALIZATION
   - Update final SRS with all features
   - Embed diagrams in SRS
   - Organize all files in /docs directory

EXECUTION PROTOCOL:
- Work through checklist in order
- Confirm each ☐ item completion with ✅
- If any item fails, stop and report issue
- Only proceed when current item is ✅ complete

BEGIN EXECUTION NOW`;

export const SINGLE_SHOT_AISTUDIO = `${CONTEXT_BLOCK}

PROJECT: [SPECIFY PROJECT NAME]
TASK: FULL PROJECT REFRESH (ALL PHASES)

You are acting as a senior software architect, security engineer, QA engineer, and technical writer. Execute the following tasks in order. Confirm each with ✅ before proceeding to the next. Do not skip or defer any item.

TASKS:
1. PHASE 1: FOUNDATION
   - Generate a complete IEEE 830 / IEEE 29148 SRS document for the current state. Document ID: SRS-[YEAR]-[NNN]
   - Provide a checklist to reset the project to a clean baseline.

2. PHASE 2: SECURITY & ACCESSIBILITY
   - Implement a password-protected Admin section.
   - Add comprehensive audit logging for all admin actions.
   - Add full accessibility support (ARIA, keyboard navigation, screen readers).
   - Implement Light / Dark / High-contrast themes.

3. PHASE 3: TESTING
   - Integrate self-testing capabilities.
   - Create a Playwright test suite for critical journeys.
   - Add an interactive "Playwright Self-Test" tab to the frontend.

4. PHASE 4: DOCUMENTATION
   - Generate System Architecture Diagram (SVG).
   - Generate Database Architecture Diagram (SVG).
   - Create Administrator Guide, Deployment Guide, and Testing Guide.

5. PHASE 5: FINALISATION
   - Update the final SRS with all implemented features.
   - Embed the SVGs directly into the SRS.
   - Perform a formal SRS ↔ Implementation Gap Analysis as a table.
   - Specify the internal directory structure containing the new guides.

OUTPUT FORMAT:
- Deliver all code, tests, markdown, and SVG diagrams in full — no placeholders.
- Follow the sequence strictly.
- End your response with: "ALL PHASES COMPLETE ✅ — PROJECT REFRESH FINISHED"`;

const DIRECTIVES = {
  1: `${CONTEXT_BLOCK}

PROJECT: [SPECIFY PROJECT NAME]
TASK: PHASE 1 — FOUNDATION

You are acting as a senior software architect. Execute the following tasks in order. Confirm each with ✅ before proceeding to the next. Do not skip or defer any item.

TASKS:
1. Generate a complete IEEE 830 / IEEE 29148 SRS document for the current state of this application.
   - Document ID: SRS-[YEAR]-[NNN]
   - Language: UK British English
   - Include: purpose, scope, functional requirements, non-functional requirements, constraints, assumptions
   - Output as a full structured document — no outlines or placeholders

2. Describe the steps required to reset the project to a clean, stable baseline. List any files or configurations that should be verified or removed.

OUTPUT FORMAT:
- Deliver the SRS document in full
- Follow with the baseline reset checklist
- End your response with: "PHASE 1 COMPLETE ✅ — READY FOR PHASE 2"

Do not proceed to Phase 2 tasks in this response.`,

  2: `${CONTEXT_BLOCK}

PROJECT: [SPECIFY PROJECT NAME]
TASK: PHASE 2 — SECURITY & ACCESSIBILITY
GATE: Phase 1 SRS must be complete before starting this phase.

You are acting as a senior software architect and security engineer. Execute the following tasks in order. Confirm each with ✅ before proceeding to the next. Do not skip or defer any item.

TASKS:
1. Design a password-protected Admin section:
   - Specify the authentication mechanism (session-based or token-based)
   - Define the admin routes and access control logic
   - Provide the full implementation code (not an outline)

2. Implement comprehensive audit logging for all admin actions:
   - Log format: timestamp, admin user, action, affected resource, IP address
   - Storage: database table or append-only log file (recommend and justify your choice)
   - Provide the full implementation

3. Implement full accessibility support:
   - ARIA roles and labels on all interactive elements
   - Full keyboard navigation (tab order, focus management, skip links)
   - Screen reader compatibility
   - Provide annotated code examples for each

4. Implement three UI themes — Light, Dark, and High-contrast:
   - Use CSS custom properties (variables)
   - Theme preference persisted in localStorage with key: [project-slug]-theme
   - Auto-apply theme on page load before DOM renders (inline script)
   - Provide complete CSS and the theme-switching logic

OUTPUT FORMAT:
- Deliver each task's implementation in full
- End your response with: "PHASE 2 COMPLETE ✅ — READY FOR PHASE 3"

Do not proceed to Phase 3 tasks in this response.`,

  3: `${CONTEXT_BLOCK}

PROJECT: [SPECIFY PROJECT NAME]
TASK: PHASE 3 — TESTING
GATE: Phase 2 security and accessibility must be complete before starting this phase.

You are acting as a senior QA engineer and test architect. Execute the following tasks in order. Confirm each with ✅ before proceeding to the next.

TASKS:
1. Design and implement self-testing capabilities within the application:
   - Health check endpoints for all major services
   - Internal diagnostic routines that can be triggered from the UI
   - Provide full implementation code

2. Create a comprehensive Playwright test suite covering critical user journeys:
   - Authentication (login, logout, failed login)
   - Admin section access and audit logging
   - Theme switching
   - Accessibility checks (keyboard navigation, ARIA)
   - Provide complete, runnable Playwright scripts

3. Add an interactive "Playwright Self-Test" tab to the frontend:
   - Trigger tests from the browser UI
   - Display real-time test results (pass/fail per test)
   - Capture and display screenshots on failure
   - Provide the full React/TypeScript component code

OUTPUT FORMAT:
- Deliver all implementation code in full — no placeholders
- End your response with: "PHASE 3 COMPLETE ✅ — READY FOR PHASE 4"

Do not proceed to Phase 4 tasks in this response.`,

  4: `${CONTEXT_BLOCK}

PROJECT: [SPECIFY PROJECT NAME]
TASK: PHASE 4 — DOCUMENTATION
GATE: Phase 3 testing must be complete before starting this phase.

You are acting as a senior technical architect and technical writer. Execute the following tasks in order. Confirm each with ✅ before proceeding to the next.

TASKS:
1. Generate a System Architecture Diagram in SVG format:
   - Show all major components (frontend, backend, database, external services)
   - Include data flow arrows with labels
   - Use a clean layout suitable for embedding in an IEEE SRS document
   - Output raw, complete SVG code

2. Generate a Database Architecture Diagram in SVG format:
   - Show all tables with column names and data types
   - Show all relationships (PK, FK, cardinality)
   - Output raw, complete SVG code

3. Write a comprehensive Administrator Guide (UK British English):
   - Admin login and session management
   - User management procedures
   - Audit log access and interpretation
   - Common troubleshooting steps
   - Save path: /docs/ADMIN_GUIDE.md

4. Write a step-by-step Deployment Guide (UK British English):
   - Environment requirements
   - Build and deployment commands
   - Nginx / PM2 / Docker configuration
   - Post-deployment verification checklist
   - Save path: /docs/DEPLOYMENT_GUIDE.md

5. Write a Testing Guide (UK British English):
   - How to run the Playwright test suite
   - How to interpret results and screenshots
   - Manual testing checklist for each critical journey
   - Save path: /docs/TESTING_GUIDE.md

OUTPUT FORMAT:
- Deliver SVG diagrams as raw code blocks
- Deliver each guide as a complete Markdown document
- End your response with: "PHASE 4 COMPLETE ✅ — READY FOR PHASE 5"

Do not proceed to Phase 5 tasks in this response.`,

  5: `${CONTEXT_BLOCK}

PROJECT: [SPECIFY PROJECT NAME]
TASK: PHASE 5 — FINALISATION
GATE: Phase 4 documentation must be complete before starting this phase.

You are acting as a senior software architect performing final sign-off. Execute the following tasks in order. Confirm each with ✅ before proceeding to the next.

TASKS:
1. Update the IEEE SRS document (SRS-YYYY-NNN) to reflect all features implemented across Phases 1–4:
   - Add or revise functional requirements to match actual implementation
   - Update non-functional requirements (accessibility, security, performance)
   - Language: UK British English

2. Embed the System Architecture SVG and Database Architecture SVG directly into the SRS document at the appropriate sections.

3. Perform a formal SRS ↔ Implementation Gap Analysis:
   - List every requirement in the SRS
   - For each: state whether it is Implemented ✅, Partial ⚠️, or Missing ❌
   - For partial or missing items: provide a brief remediation note
   - Format as a structured table

4. Specify the /docs directory structure with all files created across all phases, showing the complete folder layout.

OUTPUT FORMAT:
- Deliver the updated SRS in full
- Deliver the gap analysis as a structured table
- Deliver the /docs directory tree
- End your response with: "PHASE 5 COMPLETE ✅ — PROJECT REFRESH COMPLETE" (or "READY FOR PHASE 6" if App Store deployment is required)

Do not proceed to Phase 6 tasks in this response unless explicitly instructed.`,

  6: `${CONTEXT_BLOCK}

PROJECT: [SPECIFY PROJECT NAME]
TASK: PHASE 6 — APP STORE DEPLOYMENT
GATE: Phase 5 finalisation must be complete before starting this phase.
NOTE: Only execute this phase if the project is targeting iOS and/or Android app stores.

You are acting as a senior mobile deployment engineer. Execute the following tasks in order. Confirm each with ✅ before proceeding to the next.

TASKS:
1. Provide the exact commands to install and configure Capacitor 8.3.3:
   - Install @capacitor/core, @capacitor/cli, @capacitor/ios, @capacitor/android
   - Initialise with correct app name and ID (com.example.[appname])
   - Add iOS and Android platforms

2. Write a complete capacitor.config.ts for this project:
   - App ID: com.example.[appname]
   - App name: [Project Name]
   - Web directory: dist

3. Specify the package.json version update to 1.0.0 and provide the full npm scripts block:
   - build, build:web, build:ios, build:android, ios:open, android:open, mobile:sync

4. Write APP_STORE_GUIDE.md — complete iOS App Store and Google Play submission SOP:
   - Account setup, app record creation, metadata, screenshots, build upload, review submission
   - Save path: /docs/APP_STORE_GUIDE.md

5. Write MOBILE_BUILD_GUIDE.md — build workflow and debugging:
   - Step-by-step build commands for both platforms
   - Common errors and fixes
   - Save path: /docs/MOBILE_BUILD_GUIDE.md

6. Write APP_ICONS_GUIDE.md — icon generation process:
   - Required sizes for iOS and Android
   - Recommended tools and placement paths
   - Save path: /docs/APP_ICONS_GUIDE.md

7. Write a GDPR / CCPA / GDPA compliant privacy.html:
   - Must be suitable for hosting at a public URL (e.g. https://[domain]/privacy.html)
   - Cover data collection, storage, user rights, contact details
   - Save path: /public/privacy.html

8. Write APPSTORE_READY.md — pre-submission checklist:
   - ✅/❌ checklist of all setup items
   - Timeline estimate and next steps
   - Save path: /docs/APPSTORE_READY.md

9. Provide device testing instructions:
   - iOS simulator commands (Xcode)
   - Android emulator commands (Android Studio)
   - What to verify: exports, theming, admin panel, accessibility

OUTPUT FORMAT:
- Deliver all code and documents in full — no placeholders
- End your response with: "PHASE 6 COMPLETE ✅ — PROJECT REFRESH FINISHED"`,
};

export const FRAMEWORKS: Framework[] = [
    {
        id: 'standard',
        title: 'Standard Project Refresh',
        phases: [
            { id: 1, title: "FOUNDATION", description: "Analyze, document, and establish baseline", tasks: [], deliverables: [], directive: DIRECTIVES[1], status: 'Complete' },
            { id: 2, title: "SECURITY & ACCESSIBILITY", description: "Implement core security and accessibility features", tasks: [], deliverables: [], directive: DIRECTIVES[2], status: 'Complete' },
            { id: 3, title: "TESTING", description: "Integrate E2E testing and diagnostics", tasks: [], deliverables: [], directive: DIRECTIVES[3], status: 'In Progress' },
            { id: 4, title: "DOCUMENTATION", description: "Generate guides and architecture diagrams", tasks: [], deliverables: [], directive: DIRECTIVES[4], status: 'Pending' },
            { id: 5, title: "FINALISATION", description: "Finalize SRS and project alignment", tasks: [], deliverables: [], directive: DIRECTIVES[5], status: 'Pending' },
            { id: 6, title: "APP STORE DEPLOYMENT", description: "Capacitor config, mobile builds, and app store submission", tasks: [], deliverables: [], directive: DIRECTIVES[6], status: 'Pending' }
        ]
    },
    {
        id: 'hipaa',
        title: 'HIPAA Healthcare Compliance',
        phases: [
            { id: 1, title: "Foundation & Compliance Baseline", description: "IEEE SRS with HIPAA section, PHI data inventory, PHI storage map, Compliance structure", tasks: [], deliverables: [], directive: "Conduct initial HIPAA risk assessment and document PHI inventory.", status: 'In Progress' },
            { id: 2, title: "Administrative Safeguards (§164.308)", description: "RBAC system, Unique user IDs, Auto logout 15min, Emergency access, Comprehensive audit logs, Password policies", tasks: [], deliverables: [], directive: "Implement RBAC, unique user IDs, and auto-logout mechanisms.", status: 'Pending' },
            { id: 3, title: "Technical Safeguards (§164.310, §164.312)", description: "AES-256 at rest, TLS 1.3 in transit, Integrity controls, MFA for admins, Encrypted backups", tasks: [], deliverables: [], directive: "Enforce AES-256 encryption at rest and TLS 1.3 in transit.", status: 'Pending' },
            { id: 4, title: "Privacy & Access Controls", description: "Minimum necessary access, Consent tracking, Patient portal, Accounting of disclosures, Breach notification", tasks: [], deliverables: [], directive: "Establish minimum necessary access and breach notification procedures.", status: 'Pending' },
            { id: 5, title: "Testing & Technical Documentation", description: "HIPAA test suite, Risk assessment, Security architecture SVG, PHI data flow SVG, Compliance checklist, Incident response plan, BAA template", tasks: [], deliverables: [], directive: "Execute HIPAA test suite and finalize security architecture.", status: 'Pending' },
            { id: 6, title: "Administrative Documentation", description: "Administrator guide, Training guide, Patient rights guide, Updated SRS, Organised /docs/hipaa/, Final verification", tasks: [], deliverables: [], directive: "Complete administrative documentation and final verification.", status: 'Pending' }
        ]
    },
    {
        id: 'pci',
        title: 'PCI-DSS Payment Security',
        phases: [
            { id: 1, title: "Foundation & Scope", description: "SRS with PCI-DSS section, CDE boundaries, Data flow diagram, Retention policies", tasks: [], deliverables: [], directive: "Define CDE boundaries and document data flow.", status: 'In Progress' },
            { id: 2, title: "Network Security (Req 1-2)", description: "Network segmentation, Firewall rules, Remove defaults, System inventory", tasks: [], deliverables: [], directive: "Implement network segmentation and firewall configurations.", status: 'Pending' },
            { id: 3, title: "Data Protection (Req 3-4)", description: "AES-256 at rest, PAN masking, TLS 1.2+, No sensitive auth data storage, Key management", tasks: [], deliverables: [], directive: "Ensure AES-256 encryption and secure key management.", status: 'Pending' },
            { id: 4, title: "Vulnerability Management (Req 5-6)", description: "Anti-malware, Secure SDLC, Vulnerability scanning, WAF/code review", tasks: [], deliverables: [], directive: "Deploy anti-malware and establish secure SDLC practices.", status: 'Pending' },
            { id: 5, title: "Access Controls (Req 7-8)", description: "RBAC need-to-know, Unique user IDs, MFA for CDE, Password policies, Session timeout", tasks: [], deliverables: [], directive: "Configure RBAC, MFA, and session timeout controls.", status: 'Pending' },
            { id: 6, title: "Monitoring & Testing (Req 10-11)", description: "Comprehensive audit logs, Daily log review, Time sync, File integrity monitoring, Pen testing", tasks: [], deliverables: [], directive: "Implement comprehensive audit logging and file integrity monitoring.", status: 'Pending' },
            { id: 7, title: "Security Policy (Req 12)", description: "Security policy, Compliance manual, Training programme, Architecture diagrams, SAQ", tasks: [], deliverables: [], directive: "Finalize security policies and compliance documentation.", status: 'Pending' }
        ]
    },
    {
        id: 'soc2',
        title: 'SOC 2 Trust Services',
        phases: [
            { id: 1, title: "Foundation & Scope", description: "SRS with SOC 2 section, Define scope (Type I/II), Identify TSC criteria, System description", tasks: [], deliverables: [], directive: "Define SOC 2 scope and identify TSC criteria.", status: 'In Progress' },
            { id: 2, title: "Organisation & Management (CC1)", description: "Org structure, Security policy framework, Board oversight, Third-party risk mgmt", tasks: [], deliverables: [], directive: "Establish organizational structure and security policies.", status: 'Pending' },
            { id: 3, title: "Communication & Monitoring (CC2-CC3)", description: "Security training, Communication mechanisms, SIEM monitoring, Incident escalation", tasks: [], deliverables: [], directive: "Implement security training and incident monitoring.", status: 'Pending' },
            { id: 4, title: "Risk Assessment (CC4-CC5)", description: "Risk assessment process, Risk register, BC/DR plan, Incident response plan", tasks: [], deliverables: [], directive: "Develop risk assessment and BC/DR plans.", status: 'Pending' },
            { id: 5, title: "Access Controls (CC6)", description: "IAM system, MFA for all, Access reviews, Privileged access mgmt, Audit logging", tasks: [], deliverables: [], directive: "Configure IAM, MFA, and audit logging.", status: 'Pending' },
            { id: 6, title: "Operations & Change (CC7-CC8)", description: "Operations procedures, Change management, Environment separation, Encryption controls", tasks: [], deliverables: [], directive: "Implement change management and encryption controls.", status: 'Pending' },
            { id: 7, title: "Testing & Evidence", description: "Control testing, Evidence collection, SOC 2 description, Architecture diagrams, Audit readiness", tasks: [], deliverables: [], directive: "Execute control testing and finalize audit readiness.", status: 'Pending' }
        ]
    },
    {
        id: 'gdpr',
        title: 'GDPR Data Protection',
        phases: [
            { id: 1, title: "Foundation & Data Mapping", description: "SRS with GDPR section, PII data inventory, PII storage map, Data inventory (Art 30), Data flow mapping, Legal basis documentation, Compliance structure", tasks: [], deliverables: [], directive: "Map data flows and document legal basis for processing.", status: 'In Progress' },
            { id: 2, title: "Lawful Basis (Art 5-7, 12-14)", description: "Consent management, Privacy notices, LIA assessments, DPA templates, Age verification", tasks: [], deliverables: [], directive: "Implement consent management and privacy notices.", status: 'Pending' },
            { id: 3, title: "Data Subject Rights (Art 15-22)", description: "DSAR portal, Right to rectification, Right to erasure, Data portability, Right to object", tasks: [], deliverables: [], directive: "Develop DSAR portal and data subject rights processes.", status: 'Pending' },
            { id: 4, title: "Security (Art 25, 32)", description: "Privacy by design, AES-256 + TLS 1.3, Breach detection, 72-hour notification, Auto-deletion", tasks: [], deliverables: [], directive: "Implement privacy-by-design and breach detection systems.", status: 'Pending' },
            { id: 5, title: "Accountability (Art 24, 35-39)", description: "DPIA system, DPO appointment, Processor management, Compliance audits", tasks: [], deliverables: [], directive: "Establish DPIA system and processor management.", status: 'Pending' },
            { id: 6, title: "Documentation & Training", description: "Article 30 records, Training programme, Compliance diagrams, Cookie consent, Organised /docs/gdpr/", tasks: [], deliverables: [], directive: "Finalize Article 30 records and training programmes.", status: 'Pending' }
        ]
    },
];

export const PHASES = FRAMEWORKS[0].phases;
