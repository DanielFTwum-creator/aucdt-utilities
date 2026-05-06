# Troubleshooting

## Blank Screen After `pnpm dev`

**Symptom:** App loads but shows nothing.

**Fix:**
```bash
pnpm remove tailwindcss eslint
pnpm add -D tailwindcss@^3.4.1 eslint@^8.57.0
pnpm dev
```

Or use the pinned versions already in `package.json` by deleting `node_modules` and reinstalling:
```bash
rm -rf node_modules
pnpm install
```

---

## Charts Not Rendering

**Symptom:** Chart areas are empty or show a spinner indefinitely.

**Checks:**
1. Open DevTools → Network → confirm `analytics.json` returns 200.
2. Open DevTools → Console → look for `Data validation failed` messages.
3. Confirm the JSON matches the required schema (see [API.md](API.md#data-format)).

**Quick fix:** Remove date range filters (click **Clear**) — an invalid range can return 0 rows.

---

## Export Not Working

**PDF blank:** The jsPDF library needs chart DOM nodes to be fully rendered. Wait for all charts to load before exporting.

**CSV/Excel file is empty:** Check that `processedMetrics` is not null — this happens when data fails validation.

**Download doesn't start:** Some browsers block programmatic downloads. Allow downloads from `localhost` in browser settings.

---

## Login Always Fails

1. Check `.env` values match what you're typing.
2. Remember env vars are baked in at build time — rebuild after changing `.env`.
3. If locked out: DevTools → Application → Session Storage → delete `adminLockout`.

---

## `pnpm install` Fails

```bash
# Clear lockfile and retry
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Or fall back to npm
npm install --legacy-peer-deps
```

---

## Vite Build Memory Error

```bash
NODE_OPTIONS=--max-old-space-size=4096 pnpm run build
```

---

## Docker Container Keeps Restarting

```bash
# Check logs
docker-compose logs analytics-refactor

# Rebuild without cache
docker-compose build --no-cache analytics-refactor
docker-compose up analytics-refactor
```

---

## E2E Tests Fail: `Browser was not found`

Playwright ships its own Chromium but it must be downloaded first:

```bash
node node_modules/playwright/install.mjs
```

Or re-install:
```bash
pnpm remove playwright && pnpm add -D playwright
```

---

## TypeScript Errors in VS Code

**`Cannot find type definition file for 'node'`:**
```bash
pnpm add -D @types/node
```

**`JSX element implicitly has type 'any'`:** Ensure `tsconfig.json` has `"jsx": "react-jsx"` and React types are installed.

---

## Getting Help

- Check existing issues in the Bitbucket repository
- Contact the TUC ICT Department: ict@techbridge.edu.gh
