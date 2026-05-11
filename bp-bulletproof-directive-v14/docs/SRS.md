# Software Requirements Specification (SRS) for Compliance Workflow Dashboard

## 1. Introduction
### 1.1 Purpose
This document specifies the requirements for the Compliance Workflow Dashboard, an AI-orchestrated system for managing project compliance lifecycles.

### 1.2 Scope
The system provides a framework for managing compliance frameworks (HIPAA, PCI-DSS, SOC 2, GDPR), tracking phase progress, and utilizing AI-driven directive refinement.

## 2. Functional Requirements
### 2.1 Framework Management
- The system shall allow users to select between multiple compliance frameworks.
- The system shall display phases and tasks specific to the selected framework.

### 2.2 Progress Tracking
- The system shall track completion status of tasks and phases.
- The system shall calculate and display overall progress.

### 2.3 AI Integration
- The system shall provide an AI assistant for directive refinement.
- The system shall support context-aware interactions.

## 3. Non-Functional Requirements
### 3.1 Technology Stack
- React 19.2.5
- Tailwind CSS
- TypeScript

### 3.2 Accessibility
- The system shall support screen readers, keyboard navigation, and ARIA labels.
- All interactive elements shall have appropriate aria-labels.
- Error messages shall use ARIA roles.

### 3.3 Security
- Admin diagnostics shall be restricted to `/admin/*` routes.
- Admin functionality shall be password-protected via configurable environment variable.
- All admin actions shall be logged in an audit trail.

### 3.4 Testing
- The system shall implement a comprehensive self-testing suite.
- The system shall integrate Playwright for end-to-end testing of critical user journeys.
- The system shall provide an interactive testing dashboard in the admin section.
- The system shall support real-time test result display and screenshot capture.

## 4. Architecture
### 4.1 System Architecture
![System Architecture](/docs/Architecture.svg)

### 4.2 Database Architecture
![Database Architecture](/docs/Database.svg)
