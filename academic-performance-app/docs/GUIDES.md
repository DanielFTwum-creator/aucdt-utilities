# Project Guides: Academic Performance App

## 1. Admin Guide
### Access
- Click the **Admin Login** button in the header.
- Password: `admin123` (Change in `App.js` for production).

### Features
- **Audit Log**: Tracks all session actions (logins, student views).
- **Test Suite**: Run real-time diagnostics on data integrity and UI readiness.

---

## 2. Deployment Guide
### Prerequisites
- Node.js installed.
- pnpm or npm installed.

### Setup
1. Clone the repository.
2. Run `pnpm install` or `npm install`.

### Building
1. Run `pnpm run build` or `npm run build`.
2. The production files will be in the `build/` folder.

### Hosting
- Upload the `build/` folder to any static host (Vercel, Netlify, GitHub Pages).
- Ensure the base path is correct if deploying to a subdirectory.

---

## 3. Testing Guide
### Automated Tests
- **Unit Tests**: Run `npm test` to execute React testing library tests.
- **E2E Tests**: Run `node tests/e2e.test.js` (Requires Playwright).

### Manual Verification
- Test theme toggles (Light, Dark, Contrast).
- Verify GPA calculations match the grading system table.
- Confirm Admin sections are hidden for non-logged-in users.
