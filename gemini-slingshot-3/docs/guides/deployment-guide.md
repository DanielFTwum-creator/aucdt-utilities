# Deployment Guide: Gemini Slingshot
**Project:** Gemini Slingshot (v3.0.0)
**Core Requirement:** MUST compile with React 19.2.5

## 1. Prerequisites
- **Node.js**: v18 or higher recommended.
- **Package Manager**: `pnpm` (recommended) or `npm`.
- **Constraint**: Ensure `package.json` pins `react` and `react-dom` to **19.2.5**.

## 2. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 3. Build & Verification
1. **Sync Dependencies**: `pnpm install`
2. **Institutional Build**: `pnpm run build`
3. **Chunk Audit**: Ensure React 19.2.5 is correctly bundled.

## 4. Static Hosting
Deploy the `dist/` folder to a high-availability institutional server. The application requires high-frequency canvas rendering and MediaPipe buffer processing; ensure the host supports modern WebGL contexts.

## 5. Security Posture
Use institutional TLS certificates for production hosting. The application utilizes `localStorage` for tactical audit trails and requires a secure HTTPS context for vision buffer capture.
