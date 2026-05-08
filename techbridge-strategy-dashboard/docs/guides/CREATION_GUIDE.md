# TechBridge Dashboard - Model Creation Guide

## OBJECTIVE
Recreate the TechBridge Strategic Dashboard application from scratch following these exact steps.

---

## STEP 1: Initialize Project

### 1.1. Create Project Directory
```bash
mkdir techbridge-strategy-dashboard
cd techbridge-strategy-dashboard
```

### 1.2. Create package.json
Create file `package.json` with this exact content:
```json
{
  "name": "techbridge-strategy-dashboard",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "packageManager": "pnpm@10.22.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.563.0",
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
    "recharts": "^3.7.0"
  },
  "devDependencies": {
    "@types/node": "^25.2.2",
    "@vitejs/plugin-react": "^5.1.3",
    "typescript": "~5.9.3",
    "vite": "^7.3.1",
    "vite-plugin-pwa": "^1.2.0"
  }
}
```

### 1.3. Install Dependencies
```bash
pnpm install
```

---

## STEP 2: Create Configuration Files

### 2.1. Create tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["*.tsx", "*.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 2.2. Create vite.config.ts
```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['https://techbridge.edu.gh/static/TUC_LOGO.png'],
          manifest: {
            name: 'TechBridge Strategic Dashboard',
            short_name: 'TechBridge',
            description: 'Strategic dashboard for Techbridge University College',
            theme_color: '#630f12',
            background_color: '#0f172a',
            display: 'standalone',
            icons: [
              {
                src: 'https://techbridge.edu.gh/static/TUC_LOGO.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: 'https://techbridge.edu.gh/static/TUC_LOGO.png',
                sizes: '512x512',
                type: 'image/png'
              }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom', 'recharts', 'lucide-react'],
            },
          },
        },
      }
    };
});
```

---

## STEP 3: Create Type Definitions

### 3.1. Create types.ts
Define all TypeScript interfaces:
```typescript
export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  user: string;
}

export type Theme = 'light' | 'dark' | 'high-contrast';
```

---

## STEP 4: Create Data File

### 4.1. Create data.ts
**NOTE**: This file contains all static data for the dashboard. Reference the actual file at:
`c:\Users\DELL\Downloads\techbridge-strategy-dashboard\data.ts`

Copy the entire content from the source file (contains financial projections, risk matrices, marketing data, etc.)

---

## STEP 5: Create HTML Template

### 5.1. Create index.html
```html
<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- BASIC SEO META TAGS -->
    <title>TechBridge Strategic Dashboard | Techbridge University College | Pioneering Design & Technology</title>
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    
    <!-- Keywords -->
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    
    <!-- Author and Publisher -->
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://techbridge.edu.gh/" />
    
    <!-- Robots Meta Tag -->
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    
    <!-- Language and Geographic Targeting -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    
    <!-- OPEN GRAPH META TAGS -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="TechBridge Strategic Dashboard | Techbridge University College" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    
    <!-- TWITTER CARD META TAGS -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="TechBridge Strategic Dashboard | Techbridge University College" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    
    <!-- ADDITIONAL SEO META TAGS -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="rating" content="general" />
    <meta name="referrer" content="origin-when-cross-origin" />
    
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-FKXTELQ71R"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-FKXTELQ71R');
    </script>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              slate: {
                850: '#1e293b',
                950: '#020617',
              }
            }
          }
        }
      }
    </script>
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <link rel="apple-touch-icon" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    
    <!-- Font Preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- iOS PWA Support -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="TechBridge">
    
</head>
  <body>
    <div id="root"></div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>
```

---

## STEP 6: Create Styles

### 6.1. Create index.css
**NOTE**: Copy the exact content from:
`c:\Users\DELL\Downloads\techbridge-strategy-dashboard\index.css`

This file contains:
- Global fonts (Inter from Google Fonts)
- Dark theme gradient backgrounds
- Glassmorphism panel styles
- High contrast mode overrides
- Custom scrollbar styles

---

## STEP 7: Create React Components

### 7.1. Create components/ directory
```bash
mkdir components
```

### 7.2. Create Components
For each of the following components, copy the exact content from the source files:

1. **components/MetricCard.tsx** - Reusable metric display card
2. **components/Sidebar.tsx** - Navigation sidebar with theme switching
3. **components/Overview.tsx** - Executive briefing module (REQ-1.x)
4. **components/StrategyView.tsx** - Strategic planning module (REQ-2.x)
5. **components/Financials.tsx** - Financial projections module (REQ-3.x)
6. **components/MarketingView.tsx** - Marketing & operations module (REQ-4.x)
7. **components/RisksView.tsx** - Risk management module (REQ-5.x)
8. **components/AdminView.tsx** - Admin & security module (REQ-6.x)

**SOURCE LOCATION**: `c:\Users\DELL\Downloads\techbridge-strategy-dashboard\components\`

---

## STEP 8: Create Main Application Files

### 8.1. Create App.tsx
Copy from: `c:\Users\DELL\Downloads\techbridge-strategy-dashboard\App.tsx`

This file contains:
- Tab switching logic
- Theme management
- Authentication system
- Audit logging

### 8.2. Create index.tsx
```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

---

## STEP 9: Build and Verify

### 9.1. Run Development Server
```bash
pnpm dev
```

**VERIFY**: App runs at `http://localhost:3000`

### 9.2. Build for Production
```bash
pnpm build
```

**VERIFY**: Output shows:
- No errors
- `dist/` folder created
- `manifest.webmanifest` generated
- `registerSW.js` generated
- Vendor and app chunks separated

### 9.3. Test Production Build
```bash
pnpm preview
```

**VERIFY**: App works correctly in production mode

---

## STEP 10: Final Verification Checklist

- [ ] All 8 tabs render correctly (Overview, Strategy, Financials, Marketing, Risks, Admin)
- [ ] Theme switching works (Light, Dark, High Contrast)
- [ ] Admin login works with password "admin"
- [ ] Charts render with correct data
- [ ] PWA install prompt appears
- [ ] Service worker registered
- [ ] No console errors
- [ ] Responsive design works on mobile

---

## NOTES FOR MODEL EXECUTION

1. **Do NOT modify** configuration values (theme colors, URLs, etc.)
2. **Copy exact content** for data.ts, components, and styles
3. **Verify after each step** before proceeding
4. **Use pnpm** (not npm or yarn) as specified
5. **All file paths** are relative to project root
6. **Component files** contain the complete implementation per SRS requirements

## SUCCESS CRITERIA

The application is successfully recreated when:
1. Build completes with no errors
2. All functional requirements (REQ-1.x through REQ-8.x) are working
3. PWA is installable
4. Production bundle is optimized (vendor/app split)
