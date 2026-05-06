# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/auto-scaling-policy-engine/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/auto-scaling-policy-engine/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/auto-scaling-policy-engine/',  // REQUIRED: Assets must load from /auto-scaling-policy-engine/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/auto-scaling-policy-engine"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/auto-scaling-policy-engine">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/auto-scaling-policy-engine/`, not at the root
- **Asset Loading**: Without `base: '/auto-scaling-policy-engine/'`, assets try to load from `/assets/` instead of `/auto-scaling-policy-engine/assets/`
- **Routing**: Without `basename="/auto-scaling-policy-engine"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/auto-scaling-policy-engine/assets/index-*.js`
- Link tags should reference: `/auto-scaling-policy-engine/assets/index-*.css`

If they reference `/assets/` instead of `/auto-scaling-policy-engine/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/auto-scaling-policy-engine/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/auto-scaling-policy-engine/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: auto-scaling-policy-engine
