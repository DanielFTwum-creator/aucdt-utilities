# Cypress Test Commands — Quick Reference (pnpm)

## Initial Setup

```powershell
cd C:\Development\github\aucdt-utilities\dictation-app
pnpm add -D cypress
```

## Running Tests

### Terminal 1: Start Dev Server
```powershell
pnpm dev
```
Keep this running. You'll see `http://localhost:5173/`

### Terminal 2: Run Tests

**Interactive GUI (Recommended)**
```powershell
pnpm exec cypress open
```

**Headless (Quick Results)**
```powershell
pnpm exec cypress run
```

## Run Specific Test Suites

```powershell
# Theme tests only
pnpm exec cypress run --spec "cypress/e2e/theme.cy.ts"

# Tabs tests only
pnpm exec cypress run --spec "cypress/e2e/tabs.cy.ts"

# Header tests only
pnpm exec cypress run --spec "cypress/e2e/header.cy.ts"

# UI component tests only
pnpm exec cypress run --spec "cypress/e2e/ui-components.cy.ts"

# Accessibility tests only
pnpm exec cypress run --spec "cypress/e2e/accessibility.cy.ts"

# Responsive design tests only
pnpm exec cypress run --spec "cypress/e2e/responsive.cy.ts"
```

## Run with Specific Browser

```powershell
pnpm exec cypress run --browser chrome
pnpm exec cypress run --browser firefox
pnpm exec cypress run --browser edge
```

## View Detailed Results

```powershell
pnpm exec cypress run --reporter spec
```

## Debug Mode

```powershell
$env:DEBUG="cypress:*"; pnpm exec cypress run
```

## Generate Coverage Report

```powershell
pnpm add -D @cypress/code-coverage
pnpm exec cypress run --coverage
```

Then open `coverage/index.html` in browser.

## Expected Results

✅ Pass Rate: 95%+  
✅ Total Tests: 60+  
✅ Execution Time: ~10 seconds

---

**All files ready in:** `C:\Development\github\aucdt-utilities\dictation-app\`

See `CYPRESS_TEST_GUIDE.md` for detailed documentation.
