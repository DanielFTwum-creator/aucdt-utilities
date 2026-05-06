# Sentinel Agent - Model Creation Guide

## OBJECTIVE
Recreate the Sentinel Agent application from scratch following these exact steps. This is a full-stack React + Node.js application with PWA support.

---

## STEP 1: Initialize Project

### 1.1. Create Project Directory
```bash
mkdir sentinel-agent
cd sentinel-agent
```

### 1.2. Create package.json
Create file `package.json` with this exact content:
```json
{
  "name": "sentinel-agent",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/react": "^19.2.13",
    "@types/react-dom": "^19.2.3",
    "cors": "^2.8.6",
    "dotenv": "^17.2.4",
    "express": "^5.2.1",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "dev": "concurrently \"pnpm run server\" \"pnpm run client\"",
    "client": "vite",
    "server": "nodemon --exec ts-node --project server/tsconfig.json server/index.ts",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/node": "^16.18.126",
    "@vitejs/plugin-react": "^5.1.3",
    "concurrently": "^9.2.1",
    "nodemon": "^3.1.11",
    "ts-node": "^10.9.2",
    "vite": "^7.3.1",
    "vite-plugin-pwa": "^1.2.0"
  }
}
```

### 1.3. Install Dependencies
```bash
pnpm install
```

**NOTE**: This project uses pnpm for faster builds and better dependency management. If you don't have pnpm installed:
```bash
npm install -g pnpm
```

---

## STEP 2: Create Configuration Files

