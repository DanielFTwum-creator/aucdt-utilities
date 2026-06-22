# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## Document Identification: TUC-ICT-SRS-2026-001
### Project: VortexType (Techbridge University College Typing Tutor)
**Customer:** Daniel Twum, Head of ICT, Techbridge University College (TUC), Oyibi, Ghana  
**Status:** Approved  
**Version:** 1.0.0  
**Date:** May 2026  

---

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to specify the software requirements for VortexType, a modern, highly interactive web and mobile typing tutorial. This application serves as the core keyboarding and computer literacy teaching system at Techbridge University College (TUC).

### 1.2 Document Conventions
All documents use UK English spelling and IEEE 830 standards. Naming conventions conform strictly to:
* Document ID: `TUC-ICT-SRS-2026-001`
* Code and architectural references: `TUC-INC-2026-001`

### 1.3 Intended Audience & Reading Suggestions
This document is prepared for Daniel Twum, Head of ICT, curriculum developers, systems administrators at TUC, and deployment engineers. Readers should focus on the architectural alignment, accessibility compliance, and mobile packaging details.

### 1.4 Project Scope
The application teaches typing dynamically over multi-level, multi-row keyboard lessons, features a timed speed assessment tool, integrates an engaging interactive type-race game, is highly accessible, provides a secure admin dashboard with real-time audit logs, and supports modern packaging (via Capacitor 8.3.3) for Android & iOS App Store distribution.

---

## 2. Overall Description

### 2.1 Product Perspective
TUC relies on a secure self-hosted infrastructure. This system is hosted via:
* **Operating System / Reverse Proxy:** Linux, Plesk Obsidian, Nginx
* **Backend Runtime:** Node.js, Express, Python for data analytics (planned)
* **Database Engine:** MySQL or MariaDB

### 2.2 Product Functions
* **Interactive Lessons Map:** A structured 10-lesson progression covering individual rows, characters, numeric inputs, and full keyboard mastery.
* **Typing Playground / Engine:** Dynamic client-side keyboard tracking with color-coded key statuses, immediate visual mistake highlight, elapsed time monitoring, accuracy percentage updates, and virtual interactive key guides.
* **Speed Test Center:** Standard test paragraphs yielding precise Speed (WPM) and Accuracy outputs.
* **Typing Race Arcade:** Quick key-typing survival mechanic to boost learning engagement.
* **Admin Dashboard:** Access-restricted monitoring node displaying local audit logs, platform service health statuses, interactive Playwright automated test triggers, and mock frame screenshots.

### 2.3 User Classes & Characteristics
* **Standard Student:** Connects without login or with default details to practice keyboards. Require highly readable visual aids and keyboard layouts.
* **Daniel Twum / ICT Administrator:** Full access to standard features. Uses credentials `admin` / `TUC-ict-2026!` to access the administrative control center to review audit logs and execute test runs.

### 2.4 Design and Implementation Constraints
* **Platform Constraints:** Must render perfectly in responsive web containers (iframe), and scale correctly inside mobile application wrappers in touch mode.
* **Offline Safe:** Must persist basic progress states (Completed lessons, high speed, accuracy, points) inside browser local storage without dropping states.

---

## 3. Specific Requirements

### 3.1 External Interface Requirements
* **Student Viewport:** Minimalist layout, modern spacing, soft borders, 44px minimum touch targets.
* **Admin Center:** Comprehensive panel displaying system diagrams, and system state monitors.

### 3.2 System Features & Requirements List
1. **Interactive Lessons:** 10 core levels including lesson maps, practice sets, dynamic character tracking.
2. **Speed Test Module:** Custom paragraph assessments, exact words-per-minute calculations based on a standard 5-character word ratio.
3. **Accessibility:** Themes for Light, Dark, and High-Contrast (for low-vision students), clear text contrast ratios, standard ARIA landmarks, keyboard-only focus states.
4. **Administrative Console:** Secure portal, real-time logging, mock automated browser validation.

### 3.3 Security Requirements
* **Access Limitation:** Simple secret gating for academic deployments. Default admin credentials bypasses access with visual warning.
* **Audit Controls:** Action recording for administrative activities (login events, reset actions, test trigger, config changes).

---

## 4. System Diagrams & Specifications
Embedded System Core flows are maintained in `/docs/APPSTORE_READY.md` and app visual systems.
