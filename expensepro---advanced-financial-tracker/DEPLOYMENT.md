# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/expensepro---advanced-financial-tracker/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/expensepro---advanced-financial-tracker/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/expensepro---advanced-financial-tracker/',  // REQUIRED: Assets must load from /expensepro---advanced-financial-tracker/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/expensepro---advanced-financial-tracker"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/expensepro---advanced-financial-tracker">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/expensepro---advanced-financial-tracker/`, not at the root
- **Asset Loading**: Without `base: '/expensepro---advanced-financial-tracker/'`, assets try to load from `/assets/` instead of `/expensepro---advanced-financial-tracker/assets/`
- **Routing**: Without `basename="/expensepro---advanced-financial-tracker"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/expensepro---advanced-financial-tracker/assets/index-*.js`
- Link tags should reference: `/expensepro---advanced-financial-tracker/assets/index-*.css`

If they reference `/assets/` instead of `/expensepro---advanced-financial-tracker/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/expensepro---advanced-financial-tracker/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/expensepro---advanced-financial-tracker/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: expensepro---advanced-financial-tracker
