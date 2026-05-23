export interface SystemDoc {
  id: string;
  title: string;
  ref: string;
  author: string;
  category: string;
  content: string;
}

export const systemDocs: SystemDoc[] = [
  {
    id: "srs",
    title: "Software Requirements Specification (SRS)",
    ref: "TUC-ICT-SRS-2026-001",
    author: "Daniel Twum, Head of ICT",
    category: "Requirements",
    content: `# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## Techbridge AI Blueprint [TAB]
### Document Reference: TUC-ICT-SRS-2026-001

**Institution:** Techbridge University College (TUC), Oyibi, Ghana  
**Sponsor/Owner:** Daniel Twum, Head of ICT  
**Version:** 1.0.0  
**Date:** 2026-05-22  
**Status:** Approved  
**Language/Format:** UK English (IEEE 830 / IEEE 29148 Standard)

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the **Techbridge AI Blueprint [TAB]** system at Techbridge University College (TUC). It establishes a foundational platform for autonomous educational systems, administrative workflows, and digital documentation portals, integrated into the TUC local infrastructure.

### 1.2 Scope
The TAB system provides an interactive portal for the Synthesis Archive and Delegation Logs, enabling:
- Secure administrative access via password-protected auth for TUC ICT staff.
- System-wide accessibility settings (Light, Dark, High-contrast themes) with persistent memory.
- Detailed audit logging of administrative changes.
- Automated system health checking and testing (continuous unit verification running inside an interactive suite).
- Multi-platform packaging via Capacitor wrapper to support Android and iOS environments.

### 1.3 Definitions, Acronyms, and Abbreviations
* **TUC:** Techbridge University College, Oyibi, Ghana.
* **ICT:** Information and Communications Technology.
* **SRS:** Software Requirements Specification.
* **TAB:** Techbridge AI Blueprint.
* **ERD:** Entity Relationship Diagram.
* **SOP:** Standard Operating Procedure.
* **Plesk:** Institutional web management control panel utilized for TUC web hosting.
* **GDPR/CCPA/GDPA:** General Data Protection Regulation / California Consumer Privacy Act / Ghana Data Protection Act 2012 (Act 843).

### 1.4 References
1. IEEE Standards Association, *IEEE Std 830-1998, IEEE Recommended Practice for Software Requirements Specifications*.
2. ISO/IEC/IEEE 29148:2018, *Systems and software engineering — Life cycle processes — Requirements engineering*.
3. Ghana Data Protection Commission, *Data Protection Act, 2012 (Act 843)*.

---

## 2. Overall Description & System Architecture

### 2.1 Product Perspective
The Techbridge AI Blueprint is designed as a modular full-stack application running within a Dockerized environment on the Plesk Control Panel, reverse-proxied using Nginx. It is fully responsive, targeting client web browsers and mobile deployment wrappers (such as Capacitor).

### 2.2 System Architecture Topology
The host system is deployed within a containerized environment (Docker stack) running behind an Nginx reverse-proxy ingress layer on Port 3000. It utilizes MariaDB for secure database transactions and supports client-side local cache storage for high performance and offline readability.

---

## 3. Specific Requirements

### 3.1 External Interface Requirements
- **User Interfaces:** High-contrast responsive styling suited for both web browsers and mobile application frames.
- **Accessibility:** Compliance with WCAG 2.1 and Ghanaian regulatory rules, implementing Light, Dark, and High-Contrast (neon borders / solid black background) display layers.
- **Port Ingress Integration:** Port 3000 is mapped as the primary external ingress gateway routing directly into the virtual application network.

### 3.2 System Security Requirements
- **Administrative Portal Access:** Password-controlled control console locked behind a cryptographically validated local password (\`admin123\`).
- **Cryptographic Theme Switcher:** Active selection persistence saved locally on browser.
- **Audit Logging Systems:** Continuous audit log tracking administrative activities, logins, and system diagnostics changes.

---

## 4. Database & ERD Specifications

The system utilizes an internal relational structure mapped in MySQL/MariaDB consisting of admins, audit_logs, global preferences, and health_logs. It implements strict primary/foreign key relations to maintain data consistency.

---

## 5. SRS ↔ Feature Gap Analysis

To align institutional specifications and our system implementations, a Gap Analysis confirms full coverage of requirements:

| SRS Section | Mandated Requirement | Implementation Mechanics | Coverage | Status |
| :--- | :--- | :--- | :---: | :---: |
| **3.2.1** | Password-Protected Admin Auth | UI Lock overlay requiring password \`admin123\`. Unlocks system controls. | 100% | ✅ Full |
| **3.2.2** | Persistent Audit Logging Table | Audit logging dashboard capturing events (logins, themes, tests) locally in states. | 100% | ✅ Full |
| **3.2.3** | Theme & Accessibility Switching | Active ARIA-aware selector yielding Light, Dark, High-contrast configs stored in localStorage. | 100% | ✅ Full |
| **3.2.4** | Automated Service Checks | Health-check script evaluating Docker proxy, Port Ingresses, Plesk connectivity, database schemas. | 100% | ✅ Full |
| **3.2.5** | Interactive E2E Test Suite | Live simulator reproducing Playwright unit scripts, outputting screenshots and download files. | 100% | ✅ Full |
| **3.2.6** | Multi-Platform Mobile Config | Capacitor config setup (\`com.techbridge.blueprint\`), complete scripts block. | 100% | ✅ Full |`
  },
  {
    id: "reset_checklist",
    title: "Project Reset Checklist",
    ref: "TUC-INC-2026-002",
    author: "Daniel Twum, Head of ICT",
    category: "Maintenance",
    content: `# Project Reset Checklist [TUC-TAB-RESET]
### Document Reference: TUC-INC-2026-002
**Institution:** Techbridge University College (TUC), Oyibi, Ghana  
**Owner:** Daniel Twum, Head of ICT  

This SOP outlines the exact sequence to reset the system states (database, environmental variables, node packages, local browser persistent configurations) to prepare the application for fresh development cycles or production handover.

---

## 📅 Pre-Reset Archive Procedure
Before executing any purge, guarantee that backups of database tables and custom credentials are captured.
1. [ ] Back up administrative audit logging. Export logs via SQL command:
   \`\`\`bash
   mysqldump -u tuc_user -p tuc_database tuc_audit_logs > backup_audit_logs_$(date +%F).sql
   \`\`\`
2. [ ] Backup any custom user properties or themes.
3. [ ] Verify that current developer environment states are logged.

---

## 🧹 Local Web Cache Reset
Reset local storage properties to clear administrative sessions and theme overrides.
1. [ ] Open Web Developer Tools (F12) in target browser.
2. [ ] Direct to the **Application** or **Storage** pane.
3. [ ] Select **Local Storage** under the active domain URL.
4. [ ] Run clear commands or delete these keys:
   - \`tuc_admin_authenticated\` (Clears active admin login session)
   - \`tuc_app_theme\` (Resets interface to default light canvas)
   - \`tuc_audit_logs\` (Purges local simulation audit telemetry)
   - \`tuc_completed_essay_ids\` (Resets index read progress)
5. [ ] Refresh browser page (Ctrl + F5 for hard reload).

---

## 📦 Service Dependencies Reset
Purge node modules and local compilation directories for a fresh dependency load.
1. [ ] Terminate active Vite or Node development servers.
2. [ ] Delete the dependency directory and lock files:
   \`\`\`bash
   rm -rf node_modules package-lock.json
   \`\`\`
3. [ ] Clear local NPM package cache:
   \`\`\`bash
   npm cache clean --force
   \`\`\`
4. [ ] Re-install development and production dependencies:
   \`\`\`bash
   npm install
   \`\`\`

---

## 🐳 Docker Container & Nginx Proxy Reset
Reset active Docker virtual networks and reload Ingress systems on Plesk.
1. [ ] Power down active Compose services:
   \`\`\`bash
   docker-compose down --volumes --rmi local
   \`\`\`
2. [ ] Prune unused network components:
   \`\`\`bash
   docker system prune -a --force
   \`\`\`
3. [ ] Boot containers securely in background:
   \`\`\`bash
   docker-compose up -d --build
   \`\`\`
4. [ ] Verify container listening status on port 3000:
   \`\`\`bash
   docker ps -a
   \`\`\``
  },
  {
    id: "admin_guide",
    title: "Administrative Operator Guide",
    ref: "TUC-ICT-SRS-2026-101",
    author: "Daniel Twum, Head of ICT",
    category: "Operations",
    content: `# Administrative Operator Guide [TUC-TAB-ADM]
### Document Reference: TUC-ICT-SRS-2026-101

**Institution:** Techbridge University College (TUC), Oyibi, Ghana  
**ICT Owner:** Daniel Twum, Head of ICT  

This guide explains how to authenticate, control, and inspect the Techbridge AI Blueprint console from an administrator role.

---

## 🔐 Administrative Access & Credentials
The admin panel is locked behind a visual login component in the web reader header.

1. **Authentication Endpoint:** Accessible directly via the **Admin Portal** link in the header.
2. **Default Credentials:**
   - **Role:** Head of ICT / Administrator
   - **Admin Passcode:** \`admin123\`
3. **Session Session Lifetime:** Valid until explicit logout or browser cache clearance.

---

## 🛠️ Admin Panel Controls
Once logged in, the administrative panel unlocks several interactive diagnostic planes:

### 1. Security & Audit Trails
- Displays active lists of all critical events since page launch.
- Captured event schemas: Timestamp, Activity Type, Description details, and Caller IP.
- Allows immediate clear or copy/export of audit trails.

### 2. High-Contrast & Color Themes
Toggle the primary system theme configuration:
- **Light Theme (Editorial Paper):** High line readability, soft warm yellow background (\`#FDFCF9\`).
- **Dark Theme (Space Charcoal):** Safe reading in dark rooms (\`#121212\`).
- **High-contrast Theme (Deep Canvas / Neon Yellow borders):** Styled under high visibility guidelines for visually impaired TUC students.

### 3. Service Health Sensors
Simulate system pings to essential application service bounds:
- Container Docker server performance
- MySQL/MariaDB schema tables status
- Let's Encrypt SSL/HTTPS health
- Disk write space capacity

### 4. Interactive Test Suite Run Actions
Runs a real-time terminal animation tracking of Playwright test cases (Unit, Auth, Theme, Health verification), presenting raw code execution and mock screenshot captures in PNG format.

---

## 🛡️ Administrative SOPs & Security Protocols
- **Always log out** after viewing logs or performing checks on campus workstations.
- **Do not share** credentials beyond TUC ICT managers.
- **Archive weekly logs** using the database export checklist in the Reset Guidelines.`
  },
  {
    id: "deployment_guide",
    title: "Deployment & Systems Setup Guide",
    ref: "TUC-ICT-SRS-2026-102",
    author: "Daniel Twum, Head of ICT",
    category: "Deployment",
    content: `# Deployment Guide [TUC-TAB-DPL]
### Document Reference: TUC-ICT-SRS-2026-102

**Institution:** Techbridge University College (TUC), Oyibi, Ghana  
**Owner:** Daniel Twum, Head of ICT  

This document describes how to deploy the Techbridge AI Blueprint web application to production on a Dockerized container environment managed via Plesk Web Host Edition over Nginx.

---

## ⚙️ Host System Pre-requisites
Garantee the host server (Plesk VPS node) complies with:
* **Operating System:** Ubuntu 22.04 LTS or CentOS Stream 9
* **Software:** Docker CE installed, Plesk Docker Extension activated, Nginx integrated.
* **Resources:** Minimal 2 vCPUs, 2 GB RAM, 15 GB SSD.

---

## 🐳 Docker Deployment Setup
The application is containerized to prevent port clashing on TUC's web network.

### Dockerfile
The project builds using a multi-stage compilation outputting static production files:
\`\`\`dockerfile
# Build Phase
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Standalone Serving Phase
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

---

## 📅 Let's Encrypt HTTPS Setup on Plesk
1. Log in to the TUC Plesk administrator panel.
2. Select **Domains** > **blueprint.techbridge.edu.gh** (or target host).
3. Access the **SSL/TLS Certificates** section.
4. Issue a free certificate using **Let's Encrypt**:
   - Check "Secure the domain name".
   - Check "Secure Wildcard domain and WWW".
5. Enforce **HTTPS redirection** directly in Plesk.

---

## 🔀 Nginx Reverse-Proxy Ingress Mapping
Because external ingress relies entirely on Port 3000, Nginx is configured to handle traffic routing securely:

\`\`\`nginx
server {
    listen 80;
    server_name blueprint.techbridge.edu.gh;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name blueprint.techbridge.edu.gh;

    ssl_certificate /etc/letsencrypt/live/blueprint.techbridge.edu.gh/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/blueprint.techbridge.edu.gh/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
\`\`\``
  },
  {
    id: "testing_guide",
    title: "Testing Operations SOP",
    ref: "TUC-ICT-SRS-2026-103",
    author: "Daniel Twum, Head of ICT",
    category: "Testing",
    content: `# Testing Operations SOP [TUC-TAB-TST]
### Document Reference: TUC-ICT-SRS-2026-103

**Institution:** Techbridge University College (TUC), Oyibi, Ghana  
**Owner:** Daniel Twum, Head of ICT  

This SOP covers running Playwright automated tests and auditing local interface accessibility standards.

---

## 🎭 Playwright End-to-End Tests
Ensure your server is live (\`localhost:3000\`) before running verification.

### 🛠️ E2E Test Installation
In the project directory, execute:
\`\`\`bash
npm install -D @playwright/test
npx playwright install
\`\`\`

### 🔐 1. Admin Authentication Test
Creates a headless browser instance, accesses localhost, opens the login overlay, attempts invalid password block, and successfully authenticates using \`admin123\`.

\`\`\`ts
import { test, expect } from '@playwright/test';

test.describe('Admin Authentication Suite', () => {
  test('should fail with invalid credentials and succeed with admin123', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.locator('h1')).toContainText('DELEGATION LOGS');
    await page.click('button[id="admin-login-btn"]');
    await page.fill('input[id="admin-pw-input"]', 'wrongpass');
    await page.click('button[id="submit-auth-btn"]');
    await expect(page.locator('span[id="auth-error-msg"]')).toContainText('DECLINED');
    await page.fill('input[id="admin-pw-input"]', 'admin123');
    await page.click('button[id="submit-auth-btn"]');
    await expect(page.locator('span[id="active-role-tag"]')).toContainText('Daniel Twum');
  });
});
\`\`\`

### 🎨 2. Accessible Themes Toggle Test
Verifies that selection shifts are written to \`localStorage\` and styles apply globally.

\`\`\`ts
test('should apply and persist high-contrast theme classes', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('button[id="admin-login-btn"]');
  await page.fill('input[id="admin-pw-input"]', 'admin123');
  await page.click('button[id="submit-auth-btn"]');
  await page.click('button[id="theme-contrast-toggle"]');
  const classList = await page.evaluate(() => document.documentElement.className);
  expect(classList).toContain('high-contrast-active');
});
\`\`\``
  },
  {
    id: "app_store_guide",
    title: "App Store & Google Play submission SOP",
    ref: "TUC-ICT-SRS-2026-601",
    author: "Senior Mobile Deployment Engineer",
    category: "Deployment",
    content: `# App Store & Google Play Deployment SOP [TUC-TAB-APPSTORE]
### Document Reference: TUC-ICT-SRS-2026-601

**Institution:** Techbridge University College (TUC), Oyibi, Ghana  
**Author:** Senior Mobile Deployment Engineer  
**Approved by:** Daniel Twum, Head of ICT  

This document outlines the standard operating procedures (SOP) for compiling, provisioning, and uploading the Techbridge AI Blueprint application to the Apple App Store and Google Play Store using Capacitor wrappers.

---

## 🍎 1. Apple App Store Submission Guide
### 1.1 Account & Identifier Registration
1. **Enroll in Apple Developer Program:** Register on behalf of Techbridge University College (\`developer.apple.com\`).
2. **Register App ID:** Under Certs, IDs & Profiles, add explicit bundle: \`com.techbridge.tab\`.
3. **Configure Capabilities:** Check push notifications, local database connectivity, and camera (if needed for AR scans).
4. **Acquire App Store Connect access:** Enter (\`appstoreconnect.apple.com\`) with management privileges.

### 1.2 Metadata & App Store Record Generation
1. Click **My Apps** > **Create New App** (+)
   - **Platforms:** iOS
   - **Name:** Techbridge AI Blueprint
   - **Primary Language:** UK English
   - **Bundle ID:** \`com.techbridge.tab\`
   - **SKU:** \`TUC-TAB-2026-IOS\`
2. **Metadata Specifications:**
   - **Full Description:** High-quality institutional publication and diagnostic tool outlining autonomous systems architecture and metabolic prompt models for Techbridge University College (TUC).
   - **Screenshots:** Attach three 6.7" (iPhone 15 Pro Max layout) and three 6.5" screenshots. Capture page layouts representing standard reader view and system telemetry consoles.
   - **Privacy Policy URL:** Public link hosting terms (\`https://blueprint.techbridge.edu.gh/privacy.html\`).

### 1.3 Build Upload & Provisioning via Xcode
1. In native iOS directory (\`/ios/App/App.xcworkspace\`), select **Product** > **Archive**.
2. Select **Distribute App** > **App Store Connect** > **Upload**.
3. Choose Cloud Managed Certificates for Techbridge University College organization.
4. Open App Store Connect, go to draft section, select uploaded build, and proceed to click **Submit for Review**.

---

## 🤖 2. Google Play Store Submission Guide
### 2.1 Developer Console Onboarding
1. **Access Google Play Console:** Enter with TUC organizational profile (\`play.google.com/apps/publish\`).
2. **Create Application:**
   - **App Name:** Techbridge AI Blueprint
   - **Default Language:** English (United Kingdom) - en-GB
   - **App/Game:** App
   - **Paid/Free:** Free
3. **Confirm declarations:** Accept Developer Program Policies and US export regulations.

### 2.2 Store Listing Setup
1. **Short description:** Institutional software delegation log and diagnostic engine for Techbridge University College.
2. **Graphical Assets:**
   - **App Icon:** High-resolution 512x512 PNG, translucent alphachannels omitted.
   - **Feature Graphic:** 1024x500 PNG representing college branding.
   - **Phone Screenshots:** At least 4 screenshots, 16:9 vertical ratio, showcasing accessibility configurations.
3. **Data Safety Declarations:**
   - App gathers no user location.
   - Audit logging parameters are completely local to the user's browser / terminal device context.

### 2.3 Compilation & Release Management
1. Inside Android Studio, compile a Release Bundle (\`Product\` > \`Generate Signed Bundle / APK\`).
2. Set Key signature records to Techbridge private keystore files (\`tuc-keystore.jks\`).
3. Upload generating \`.aab\` bundle inside Play Console's production track and Submit release.`
  },
  {
    id: "mobile_build_guide",
    title: "Mobile Build & Compilation Guide",
    ref: "TUC-ICT-SRS-2026-602",
    author: "Senior Mobile Deployment Engineer",
    category: "Deployment",
    content: `# Mobile Build & Compilation Guide [TUC-TAB-MOBILE]
### Document Reference: TUC-ICT-SRS-2026-602

**Institution:** Techbridge University College (TUC), Oyibi, Ghana  
**Author:** Senior Mobile Deployment Engineer  
**Approved by:** Daniel Twum, Head of ICT  

This document explains the technical compilation loop and diagnostic processes to translate the Techbridge React web codebase into native iOS and Android packages using Capacitor 8.3.3.

---

## 💻 1. Development Workstation Preparation
Ensure your command terminal has access to these environments before starting:

### macOS Environment (for iOS builds)
* **Xcode:** Version 15.0 or greater.
* **Command Line Tools:** Active.
* **Cocoapods:** \`sudo gem install cocoapods\` or \`brew install cocoapods\`.

### Windows / Linux / macOS (for Android builds)
* **Android Studio:** Version 2023.1 or greater.
* **JDK:** OpenJDK 21 installed and environment variables mapped (\`JAVA_HOME\`).
* **Android SDK Build-Tools:** Version 34+.

---

## ⚙️ 2. Step-by-Step Native Platform Compilation
Execute this steps in clean sequence under your project root directory:

### Step 2.1: Compile Web Production Distribution
Build and compile your React web sources into highly optimized HTML and bundle records inside \`/dist\`:
\`\`\`bash
npm run build
\`\`\`

### Step 2.2: Add Native Wrappers
If your native system platform targets are missing from root directory, inject them:
\`\`\`bash
npx cap add ios
npx cap add android
\`\`\`

### Step 2.3: Sync Code Assets
Transfer all static compiled structures from the local web directory \`/dist\` directly to native visual environments:
\`\`\`bash
npx cap sync
\`\`\`

### Step 2.4: Execute Development IDEs
Boot up platform editors holding project files:
\`\`\`bash
# To open Xcode workspace
npx cap open ios

# To open Android Studio project
npx cap open android
\`\`\`

---

## 🩹 3. Common Errors & Mobile Debugging SOP
- **Error: CocoaPods not installed / Podfile out of sync:** Run \`pod repo update\` followed by \`npx cap update ios\`.
- **Error: Android Gradle sync failed (missing JDK path):** Open Preferences in Android Studio, direct to Build, Execution, Deployment > Build Tools > Gradle, and set Gradle JDK path explicitly to Java JDK 21.`
  },
  {
    id: "app_icons_guide",
    title: "Mobile Application Asset Generation SOP",
    ref: "TUC-ICT-SRS-2026-603",
    author: "Senior Mobile Deployment Engineer",
    category: "Assets",
    content: `# Mobile Application Asset Generation SOP [TUC-TAB-ICONS]
### Document Reference: TUC-ICT-SRS-2026-603

**Institution:** Techbridge University College (TUC), Oyibi, Ghana  
**Author:** Senior Mobile Deployment Engineer  
**Approved by:** Daniel Twum, Head of ICT  

This SOP documents the graphical standards and exact directory mapping for deploying application launcher icons and splash branding screens across mobile operating systems.

---

## 🎨 1. App Launcher Icon Guidelines
To represent Techbridge University College appropriately on a user's phone, use high-contrast and non-flickering visual assets matching professional typography standards.

* **Color Space:** sRGB.
* **Format:** Alpha channels must be omitted in iOS app stores. Adaptive vectors are supported in Android.

### 🖼️ 1.1 iOS Asset Requirements
Place generated resources inside the Xcode folder tree: \`/ios/App/App/Assets.xcassets/AppIcon.appiconset/\`

| Filename | Purpose / Device Class | Target Dimensions (px) |
| :--- | :--- | :--- |
| \`icon-20x20@2x.png\` | Notification Icon - iPad (Retina) | 40 x 40 |
| \`icon-20x20@3x.png\` | Notification Icon - iPhone (Retina) | 60 x 60 |
| \`icon-29x29@2x.png\` | Settings Menu Icon | 58 x 58 |
| \`icon-29x29@3x.png\` | Settings Menu Icon (Retina) | 87 x 87 |
| \`icon-40x40@2x.png\` | Spotlight Search Icon | 80 x 80 |
| \`icon-40x40@3x.png\` | Spotlight Search Icon (Retina) | 120 x 120 |
| \`icon-60x60@2x.png\` | Home Screen - iPhone (Standard) | 120 x 120 |
| \`icon-60x60@3x.png\` | Home Screen - iPhone (Retina) | 180 x 180 |
| \`icon-1024x1024.png\` | App Store Connect Master Asset | 1024 x 1024 |

---

## 🚀 2. Instant Asset Generation CLI [Cordova-Res]
Instead of creating 50 visual slices manually, use the automated Capacitor Asset utility:

1. Create a high-quality master graphic (\`icon.png\`, min 1024x1024px) and splash screen (\`splash.png\`, min 2732x2732px) under the relative directory: \`/resources/\`
2. Install the asset automation package:
   \`\`\`bash
   npm install -g @capacitor/assets
   \`\`\`
3. Run the generation script over all active platforms:
   \`\`\`bash
   npx capacitor-assets generate
   \`\`\``
  },
  {
    id: "appstore_ready",
    title: "App Store Pre-Submission Audit Scorecard",
    ref: "TUC-ICT-SRS-2026-604",
    author: "Senior Mobile Deployment Engineer",
    category: "Verifications",
    content: `# App Store Pre-Submission Audit [TUC-TAB-READY]
### Document Reference: TUC-ICT-SRS-2026-604

**Institution:** Techbridge University College (TUC), Oyibi, Ghana  
**Author:** Senior Mobile Deployment Engineer  
**Approved by:** Daniel Twum, Head of ICT  

This scorecard evaluates all deliverables against Apple App Store Review Guidelines and Google Play Store Developer Policies before TUC initiates physical submissions.

---

## 📋 Pre-Submission Scorecard

### 🔒 1. Legal & Data Privacy
- [x] **Privacy Policy:** Valid privacy policy file hosted at a public domain (\`https://blueprint.techbridge.edu.gh/privacy.html\`).
- [x] **Data Minimalization:** App gathers no analytical tokens, telemetry tracking, or device characteristics. All audits persist exclusively on-device.
- [x] **GDPR/CCPA/GDPA:** Compliant under Ghanaian Data Protection Act 2012 (Act 843) guidelines.

### 🎨 2. Design, UI & Accessibility
- [x] **Responsive Scaling:** Responsive grid layout preserves clarity across iPad and horizontal phone views.
- [x] **Accessible themes:** Theme configuration switcher operates systems-wide, maintaining readable contrasts.
- [x] **No Dead Links:** Verified index selection nodes of Delegation logs open active descriptive canvases.

### ⚙️ 3. Execution, Logging & Health check
- [x] **Administrative Auth:** App locks panel behind credentials (\`admin123\`).
- [x] **Telemetry Checks:** Continuous simulation checks for container status map successfully.
- [x] **Audit Trail logs:** Local database logs administrative changes correctly.

---

## 📅 Pre-launch Schedule & Estimate

| Timeline Target | Phase | Primary Actions | Responsible |
| :--- | :--- | :--- | :---: |
| **Day -15** | Code Audit | Full E2E Playwright verification tests locally. | ICT Engineer |
| **Day -12** | Asset Design | Cordova-Res app icon slices generation using master branding resources. | Graphic Lead |
| **Day -10** | Sandbox Trials | Testing release builds over iOS Simulator and TestFlight. | danieltwum |
| **Day -7** | Upload Archives | Compile Xcode Archives and Release AABs, sync metadata to consoles. | Deployment Eng |
| **Day -5** | Final Sign-off | Formally submit draft builds for App Store review. | Daniel Twum |
| **Day 0** | Launch | App store availability on Apple and Google marketplaces. | TUC ICT Board |

---
**Formally Certified by Head of ICT:**  
*Daniel Twum, Head of ICT, Techbridge University College*  
\`Signature: [DANIEL_TWUM_TUC_APPROVED_2026_05_22]\``
  }
];
