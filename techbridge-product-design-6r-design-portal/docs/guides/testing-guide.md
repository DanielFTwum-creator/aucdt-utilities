# Testing Guide
## TechBridge 6R Workshop Portal

### 1. Internal Scholastic Testbed
The built-in Testbed (`components/TestDashboard.tsx`) is the primary tool for smoke testing:
- **Navigation Test**: Simulates route transitions to ensure module accessibility.
- **Security Test**: Validates the admin gate logic.
- **Accessibility Test**: Verifies theme persistence and contrast ratios.
- **PWA Test**: Confirms the Service Worker API availability.

### 2. External Automation (Playwright)
For CI/CD pipelines, use the Playwright suite located in `tests/critical_path.test.js`:
1. Install dependencies: `npm install playwright`.
2. Run tests: `node tests/critical_path.test.js`.
3. The script verifies the "Pioneer" dashboard title and Service Worker registration.

### 3. Accessibility Auditing
Manual verification steps:
- Press `Alt+T` to ensure the theme cycles through Light -> Dark -> High-Contrast.
- Use a screen reader (VoiceOver/NVDA) to verify button labels and headings.
- Ensure all interactive elements are focusable via `Tab` key.
