# MASTER CREATION GUIDE: AI @ TechBridge Portal (v4.0)

This blueprint contains the exact technical signatures required to recreate the AI @ TechBridge Portal with total fidelity.

---

## 1. PROJECT INITIALIZATION & CONFIG
**Environment:** Node 18+, pnpm.
```bash
# Core setup
pnpm create vite ./ --template react-ts
pnpm install @google/genai lucide-react clsx tailwind-merge
pnpm install -D tailwindcss @tailwindcss/vite
```

### Vite Config (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  resolve: { alias: { '@': path.resolve(__dirname, './') } },
});
```

### Environment (`.env.local`)
**CRITICAL**: Variables must be prefixed with `VITE_`.
```env
VITE_GEMINI_API_KEY=AIzaSy...
```

---

## 2. DESIGN SYSTEM (Tailwind v4 Build-Time)
Configure `index.css` to centralize the "Hollywood" design tokens:
```css
@import "tailwindcss";
@theme {
  --color-techbridge-burgundy: #8B1538;
  --color-techbridge-burgundy-dark: #6B1028;
  --color-techbridge-gold: #D4AF37;
  --color-techbridge-gold-light: #F4E4BC;
  --color-techbridge-cream: #F8F6F0;
  --font-serif: "Playfair Display", serif;
  --font-sans: "Inter", sans-serif;
  
  @keyframes shell-breathe {
    0%, 100% { transform: scale(1); opacity: 0.95; }
    50% { transform: scale(1.02); opacity: 1; }
  }
}
```

---

## 3. CORE COMPONENT LOGIC

### A. The Morphing Visualization (`InteractiveShell.tsx`)
**The Math of "Reaching":**
```typescript
const morphDirection = activeTopic ? (activeTopic.align === 'start' ? 1 : -1) : 0;
const pullY = activeTopic ? Math.max(-40, Math.min(40, (activeTopic.y - 250) / 8)) : 0;
// Dynamic bezier points
const topCurveX = 190 + (morphDirection * 50); 
const topCurveY = 140 + (pullY * 1.5);
```
**SVG Requirements:** 
- Use `<defs>` for `linearGradient` (gold-grad, core-grad).
- Apply `feGaussianBlur` for the wireframe glow.

### B. Secure Admin Protocol (`AdminDashboard.tsx`)
**Session Management:**
```typescript
const SESSION_TIMEOUT_MS = 5 * 60 * 1000;
useEffect(() => {
  if (!isAuth) return;
  const timeoutId = setTimeout(() => onLogout(), SESSION_TIMEOUT_MS);
  // Attach listeners to reset timer on activity
}, [isAuth]);
```

### C. Hardened Gemini Service (`services/gemini.ts`)
```typescript
let ai: GoogleGenAI | null = null;
export const askDartmouthAI = async (query: string) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return "API Key Missing.";
  if (!ai) ai = new GoogleGenAI(apiKey);
  // ... call model with systemInstruction ...
};
```

---

## 4. OFFLINE CAPABILITY (`sw.js`)
The Service Worker MUST cache Google Fonts and critical ESM chunks.
```javascript
const CACHE_NAME = 'techbridge-v1';
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(['/index.html', '/index.css'])));
});
// Fetch interceptor with Cache-First strategy for static assets.
```

---

## 5. RECONSTRUCTION CHECKLIST
1.  [ ] **Foundation**: Setup Vite + T4 + sw.js.
2.  [ ] **Data**: Port `constants.tsx` (50+ tools, faculty videos, coordinates).
3.  [ ] **Shell**: Implement the Morphing SVG logic.
4.  [ ] **Dashboard**: Build the Admin logic (Audit table + Inactivity timer).
5.  [ ] **Concierge**: Hook up the Gemini Flash provider.
6.  [ ] **Aesthetics**: Apply the Playfair Display serif fonts to all headers.

---
**END OF SPECIFICATION**
