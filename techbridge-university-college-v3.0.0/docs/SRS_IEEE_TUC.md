
# IEEE Software Requirements Specification (SRS)
## Techbridge University College (TUC) Digital Ecosystem
**Version:** 3.0.0 (Final Architecture)
**Date:** March 28, 2026

---

### 1. Introduction
#### 1.1 Purpose
The purpose of this document is to define the software requirements and architectural design for the Techbridge University College (TUC) web application. This document serves as a blueprint for the platform's current state (v3.0.0) and future development.

#### 1.2 Scope
The application is a high-fidelity Single Page Application (SPA) providing institutional information, an AI-driven BridgeBot assistant, and administrative diagnostic tools. It targets prospective students, current students, alumni, staff, donors, and press.

#### 1.3 Institutional Context
**Motto:** "Build What Comes Next" / "Ghana's Home for Tech Talent"
**Core Mission:** Driving admissions applications and bridging education and industry through Disruptive Design and Technical Excellence.

---

### 2. System Architecture
The platform utilizes a decentralized frontend architecture to maximize performance and scalability.

#### 2.1 Technology Stack
- **Frontend Framework:** React 19.2.5
- **Type Safety:** TypeScript
- **Styling Engine:** Tailwind CSS
- **AI Integration:** Google Gemini 3.1 Pro via `@google/genai`
- **Persistence:** Browser LocalStorage with JSON serialization

#### 2.2 System Modules
- **Public Website:** Highly responsive UI for program discovery and admissions.
- **BridgeBot AI:** Contextual agent trained on the Student Handbook.
- **Admin Portal:** Secure auditing and brute-force protection hub.
- **Testing Engine:** Integrated Playwright-Lite diagnostic suite.

---

### 3. Functional Requirements
#### 3.1 AI Interaction (BridgeBot)
- **REQ-AI-01:** Real-time streaming interaction via Gemini 3.1 Pro.
- **REQ-AI-02:** Support for multimodal inputs (text and image analysis).
- **REQ-AI-03:** Contextual grounding using the TUC Student Handbook data.

#### 3.2 Security & Compliance
- **REQ-SEC-01:** Brute-force protection with automatic 30s lockout after 3 failed attempts.
- **REQ-SEC-02:** Detailed audit logging of all administrative actions.
- **REQ-SEC-03:** Password-protected hidden Admin entry point.

#### 3.3 Diagnostic Suite
- **REQ-DIAG-01:** Automated verification of Brand and Motto.
- **REQ-DIAG-02:** Verification of AI session initialization.
- **REQ-DIAG-03:** Visual regression check via diagnostic snapshots.

---

### 4. Non-Functional Requirements
#### 4.1 Accessibility
- **REQ-ACC-01:** WCAG AA minimum compliance, AAA target for body text.
- **REQ-ACC-02:** Support for Light, Dark, and High-Contrast themes.
- **REQ-ACC-03:** Full ARIA compliance for assistive technologies.
- **REQ-ACC-04:** Keyboard navigation and visible focus indicators.

#### 4.2 Performance
- **REQ-PERF-01:** LCP < 2.5s on mobile 4G.
- **REQ-PERF-02:** CLS < 0.1.
- **REQ-PERF-03:** Preload critical assets (fonts, hero images).
- **REQ-PERF-04:** Fluid animations at 60fps across mobile and desktop.

#### 4.3 Design System
- **REQ-DES-01:** Brand Colors: Deep Forest (#1A5C38), Midnight Forest (#0F3D24), Leaf Mist (#E8F5EE), Kente Gold (#D4A017), Warm Ivory (#F5F3EE), Charcoal (#1C1C1A).
- **REQ-DES-02:** Typography: Playfair Display (Display/Hero), Inter (Body/Headings).

---
**Document Status: Finalized**
