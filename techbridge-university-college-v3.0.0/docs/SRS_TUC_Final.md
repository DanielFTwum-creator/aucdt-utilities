
# IEEE Software Requirements Specification (SRS)
## Techbridge University College (TUC) Digital Ecosystem
**Version:** 12.0 (Security & Accessibility Release)
**Date:** October 26, 2025

---

### 1. Introduction
#### 1.1 Purpose
This document provides the definitive technical specification for the Techbridge University College (TUC) platform. It serves as the authoritative blueprint for the application's architecture, security, AI integration, analytics strategy, and diagnostic frameworks.

#### 1.2 Institutional Scope
The TUC platform is a high-performance Single Page Application (SPA) designed to:
- Communicate the institution's pioneering mission in Design and Industrial Technology.
- Provide a context-aware AI BridgeBot for prospective and current students.
- Offer administrative tools for security auditing and diagnostic verification.
- Monitor user engagement through granular analytics tracking.

#### 1.3 Institutional Motto
"Design and Build a Nation!"

---

### 2. System Architecture
The application utilizes a decentralized, modern frontend architecture following industry best practices.

#### 2.1 Core Stack
- **Framework**: React 18.3+
- **Language**: TypeScript (Strict)
- **Styling**: Tailwind CSS with Adaptive Multi-Theme Support
- **AI Backend**: Google Gemini 3 Pro (Multimodal Streaming)
- **Analytics**: Google Analytics 4 (GA4) with SPA Route Tracking
- **Testing**: Integrated Browser-Side Playwright-Lite Engine

#### 2.2 Functional Blocks
1. **Public Hub**: Homepage, Programs (DMCD, FDT, JDT, PDE), News Feed.
2. **Academic Core**: Dynamic Faculty Directory, Calendars, and Timetables.
3. **AI Layer**: BridgeBot (Gemini-powered streaming agent with image context).
4. **Admin Layer**: Secure authentication with brute-force protection and persistent audit logging.
5. **Diagnostic Layer**: Automated verification suite with snapshot capture.

---

### 3. Functional Requirements

#### 3.1 Adaptive User Interface
- **REQ-UI-01**: Support for Light, Dark, and High-Contrast accessibility themes (WCAG 2.1 AA Compliance).
- **REQ-UI-02**: Fully responsive layouts with mobile-first grid structures.
- **REQ-UI-03**: Consistent SPA routing using robust hash-normalization logic.
- **REQ-UI-04**: **Keyboard Navigation**: All interactive elements must be accessible via keyboard (Tab/Enter/Esc). A "Skip to Main Content" link must be present.

#### 3.2 BridgeBot AI Assistant
- **REQ-AI-01**: Real-time streaming interaction using `gemini-3-pro-preview`.
- **REQ-AI-02**: Persona-grounded responses based on the TUC Student Handbook.
- **REQ-AI-03**: Multimodal reasoning (Text + Image analysis).

#### 3.3 Security & Auditing
- **REQ-SEC-01**: Admin route (`#/admin`) with brute-force lockout (3 attempts / 30s).
- **REQ-SEC-02**: **Persistent Lockout**: Lockout state must persist across page reloads via LocalStorage to prevent bypass.
- **REQ-SEC-03**: Persistent Audit logs tracking logins, security alerts, and system resets.
- **REQ-SEC-04**: LocalStorage-based persistence for themes and logs.

#### 3.4 Academic Module
- **REQ-ACAD-01**: **Faculty Directory** must support client-side filtering by name and department.
- **REQ-ACAD-02**: Faculty profiles must open in a modal view without navigating away from the list context.
- **REQ-ACAD-03**: Deep-linking to specific faculty profiles must be supported via URL slugs (e.g., `#/academics/faculty/daniel-morrison`).

#### 3.5 Analytics & Telemetry
- **REQ-ANA-01**: The system must initialize Google Analytics 4 (Tag: `G-FKXTELQ71R`).
- **REQ-ANA-02**: The router must manually trigger `page_view` events on hash changes to ensure accurate SPA tracking.
- **REQ-ANA-03**: Internal and external link clicks must be tracked where applicable.

---

### 4. Technical Specifications & Guides
- **System Architecture Diagram**: `docs/svg/system_architecture.svg`
- **Testing Guide**: `docs/TESTING_GUIDE.md`
- **Admin Guide**: `docs/ADMIN_GUIDE.md`
- **Tech Stack**: `docs/tech-stack.md`

---
**Institutional Motto:** "Design and Build a Nation!"
