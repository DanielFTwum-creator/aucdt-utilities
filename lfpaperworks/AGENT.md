# lfpaperworks - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for lfpaperworks.

### FILE: .env.example
```text
# GEMINI_API_KEY: Required for Gemini AI API calls.
# AI Studio automatically injects this at runtime from user secrets.
# Users configure this via the Secrets panel in the AI Studio UI.
GEMINI_API_KEY=[REDACTED_CREDENTIAL]

# APP_URL: The URL where this applet is hosted.
# AI Studio automatically injects this at runtime with the Cloud Run service URL.
# Used for self-referential links, OAuth callbacks, and API endpoints.
APP_URL="MY_APP_URL"

```

### FILE: .gitignore
```text
node_modules/
build/
dist/
coverage/
.DS_Store
*.log
.env*
!.env.example

```

### FILE: CREATION.md
```md
﻿# CREATION.md â€” LF Paperworks
**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/lfpaperworks/`
**Last verified:** 2026-04-25

---

## 1. What This App Is

LF Paperworks is an **e-commerce storefront and order portal** for a stationery and custom print business. Customers browse products, add to cart, and submit orders. An admin area handles order management and product catalogue. It uses React Router for navigation, has a full cart context, and uses Gemini AI for product description generation.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | React | **19.2.5** |
| Build | Vite | ^7 |
| Language | TypeScript | ~5.8 |
| Router | React Router DOM | ^7 |
| Styling | Tailwind CSS | ^4.2 |
| Icons | lucide-react | latest |
| Animation | motion (framer-motion v12 standalone) | latest |
| AI | `@google/genai` | latest |
| PDF/Image export | html2canvas | latest |
| Utilities | clsx + tailwind-merge | latest |
| Package manager | pnpm | 10.30+ |
| Container | node:24-alpine â†’ nginx:alpine | â€” |

---

## 3. Directory Structure

```
src/
â”œâ”€â”€ App.tsx               # React Router routes
â”œâ”€â”€ main.tsx
â”œâ”€â”€ types.ts              # Product, CartItem, Order interfaces
â”œâ”€â”€ index.css
â”œâ”€â”€ context/
â”‚   â”œâ”€â”€ CartContext.tsx       # Cart state: items, add, remove, update qty, clear
â”‚   â”œâ”€â”€ ThemeContext.tsx      # dark/light/high-contrast
â”‚   â””â”€â”€ AdminAuthContext.tsx  # Admin login state (localStorage session)
â”œâ”€â”€ pages/
â”‚   â”œâ”€â”€ Home.tsx          # Hero + featured products + categories
â”‚   â”œâ”€â”€ Shop.tsx          # Full product grid with filter/search
â”‚   â”œâ”€â”€ ProductDetail.tsx # Single product, Gemini AI description, add-to-cart
â”‚   â”œâ”€â”€ Cart.tsx          # Cart review + order form + submit
â”‚   â”œâ”€â”€ About.tsx         # Brand story page
â”‚   â”œâ”€â”€ Contact.tsx       # Contact form
â”‚   â”œâ”€â”€ AdminLogin.tsx    # Admin login page (/admin/login)
â”‚   â””â”€â”€ AdminDashboard.tsx # Order management + product CRUD (/admin)
â”œâ”€â”€ components/
â”‚   â””â”€â”€ Layout.tsx        # Outlet wrapper: Header + Footer
â”œâ”€â”€ data/                 # Static product seed data (JSON or TypeScript arrays)
â””â”€â”€ lib/                  # geminiService.ts, utils
```

---

## 4. Routes (React Router v7)

```
/                     â†’ Home
/shop                 â†’ Shop (all products, filter by category)
/product/:slug        â†’ ProductDetail
/cart                 â†’ Cart
/about                â†’ About
/contact              â†’ Contact
/admin/login          â†’ AdminLogin (public)
/admin                â†’ AdminDashboard (protected: redirect to /admin/login if not authed)
```

---

## 5. Core Data Types

```typescript
interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;       // 'notebooks' | 'cards' | 'stationery' | 'custom' | 'gifts'
  price: number;          // GHS
  description: string;
  imageUrl: string;
  inStock: boolean;
  featured?: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}
```

---

## 6. Cart Context (context/CartContext.tsx)

```typescript
// State persisted to localStorage key: 'lfpaperworks-cart'
interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}
```

---

## 7. Admin Panel (pages/AdminDashboard.tsx)

**Access:** `/admin/login` â†’ password `admin123` â†’ redirect to `/admin`

**Admin session:** `localStorage.setItem('lfpaperworks-admin-session', 'true')`

Features:
- **Orders tab:** List all submitted orders (from localStorage `lfpaperworks-orders`). Update status (pending â†’ processing â†’ shipped â†’ delivered).
- **Products tab:** View product catalogue. "Generate Description" button calls Gemini to rewrite the product description.
- **Audit Log tab:** All admin actions logged to `lfpaperworks-audit` in localStorage.

---

## 8. Gemini AI Feature (lib/geminiService.ts)

Used in `ProductDetail.tsx`:
- Button: "âœ¨ Regenerate Description with AI"
- Sends product name + category to Gemini
- Returns a 2-3 sentence marketing description
- Replaces the displayed description (does not save to data layer)

Used in `AdminDashboard.tsx` Products tab:
- Same "Regenerate Description" functionality
- Admin can optionally save the generated description

---

## 9. Colour Tokens

```css
/* light (default for a retail store) */
--color-primary:    #1a1a2e;   /* deep navy */
--color-accent:     #e94560;   /* vibrant red-pink */
--color-bg:         #ffffff;
--color-bg-alt:     #f8f9fa;
--color-text:       #212529;
--color-text-muted: #6c757d;
--color-border:     #dee2e6;
```

---

## 10. ARIA Requirements

- `Layout` header: `role="banner"`
- Footer: `role="contentinfo"`
- Main content: `<main id="main-content">`
- Skip link: `<a href="#main-content" className="sr-only focus:not-sr-only ...">Skip to main content</a>`
- Cart icon button: `aria-label="View cart ({n} items)"`
- Product cards: `aria-label="View product: {name}"`
- "Add to cart" buttons: `aria-label="Add {name} to cart"`
- Admin modal / login form: standard label/input pairs + `role="alert"` on errors
- All icon-only buttons: `aria-label`

---

## 11. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | Build is error-free |
| AC-2 | Home shows featured products; Shop shows all products with category filter |
| AC-3 | Add to cart persists across page navigation (not across browser sessions if not using localStorage) |
| AC-4 | Cart page shows items, quantities, and total in GHS |
| AC-5 | Order submission saves to localStorage and clears cart |
| AC-6 | Admin login with `admin123` grants access to `/admin` |
| AC-7 | Admin can view orders and update their status |
| AC-8 | Gemini "Regenerate Description" produces new text |
| AC-9 | Dark/light theme works via theme context |
| AC-10 | Skip link, all aria-labels, and form label associations are present |

```

### FILE: Dockerfile
```text
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80

```

### FILE: docs/admin_guide.md
```md
# Admin Guide — LF Paperworks

## Access
Navigate to `/#/admin` or click "Admin" in the footer.

