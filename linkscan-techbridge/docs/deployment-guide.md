# DEPLOYMENT GUIDE
## LinkScan Techbridge

### 1. Prerequisites
- **React:** 19.2.5 (StrictRequirement)
- **Node.js:** v18+ (LTS RECOMMENDED)
- **Environment:** Cloud Run or similar containerized environment.

### 2. Environment Variables
Defined in `.env.example`:
- `GEMINI_API_KEY`: Required for future AI diagnostic features.
- `APP_URL`: The public-facing URL of the auditor.

### 3. Installation
```bash
npm install
```

### 4. Build & Start
```bash
# Build production assets
npm run build

# Start the full-stack server
npm run start
```

### 5. Security Note
Ensure `server.ts` is running in `production` mode to serve static assets correctly. The admin password should be moved to a secret environment variable before public deployment.
