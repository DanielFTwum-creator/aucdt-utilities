# Software Requirements Specification (SRS) v1.5
**Project:** Techbridge Media Club Platform
**Version:** 1.5
**Date:** February 17, 2026
**Status:** Phase 3 Complete (Testing Framework Integrated)

## 1. Introduction
### 1.1 Purpose
The Techbridge Media Club Platform (TMCP) is a centralized system designed to facilitate digital media management, editorial workflows, event coordination, and analytics.

## 2. Quality Assurance & Testing (Phase 3)

### 2.1 Testing Strategy
The platform employs a dual-layer testing strategy to ensure reliability across the Simulated Client environment.

#### 2.1.1 Interactive Live User Journey (Internal)
*   **Mechanism**: A built-in test runner within the Admin Panel (`/admin/testing`).
*   **Scope**: Programmatically drives the DOM to verify navigation paths, component mounting, and state retention.
*   **Triggers**: Manual trigger by Admin.
*   **Feedback**: Real-time console logs within the UI (PASS/FAIL).

#### 2.1.2 Automated E2E Suite (External)
*   **Tool**: Playwright (Script provided in Admin Panel).
*   **Scope**: Headless browser automation validating critical paths:
    1.  Initial Load
    2.  Dashboard Stats Rendering
    3.  CMS Table Availability
    4.  Asset Upload Modal
    5.  Admin Authentication
*   **Artifacts**: Screenshots generated for every step in `screenshots/` directory.

### 2.2 Test Coverage Requirements
*   **REQ-QA-01**: Navigation between all primary tabs must confirm destination mount within 1000ms.
*   **REQ-QA-02**: Admin authentication must block invalid credentials.
*   **REQ-QA-03**: Critical UI elements (Stats, Tables) must differ from "Loading" state.

## 3. Implementation Status
*   **Test Runner**: Operational in Admin Panel.
*   **E2E Script**: Updated to v1.2 with verified DOM selectors (`#nav-*`).
*   **Self-Healing**: Navigation includes error boundaries (implicit React).

## 4. Appendices
*   `docs/GAP_ANALYSIS.md`: Updated report.
