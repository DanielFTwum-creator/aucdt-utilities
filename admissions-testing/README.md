# Admissions Testing — Cypress E2E Suite & React Dashboard

Comprehensive E2E testing framework and real-time monitoring dashboard for TechBridge University College admissions portal (`admissions.techbridge.edu.gh`).

## 📁 Project Contents

### Test Files
- **admissions.cy.ts** — Main Cypress test suite (64 tests, 68.75% pass rate)
- **admissions.cy.FIXED.ts** — Final corrected version with all selector fixes applied
- **admissions-test-suite.json** — Test metadata and structure

### Dashboard & UI
The React/Next.js dashboard is maintained in the main project repository:
```
C:\Development\github\aucdt-utilities\test-dashboard\
```

Access it locally:
```bash
cd ../../test-dashboard/
pnpm install
pnpm dev
# Opens at http://localhost:3000
```

### Reports & Documentation
- **ADMISSIONS_TESTS_QUICKSTART.md** — Quick start guide for running tests
- **ADMISSIONS_TEST_REPORT.md** — Detailed test analysis and results
- **CYPRESS_TEST_SPECIFICATION.md** — Complete test specification
- **CYPRESS_REWRITE_GUIDE.md** — Guide explaining test suite rewrite
- **TEST_REWRITE_SUMMARY.md** — Summary of changes and fixes
- **TEST_RESULTS_ANALYSIS.md** — Analysis of test execution results

### Source Code & Network Data
- **aucdt-admissions-sdev/** — Local copy of admissions portal source code
- **admissions.techbridge.edu.gh.har** — Network request capture (HAR format)

### Test Artifacts
- **admissions-test-screenshots.pptx** — Screenshots from test execution

---

## 🚀 Getting Started

### Run Cypress Tests
```bash
cd ../../../
cd Development/github/aucdt-utilities/
pnpm test:admissions
```

### View Test Dashboard
```bash
cd test-dashboard/
pnpm dev
# Dashboard with real-time metrics at http://localhost:3000
```

### Analyze Test Results
1. Open **ADMISSIONS_TEST_REPORT.md** for test summary
2. Check **TEST_RESULTS_ANALYSIS.md** for detailed findings
3. Review **admissions-test-screenshots.pptx** for visual evidence

---

## 🔧 Test Suite Details

**Framework:** Cypress 14 + TypeScript  
**Target:** Angular SPA with hash-based routing  
**Tests:** 64 total (Suites 0-13)  
**Pass Rate:** 68.75% on latest run  
**Coverage:** Authentication, form validation, hCaptcha integration, accessibility

### Key Test Suites
- **Suite 0:** Version & metadata display
- **Suite 1:** Logo & branding verification
- **Suite 2-4:** Login workflow (valid/invalid/edge cases)
- **Suite 5-7:** Signup workflow & form validation
- **Suite 8-9:** Password reset & verification
- **Suite 10-11:** Accessibility & keyboard navigation
- **Suite 12-13:** Error handling & security

---

## 🐛 Known Issues

- **Logo verification (Suite 1, Test 1):** h1 selector may need adjustment based on live HTML structure
- Some form validation tests depend on timing; may need additional cy.wait() statements

See **CYPRESS_REWRITE_GUIDE.md** for detailed technical notes.

---

## 📊 Dashboard Features

- Real-time test status monitoring
- Pass/fail distribution charts (Recharts)
- Performance metrics visualization
- Search & filter by test name/status
- Expandable suite grouping
- Test duration tracking
- Error message display

---

## 🔄 Maintenance

- Update **admissions.cy.ts** when UI selectors change
- Regenerate dashboard from **cypress-test-suite.json** data
- Run full suite before deployment: `pnpm test:admissions`
- Archive old test screenshots after major updates

---

## 📞 Related Resources

- **Source Code:** aucdt-admissions-sdev/
- **Live App:** https://admissions.techbridge.edu.gh
- **Dashboard Project:** C:\Development\github\aucdt-utilities\test-dashboard\
- **Test Output:** Latest run captured in admissions-test-screenshots.pptx

---

**Last Updated:** 2026-05-22  
**Status:** Active — ongoing testing & maintenance

