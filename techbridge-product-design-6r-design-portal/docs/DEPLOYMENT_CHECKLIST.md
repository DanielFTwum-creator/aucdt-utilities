
# Production Deployment Checklist

Before finalizing the rollout to TechBridge scholars, ensure all steps are completed:

## 1. Security & Keys
- [ ] `API_KEY` is securely injected as an environment variable.
- [ ] Default `ADMIN_PASSWORD` in `App.tsx` has been reviewed for institutional policy.
- [ ] HTTPS is active on the production domain.

## 2. PWA Readiness
- [ ] `sw.js` is loading without errors in the browser console.
- [ ] Service Worker successfully caches the critical path for offline use.
- [ ] `metadata.json` icons and theme colors match the institutional brand.

## 3. Accessibility
- [ ] High-Contrast mode verified via `Alt+T`.
- [ ] All SVG icons have appropriate descriptions or ARIA labels.
- [ ] Main content area is focusable via keyboard tab order.

## 4. Testing
- [ ] **Scholastic Testbed** executed in the Faculty Hub; all 4 tests passed.
- [ ] Playwright suite (`tests/critical_path.test.js`) passed in the staging environment.
- [ ] Audit logs successfully record a "LOGIN" and "NAV" action.

## 5. Documentation
- [ ] `README.md` is present at the root.
- [ ] `SRS` version 1.5.0 is archived.
- [ ] Executive Summary provided to the Office of the Registrar.
