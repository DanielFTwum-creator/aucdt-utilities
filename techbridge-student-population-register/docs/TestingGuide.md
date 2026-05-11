# Testing Guide: Student Population Register
**Project:** TUC Population Register (v3.0.0)
**Core Requirement:** Logic validation against React 19.2.5

## 1. Testing Strategy
The register employs a robust three-tier validation framework:
1. **Playwright Self-Test**: Integrated E2E suite within the Admin Portal.
2. **Institutional Logic Verification**: Automated checks for department and level aggregations.
3. **Visual Regression**: Automated screenshot capture for all major UI states.

## 2. Admin Self-Test Dashboard
- **Location**: `/admin/testing`
- **Execution**: Click "Execute Test Suite" to trigger the Playwright engine.
- **Verification**: Ensure all test nodes return "Passed" with corresponding high-fidelity screenshots.

## 3. Critical User Journeys Tested
- **Dashboard Load**: Verifies editorial masthead and summary metrics.
- **Registration Flow**: Tests modal opening, form validation, and state persistence.
- **Admin Auth**: Validates secure gateway and diagnostic accessibility.

## 4. Accessibility Audit
Use institutional themes (Light, Dark, High Contrast) to verify WCAG 2.1 AA compliance. Ensure all interactive table rows and registration fields maintain focus traps and appropriate ARIA roles during screen reader navigation.
