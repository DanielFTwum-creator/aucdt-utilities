# Patois Lyricist - Production Deployment Guide

## 1. Environment Requirements
*   **Google Gemini API Key**: Required for the NLP engine.
*   **Static Hosting**: Vercel, Netlify, or Cloudflare Pages recommended.

## 2. Configuration Steps

### 2.1 API Key Integration
The app uses `process.env.API_KEY`. 
1.  In your hosting dashboard, add a new Environment Variable.
2.  Key: `API_KEY`
3.  Value: [Your Gemini API Key]

### 2.2 Domain Restriction
To prevent unauthorized use of your API key:
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Navigate to **APIs & Services** > **Credentials**.
3.  Select your key and set **Website restrictions** to your production domain (e.g., `https://patois-lyricist.vercel.app`).

## 3. Build & Launch
1.  Clone the repository.
2.  Run `npm install` to resolve dependencies (`jspdf`, `html2canvas`, etc.).
3.  Run `npm run build` (if using a build step) or simply deploy the `index.html` and assets.

## 4. Compliance Hardening
For SOC 2 production readiness:
*   Ensure HTTPS is enforced.
*   Configure a `Content-Security-Policy` header to only allow connections to Google API endpoints.
