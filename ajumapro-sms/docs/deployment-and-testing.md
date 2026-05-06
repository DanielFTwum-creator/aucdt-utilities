# Deployment & Testing Guide

## Deployment

### Local Development
To run the Ajumapro Student Management System locally:

```bash
# Install dependencies
pnpm install

# Start the Vite development server
pnpm run dev
```
The application will be available at `http://localhost:3000`.

### Docker Deployment
For containerized deployment across all services:

```bash
# Build and start all services in detached mode
docker-compose -f docker-compose-all-apps.yml up -d
```

### Production Build
To generate the optimized static assets for production:

```bash
# Build the application
pnpm run build
```
*Note: The application is built as a static Single Page Application (SPA) using Vite. The output will be located in the `dist/` directory.*

---

## Testing Framework

### E2E Testing (Playwright)
The project includes a comprehensive End-to-End (E2E) suite located in `/tests/e2e.spec.js`. This suite uses Playwright to simulate real user interactions.

**Run Tests:**
```bash
npm test
```

**Test Coverage:**
1. **Cover Page Load & Branding:** Verifies that the application loads and displays the correct "Ajumapro" branding.
2. **Admin Authentication Flow:** Ensures the `/admin` route is protected and accepts valid credentials.
3. **Theme Toggle Functionality:** Confirms that the theme switcher correctly updates the DOM classes.
4. **Audit Log Persistence:** Verifies that actions are correctly logged.
5. **Diagnostic Routing:** Ensures all internal admin modules are accessible.

### Interactive Testing Dashboard
Tests can also be simulated and visualized via the Admin Portal (`#/admin/testing`).
- Navigate to the Testing Suite.
- Click **Run E2E Tests**.
- The system will simulate the test run and automatically capture a DOM snapshot using `html2canvas` for visual regression verification.
