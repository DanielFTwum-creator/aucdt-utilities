# Branch Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up the `claude/pdf-showcase-prototype-yuiXV` branch: standardise on pnpm, fix Playwright tests, update .gitignore, and remove stale ThesisAI worktrees.

**Architecture:** Four independent cleanup tasks executed in order. No new features — only fix and tidy existing state. Each task ends with a commit so the branch stays clean at every step.

**Tech Stack:** pnpm, Playwright, git worktrees, Node.js/TypeScript

---

## File Map

| File | Action | Why |
|---|---|---|
| `tuc-ai-lab-catalog/.gitignore` | Modify | Add playwright-browsers subdirs, test output dirs |
| `tuc-ai-lab-catalog/package.json` | Modify | Add `packageManager` field, update `npx` → `pnpm exec` in scripts |
| `tuc-ai-lab-catalog/pnpm-workspace.yaml` | Keep | Already correct — just needs committing |
| `tuc-ai-lab-catalog/pnpm-lock.yaml` | Keep/commit | Already generated — commit it |
| `.claude/worktrees/agent-*` (×4) | Delete | Stale ThesisAI agent worktrees, no pending changes |

---

## Task 1: Update .gitignore

**Files:**
- Modify: `tuc-ai-lab-catalog/.gitignore`

- [ ] **Step 1: Add missing exclusions**

Replace the entire `.gitignore` with:

```
node_modules/
build/
dist/
coverage/
.DS_Store
*.log
.env*
!.env.example

# Playwright browser binaries (firefox, webkit, winldd — chromium is intentionally kept)
playwright-browsers/firefox-*/
playwright-browsers/webkit-*/
playwright-browsers/winldd-*/
playwright-browsers/ffmpeg-*/

# Playwright test output artifacts
playwright-report/
test-results/
```

- [ ] **Step 2: Verify the untracked dirs are now ignored**

Run from `tuc-ai-lab-catalog/`:
```bash
cd tuc-ai-lab-catalog
git status --short
```

Expected: `playwright-browsers/firefox-1511/`, `playwright-browsers/webkit-2272/`, `playwright-browsers/winldd-1007/`, `playwright-report/`, `test-results/` no longer appear as `??` untracked.

- [ ] **Step 3: Commit**

```bash
git add tuc-ai-lab-catalog/.gitignore
git commit -m "chore(tuc-ai-lab-catalog): exclude playwright browser binaries and test output from git"
```

---

## Task 2: Standardise on pnpm

**Files:**
- Modify: `tuc-ai-lab-catalog/package.json`
- Keep: `tuc-ai-lab-catalog/pnpm-workspace.yaml`
- Keep: `tuc-ai-lab-catalog/pnpm-lock.yaml`

- [ ] **Step 1: Add `packageManager` field to package.json**

Check the installed pnpm version:
```bash
pnpm --version
```

Then add the `packageManager` field to `tuc-ai-lab-catalog/package.json` (insert after `"type": "module"`):

```json
"packageManager": "pnpm@10.x.x",
```

Replace `10.x.x` with the actual version reported by `pnpm --version`.

- [ ] **Step 2: Replace `npx` with `pnpm exec` in scripts**

Update the `scripts` block in `package.json`. Replace every `npx` with `pnpm exec` and every `npm run` with `pnpm run`:

```json
"scripts": {
  "dev": "PLAYWRIGHT_BROWSERS_PATH=./playwright-browsers tsx server.ts",
  "build": "vite build && PLAYWRIGHT_BROWSERS_PATH=dist/playwright-browsers pnpm exec playwright install chromium && cp server.ts dist/ && cp package.json dist/",
  "build:web": "vite build",
  "build:ios": "pnpm run build:web && pnpm exec capacitor build ios",
  "build:android": "pnpm run build:web && pnpm exec capacitor build android",
  "start": "PLAYWRIGHT_BROWSERS_PATH=./playwright-browsers tsx server.ts",
  "install:linux-deps": "sudo pnpm exec playwright install-deps chromium",
  "preview": "vite preview",
  "clean": "rm -rf dist",
  "lint": "tsc --noEmit",
  "test": "pnpm exec playwright test",
  "test:ui": "pnpm exec playwright test --ui",
  "ios:open": "open ios/App/App.xcworkspace",
  "android:open": "open android",
  "mobile:sync": "capacitor sync"
}
```

Note: a `"test"` script is added here — it was missing and is needed for CI.

- [ ] **Step 3: Move `playwright` from dependencies to devDependencies**

