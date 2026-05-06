
# Techbridge TSAP - Deployment Guide
**Version 3.1**

## 1. Overview
TSAP (Techbridge Salary Administration Portal) utilizes a **Zero-Backend Architecture**. It is a pure client-side React application that runs entirely within the user's browser. It requires no application server, database server, or complex build pipelines (Webpack/Vite are not required for runtime).

## 2. Technical Architecture
*   **Framework**: React 19 (via ESM Imports).
*   **Dependency Management**: Native Browser `importmap` (No Node_modules required in production).
*   **Persistence**: `localStorage` (Client-side).
*   **AI Integration**: Google Gemini API (Direct client calls).

## 3. Deployment Steps

### 3.1. Hosting Requirements
1.  **Static File Host**: Upload the contents of the project root to any static hosting service (Nginx, Apache, AWS S3, Netlify, or Organization Intranet).
2.  **HTTPS Mandatory**: Because the app uses `localStorage` for sensitive data and calls the Gemini API, serving over **HTTPS is strictly required**. Browsers may block crypto features on non-secure origins.
3.  **MIME Types**: Ensure your server is configured to serve `.tsx` and `.ts` files (if serving source directly via a transpiler shim) or the built assets with `application/javascript`. *Note: The current version uses an in-browser transpiler setup for demonstration. for production, pre-transpilation is recommended.*

### 3.2. AI Configuration (Critical)
The application relies on the Google GenAI SDK.
*   **API Key**: The application expects the API key to be available in the environment.
*   **Environment Variable**: The `GoogleGenAI` initialization looks for `process.env.API_KEY`.
    *   *If using a build tool:* Inject this variable during the build process.
    *   *If using the demo environment:* The platform automatically injects this key.
    *   *Manual Injection:* You may need to configure a proxy or a secure token exchange if deploying to a public URL to avoid exposing the raw API key in client code.

### 3.3. File Structure for Deployment
Ensure the following files are present in the web root:
*   `index.html` (Entry point)
*   `index.tsx` (Bootstrapper)
*   `App.tsx` (Main Component)
*   `metadata.json` (Manifest)
*   `/contexts/` (State Logic)
*   `/components/` (UI Elements)
*   `/pages/` (Route Views)
*   `/services/` (API Integrations)
*   `/utils/` (Calculation Logic)

## 4. Post-Deployment Verification
1.  Access the URL via HTTPS.
2.  **Verify Loading**: Ensure the "Techbridge TSAP" login screen appears without console errors regarding `importmap`.
3.  **Verify AI**: Open the Admin Panel -> "Intelligent Salary Scale Ingestion". If the Gemini API key is missing or invalid, AI features will fail (check browser console for 403/401 errors).
4.  **Security Check**: Confirm the "System Security Status" card in the Admin Panel is visible.

## 5. Troubleshooting
*   **Blank Screen**: Check browser console. If you see "Bare module import...", your browser does not support `importmap` or the CDN links are blocked by a corporate firewall.
*   **AI Errors**: If CLAUDE does not respond, verify the `API_KEY` is correctly provisioned in the execution environment.
