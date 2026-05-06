# Testing Guide: Brainiac Challenge
**Project:** Brainiac Challenge AI Quiz (v3.0.0)
**Core Requirement:** Logic validation against React 19.2.4

## 1. Testing Framework
The platform employs a robust three-tier testing framework:
1. **Component Logic**: Jest/React Testing Library for unit-level verification.
2. **E2E Automation**: Playwright for critical path validation (Setup -> Quiz -> Results).
3. **Audit Log Verification**: Manual and automated review of Gemini prompts/responses.

## 2. E2E Playwright Suite
- **Script**: `tests/app.test.js`
- **Cmd**: `pnpm test`
- **Targets**: 
  - Verification of academic level and difficulty selection.
  - Validation of AI quiz generation latency.
  - Confirmation of correct/incorrect answer state management.
  - Audit log recording and details viewing.

## 3. Visual & Accessibility Audit
- **Motion Verification**: Confirm that framer-motion celebrations trigger correctly on the Results page.
- **ARIA Standards**: Use VoiceOver or NVDA to navigate the quiz. Ensure all options are keyboard-accessible and announce their state correctly.

## 4. Institutional Compliance
Every test run must be verified against the React 19.2.4 mandate. Ensure that any logic changes maintain perfect alignment with the institutional SRS v3.0.0.
