# Software Requirements Specification (SRS) v1.4
**Project:** Techbridge Media Club Platform
**Version:** 1.4
**Date:** February 17, 2026
**Status:** Phase 2 Complete (Security & Accessibility)

## 1. Introduction
### 1.1 Purpose
The Techbridge Media Club Platform (TMCP) is a centralized system designed to facilitate digital media management, editorial workflows, event coordination, and analytics.

## 2. Specific Requirements (Phase 2 Additions)

### 2.1 Security & Auditing
*   **REQ-SEC-02**: All significant user actions (login, upload, delete, nav) must be logged to a centralized Audit Service.
*   **REQ-SEC-03**: Admin Panel must provide a live view of these audit logs.
*   **REQ-SEC-04**: Authentication for Admin Panel must fail on incorrect credentials and log the attempt.

### 2.2 Accessibility (WCAG 2.1 AA)
*   **REQ-ACC-02**: High Contrast Mode must be available, utilizing stark black/white/yellow palette for visual impairment support.
*   **REQ-ACC-03**: All interactive elements (buttons, inputs) must have accessible labels (`aria-label` or `<label>`).
*   **REQ-ACC-04**: User feedback (Toasts) must have `role="alert"` for screen readers.

### 2.3 User Experience
*   **REQ-UX-01**: Zero Broken Links Policy - All buttons must provide feedback (Toast) even if the feature is simulated.

## 3. Implementation Status
*   **Theme System**: Light / Dark / High Contrast fully implemented.
*   **Audit Logging**: Live tracking active in Admin Panel.
*   **Feedback**: Global Toast system handles all simulated actions.

## 4. Appendices
*   `docs/GAP_ANALYSIS.md`: Updated report.
