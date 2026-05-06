# Testing Guide: Cinematic Triptych Generator
**Project:** Cinematic Triptych (v3.0.0)
**Core Requirement:** Logic validation against React 19.2.4

## 1. Testing Framework
The platform employs a robust three-tier testing framework:
1. **Institutional Audit**: Real-time logging of all generation events via `AuditService`.
2. **E2E Automation**: Playwright-based headless testing for critical path validation (Variation Select -> Generate -> Download).
3. **Zip Integrity**: Verification of multi-panel archival using the `JSZip` integration.

## 2. E2E Playwright Suite
- **Script**: `tests/playwright/triptych_flow.test.js` (Placeholder)
- **Targets**: 
  - Verification of variation dropdown state management.
  - Validation of three-panel sequential generation latency.
  - Confirmation of base64 image rendering accuracy.
  - Audit trail persistence check.

## 3. Visual & Accessibility Audit
- **Cinematic Verification**: Confirm that all UI elements use the official institutional Gold (#C8A84B) and Stone (#0c0a09) palette.
- **ARIA Standards**: Use VoiceOver or NVDA to navigate the generator. Ensure all creative variation selects are keyboard-accessible and announce their labels.

## 4. Institutional Compliance
Every test run must be verified against the React 19.2.4 mandate. Any creative deviations from the institutional storyboard standards must be flagged as a regression.
