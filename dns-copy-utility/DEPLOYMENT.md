# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/dns-copy-utility/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/dns-copy-utility/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/dns-copy-utility/',  // REQUIRED: Assets must load from /dns-copy-utility/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/dns-copy-utility"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/dns-copy-utility">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/dns-copy-utility/`, not at the root
- **Asset Loading**: Without `base: '/dns-copy-utility/'`, assets try to load from `/assets/` instead of `/dns-copy-utility/assets/`
- **Routing**: Without `basename="/dns-copy-utility"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/dns-copy-utility/assets/index-*.js`
- Link tags should reference: `/dns-copy-utility/assets/index-*.css`

If they reference `/assets/` instead of `/dns-copy-utility/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/dns-copy-utility/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/dns-copy-utility/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: dns-copy-utility
