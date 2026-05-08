# Testing Guide: University Fees Dashboard
**Project:** Ghana University Fees (v3.0.0)
**Core Requirement:** Logic validation against React 19.2.5

## 1. Testing Framework
The platform employs a robust three-tier testing framework:
1. **Institutional Audit**: Real-time logging of all navigation and filtering events via `AuditService`.
2. **E2E Automation**: Playwright-based headless testing for critical path validation (Category Select -> Chart Update -> Tooltip Verification).
3. **A11y Audit**: Continuous monitoring of WCAG 2.1 AA compliance across themes.

## 2. E2E Playwright Suite
- **Script**: `tests/playwright/fees_flow.test.js` (Placeholder)
- **Targets**: 
  - Verification of Undergraduate/International/Postgraduate view transitions.
  - Validation of chart rendering context across Light and Dark themes.
  - Confirmation of persistent audit trail recording for each filter action.

## 3. Visual & Accessibility Audit
- **Branding Verification**: Confirm that all UI elements use the official TUC Gold (#C8A84B) and Ink (#2C1810) palette.
- **ARIA Standards**: Use VoiceOver or NVDA to navigate the dashboard. Ensure all interactive chart segments and segmented control buttons announce their state correctly.

## 4. Institutional Compliance
Every test run must be verified against the React 19.2.5 mandate. Any functional deviations from the institutional financial transparency standards must be flagged as a regression.
