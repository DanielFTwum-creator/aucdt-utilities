# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/midjourney-prompt-helper/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/midjourney-prompt-helper/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/midjourney-prompt-helper/',  // REQUIRED: Assets must load from /midjourney-prompt-helper/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/midjourney-prompt-helper"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/midjourney-prompt-helper">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/midjourney-prompt-helper/`, not at the root
- **Asset Loading**: Without `base: '/midjourney-prompt-helper/'`, assets try to load from `/assets/` instead of `/midjourney-prompt-helper/assets/`
- **Routing**: Without `basename="/midjourney-prompt-helper"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/midjourney-prompt-helper/assets/index-*.js`
- Link tags should reference: `/midjourney-prompt-helper/assets/index-*.css`

If they reference `/assets/` instead of `/midjourney-prompt-helper/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/midjourney-prompt-helper/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/midjourney-prompt-helper/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: midjourney-prompt-helper
