# Rophe RPMS: Production Deployment Guide

## 1. Technical Prerequisites
- **HTTPS Environment:** Essential for WebRTC (Telehealth) and Camera/Mic permissions.
- **Node.js Environment:** For building and environment variable injection.
- **Google Cloud Console Access:** To manage the Gemini API Key.

## 2. Environment Variables
The application requires the following key to be available:
- `API_KEY`: A valid Google AI Studio key with permission to access `gemini-3-flash-preview`.

## 3. Deployment Steps
### Phase A: Build
1. **Source Prep:** Clone the repository and install dependencies (`npm install`).
2. **Key Injection:** Ensure `process.env.API_KEY` is mapped to your build secret.
3. **Build Command:** Execute `npm run build` or equivalent.

### Phase B: Hosting
1. **Static Deployment:** Upload the `dist/` or `build/` folder to your provider (Vercel, Netlify, AWS S3).
2. **CORS Configuration:** Ensure your hosting domain is whitelisted in the Google AI Studio console if necessary.

### Phase C: Permission Headers
Ensure the following headers are set by your server for video functionality:
- `Feature-Policy: camera 'self'; microphone 'self'`
- `Content-Security-Policy: ... connect-src https://*.googleapis.com ...`

## 4. Post-Deployment Verification
1. Access the production URL via a secure connection (HTTPS).
2. Open the **Self-Test** tab.
3. Execute the `Clinical AI Integration` test to verify API handshake.
4. Start a mock video call to verify camera/mic hardware access.

## 5. Scalability Note
For high-concurrency environments, consider upgrading to a paid Tier in Google AI Studio to increase RPM (Requests Per Minute) limits for the Gemini model.