In `package.json`, remove `"playwright": "^1.59.1"` from `dependencies` and add it to `devDependencies`. Also remove the duplicate `"vite"` entry from `devDependencies` (it's already in `dependencies`; keep it in `dependencies` only). Final `devDependencies`:

```json
"devDependencies": {
  "@capacitor/cli": "^8.1.0",
  "@playwright/test": "^1.59.1",
  "playwright": "^1.59.1",
  "@types/express": "^4.17.21",
  "@types/node": "^22.14.0",
  "autoprefixer": "^10.4.21",
  "tailwindcss": "^4.1.14",
  "typescript": "~5.8.2"
}
```

And remove `"vite"` from `devDependencies` (keep only in `dependencies`).

- [ ] **Step 4: Verify pnpm can install cleanly**

```bash
cd tuc-ai-lab-catalog
pnpm install
```

Expected: exits 0, no errors. `pnpm-lock.yaml` may update — that's fine.

- [ ] **Step 5: Commit**

```bash
git add tuc-ai-lab-catalog/package.json tuc-ai-lab-catalog/pnpm-workspace.yaml tuc-ai-lab-catalog/pnpm-lock.yaml
git commit -m "chore(tuc-ai-lab-catalog): standardise on pnpm, fix duplicate deps, add test script"
```

---

## Task 3: Fix and Verify Playwright Tests

**Files:**
- Read-only: `tuc-ai-lab-catalog/playwright.config.ts`
- Read-only: `tuc-ai-lab-catalog/tests/catalog.spec.ts`

No code changes expected — the test logic is sound. The previous run failed because the server wasn't running. The `webServer` config in `playwright.config.ts` handles starting `tsx server.ts` automatically before tests run.

- [ ] **Step 1: Run the Playwright test suite**

```bash
cd tuc-ai-lab-catalog
pnpm test
```

The Playwright config will auto-start `tsx server.ts` on port 3000 before running tests.

Expected output: `24 passed` (or close to it — some assertions may need minor fixes if the app data has changed).

- [ ] **Step 2: If tests fail — diagnose**

Check the HTML report:
```bash
pnpm exec playwright show-report
```

Common failure causes:
- **"83 tools" count wrong:** The test at `Core Application > should display tool count` checks for `83`. If the catalog now has a different count, update the assertion in `tests/catalog.spec.ts`.
- **"Product Catalog" heading missing:** Check `src/App.tsx` for the actual `h1` text and update the test.
- **Server startup timeout:** Increase `timeout: 30000` in `playwright.config.ts` if `tsx server.ts` is slow.

- [ ] **Step 3: Commit test results config only (not the output artifacts)**

If `playwright.config.ts` needed changes:
```bash
git add tuc-ai-lab-catalog/playwright.config.ts tuc-ai-lab-catalog/tests/catalog.spec.ts
git commit -m "fix(tuc-ai-lab-catalog): update playwright tests to match current app state"
```

If no changes were needed, no commit required here.

---

## Task 4: Remove ThesisAI Worktrees

**Files:**
- Delete: `.claude/worktrees/agent-a24ced45e50fd98bf/`
- Delete: `.claude/worktrees/agent-a62b1761caea2e5d4/`
- Delete: `.claude/worktrees/agent-a7de615fbde5a8e91/`
- Delete: `.claude/worktrees/agent-ad9de7a58999784c2/`

The worktrees are registered with git as locked — they must be removed via `git worktree remove` (or `--force` since they are locked), not just `rm -rf`.

- [ ] **Step 1: Remove all four worktrees**

```bash
git worktree remove --force .claude/worktrees/agent-a24ced45e50fd98bf
git worktree remove --force .claude/worktrees/agent-a62b1761caea2e5d4
git worktree remove --force .claude/worktrees/agent-a7de615fbde5a8e91
git worktree remove --force .claude/worktrees/agent-ad9de7a58999784c2
```

- [ ] **Step 2: Prune stale worktree refs**

```bash
git worktree prune
git worktree list
```

Expected: only one entry — the main worktree at `C:/Development/github/aucdt-utilities`.

- [ ] **Step 3: Verify directories are gone**

```bash
ls .claude/worktrees/
```

Expected: empty directory or "no such file or directory".

- [ ] **Step 4: Commit the removal**

```bash
git add -A .claude/worktrees/
git commit -m "chore: remove stale ThesisAI agent worktrees"
```

---

## Verification Checklist

After all four tasks:

```bash
# 1. Working tree is clean
git status --short
# Expected: no untracked ?? entries for playwright-browsers/firefox|webkit|winldd, playwright-report, test-results, or .claude/worktrees

# 2. pnpm install works
cd tuc-ai-lab-catalog && pnpm install

# 3. All 24 Playwright tests pass
pnpm test
# Expected: 24 passed, 0 failed

# 4. Worktrees are clean
git worktree list
# Expected: 1 entry only

# 5. git log shows 4 clean commits
git log --oneline -5
```
