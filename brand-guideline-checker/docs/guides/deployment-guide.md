# Deployment Guide: Brand Guideline Checker
**Project:** Brand Checker (v3.0.0)
**Core Requirement:** MUST compile with React 19.2.4

## 1. Prerequisites
- **Node.js**: v18 or higher recommended.
- **Package Manager**: `pnpm` (recommended) or `npm`.
- **Constraint**: Ensure `package.json` pins `react` and `react-dom` to **19.2.4**.

## 2. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 3. Institutional Build
1. **Sync Dependencies**: `pnpm install`
2. **Type Check**: `pnpm run build` (Ensure 100% compliance)
3. **Verify**: Inspect `package.json` to confirm React 19.2.4 is active.

## 4. Hosting (Static)
Deploy the `dist/` folder to your institutional static hosting provider.
Ensure the host supports SPA routing (fallback to `index.html`) if custom routes are added in future iterations.

## 5. PWA Considerations
Ensure institutional logos and manifest assets are correctly linked in the `/public` folder to maintain brand identity even in offline states.
