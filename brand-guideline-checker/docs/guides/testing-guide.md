# Testing Guide: Brand Guideline Checker
**Project:** Brand Checker (v3.0.0)
**Core Requirement:** Logic validation against React 19.2.4

## 1. Testing Framework
The platform employs a robust three-tier testing framework:
1. **Institutional Audit**: Real-time logging of all analysis events via `AuditService`.
2. **E2E Automation**: Playwright-based headless testing for critical path validation (Upload -> Analyze -> Result).
3. **Link Integrity**: Recursive auditing to ensure zero broken links.

## 2. E2E Playwright Suite
- **Script**: `tests/playwright/compliance_flow.test.js` (Placeholder)
- **Targets**: 
  - Verification of asset upload drag-and-drop triggers.
  - Validation of AI analysis response latency.
  - Confirmation of color extraction accuracy against standard hex codes.

## 3. Visual & Accessibility Audit
- **Branding Verification**: Confirm that all UI elements use the official TUC Gold (#C8A84B) and Ink (#2C1810) palette.
- **ARIA Standards**: Use VoiceOver or NVDA to navigate the results cards. Ensure all comparison toggles are keyboard-accessible.

## 4. Institutional Compliance
Every test run must be verified against the React 19.2.4 mandate. Any visual deviations from the institutional brand manual must be flagged as a regression.