### 2.1. Create tsconfig.json (Frontend)
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["vite/client", "vite-plugin-pwa/client"]
  },
  "include": ["src"]
}
```

### 2.2. Create vite.config.ts
```typescript
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo192.png', 'logo512.png'],
      manifest: {
        short_name: 'Sentinel',
        name: 'Sentinel Agent System',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          },
          {
            src: 'logo192.png',
            type: 'image/png',
            sizes: '192x192'
          },
          {
            src: 'logo512.png',
            type: 'image/png',
            sizes: '512x512'
          }
        ],
        start_url: '.',
        display: 'standalone',
        theme_color: '#000000',
        background_color: '#ffffff'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        clientsClaim: true,
        skipWaiting: true
      }
    })
  ],
  resolve: {
    alias: {
      src: "/src",
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

---

## STEP 3: Create Backend Server

### 3.1. Create server Directory
```bash
mkdir server
mkdir server/public
```

### 3.2. Create server/tsconfig.json
```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "outDir": "../build",
    "noEmit": false
  },
  "include": ["./**/*"]
}
```

### 3.3. Create server/index.ts
**NOTE**: Copy the exact content from:
`c:\Users\DELL\Downloads\sentinel-agent\server\index.ts`

This file contains the Express server setup with CORS configuration.

### 3.4. Create server/routes.ts
**NOTE**: Copy the exact content from:
`c:\Users\DELL\Downloads\sentinel-agent\server\routes.ts`

This file contains all API routes for the application.

---

## STEP 4: Create HTML Template

### 4.1. Create index.html
**NOTE**: Copy the exact content from:
`c:\Users\DELL\Downloads\sentinel-agent\index.html`

This file contains:
- Complete SEO meta tags (Open Graph, Twitter Card)
- Google Analytics integration
- Techbridge branding
- PWA meta tags
- Font preconnect links

**CRITICAL**: The HTML must include all meta tags for:
- SEO optimization
- Social media sharing
- Geographic targeting
- Google Analytics (gtag.js)
- Favicons and Apple touch icons

---

## STEP 5: Create Styles

### 5.1. Create src/index.css
```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
```

### 5.2. Create src/App.css
**NOTE**: Copy the exact content from:
`c:\Users\DELL\Downloads\sentinel-agent\src\App.css`

This contains:
- Dark theme gradient backgrounds
- Glassmorphism panel styles
- Animation keyframes
- Responsive grid layouts
- Dashboard component styles

---

## STEP 6: Create React Components

### 6.1. Create src Directory Structure
```bash
mkdir src
mkdir src/components
```

### 6.2. Create src/vite-env.d.ts
```typescript
/// <reference types="vite/client" />
```

### 6.3. Create src/components/NotificationContainer.tsx
**NOTE**: Copy the exact content from:
`c:\Users\DELL\Downloads\sentinel-agent\src\components\NotificationContainer.tsx`

### 6.4. Create src/App.tsx
**NOTE**: Copy the exact content from:
`c:\Users\DELL\Downloads\sentinel-agent\src\App.tsx`

This file contains:
- Main application component
- Agent health monitoring
- Notification system integration
- Dashboard UI layout

---

## STEP 7: Create Supporting Files

### 7.1. Create src/index.tsx
**NOTE**: Copy the exact content from:
`c:\Users\DELL\Downloads\sentinel-agent\src\index.tsx`

### 7.2. Create src/reportWebVitals.ts
```typescript
import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
```

### 7.3. Create src/setupTests.ts
```typescript
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
```

### 7.4. Create src/App.test.tsx
```typescript
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

---

## STEP 8: Create Public Assets

### 8.1. Create public Directory
```bash
mkdir public
```

### 8.2. Add Required Assets
- `public/favicon.ico` - TUC logo icon
- `public/logo192.png` - 192x192 logo
- `public/logo512.png` - 512x512 logo
- `src/logo.svg` - React logo SVG

**NOTE**: Copy these from the source project at:
`c:\Users\DELL\Downloads\sentinel-agent\public\`

---

## STEP 9: Create Additional Config Files

### 9.1. Create .gitignore
```gitignore
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build
/dist

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

### 9.2. Create pnpm-workspace.yaml (Optional)
```yaml
packages:
  - '.'
```

---

## STEP 10: Build and Verify

### 10.1. Run Development Server
```bash
pnpm run dev
```

**VERIFY**: 
- Backend server starts on port (check console)
- Frontend starts on http://localhost:3000
- Both run concurrently

### 10.2. Build for Production
```bash
pnpm run build
```

**VERIFY**: Output shows:
- TypeScript compilation successful
- Vite build successful
- `dist/` folder created
- PWA manifest generated
- Service worker files created

### 10.3. Test Production Build
```bash
pnpm run preview
```

**VERIFY**: App works correctly in production mode

---

## STEP 11: Final Verification Checklist

- [ ] Frontend renders dashboard correctly
- [ ] Backend API endpoints respond
- [ ] Agent health monitoring works
- [ ] Notification system functional
- [ ] PWA install prompt appears
- [ ] Service worker registered
- [ ] All API routes functional
- [ ] No console errors
- [ ] Dark theme gradient displays correctly
- [ ] Glassmorphism effects visible

---

## ARCHITECTURE NOTES

### Frontend
- React 19.2.4 with TypeScript
- Vite 7.3.1 for build and dev server
- PWA support via vite-plugin-pwa
- Component-based architecture
- Notification system for user feedback

### Backend
- Node.js + Express 5.2.1
- TypeScript with ts-node
- CORS enabled for API access
- RESTful API routes
- Runs concurrently with frontend

### Key Features
- Full-stack architecture (React + Node.js)
- Progressive Web App (installable)
- Comprehensive SEO optimization
- Google Analytics integration
- Real-time agent health monitoring
- Responsive dashboard UI
- Dark theme with glassmorphism

---

## NOTES FOR MODEL EXECUTION

1. **Do NOT modify** configuration values (theme colors, URLs, analytics IDs)
2. **Copy exact content** for referenced files
3. **Verify after each step** before proceeding
4. **Use pnpm** (not npm or yarn) for faster builds
5. **Both frontend and backend** must run together
6. **Server files** are in `server/` directory
7. **Frontend files** are in `src/` directory

## DEPLOYMENT

### Ubuntu Server Deployment

An Ubuntu server environment is already available for self-deployment.

#### Prerequisites
- Ubuntu 20.04+ or 22.04 LTS
- Node.js 18+ installed
- pnpm installed globally
- PM2 (optional, for process management)

#### Deployment Steps

1. **Clone/Copy project to server**
```bash
scp -r sentinel-agent user@server:/var/www/
```

2. **Install dependencies**
```bash
cd /var/www/sentinel-agent
pnpm install
```

3. **Build for production**
```bash
pnpm run build
```

4. **Start backend server with PM2**
```bash
pm2 start server/index.ts --name sentinel-backend --interpreter ts-node
```

5. **Serve frontend with nginx or serve**
```bash
# Option 1: Using serve
pm2 serve dist 3000 --name sentinel-frontend --spa

# Option 2: Using nginx (recommended)
# Configure nginx to serve dist/ folder
```

#### Environment Variables
Create `.env` file:
```bash
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://yourdomain.com
```

#### SSL/HTTPS Setup
```bash
sudo certbot --nginx -d yourdomain.com
```

## SUCCESS CRITERIA

The application is successfully recreated when:
1. Both frontend and backend start with `pnpm run dev`
2. Production build completes with `pnpm run build`
3. All API endpoints respond correctly
4. PWA is installable
5. Dashboard renders with correct styling
6. Notification system works
7. No build or runtime errors
8. Can be deployed to Ubuntu server successfully
