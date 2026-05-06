
# Deployment Guide: ExpensePro

### Environment Setup
- **Gemini API Key**: Must be provided via `process.env.API_KEY`.
- **Node Version**: LTS Recommended.

### Deployment Steps
1. **Build**: Run `npm run build` to generate static assets.
2. **Static Hosting**: Upload `index.html` and bundled assets to any static provider (Netlify, Vercel, S3).
3. **PWA Configuration**: Ensure `metadata.json` is served correctly for manifest-ready installation.

### Security Note
Ensure the Admin Security Key is updated in `AdminPage.tsx` before production deployment.