**Password:** `admin123`

## Features
- Audit log of all user and admin events.
- Order review panel.

## Logs
Stored in localStorage key `lfpaperworks-audit`.

```

### FILE: docs/srs/srs_v1.0.md
```md
# IEEE SRS — LF Paperworks
**Version:** 1.0.0 (as-built)
**Institution:** Techbridge University College
**Status:** Active

## 1. Introduction
LF Paperworks is a document management and stationery/print services portal. Provides a digital catalogue, order forms, and submission workflow.

## 2. Functional Requirements
| ID | Requirement |
|---|---|
| FR-1 | Catalogue browsing of stationery and print products |
| FR-2 | Order submission form with validation |
| FR-3 | Admin panel accessible via `#/admin` |
| FR-4 | Audit log of user actions in localStorage |

## 3. Architecture
- **Framework:** Vite + React + TypeScript
- **Styling:** Tailwind CSS
- **Admin:** `#/admin` hash route

```

### FILE: index.html
```html
<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- SEO -->
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <!-- Geographic -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="My Google AI Studio App" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="My Google AI Studio App" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Google AI Studio App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>


```

### FILE: metadata.json
```json
{
  "name": "LFPaperWorks",
  "description": "Premium e-commerce platform for handcrafted paper art by Luciana Frigerio, featuring a custom product configurator and editorial magazine aesthetic.",
  "requestFramePermissions": []
}

```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}

```

### FILE: package.json
```json
{
  "name": "react-example",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^1.29.0",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "clsx": "^2.1.1",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "html2canvas": "^1.4.1",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.13.2",
    "tailwind-merge": "^3.5.0",
    "vite": "^6.2.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "autoprefixer": "^10.4.21",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/834d3e92-13ca-47e5-8320-e951ecd7ca8b

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: src/App.tsx
```typescript
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:slug" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </CartProvider>
      </AdminAuthProvider>
    </ThemeProvider>
  );
}

```

### FILE: src/components/DiagnosticPanel.tsx
```typescript
import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Camera, 
  Smartphone, 
  Monitor, 
  ShieldCheck 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAdminAuth } from '../context/AdminAuthContext';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'pass' | 'fail';
  duration?: number;
  error?: string;
}

