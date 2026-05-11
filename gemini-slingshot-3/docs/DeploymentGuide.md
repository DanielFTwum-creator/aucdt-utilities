# Production Deployment Guide - Gemini Slingshot

## 1. Environment Setup
The application is a standalone Single Page Application (SPA) that requires certain build-time configurations.

### 1.1 Prerequisites
-   Node.js v18.0 or higher.
-   A valid **Google Gemini API Key**.
-   HTTPS-enabled hosting (Required for `getUserMedia` camera access).

## 2. Build and Deployment
### 2.1 Environment Variables
Ensure the following variable is injected into your hosting environment (e.g., Vercel, Netlify, Cloudflare):
- `API_KEY`: Your Google GenAI API key.

### 2.2 Static Hosting
Upload the build artifacts to your static web server.
- Ensure `index.html` is the entry point.
- Ensure all `*.tsx` and `*.js` assets are served with correct MIME types.

## 3. Permission Configuration
### 3.1 Camera Permissions
Browsers will block camera access if not served over a secure origin (`https://` or `localhost`).
- Add `camera` to the site's feature policy.
- The `metadata.json` file in this repository already specifies `requestFramePermissions: ["camera"]` for platforms like AI Studio.

## 4. Verification
After deployment, navigate to your URL and:
1.  Confirm the "Synchronizing Tactical Systems" loader completes.
2.  Perform a "Pinch" gesture to verify MediaPipe tracking.
3.  Execute a test shot and confirm the AI Strategic Advisor provides a hint.