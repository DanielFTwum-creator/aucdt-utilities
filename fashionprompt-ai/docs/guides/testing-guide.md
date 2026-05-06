# Testing Guide

## Self-Testing (Internal)
The application includes a built-in diagnostic tool.
1. Navigate to the "System Tests" tab.
2. Click "Run Test Suite".
3. The system will check:
   - State Integrity
   - Diversity Guardrails
   - Resolution Defaults
   - Mood Logic consistency

## Automated Testing (External)
A Playwright script is provided in `tests/playwright/critical-paths.js`.
To run:
1. Ensure app is running on port 3000.
2. Run `node tests/playwright/critical-paths.js`.
