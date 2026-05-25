# Testing Guide
## Automated Quality Assurance

### 1. Framework Overview
This project uses **Playwright** for end-to-end (E2E) testing of critical user journeys.

### 2. Running Tests
#### Via Admin UI
1. Log in to the Admin Portal.
2. Navigate to the **Testing** tab.
3. Click **Run Full Suite**.
4. View real-time results and pass/fail metrics.

#### Via Command Line
```bash
npx playwright test
```

### 3. Test Coverage
- **Home Page**: Verifies hero content and page title.
- **Navigation**: Ensures all primary routes are accessible.
- **Admin Auth**: Validates the security of the administrative portal.
- **Theme Engine**: Confirms dynamic theme switching and persistence.

### 4. Configuration
- **File**: `playwright.config.ts`
- **Directory**: `/tests`
- **Browsers**: Chromium (Default).
- **Reporting**: JSON (for UI integration) and HTML (for local debugging).

---
*Compatibility: Tests are optimized for React 19.2.4 environments.*
