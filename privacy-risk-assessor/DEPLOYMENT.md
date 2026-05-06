# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/privacy-risk-assessor/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/privacy-risk-assessor/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/privacy-risk-assessor/',  // REQUIRED: Assets must load from /privacy-risk-assessor/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/privacy-risk-assessor"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/privacy-risk-assessor">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/privacy-risk-assessor/`, not at the root
- **Asset Loading**: Without `base: '/privacy-risk-assessor/'`, assets try to load from `/assets/` instead of `/privacy-risk-assessor/assets/`
- **Routing**: Without `basename="/privacy-risk-assessor"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/privacy-risk-assessor/assets/index-*.js`
- Link tags should reference: `/privacy-risk-assessor/assets/index-*.css`

If they reference `/assets/` instead of `/privacy-risk-assessor/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/privacy-risk-assessor/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/privacy-risk-assessor/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: privacy-risk-assessor
