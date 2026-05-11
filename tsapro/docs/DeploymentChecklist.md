
# TSAP Deployment Checklist

Use this checklist to ensure a secure and successful deployment of the Techbridge Salary Administration Portal.

## 1. Pre-Deployment Configuration
- [ ] **API Key Provisioning**: Ensure a valid Google Gemini API Key (`API_KEY`) is available in the hosting environment variables for AI features.
- [ ] **HTTPS Certificate**: Verify that the domain where TSAP will be hosted has a valid SSL certificate. **Required** for crypto operations and microphone access (if enabled later).
- [ ] **Data Cleanup**: Ensure the `constants.ts` file contains the most up-to-date `STEP_CODES` list before building.

## 2. Environment Setup
- [ ] **Web Server**: Configure web server (Nginx/Apache/Netlify) to serve `index.html` for all routes (SPA fallback).
- [ ] **MIME Types**: Verify server sends `application/javascript` headers for `.js`, `.ts`, and `.tsx` files.
- [ ] **Caching**: Configure cache-control headers (recommended: `no-cache` for index.html, long cache for assets).

## 3. Post-Deployment Verification
- [ ] **Load Test**: Access the production URL. Confirm application loads without "Import Map" errors in console.
- [ ] **AI Check**: Open Admin Panel -> "Salary Scale Ingestion". Verify connection to Gemini API.
- [ ] **Audit Log**: Perform one calculation. Go to Admin -> Audit Logs. Verify the entry exists.
- [ ] **Persistence**: Refresh the page. Verify session remains active or handles timeout correctly.

## 4. Security Handover
- [ ] **Default Password**: Log in with default creds (`%oyibi%ghana+`) and IMMEDIATELY change the admin password.
- [ ] **Backup Strategy**: Establish a schedule for exporting Audit Logs (CSV) from the Admin Panel (e.g., Monthly).

## 5. Sign-Off
- [ ] **System Owner**: __________________________
- [ ] **Date**: __________________________
