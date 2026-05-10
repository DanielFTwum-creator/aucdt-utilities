# TUC AI Lab Catalog — Testing Guide

**Complete, verified steps for running the Playwright E2E test suite**  
**Last verified: 10 May 2026 — Windows 11, Git Bash, Node 18+, pnpm**

---

## Pre-flight Checklist

Before the demo, confirm these are done **once** on the machine:

- [ ] You are in the correct directory: `tuc-ai-lab-catalog/`
- [ ] `pnpm install` has been run (installs `@playwright/test`)
- [ ] Chromium has been downloaded into the project folder (Step 1 below)
- [ ] Port 3000 is free (no other dev server running)

---

## Step 1 — Install Chromium into the Project Folder

> **Do this once. Never skip it.** `npx playwright install` alone puts the browser
> in the system default location. The dev server (`server.ts`) overrides the path to
> `./playwright-browsers`, so the test runner must find the browser in the same place.

```bash
PLAYWRIGHT_BROWSERS_PATH=./playwright-browsers npx playwright install chromium
```

Expected output ends with:
```
Chromium 136.x.x.x downloaded to ...tuc-ai-lab-catalog\playwright-browsers\chromium_headless_shell-XXXX\...
```

Verify it worked:
```bash
ls playwright-browsers/
# Should show: chromium_headless_shell-XXXX/
```

---

## Step 2 — Run the Full Test Suite

```bash
PLAYWRIGHT_BROWSERS_PATH=./playwright-browsers npx playwright test
```

**What happens automatically:**
1. Playwright starts `tsx server.ts` on port 3000 (the full Express + Vite dev server)
2. Runs 24 tests across 6 suites using headless Chromium
3. Takes a screenshot of the homepage → `docs/screenshots/homepage.png`
4. Writes an HTML report → `playwright-report/index.html`
5. Writes a JSON report → `test-results/results.json`

**Expected output:**
```
Running 24 tests using 4 workers

  ✓  Core Application › has correct page title
  ✓  Core Application › renders main heading
  ✓  Core Application › TUC logo is visible
  ✓  Core Application › Contact Lab button is visible in nav
  ✓  Core Application › displays total tool count
  ✓  Search & Filter › search input is visible and accepts text
  ✓  Search & Filter › typing in search filters the tool list
  ✓  Search & Filter › clearing search restores all tools
  ✓  Search & Filter › clicking AI & ML category filters results
  ✓  Search & Filter › clicking All restores full catalog
  ✓  Grid & List View › grid view button is visible
  ✓  Grid & List View › list view button is present in toolbar
  ✓  Grid & List View › tool cards are visible in default grid view
  ✓  Grid & List View › sidebar shows all 7 categories
  ✓  Tool Detail Modal › clicking a tool card opens the detail panel
  ✓  Tool Detail Modal › detail panel contains an external link
  ✓  Tool Detail Modal › detail panel can be dismissed
  ✓  Tool Detail Modal › stability bar is shown in detail panel
  ✓  Accessibility & TUC Standards › page has lang="en" attribute
  ✓  Accessibility & TUC Standards › page title is not the default placeholder
  ✓  Accessibility & TUC Standards › meta description is present
  ✓  Accessibility & TUC Standards › theme-color meta tag is present
  ✓  Accessibility & TUC Standards › TUC AI Lab brand text is visible
  ✓  capture homepage screenshot for QA showcase

  24 passed (0 failed)
```

---

## Step 3 — View the HTML Report

```bash
npx playwright show-report
```

Opens `playwright-report/index.html` in the default browser. Shows each test with
pass/fail status, duration, and screenshots captured during the run.

---

## Step 4 — Open the Showcase Page

Open `docs/test-showcase.html` directly in Chrome:

```bash
# Git Bash
start docs/test-showcase.html

# Or navigate to it in File Explorer and double-click
```

The page displays:
- Live homepage screenshot (from `docs/screenshots/homepage.png`)
- Test results summary table (24 passed, 0 failed, 100%)
- Agent explanation panel

---

## Known Gotchas (Avoid During Demo)

### ❌ Wrong: `npx playwright install` without the path prefix

```bash
# This installs to C:\Users\...\AppData\Local\ms-playwright\ — WRONG
npx playwright install chromium
```

The test runner sets `PLAYWRIGHT_BROWSERS_PATH=./playwright-browsers` when
it starts the dev server. If the browser isn't in that folder, every test fails
with "Executable doesn't exist".

### ✅ Correct: Always prefix with the path variable

```bash
PLAYWRIGHT_BROWSERS_PATH=./playwright-browsers npx playwright install chromium
PLAYWRIGHT_BROWSERS_PATH=./playwright-browsers npx playwright test
```

---

### ❌ Port 3000 already in use

If another dev server is running on port 3000, Playwright's `webServer` block
will reuse it (if outside CI) but the wrong app may be served.

Check before the demo:
```bash
# Git Bash / PowerShell
netstat -ano | grep 3000
# Should return nothing
```

Kill if needed:
```bash
# PowerShell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

---

### ❌ `pnpm install` not run after cloning

The `@playwright/test` package is a devDependency. Without it, `npx playwright test`
will fail immediately.

```bash
pnpm install   # must be run at least once
```

---

### ❌ Screenshot missing from showcase page

The screenshot at `docs/screenshots/homepage.png` is only created when the test
suite runs successfully. If the image is missing, the showcase page shows a grey
placeholder. Run the full test suite first.

---

## Demo Script (3 minutes)

Use this sequence for a smooth live demo:

**1. Open terminal (Git Bash), navigate to project:**
```bash
cd /c/Development/github/aucdt-utilities/tuc-ai-lab-catalog
```

**2. Run the agent in one command:**
```bash
PLAYWRIGHT_BROWSERS_PATH=./playwright-browsers npx playwright test
```

**3. While tests run, narrate:**
> *"The autonomous Playwright agent has launched a headless Chrome browser. It is
> navigating the catalog, interacting with search, filters, and modals — asserting
> 24 conditions across 6 test suites. No human is clicking anything."*

**4. Tests finish — show the terminal output (24 passed, 0 failed)**

**5. Open the showcase page:**
```bash
start docs/test-showcase.html
```

**6. Show the HTML report:**
```bash
npx playwright show-report
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Install Chromium (once) | `PLAYWRIGHT_BROWSERS_PATH=./playwright-browsers npx playwright install chromium` |
| Run all tests | `PLAYWRIGHT_BROWSERS_PATH=./playwright-browsers npx playwright test` |
| Run one suite only | `PLAYWRIGHT_BROWSERS_PATH=./playwright-browsers npx playwright test --grep "Core Application"` |
| View HTML report | `npx playwright show-report` |
| Open showcase page | `start docs/test-showcase.html` |
| Check port 3000 | `netstat -ano \| grep 3000` |

---

## File Locations After a Successful Run

```
tuc-ai-lab-catalog/
├── docs/
│   ├── screenshots/
│   │   └── homepage.png          ← Homepage screenshot for showcase
│   └── test-showcase.html        ← Presentation page for President/QA
├── playwright-report/
│   └── index.html                ← Detailed HTML test report
├── test-results/
│   └── results.json              ← Machine-readable results
└── tests/
    └── catalog.spec.ts           ← The 24-test E2E suite
```

---

**Last Updated:** 10 May 2026  
**Playwright Version:** 1.59.1  
**Browser:** Chromium (headless)  
**Tests:** 24 | **Pass Rate:** 100%
