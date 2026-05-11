# Deployment Guide: Animator Agent Desktop
## Version: 3.0.0

---

## 1. Prerequisites
- **Node.js**: 18.x or higher
- **Package Manager**: `pnpm` (mandatory)
- **Environment**: `.env.local` must contain `GEMINI_API_KEY` for AI features.

## 2. Build Process
Run the following command to generate the production bundle:
```bash
pnpm build
```
The output will be located in the `/dist` directory.

## 3. Local Preview & Routing
To test the production build locally:
```bash
pnpm preview
```
*Note: The app uses **HashRouter** and `base: './'` in `vite.config.ts` to support subdirectory deployments.*

## 4. Institutional Deployment (TUC)
The application is deployed via SCP to the Techbridge University College production environment:
```bash
pnpm deploy
```
**Destination Path**: `root@techbridge.edu.gh:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/animator/`

## 5. Metadata Compliance
Ensure `metadata.json` is synchronized with the latest version before deployment.
```json
{
  "name": "Animator Agent Desktop",
  "version": "3.0.0",
  "majorCapabilities": [...]
}
```

---
*Verified for TUC Infrastructure v2026.05*