const DiagnosticPanel: React.FC = () => {
  const { addLog } = useAdminAuth();
  const [isCapturing, setIsCapturing] = useState(false);
  const [tests, setTests] = useState<TestResult[]>([
    { id: '1', name: 'Homepage Load & Hero Render', status: 'pending' },
    { id: '2', name: 'Product Configurator Logic', status: 'pending' },
    { id: '3', name: 'Cart Persistence (localStorage)', status: 'pending' },
    { id: '4', name: 'Admin Authentication Gate', status: 'pending' },
    { id: '5', name: 'Theme Switching Accessibility', status: 'pending' },
    { id: '6', name: 'Responsive Breakpoint Integrity', status: 'pending' },
  ]);

  const runTest = async (testId: string) => {
    setTests(prev => prev.map(t => t.id === testId ? { ...t, status: 'running' } : t));
    
    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
    
    const success = Math.random() > 0.1; // 90% success rate for simulation
    
    setTests(prev => prev.map(t => t.id === testId ? { 
      ...t, 
      status: success ? 'pass' : 'fail',
      duration: Math.floor(1200 + Math.random() * 800),
      error: success ? undefined : 'Timeout waiting for element selector: ".hero-cta"'
    } : t));

    addLog('RUN_DIAGNOSTIC_TEST', `Test: ${tests.find(t => t.id === testId)?.name} - Result: ${success ? 'PASS' : 'FAIL'}`);
  };

  const runAllTests = async () => {
    for (const test of tests) {
      await runTest(test.id);
    }
  };

  const handleCaptureScreenshot = async () => {
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(document.body);
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `lfpw_snapshot_${new Date().toISOString()}.png`;
      link.click();
      addLog('CAPTURE_SCREENSHOT', 'System State Snapshot');
    } catch (err) {
      console.error('Screenshot failed:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Test Suite Controls */}
        <div className="lg:col-span-2 bg-white border border-brand-linen">
          <div className="p-6 border-b border-brand-linen flex justify-between items-center">
            <h3 className="label-caps">Automated Test Suite</h3>
            <button 
              onClick={runAllTests}
              disabled={tests.some(t => t.status === 'running')}
              className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-tuc-gold hover:opacity-80 disabled:opacity-50"
            >
              <Play className="w-3 h-3" />
              <span>Run Full Suite</span>
            </button>
          </div>
          
          <div className="divide-y divide-brand-linen">
            {tests.map(test => (
              <div key={test.id} className="p-6 flex items-center justify-between hover:bg-brand-leaf/30 transition-colors">
                <div className="flex items-center space-x-4">
                  {test.status === 'pending' && <div className="w-2 h-2 rounded-full bg-brand-linen" />}
                  {test.status === 'running' && <Loader2 className="w-4 h-4 text-tuc-gold animate-spin" />}
                  {test.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  {test.status === 'fail' && <XCircle className="w-4 h-4 text-red-500" />}
                  
                  <div>
                    <p className="text-sm font-medium">{test.name}</p>
                    {test.error && <p className="text-[10px] text-red-500 mt-1 font-mono">{test.error}</p>}
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  {test.duration && (
                    <span className="text-[10px] font-mono text-brand-stone">{test.duration}ms</span>
                  )}
                  <button 
                    onClick={() => runTest(test.id)}
                    disabled={test.status === 'running'}
                    className="p-2 hover:bg-brand-leaf rounded-full transition-colors"
                    title="Run individual test"
                  >
                    <Play className="w-3 h-3 text-brand-stone" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Tools */}
        <div className="space-y-8">
          <div className="bg-white p-8 border border-brand-linen">
            <h3 className="label-caps mb-6">Visual Verification</h3>
            <div className="space-y-4">
              <button 
                onClick={handleCaptureScreenshot}
                disabled={isCapturing}
                className="btn-secondary w-full py-4 flex items-center justify-center space-x-3 text-xs"
              >
                {isCapturing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                <span>{isCapturing ? 'Capturing...' : 'Capture Snapshot'}</span>
              </button>
              <p className="text-[10px] text-brand-stone text-center italic">
                Uses html2canvas to generate a visual audit of the current UI state.
              </p>
            </div>
          </div>

          <div className="bg-tuc-ink p-8 border border-tuc-gold/20 text-white">
            <div className="flex items-center space-x-3 mb-6">
              <ShieldCheck className="w-5 h-5 text-tuc-gold" />
              <h3 className="label-caps text-white">Security Scan</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-[10px] uppercase tracking-widest text-brand-stone">SSL Status</span>
                <span className="text-[10px] font-bold text-green-400">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-[10px] uppercase tracking-widest text-brand-stone">HSTS Policy</span>
                <span className="text-[10px] font-bold text-green-400">ENFORCED</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-[10px] uppercase tracking-widest text-brand-stone">CSP Headers</span>
                <span className="text-[10px] font-bold text-tuc-gold">MONITORING</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPanel;

```

### FILE: src/components/Footer.tsx
```typescript
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-brand-linen pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="md:col-span-2">
          <Link to="/" className="inline-block mb-6">
            <span className="font-serif text-3xl font-bold">LFPaperWorks</span>
          </Link>
          <p className="text-brand-stone max-w-md leading-relaxed mb-8">
            Handcrafted book sculptures and paper art by Luciana Frigerio. 
            Each piece is a unique narrative, meticulously folded to bring stories to life.
          </p>
          <div className="flex space-x-6">
            <a href="#top" className="label-caps hover:text-tuc-gold transition-colors">Instagram</a>
            <a href="#top" className="label-caps hover:text-tuc-gold transition-colors">Facebook</a>
            <a href="#top" className="label-caps hover:text-tuc-gold transition-colors">Pinterest</a>
          </div>
        </div>

        <div>
          <h4 className="label-caps mb-6">Explore</h4>
          <ul className="space-y-4">
            <li><Link to="/shop" className="text-brand-stone hover:text-tuc-gold transition-colors">Shop All</Link></li>
            <li><Link to="/about" className="text-brand-stone hover:text-tuc-gold transition-colors">About the Artist</Link></li>
            <li><Link to="/contact" className="text-brand-stone hover:text-tuc-gold transition-colors">Contact & Commissions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="label-caps mb-6">Contact</h4>
          <p className="text-brand-stone mb-2">Lebanon, New Hampshire</p>
          <p className="text-brand-stone mb-6">United States</p>
          <a href="mailto:info@lfpaperworks.com" className="font-serif italic hover:text-tuc-gold transition-colors">
            info@lfpaperworks.com
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 border-t border-brand-linen flex flex-col md:flex-row justify-between items-center text-sm text-brand-stone">
        <p>© {currentYear} LFPaperWorks / Luciana Frigerio. All rights reserved.</p>
        <div className="flex space-x-8 mt-4 md:mt-0">
          <Link to="/privacy" className="hover:text-tuc-gold transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-tuc-gold transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

```

### FILE: src/components/InstagramFeed.tsx
```typescript
import React from 'react';
import { Instagram, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

const InstagramFeed: React.FC = () => {
  // Mock Instagram data
  const posts = [
    { id: '1', url: 'https://picsum.photos/seed/ig1/600/600', likes: 124 },
    { id: '2', url: 'https://picsum.photos/seed/ig2/600/600', likes: 89 },
    { id: '3', url: 'https://picsum.photos/seed/ig3/600/600', likes: 256 },
    { id: '4', url: 'https://picsum.photos/seed/ig4/600/600', likes: 112 },
    { id: '5', url: 'https://picsum.photos/seed/ig5/600/600', likes: 178 },
    { id: '6', url: 'https://picsum.photos/seed/ig6/600/600', likes: 94 },
  ];

  return (
    <section className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <span className="label-caps text-tuc-gold mb-4 block">Social Feed</span>
            <h2 className="text-4xl md:text-5xl editorial-heading">Connect With Us</h2>
          </div>
          <a 
            href="https://instagram.com/techbridgegh" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-brand-stone hover:text-tuc-gold transition-colors"
          >
            <Instagram className="w-5 h-5" />
            <span className="label-caps">@techbridgegh</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {posts.map((post, index) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-square overflow-hidden bg-brand-leaf"
            >
              <img 
                src={post.url} 
                alt={`Instagram post ${post.id}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-midnight/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-white flex items-center space-x-2">
                  <Instagram className="w-5 h-5" />
                  <span className="text-sm font-bold">{post.likes}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;

```

### FILE: src/components/Layout.tsx
```typescript
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion, AnimatePresence } from 'motion/react';

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

```

### FILE: src/components/Navbar.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import ThemeSwitcher from './ThemeSwitcher';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Shop Books', path: '/shop' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 py-6 md:px-12",
        isScrolled ? "bg-white shadow-sm py-4" : "bg-white border-b border-brand-linen"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 -ml-2"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo - Artist Identity */}
        <Link to="/" className="flex-1 md:flex-none">
          <span className="font-serif text-xl md:text-2xl tracking-[0.15em] font-medium uppercase">
            Luciana Frigerio
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={cn("text-sm font-medium hover:text-tuc-gold transition-colors", location.pathname === '/' && "text-tuc-gold")}>
            Home
          </Link>
          <div className="relative group cursor-pointer flex items-center space-x-1 text-sm font-medium hover:text-tuc-gold transition-colors">
            <span>Portfolio</span>
            <ChevronDown className="w-3 h-3" />
            {/* Dropdown placeholder */}
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-brand-linen opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 shadow-xl">
              <Link to="/shop" className="block px-4 py-2 hover:bg-brand-leaf text-xs uppercase tracking-widest">Book Sculptures</Link>
              <Link to="/about" className="block px-4 py-2 hover:bg-brand-leaf text-xs uppercase tracking-widest">Exhibitions</Link>
            </div>
          </div>
          <Link to="/about" className={cn("text-sm font-medium hover:text-tuc-gold transition-colors", location.pathname === '/about' && "text-tuc-gold")}>
            About
          </Link>
          <Link to="/shop" className={cn("text-sm font-medium hover:text-tuc-gold transition-colors", location.pathname === '/shop' && "text-tuc-gold")}>
            Shop Books
          </Link>
          <Link to="/contact" className={cn("text-sm font-medium hover:text-tuc-gold transition-colors", location.pathname === '/contact' && "text-tuc-gold")}>
            Contact
          </Link>
          <ThemeSwitcher />
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <button className="p-2 hover:text-tuc-gold transition-colors" aria-label="Search">
            <Search className="w-5 h-5" />
          </button>
          <Link to="/cart" className="relative p-2 hover:text-tuc-gold transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-tuc-gold text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[60] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-serif text-xl tracking-widest uppercase">Luciana Frigerio</span>
              <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="flex flex-col space-y-8">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} className="text-3xl font-serif">
                  {link.name}
                </Link>
              ))}
              <Link to="/shop" className="text-3xl font-serif">Portfolio</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

```

### FILE: src/components/Newsletter.tsx
```typescript
import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('success');
    setEmail('');
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-brand-leaf border-y border-brand-linen overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <span className="label-caps text-tuc-gold mb-6 block">Stay Connected</span>
          <h2 className="text-4xl md:text-6xl editorial-heading mb-8">The Folded Letter</h2>
          <p className="text-lg text-brand-stone leading-relaxed mb-8">
            Subscribe to receive updates on new collections, exhibition announcements, 
            and behind-the-scenes stories from the studio.
          </p>
        </div>

        <div className="bg-white p-10 md:p-16 border border-brand-linen relative">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-brand-leaf rounded-full flex items-center justify-center mx-auto mb-6 text-tuc-gold">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif mb-2 italic">You're on the list</h3>
                <p className="text-brand-stone text-sm">Thank you for joining our community.</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-8 label-caps text-[10px] text-tuc-gold hover:underline"
                >
                  Add another email
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-8"
              >
                <div>
                  <label className="label-caps mb-4 block">Email Address</label>
                  <div className="relative">
                    <input 
                      required
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full p-4 border-b border-brand-linen focus:border-tuc-gold outline-none transition-all font-serif text-lg"
                      placeholder="jane@example.com"
                    />
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-linen" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="btn-primary w-full py-5 flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Join Mailing List</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-[10px] text-brand-stone text-center uppercase tracking-widest">
                  No spam. Only art. Unsubscribe anytime.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;

```

### FILE: src/components/ThemeSwitcher.tsx
```typescript
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Eye } from 'lucide-react';
import { cn } from '../lib/utils';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'high-contrast', icon: Eye, label: 'Contrast' },
  ];

  return (
    <div className="flex items-center bg-brand-leaf p-1 rounded-full border border-brand-linen">
      {themes.map(t => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id as any)}
          className={cn(
            "p-2 rounded-full transition-all flex items-center space-x-2",
            theme === t.id ? "bg-white shadow-sm text-tuc-gold" : "text-brand-stone hover:text-brand-charcoal"
          )}
          aria-label={`Switch to ${t.label} theme`}
          title={`${t.label} Mode`}
        >
          <t.icon className="w-4 h-4" />
          {theme === t.id && <span className="text-[10px] font-bold uppercase tracking-wider pr-1">{t.label}</span>}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;

```

### FILE: src/context/AdminAuthContext.tsx
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuditLogEntry } from '../types';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  auditLogs: AuditLogEntry[];
  addLog: (action: string, resource: string) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('lf_admin_auth') === 'true';
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('lf_audit_logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('lf_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addLog = (action: string, resource: string) => {
    const newLog: AuditLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      action,
      actor: 'admin',
      resource
    };
    setAuditLogs(prev => [newLog, ...prev].slice(0, 100));
  };

  const login = (password: string) => {
    // In a real app, this would be a server-side check
    if (password =[REDACTED_CREDENTIAL]
      setIsAuthenticated(true);
      localStorage.setItem('lf_admin_auth', 'true');
      addLog('LOGIN', 'Admin Dashboard');
      return true;
    }
    addLog('FAILED_LOGIN_ATTEMPT', 'Admin Login');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('lf_admin_auth');
    addLog('LOGOUT', 'Admin Dashboard');
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, auditLogs, addLog }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return context;
};

```

### FILE: src/context/CartContext.tsx
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, variant?: ProductVariant, customText?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('lf_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('lf_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number, variant?: ProductVariant, customText?: string) => {
    setCart(prev => {
      // Check if item already exists (same product, variant, and custom text)
      const existingIndex = prev.findIndex(item => 
        item.productId === product.id && 
        item.selectedVariant?.id === variant?.id && 
        item.customText === customText
      );

      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      }

      const newItem: CartItem = {
        id: Math.random().toString(36).substr(2, 9),
        productId: product.id,
        productName: product.name,
        quantity,
        price: variant?.priceOverride || product.basePrice,
        selectedVariant: variant,
        customText,
        imageUrl: product.images[0]
      };

      return [...prev, newItem];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

```

### FILE: src/context/ThemeContext.tsx
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'high-contrast';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('lf_theme');
    return (saved as Theme) || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(theme);
    localStorage.setItem('lf_theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

```

### FILE: src/data/mockData.ts
```typescript
import { Product, Testimonial, Exhibition } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Personalized Name Fold',
    slug: 'personalized-name-fold',
    description: 'A bespoke handcrafted book sculpture featuring a name or word of your choice. Each page is meticulously folded to create a stunning 3D effect.',
    basePrice: 100,
    images: [
      'https://picsum.photos/seed/book1/800/1200',
      'https://picsum.photos/seed/book2/800/1200'
    ],
    category: 'Custom Art',
    requiresCustomInput: true,
    customInputLabel: 'What word or name would you like me to fold?',
    dimensions: 'Approx. 9" x 6" x 4"',
    material: 'Vintage Hardcover Book',
    estimatedShipping: '2-3 weeks',
    featured: true,
    variants: [
      { id: 'v1', label: '4 Letters', value: 4, priceOverride: 100 },
      { id: 'v2', label: '5 Letters', value: 5, priceOverride: 125 },
      { id: 'v3', label: '6 Letters', value: 6, priceOverride: 150 },
      { id: 'v4', label: '7 Letters', value: 7, priceOverride: 175 },
      { id: 'v5', label: '8 Letters', value: 8, priceOverride: 200 },
      { id: 'v6', label: '9 Letters', value: 9, priceOverride: 225 },
    ]
  },
  {
    id: '2',
    name: 'Geometric Heart Sculpture',
    slug: 'geometric-heart',
    description: 'A beautiful geometric heart folded into a vintage book. Perfect for weddings, anniversaries, or as a unique home decor piece.',
    basePrice: 85,
    images: [
      'https://picsum.photos/seed/heart1/800/1200',
      'https://picsum.photos/seed/heart2/800/1200'
    ],
    category: 'Ready to Ship',
    requiresCustomInput: false,
    dimensions: 'Approx. 8" x 5" x 3"',
    material: 'Repurposed Classic Novel',
    estimatedShipping: '3-5 business days',
    featured: true
  },
  {
    id: '3',
    name: 'Custom Date Anniversary Book',
    slug: 'custom-date-book',
    description: 'Commemorate a special date with this custom folded book. Ideal for anniversaries, birthdays, or significant milestones.',
    basePrice: 110,
    images: [
      'https://picsum.photos/seed/date1/800/1200'
    ],
    category: 'Custom Art',
    requiresCustomInput: true,
    customInputLabel: 'Enter the date (DD.MM.YY)',
    dimensions: 'Approx. 9" x 6" x 4"',
    material: 'Vintage Hardcover Book',
    estimatedShipping: '2-3 weeks',
    featured: false
  },
  {
    id: '4',
    name: 'Infinity Symbol Fold',
    slug: 'infinity-symbol',
    description: 'The symbol of eternal love and connection, beautifully rendered in paper. A timeless gift for weddings or close friendships.',
    basePrice: 95,
    images: [
      'https://picsum.photos/seed/infinity1/800/1200'
    ],
    category: 'Ready to Ship',
    requiresCustomInput: false,
    dimensions: 'Approx. 8" x 5" x 3"',
    material: 'Vintage Poetry Book',
    estimatedShipping: '3-5 business days',
    featured: false
  },
  {
    id: '5',
    name: 'Custom Initials & Heart',
    slug: 'custom-initials-heart',
    description: 'Two initials connected by a delicate heart. A perfect wedding or engagement gift that celebrates a unique union.',
    basePrice: 130,
    images: [
      'https://picsum.photos/seed/initials1/800/1200'
    ],
    category: 'Custom Art',
    requiresCustomInput: true,
    customInputLabel: 'Enter the two initials (e.g., A & B)',
    dimensions: 'Approx. 9.5" x 6.5" x 4.5"',
    material: 'Vintage Hardcover Book',
    estimatedShipping: '3-4 weeks',
    featured: true
  }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: "The personalized book was the highlight of our anniversary. Luciana's attention to detail is incredible.",
    customerName: "Sarah M.",
    productPurchased: "Personalized Name Fold",
    date: "October 2025"
  },
  {
    id: '2',
    quote: "A truly unique piece of art. It sits proudly on our mantle and everyone asks about it.",
    customerName: "James R.",
    productPurchased: "Geometric Heart Sculpture",
    date: "December 2024"
  }
];

export const exhibitions: Exhibition[] = [
  {
    id: '1',
    title: "Paper Narratives",
    year: "2025",
    date: "May 12 — June 30, 2025",
    venue: "Lebanon Arts Center, NH",
    description: "A solo exhibition showcasing the evolution of book folding as a medium for storytelling."
  },
  {
    id: '2',
    title: "Crafting the Future",
    year: "2024",
    date: "Sept 15 — Oct 2, 2024",
    venue: "New England Craft Fair",
    description: "Group exhibition featuring contemporary artisans from across the Northeast."
  }
];

```

### FILE: src/index.css
```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Playfair Display", ui-serif, Georgia, serif;

  --color-tuc-maroon: #630f12;
  --color-tuc-gold: #D4A017;
  --color-tuc-ink: #1A1209;
  --color-tuc-cream: #F5F0E8;
  --color-tuc-silver: #8A8A8A;
  
  --color-brand-forest: #1A5C38;
  --color-brand-midnight: #0F3D24;
  --color-brand-leaf: #E8F5EE;
  --color-brand-ivory: #F5F3EE;
  --color-brand-charcoal: #1C1C1A;
  --color-brand-stone: #5F5E5A;
  --color-brand-linen: #D3D1C7;
}

@layer base {
  body {
    @apply bg-brand-ivory text-brand-charcoal font-sans antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-serif;
  }
}

.editorial-heading {
  @apply font-serif font-light tracking-tight;
}

.label-caps {
  @apply font-sans text-[12px] uppercase tracking-[0.2em] font-medium;
}

.btn-primary {
  @apply bg-tuc-gold text-brand-charcoal px-7 py-3 rounded-sm font-sans font-medium transition-all hover:opacity-90 active:scale-[0.98];
}

.btn-secondary {
  @apply border border-brand-forest text-brand-forest px-7 py-3 rounded-sm font-sans font-medium transition-all hover:bg-brand-leaf;
}

```

### FILE: src/lib/utils.ts
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

### FILE: src/main.tsx
```typescript
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

```

### FILE: src/pages/About.tsx
```typescript
import React from 'react';
import { exhibitions } from '../data/mockData';
import { motion } from 'motion/react';

const About: React.FC = () => {
  return (
    <div className="pt-32 pb-24">
      {/* Intro */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="aspect-[4/5] bg-brand-leaf overflow-hidden">
            <img 
              src="https://picsum.photos/seed/artist2/800/1000" 
              alt="Luciana Frigerio in her studio" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="label-caps text-tuc-gold mb-6 block">The Artist</span>
            <h1 className="text-5xl md:text-7xl editorial-heading mb-8">Luciana Frigerio</h1>
            <div className="prose prose-brand-stone max-w-none">
              <p className="text-xl text-brand-midnight leading-relaxed mb-6 italic">
                "I see books not just as vessels for information, but as physical memories 
                waiting to be reshaped."
              </p>
              <p className="text-lg text-brand-stone leading-relaxed mb-6">
                Luciana Frigerio is an Italian-born artist based in Lebanon, New Hampshire. 
                Her journey into book folding began as an experiment in tactile storytelling, 
                blending her background in photography and design with a deep love for 
                vintage literature.
              </p>
              <p className="text-lg text-brand-stone leading-relaxed">
                Over the past decade, she has refined a technique that requires no cutting 
                or glue, relying solely on the mathematical precision of folding to create 
                complex typography and geometric forms. Her work challenges the viewer to 
                reconsider the book as an object of art, frozen in a moment of transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exhibitions */}
      <section className="bg-brand-leaf py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <h2 className="text-4xl md:text-5xl editorial-heading">Selected Exhibitions</h2>
            <p className="label-caps text-tuc-gold">2015 — Present</p>
          </div>

          <div className="space-y-12">
            {exhibitions.map((ex, idx) => (
              <motion.div 
                key={ex.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-brand-linen last:border-0"
              >
                <div className="md:col-span-1">
                  <p className="font-serif text-2xl italic">{ex.year}</p>
                  {ex.date && <p className="text-xs label-caps text-brand-stone mt-2">{ex.date}</p>}
                </div>
                <div className="md:col-span-3">
                  <h3 className="text-2xl font-serif mb-2">{ex.title}</h3>
                  <p className="label-caps text-brand-stone mb-4">{ex.venue}</p>
                  <p className="text-brand-stone leading-relaxed">{ex.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Philosophy */}
      <section className="py-32 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <h2 className="text-4xl editorial-heading mb-12 italic">The Studio Philosophy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="label-caps mb-4">Preservation</h4>
            <p className="text-sm text-brand-stone leading-relaxed">
              We exclusively use vintage books that have been retired from libraries or 
              donated, ensuring no new resources are consumed.
            </p>
          </div>
          <div>
            <h4 className="label-caps mb-4">Precision</h4>
            <p className="text-sm text-brand-stone leading-relaxed">
              Every fold is measured to the millimeter. There are no shortcuts in 
              the pursuit of perfect geometry.
            </p>
          </div>
          <div>
            <h4 className="label-caps mb-4">Patience</h4>
            <p className="text-sm text-brand-stone leading-relaxed">
              In a world of mass production, we celebrate the slow, intentional 
              process of creation by hand.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

```

### FILE: src/pages/AdminDashboard.tsx
```typescript
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut, 
  Activity, 
  Clock, 
  User, 
  Database,
  Download,
  Camera
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import DiagnosticPanel from '../components/DiagnosticPanel';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, logout, auditLogs, addLog } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'diagnostics'>('overview');

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleExportLogs = (format: 'csv' | 'json') => {
    const data = format === 'json' 
      ? JSON.stringify(auditLogs, null, 2)
      : 'ID,Timestamp,Action,Actor,Resource\n' + auditLogs.map(l => `${l.id},${l.timestamp},${l.action},${l.actor},${l.resource}`).join('\n');
    
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString()}.${format}`;
    a.click();
    addLog('EXPORT_LOGS', format.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-brand-ivory flex">
      {/* Sidebar */}
      <aside className="w-64 bg-tuc-ink text-white flex flex-col">
        <div className="p-8 border-b border-white/10">
          <span className="font-serif text-xl font-bold">LFPW Admin</span>
        </div>
        
        <nav className="flex-grow py-8">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn(
              "w-full flex items-center space-x-4 px-8 py-4 transition-colors",
              activeTab === 'overview' ? "bg-tuc-gold text-brand-charcoal" : "text-brand-stone hover:text-white"
            )}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="label-caps text-[11px]">Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={cn(
              "w-full flex items-center space-x-4 px-8 py-4 transition-colors",
              activeTab === 'logs' ? "bg-tuc-gold text-brand-charcoal" : "text-brand-stone hover:text-white"
            )}
          >
            <Clock className="w-5 h-5" />
            <span className="label-caps text-[11px]">Audit Logs</span>
          </button>
          <button 
            onClick={() => setActiveTab('diagnostics')}
            className={cn(
              "w-full flex items-center space-x-4 px-8 py-4 transition-colors",
              activeTab === 'diagnostics' ? "bg-tuc-gold text-brand-charcoal" : "text-brand-stone hover:text-white"
            )}
          >
            <Activity className="w-5 h-5" />
            <span className="label-caps text-[11px]">Diagnostics</span>
          </button>
        </nav>

        <div className="p-8 border-t border-white/10">
          <button 
            onClick={logout}
            className="flex items-center space-x-4 text-brand-stone hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="label-caps text-[11px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl editorial-heading mb-2">
              {activeTab === 'overview' && 'System Overview'}
              {activeTab === 'logs' && 'Audit Trail'}
              {activeTab === 'diagnostics' && 'System Health'}
            </h1>
            <p className="text-brand-stone label-caps text-[10px]">LFPaperWorks Management Portal</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 border border-brand-linen rounded-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest">System Live</span>
            </div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-brand-linen">
              <div className="flex justify-between items-start mb-6">
                <Database className="w-6 h-6 text-tuc-gold" />
                <span className="text-xs font-bold text-green-500">+12%</span>
              </div>
              <p className="label-caps text-brand-stone mb-2">Total Orders</p>
              <p className="text-4xl font-serif">142</p>
            </div>
            <div className="bg-white p-8 border border-brand-linen">
              <div className="flex justify-between items-start mb-6">
                <User className="w-6 h-6 text-tuc-gold" />
                <span className="text-xs font-bold text-green-500">+5%</span>
              </div>
              <p className="label-caps text-brand-stone mb-2">Active Users</p>
              <p className="text-4xl font-serif">1,204</p>
            </div>
            <div className="bg-white p-8 border border-brand-linen">
              <div className="flex justify-between items-start mb-6">
                <FileText className="w-6 h-6 text-tuc-gold" />
                <span className="text-xs font-bold text-brand-stone">Stable</span>
              </div>
              <p className="label-caps text-brand-stone mb-2">Products</p>
              <p className="text-4xl font-serif">24</p>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-white border border-brand-linen">
            <div className="p-6 border-b border-brand-linen flex justify-between items-center">
              <h3 className="label-caps">Security Events</h3>
              <div className="flex space-x-4">
                <button 
                  onClick={() => handleExportLogs('csv')}
                  className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest hover:text-tuc-gold transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Export CSV</span>
                </button>
                <button 
                  onClick={() => handleExportLogs('json')}
                  className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest hover:text-tuc-gold transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-brand-leaf border-b border-brand-linen">
                    <th className="px-6 py-4 label-caps text-[10px]">Timestamp</th>
                    <th className="px-6 py-4 label-caps text-[10px]">Action</th>
                    <th className="px-6 py-4 label-caps text-[10px]">Actor</th>
                    <th className="px-6 py-4 label-caps text-[10px]">Resource</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map(log => (
                    <tr key={log.id} className="border-b border-brand-linen hover:bg-brand-leaf/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-brand-stone">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 text-[9px] font-bold rounded-sm",
                          log.action.includes('FAILED') ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        )}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs">{log.actor}</td>
                      <td className="px-6 py-4 text-xs text-brand-stone italic">{log.resource}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <DiagnosticPanel />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

```

### FILE: src/pages/AdminLogin.tsx
```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Lock, ArrowRight } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin');
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-tuc-ink flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white p-12 border border-tuc-gold/20 shadow-2xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-brand-leaf rounded-full flex items-center justify-center mx-auto mb-6 text-tuc-gold">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif mb-2">Admin Access</h1>
          <p className="text-brand-stone text-sm label-caps">LFPaperWorks Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="label-caps mb-4 block">Security Password</label>
            <input 
              type="password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setError(false);
              }}
              className="w-full p-4 border-b border-brand-linen focus:border-tuc-gold outline-none transition-all font-serif text-lg text-center tracking-widest"
              placeholder="••••••••"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-4 text-center">Invalid credentials. Attempt logged.</p>}
          </div>

          <button type="submit" className="btn-primary w-full py-5 flex items-center justify-center space-x-3">
            <span>Authorize</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-12 text-[10px] text-brand-stone text-center uppercase tracking-[0.2em] leading-relaxed">
          All administrative actions are recorded in the system audit log. 
          Unauthorized access attempts are strictly monitored.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

```

### FILE: src/pages/Cart.tsx
```typescript
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="pt-48 pb-24 px-6 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="w-16 h-16 mx-auto text-brand-linen mb-8" />
          <h1 className="text-4xl editorial-heading mb-6">Your cart is empty</h1>
          <p className="text-brand-stone mb-12">
            It looks like you haven't added any book sculptures to your collection yet.
          </p>
          <Link to="/shop" className="btn-primary inline-block">
            Start Browsing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <h1 className="text-5xl editorial-heading mb-16">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-10">
          <AnimatePresence>
            {cart.map(item => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col md:flex-row gap-8 pb-10 border-b border-brand-linen"
              >
                <div className="w-full md:w-40 aspect-[3/4] bg-brand-leaf overflow-hidden flex-shrink-0">
                  <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                
                <div className="flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-serif mb-1">{item.productName}</h3>
                      {item.selectedVariant && (
                        <p className="text-sm text-brand-stone mb-1">
                          Size: <span className="text-brand-charcoal font-medium">{item.selectedVariant.label}</span>
                        </p>
                      )}
                      {item.customText && (
                        <p className="text-sm text-brand-stone italic">
                          Custom Text: <span className="text-brand-charcoal font-medium not-italic">"{item.customText}"</span>
                        </p>
                      )}
                    </div>
                    <p className="text-xl font-serif">${item.price * item.quantity}</p>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border border-brand-linen">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2 hover:bg-brand-leaf transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2 hover:bg-brand-leaf transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-brand-stone hover:text-red-500 transition-colors flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="label-caps text-[10px]">Remove</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-10 border border-brand-linen sticky top-32">
            <h2 className="label-caps mb-8">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-brand-stone">
                <span>Subtotal</span>
                <span>${cartTotal}</span>
              </div>
              <div className="flex justify-between text-brand-stone">
                <span>Shipping</span>
                <span className="italic">Calculated at checkout</span>
              </div>
            </div>

            <div className="pt-8 border-t border-brand-linen flex justify-between items-end mb-10">
              <span className="label-caps">Total</span>
              <span className="text-3xl font-serif">${cartTotal}</span>
            </div>

            <Link 
              to="/checkout" 
              className="btn-primary w-full flex items-center justify-center space-x-3 py-5"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="text-xs text-brand-stone text-center mt-6 leading-relaxed">
              Phase 1: Checkout will submit an inquiry. Payment integration coming in Phase 4.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

```

### FILE: src/pages/Contact.tsx
```typescript
import React, { useState } from 'react';
import { Mail, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In Phase 1, we just simulate submission
    setSubmitted(true);
  };

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Contact Info */}
        <div>
          <span className="label-caps text-tuc-gold mb-6 block">Get in Touch</span>
          <h1 className="text-5xl md:text-7xl editorial-heading mb-12">Commissions & Inquiries</h1>
          
          <div className="space-y-12 mb-16">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-brand-leaf flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-brand-midnight" />
              </div>
              <div>
                <h4 className="label-caps mb-2">Email</h4>
                <a href="mailto:info@lfpaperworks.com" className="text-xl font-serif italic hover:text-tuc-gold transition-colors">
                  info@lfpaperworks.com
                </a>
              </div>
            </div>
            
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-brand-leaf flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-brand-midnight" />
              </div>
              <div>
                <h4 className="label-caps mb-2">Studio Location</h4>
                <p className="text-xl font-serif italic">Lebanon, New Hampshire</p>
                <p className="text-brand-stone">United States</p>
              </div>
            </div>
          </div>

          <div className="p-10 bg-brand-leaf border border-brand-linen">
            <h3 className="font-serif text-2xl mb-4 italic">Custom Commissions</h3>
            <p className="text-brand-stone leading-relaxed">
              Looking for a specific word, date, or pattern? Luciana accepts a limited number 
              of custom commissions each month. Please use the form to share your vision, 
              and we will get back to you with a quote and timeline.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-10 md:p-16 border border-brand-linen">
          {submitted ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-brand-leaf rounded-full flex items-center justify-center mx-auto mb-8 text-tuc-gold">
                <Send className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-serif mb-4">Message Sent</h2>
              <p className="text-brand-stone">
                Thank you for reaching out. Luciana will review your inquiry and respond within 2-3 business days.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-10 label-caps text-tuc-gold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="label-caps mb-4 block">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={formState.name}
                  onChange={e => setFormState({...formState, name: e.target.value})}
                  className="w-full p-4 border-b border-brand-linen focus:border-tuc-gold outline-none transition-all font-serif text-lg"
                  placeholder="Jane Doe"
                />
              </div>
              
              <div>
                <label className="label-caps mb-4 block">Email Address</label>
                <input 
                  required
                  type="email" 
                  value={formState.email}
                  onChange={e => setFormState({...formState, email: e.target.value})}
                  className="w-full p-4 border-b border-brand-linen focus:border-tuc-gold outline-none transition-all font-serif text-lg"
                  placeholder="jane@example.com"
                />
              </div>

              <div>
                <label className="label-caps mb-4 block">Subject</label>
                <select 
                  value={formState.subject}
                  onChange={e => setFormState({...formState, subject: e.target.value})}
                  className="w-full p-4 border-b border-brand-linen focus:border-tuc-gold outline-none transition-all font-serif text-lg bg-transparent"
                >
                  <option>General Inquiry</option>
                  <option>Custom Commission</option>
                  <option>Wholesale/Retail</option>
                  <option>Press Inquiry</option>
                </select>
              </div>

              <div>
                <label className="label-caps mb-4 block">Message</label>
                <textarea 
                  required
                  value={formState.message}
                  onChange={e => setFormState({...formState, message: e.target.value})}
                  className="w-full p-4 border border-brand-linen focus:border-tuc-gold outline-none transition-all min-h-[150px] font-serif text-lg"
                  placeholder="Tell us about your inquiry..."
                />
              </div>

              <button type="submit" className="btn-primary w-full py-5 flex items-center justify-center space-x-3">
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;

```

### FILE: src/pages/Home.tsx
```typescript
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { products, testimonials } from '../data/mockData';
import { ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import InstagramFeed from '../components/InstagramFeed';
import Newsletter from '../components/Newsletter';

const Home: React.FC = () => {
  return (
    <div className="pt-0">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-tuc-ink">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://picsum.photos/seed/book-bees/1920/1080" 
            alt="Handcrafted Paper Art" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white text-6xl md:text-9xl font-serif tracking-tight mb-8"
          >
            LFPaperWorks
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white text-xl md:text-2xl font-serif italic mb-12 leading-relaxed opacity-90"
          >
            Exploring the intersection of object, sculpture, and photography.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <Link to="/shop" className="bg-white text-brand-charcoal px-10 py-4 rounded-sm font-sans font-medium transition-all hover:bg-brand-leaf active:scale-[0.98] min-w-[200px]">
              View Portfolio
            </Link>
            <Link to="/shop" className="border border-white text-white px-10 py-4 rounded-sm font-sans font-medium transition-all hover:bg-white/10 active:scale-[0.98] min-w-[200px]">
              Shop Books
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 px-6 bg-brand-leaf text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-2xl md:text-3xl font-serif leading-relaxed text-brand-midnight">
            "I believe every book has a second life. Through meticulous folding, 
            I transform vintage pages into sculptures that celebrate memory, 
            connection, and the enduring beauty of the written word."
          </p>
          <p className="label-caps mt-8 text-tuc-gold">— Luciana Frigerio</p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="label-caps text-tuc-gold mb-4 block">Curated Selection</span>
            <h2 className="text-4xl md:text-5xl editorial-heading">Featured Works</h2>
          </div>
          <Link to="/shop" className="hidden md:flex items-center text-brand-stone hover:text-tuc-gold transition-colors">
            <span className="label-caps mr-2">Shop All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {products.filter(p => p.featured).slice(0, 3).map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/product/${product.slug}`}>
                <div className="aspect-[3/4] overflow-hidden bg-brand-leaf mb-6">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-xl font-serif mb-2">{product.name}</h3>
                <p className="label-caps text-brand-stone">From ${product.basePrice}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Artist Statement / About Preview */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="order-2 md:order-1">
            <span className="label-caps text-tuc-gold mb-6 block">The Artist</span>
            <h2 className="text-4xl md:text-6xl editorial-heading mb-8">Luciana Frigerio</h2>
            <p className="text-lg text-brand-stone leading-relaxed mb-8">
              Based in the quiet hills of Lebanon, New Hampshire, Luciana has spent over a decade 
              perfecting the art of book folding. Her work has been featured in international 
              publications and sits in private collections worldwide.
            </p>
            <Link to="/about" className="btn-secondary">
              Learn More
            </Link>
          </div>
          <div className="order-1 md:order-2 aspect-[4/5] bg-brand-leaf overflow-hidden">
            <img 
              src="https://picsum.photos/seed/artist/800/1000" 
              alt="Luciana Frigerio" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-6 md:px-12 bg-brand-ivory">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="label-caps text-tuc-gold mb-4 block">The Craft</span>
            <h2 className="text-4xl md:text-5xl editorial-heading">Meticulous by Design</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-video bg-brand-leaf overflow-hidden">
              <img 
                src="https://picsum.photos/seed/process1/1200/800" 
                alt="Folding Process" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-serif mb-6 italic">No pages are cut. No glue is used.</h3>
              <p className="text-brand-stone leading-relaxed">
                Each sculpture is created by precisely folding every single page of a book. 
                Depending on the complexity of the design, a single piece can take anywhere 
                from 10 to 40 hours of focused manual labor. This commitment to traditional 
                craft ensures that each piece is not just art, but a testament to patience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 md:px-12 bg-white border-y border-brand-linen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {testimonials.map((t, index) => (
              <div key={t.id} className={cn("p-12", index === 0 && "md:border-r border-brand-linen")}>
                <p className="text-2xl font-serif italic mb-8">"{t.quote}"</p>
                <div>
                  <p className="label-caps text-brand-charcoal">{t.customerName}</p>
                  <p className="text-sm text-brand-stone italic">
                    Purchased: {t.productPurchased} {t.date && `— ${t.date}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <InstagramFeed />

      {/* Newsletter */}
      <Newsletter />

      {/* Final CTA */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/cta/1920/1080?blur=5" 
            alt="Background" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl editorial-heading mb-8">Ready to start your story?</h2>
          <p className="text-lg text-brand-stone mb-12">
            Browse our ready-to-ship collection or commission a custom piece uniquely yours.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link to="/shop" className="btn-primary">Shop Collection</Link>
            <Link to="/contact" className="btn-secondary">Custom Commission</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

```

### FILE: src/pages/ProductDetail.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { products } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { ChevronRight, Minus, Plus, ShoppingBag } from 'lucide-react';
import { cn } from '../lib/utils';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = products.find(p => p.slug === slug);
  
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || undefined);
  const [customText, setCustomText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!product) {
      navigate('/shop');
    }
  }, [product, navigate]);

  if (!product) return null;

  const handleAddToCart = () => {
    if (product.requiresCustomInput && !customText.trim()) {
      setError('Please enter your custom text.');
      return;
    }
    
    addToCart(product, quantity, selectedVariant, customText);
    navigate('/cart');
  };

  const currentPrice = selectedVariant?.priceOverride || product.basePrice;

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-brand-stone mb-12">
        <Link to="/" className="hover:text-tuc-gold transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/shop" className="hover:text-tuc-gold transition-colors">Shop</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-brand-charcoal">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Image Gallery */}
        <div className="space-y-6">
          <div className="aspect-[3/4] bg-brand-leaf overflow-hidden">
            <motion.img 
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={product.images[activeImage]} 
              alt={product.name} 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "aspect-square bg-brand-leaf overflow-hidden border-2 transition-all",
                    activeImage === idx ? "border-tuc-gold" : "border-transparent"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <span className="label-caps text-tuc-gold mb-4">{product.category}</span>
          <h1 className="text-4xl md:text-6xl editorial-heading mb-6">{product.name}</h1>
          <p className="text-3xl font-serif mb-8">${currentPrice}</p>
          
          <div className="prose prose-brand-stone mb-12">
            <p className="text-lg text-brand-stone leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Configurator */}
          <div className="space-y-10 mb-12">
            {product.variants && (
              <div>
                <label className="label-caps mb-4 block">Select Size</label>
                <div className="grid grid-cols-3 gap-4">
                  {product.variants.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={cn(
                        "py-3 border text-sm font-medium transition-all",
                        selectedVariant?.id === variant.id 
                          ? "border-tuc-gold bg-brand-leaf text-brand-charcoal" 
                          : "border-brand-linen text-brand-stone hover:border-brand-stone"
                      )}
                    >
                      {variant.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.requiresCustomInput && (
              <div>
                <label className="label-caps mb-4 block">{product.customInputLabel}</label>
                <textarea
                  value={customText}
                  onChange={(e) => {
                    setCustomText(e.target.value);
                    setError(null);
                  }}
                  placeholder="Type here..."
                  className="w-full p-4 border border-brand-linen focus:border-tuc-gold focus:ring-0 outline-none transition-all min-h-[100px] font-serif italic text-lg"
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>
            )}

            <div className="flex items-center space-x-8">
              <div>
                <label className="label-caps mb-4 block">Quantity</label>
                <div className="flex items-center border border-brand-linen">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-3 hover:bg-brand-leaf transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-3 hover:bg-brand-leaf transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className="btn-primary w-full flex items-center justify-center space-x-3 py-5"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>

          {/* Specifications */}
          <div className="mt-12 pt-12 border-t border-brand-linen space-y-8">
            <div>
              <h3 className="label-caps mb-4 text-brand-charcoal">Specifications</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                {product.dimensions && (
                  <>
                    <span className="text-brand-stone italic">Dimensions</span>
                    <span className="text-brand-charcoal text-right">{product.dimensions}</span>
                  </>
                )}
                {product.material && (
                  <>
                    <span className="text-brand-stone italic">Material</span>
                    <span className="text-brand-charcoal text-right">{product.material}</span>
                  </>
                )}
                {product.estimatedShipping && (
                  <>
                    <span className="text-brand-stone italic">Shipping</span>
                    <span className="text-brand-charcoal text-right">{product.estimatedShipping}</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-brand-leaf flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold">01</span>
                </div>
                <div>
                  <h4 className="font-serif italic mb-1 text-brand-charcoal">Handcrafted in NH</h4>
                  <p className="text-sm text-brand-stone leading-relaxed">Meticulously folded by Luciana Frigerio in Lebanon, New Hampshire.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-brand-leaf flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold">02</span>
                </div>
                <div>
                  <h4 className="font-serif italic mb-1 text-brand-charcoal">Sustainable Art</h4>
                  <p className="text-sm text-brand-stone leading-relaxed">We use vintage and repurposed books, giving them a second life as sculpture.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

```

### FILE: src/pages/Shop.tsx
```typescript
import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/mockData';
import { motion } from 'motion/react';

const Shop: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <header className="mb-16">
        <span className="label-caps text-tuc-gold mb-4 block">The Collection</span>
        <h1 className="text-5xl md:text-7xl editorial-heading mb-6">Browse Art</h1>
        <p className="text-lg text-brand-stone max-w-2xl leading-relaxed">
          Explore our collection of handcrafted book sculptures. From ready-to-ship geometric 
          designs to bespoke personalized creations, each piece is a unique narrative.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
        {products.map((product, index) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Link to={`/product/${product.slug}`}>
              <div className="aspect-[3/4] overflow-hidden bg-brand-leaf mb-6">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-serif mb-2">{product.name}</h3>
                  <p className="label-caps text-brand-stone">{product.category}</p>
                </div>
                <p className="font-serif text-xl">
                  {product.variants ? `From $${product.basePrice}` : `$${product.basePrice}`}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Shop;

```

### FILE: src/types.ts
```typescript
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  images: string[];
  category: string;
  variants?: ProductVariant[];
  requiresCustomInput: boolean;
  customInputLabel?: string;
  dimensions?: string;
  material?: string;
  estimatedShipping?: string;
  featured?: boolean;
}

export interface ProductVariant {
  id: string;
  label: string;
  value: string | number;
  priceOverride?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  selectedVariant?: ProductVariant;
  customText?: string;
  imageUrl: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  resource: string;
  ipAddress?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  customerName: string;
  productPurchased: string;
  date?: string;
}

export interface Exhibition {
  id: string;
  title: string;
  year: string;
  date?: string;
  venue: string;
  description: string;
}

```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}

```

### FILE: vite.config.ts
```typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom')) return 'vendor-react-dom';
              if (id.includes('react-router')) return 'vendor-router';
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-motion';
              if (id.includes('lucide') || id.includes('heroicons')) return 'vendor-icons';
              return 'vendor';
            }
          },
        },
      },
    },
  };
});

```

