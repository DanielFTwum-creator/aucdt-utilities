# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/scholarship/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/scholarship/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/scholarship/',  // REQUIRED: Assets must load from /scholarship/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

**This project does NOT use React Router**, so no basename configuration is needed.

If you add React Router in the future, include `basename="/scholarship"`:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/scholarship">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/scholarship/`, not at the root
- **Asset Loading**: Without `base: '/scholarship/'`, assets try to load from `/assets/` instead of `/scholarship/assets/`
- **Container Name**: `techbridge-scholarship-portal` (Docker service)
- **Nginx Route**: `/scholarship/` → `http://techbridge-scholarship-portal/`

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path (probably `/assets/` instead of `/scholarship/assets/`).

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/scholarship/assets/index-*.js`
- Link tags should reference: `/scholarship/assets/index-*.css`

If they reference `/assets/` instead of `/scholarship/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:3000` (local dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/scholarship/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/scholarship/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf` (location /scholarship/)
- `docker-compose-all-apps.yml` (service: techbridge-scholarship-portal)

## Current Configuration Status

✅ **vite.config.ts** - Configured with `base: '/scholarship/'`
✅ **nginx.conf** - Route `/scholarship/` configured
✅ **Built and verified** - Assets correctly reference `/scholarship/assets/`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: techbridge-scholarship-portal-v2
**Deployment Path**: /scholarship/
**Container**: techbridge-scholarship-portal
