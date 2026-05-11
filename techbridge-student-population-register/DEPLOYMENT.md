# Deployment Configuration for Docker/Nginx

This application is deployed behind an Nginx reverse proxy at the path `/registry/`.

## Required Configuration

### 1. Vite Base Path (vite.config.ts)
The Vite config MUST include `base: '/registry/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/registry/',  // REQUIRED: Assets must load from /registry/assets/
    plugins: [react(), tailwindcss()],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx)

The BrowserRouter MUST include basename="/registry" for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/registry">  {/* REQUIRED: All routes are under /registry */}
      <ThemeProvider>
        <AuditProvider>
          <App />
        </AuditProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
```

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/registry/`, not at the root.
- **Asset Loading**: Without `base: '/registry/'`, assets try to load from `/assets/` instead of `/registry/assets/`.
- **Routing**: Without `basename="/registry"`, React Router treats `/registry/admin` as just `/admin`.

## Verification After Build

After running `npm run build`, check `dist/index.html`:
- Script tags should reference: `/registry/assets/index-*.js`
- Link tags should reference: `/registry/assets/index-*.css`

If they reference `/assets/` instead of `/registry/assets/`, the configuration is incorrect.

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated.
