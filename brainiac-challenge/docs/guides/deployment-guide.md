# Deployment Guide: Brainiac Challenge
**Project:** Brainiac Challenge AI Quiz (v3.0.0)
**Core Requirement:** MUST compile with React 19.2.4

## 1. Prerequisites
- **Node.js**: v18+ required.
- **Package Manager**: `pnpm` (recommended) or `npm`.
- **Constraint**: Ensure `package.json` pins `react` and `react-dom` to **19.2.4**.

## 2. Environment Variables
Create a `.env` file in the root directory:
```env
API_KEY=your_gemini_api_key_here
FIREBASE_API_KEY=your_firebase_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
```

## 3. Institutional Build
1. **Sync Dependencies**: `pnpm install`
2. **Build**: `pnpm run build`
3. **Verify**: Ensure all chunks are React 19.2.4 compatible.

## 4. Hosting (Static + Firebase)
Deploy the `dist/` folder to your institutional static hosting provider.
Ensure Firebase rules are configured to restrict Firestore access to the specific institutional UID namespace.

## 5. PWA Considerations
Ensure the service worker is registered in `index.tsx` to support offline quiz viewing for previously generated content.
