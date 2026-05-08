# Testing Guide: Animator Agent Desktop
## Version: 3.0.0

---

## 1. Automated E2E Testing
We use **Playwright** for automated End-to-End verification.

### 1.1 Running Tests
Execute the full test suite:
```bash
pnpm test
```

### 1.2 Interactive Testing
Run tests in UI mode for debugging:
```bash
npx playwright test --ui
```

### 1.3 Screenshot & Video Capture
Visual regressions are captured in `tests-results/`. Screenshots are automatically taken on failure.

## 2. Manual Verification Checklist
- [ ] **State Persistence**: Modify a track, refresh page, verify changes remain.
- [ ] **Undo/Redo**: Perform 5 actions, undo all, redo all.
- [ ] **Admin Lockout**: Enter wrong password 5 times, verify 60s lockout.
- [ ] **Keyboard Transport**: Press `Space` to play/pause, `Esc` to stop.

## 3. Accessibility (WCAG 2.1 AA)
- Run the **Inline ARIA Audit** in the Admin Testing dashboard.
- Ensure all interactive nodes have at least 100% ARIA coverage.
- Verify High-Contrast theme accessibility.

## 4. Performance Testing
- Monitor the **Status Bar** for GPU and VRAM utilization.
- Ensure character animations maintain a steady 24/60 FPS.

---
*QA Certified for TUC Production Release*
