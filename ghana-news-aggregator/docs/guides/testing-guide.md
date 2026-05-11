# Testing Guide: Ghana News Aggregator
**Project:** Ghana News Aggregator (v3.0.0)
**Core Requirement:** Logic validation against React 19.2.5

## 1. Testing Framework
The platform employs a robust three-tier testing framework:
1. **Self-Test Dashboard**: Integrated UI validation within the application Cockpit.
2. **E2E Automation**: Playwright-based headless testing for critical editorial funnels (Discovery -> Edit -> Approve).
3. **Audit Verification**: Continuous monitoring of the Activity Stream against state transitions.

## 2. Institutional Self-Test
- **Location**: Sidebar -> Self-Test Tab.
- **Execution**: Triggers a sequence of 5 automated protocol checks.
- **Verification**: Ensure all nodes (Auth, Dashboard, Agent, Feed, Settings) return PASSED with visual evidence.

## 3. Playwright Integration
- **Script**: `tests/e2e.js`
- **Focus**: 
  - Authentication bridge validation.
  - Real-time telemetry dashboard loading.
  - Nexus Agent state machine transitions.
  - Editorial ingestion and inline mutation.

## 4. Visual & Accessibility Audit
Use the tri-theme toggle (Light, Dark, High-Contrast) to verify WCAG 2.1 AA compliance. Ensure all news cards maintain focus traps during editorial edits and that ARIA labels accurately describe the agent status indicators.

## 5. Institutional Compliance
Every test run must be verified against the React 19.2.5 mandate. Any functional deviations from the institutional editorial standards must be flagged as a regression.
