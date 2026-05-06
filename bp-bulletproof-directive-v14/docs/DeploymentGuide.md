# Deployment Guide

## 1. Prerequisites
- Node.js 18+
- React 19.2.4
- Firebase project (for Firestore and Auth)

## 2. Deployment Steps
1. Install dependencies: `npm install`
2. Configure environment variables (see section 3).
3. Initialize Firebase: Use the `set_up_firebase` tool or manually configure `firebase-applet-config.json`.
4. Deploy Firestore rules: Use the `deploy_firebase` tool.
5. Build the application: `npm run build`
6. Serve the application using a static file server or the provided `dist/` directory.

## 3. Environment Variables
- `ADMIN_PASSWORD`: Configure the admin panel access key.
- `GEMINI_API_KEY`: Required for AI assistant functionality.
- `VITE_FIREBASE_CONFIG`: (Optional) JSON string of Firebase configuration if not using `firebase-applet-config.json`.
