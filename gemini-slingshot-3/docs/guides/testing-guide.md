# Testing Guide: Gemini Slingshot
**Project:** Gemini Slingshot (v3.0.0)
**Core Requirement:** Logic validation against React 19.2.4

## 1. Testing Framework
The platform employs a technical three-tier testing framework:
1. **Quality Lab**: Integrated self-diagnostic suite for real-time logic verification.
2. **E2E Automation**: Playwright-based headless testing for critical AI loops.
3. **Telemetry Audit**: Continuous monitoring of AI throughput and vision buffer integrity.

## 2. Institutional Integrity Suite
- **Location**: Quality Lab Sidebar (Start Suite).
- **Execution**: Triggers a sequence of 6 automated protocol checks.
- **Verification**: Ensure all nodes (Visual Buffer, Gesture API, AI Link) return PASSED with visual evidence.

## 3. Playwright Integration
- **Script**: `tests/criticalJourneys.js`
- **Cmd**: `pnpm test`
- **Focus**: 
  - Application lifecycle boot.
  - Interface mode shift (Theming).
  - Security credential validation.
  - AI tactical signal integrity.

## 4. Accessibility & UI Polish
Navigate the AI cockpit using high-contrast mode to verify WCAG 2.1 AA compliance. Ensure that all terminal announcements are correctly broadcast via ARIA live-regions and that interactive HUD elements maintain clear focus states.
