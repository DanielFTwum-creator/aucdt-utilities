# Testing Guide: Eligibility Checker
**Project:** TUC Eligibility Checker (v3.0.0)
**Core Requirement:** Logic validation against React 19.2.4

## 1. Testing Strategy
The checker employs a three-tier testing approach:
1. **Internal Logic Suite**: In-browser simulations via the Admin Portal.
2. **Component Tests**: Vitest/React Testing Library for individual UI nodes.
3. **E2E Automation**: Playwright headless browser testing for critical paths.

## 2. Admin Logic Simulator
- **Location**: `#/admin` -> Logic Simulation Tab.
- **Execution**: Click "Run Logic Suite" to trigger automated algorithm checks.
- **Verification**: Ensure the "Logic Terminal" returns SUCCESS for all examination types.

## 3. Playwright Integration
- **Script**: `tests/playwright/eligibility_flow.test.js`
- **Cmd**: `pnpm run test:e2e`
- **Targets**: 
  - Form navigation (Step 1 to Result).
  - Grade validation (Invalid grade blocking).
  - Theme switching stability.

## 4. Accessibility Audit
- **Standard**: WCAG 2.1 AA.
- **Method**: Use VoiceOver/NVDA to navigate the eligibility form.
- **Check**: Verify Radix UI primitives maintain focus traps and appropriate ARIA roles during examination selection.
