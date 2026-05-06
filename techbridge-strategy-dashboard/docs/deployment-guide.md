# Deployment Guide: Production Environment

## Prerequisites
- Node.js 18.x or higher
- npm or pnpm (recommended)

## 📦 Build Process
To generate a production-ready bundle:

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

The output will be located in the `dist/` directory.

## 🚀 Hosting Recommendations
The dashboards are optimized for static hosting providers:
1. **Netlify/Vercel**: Simply connect the repository and use `npm run build` as the build command with `dist` as the publish directory.
2. **Nginx**: Deploy the `dist` folder to your web root and ensure `try_files $uri $uri/ /index.html;` is configured for SPA routing.

## 🔧 Environment Configuration
Configure the following in `vite.config.ts` if deploying to a subdirectory:
```typescript
export default defineConfig({
  base: '/your-subdirectory/',
  // ...
})
```
