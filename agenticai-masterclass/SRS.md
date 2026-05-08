# Software Requirements Specification (SRS)
## Project: AI Agent Masterclass Registration Portal
**Version:** 2.0 (Master Project Refresh)
**Date:** February 24, 2025

---

### 1. Introduction

#### 1.1 Purpose
This document defines the comprehensive software requirements for the "AI Agent Masterclass Registration Portal". This system facilitates user registration for Masterclass events and Private sessions, while providing a secure administrative environment for system monitoring and auditing.

#### 1.2 Scope
The application is a robust Single Page Application (SPA) that includes:
- **Public Portal**: High-fidelity landing page with dynamic visualizations and dual-mode registration.
- **Admin Portal**: A secure, password-protected dashboard for diagnostics, logging, and testing.
- **Infrastructure**: Client-side execution with external API integrations for email delivery.

#### 1.3 Technology Stack (Strict Compliance)
- **Framework**: React 19.2.5 (Mandatory)
- **Styling**: Tailwind CSS via CDN
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Build**: ES Modules (No Bundler)

---

### 2. Overall Description

#### 2.1 User Characteristics
- **Registrants**: Users seeking to book sessions.
- **Administrators**: Technical staff managing system health via the secure dashboard.

#### 2.2 Product Perspective
The system operates autonomously in the browser, leveraging `localStorage` for persistence of settings and logs, and communicating with `aucdt.edu.gh` for SMTP services.

---

### 3. Specific Requirements

#### 3.1 Functional Requirements (Public)

**FR-001: Dynamic Visualization**
- Background shall render a video carousel (Dark Mode) or Gradient (Light Mode).
- Interactive particles shall respond to user mouse input.
- **Update**: Video changes based on Booking Type (Masterclass vs Private).

**FR-002: Registration Logic**
- **Masterclass**: Select date from upcoming Thursdays, validate email, confirm via Calendar.
- **Private Session**: Collect Name/Email/Notes, trigger specific email template, confirm with "Request Received" message.
- **Error Handling**: Display user-friendly alerts on API failure.

**FR-003: Accessibility & Theming**
- Support Light, Dark, and High-Contrast modes.
- High-Contrast mode must disable distracting animations and maximize legibility.
- All interactive elements must have ARIA labels.

#### 3.2 Functional Requirements (Admin)

**FR-004: Security**
- Route `#/admin` must be protected by simulated JWT authentication.
- Access attempts (success/failure) must be audit logged.

**FR-005: Diagnostics & Monitoring**
- Dashboard must show API connectivity status.
- Dashboard must show client environment details (Browser, React Version).
- Dashboard must allow viewing and clearing of Audit Logs.

**FR-006: Testing Framework**
- Admin dashboard must include a "Test Suite" tab.
- Suite must support: Connectivity Test, Theme Stability Test, Log Integrity Test.
- Suite must support: **Visual Snapshot Capture** (via browser print API).

#### 3.3 Non-Functional Requirements

**NFR-001: Compliance**
- **React Version**: Must be strictly 19.2.5.
- **Zero Broken Links**: All internal and external links must be functional.

**NFR-002: Documentation**
- System must include Architecture Diagrams (`docs/system_architecture.svg`).
- System must include Admin, Deployment, and Testing guides.

---

### 4. Interface Requirements

- **External API**: `https://portal.aucdt.edu.gh/aucdt-dev/sendMail`
- **Data Format**: JSON
- **Visual Assets**: Hosted at `techbridge.edu.gh`

---

### 5. Appendices
Refer to `/docs` directory for:
- `ADMIN_GUIDE.md`
- `DEPLOYMENT_GUIDE.md`
- `TESTING_GUIDE.md`
