# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/cross-app-performance-synthesizer/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/cross-app-performance-synthesizer/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/cross-app-performance-synthesizer/',  // REQUIRED: Assets must load from /cross-app-performance-synthesizer/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/cross-app-performance-synthesizer"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/cross-app-performance-synthesizer">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/cross-app-performance-synthesizer/`, not at the root
- **Asset Loading**: Without `base: '/cross-app-performance-synthesizer/'`, assets try to load from `/assets/` instead of `/cross-app-performance-synthesizer/assets/`
- **Routing**: Without `basename="/cross-app-performance-synthesizer"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/cross-app-performance-synthesizer/assets/index-*.js`
- Link tags should reference: `/cross-app-performance-synthesizer/assets/index-*.css`

If they reference `/assets/` instead of `/cross-app-performance-synthesizer/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/cross-app-performance-synthesizer/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/cross-app-performance-synthesizer/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: cross-app-performance-synthesizer
