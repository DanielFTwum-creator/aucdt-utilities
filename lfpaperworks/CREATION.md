# CREATION.md — LF Paperworks
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
| Runtime | React | **19.2.4** |
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
| Container | node:24-alpine → nginx:alpine | — |

---

## 3. Directory Structure

```
src/
├── App.tsx               # React Router routes
├── main.tsx
├── types.ts              # Product, CartItem, Order interfaces
├── index.css
├── context/
│   ├── CartContext.tsx       # Cart state: items, add, remove, update qty, clear
│   ├── ThemeContext.tsx      # dark/light/high-contrast
│   └── AdminAuthContext.tsx  # Admin login state (localStorage session)
├── pages/
│   ├── Home.tsx          # Hero + featured products + categories
│   ├── Shop.tsx          # Full product grid with filter/search
│   ├── ProductDetail.tsx # Single product, Gemini AI description, add-to-cart
│   ├── Cart.tsx          # Cart review + order form + submit
│   ├── About.tsx         # Brand story page
│   ├── Contact.tsx       # Contact form
│   ├── AdminLogin.tsx    # Admin login page (/admin/login)
│   └── AdminDashboard.tsx # Order management + product CRUD (/admin)
├── components/
│   └── Layout.tsx        # Outlet wrapper: Header + Footer
├── data/                 # Static product seed data (JSON or TypeScript arrays)
└── lib/                  # geminiService.ts, utils
```

---

## 4. Routes (React Router v7)

```
/                     → Home
/shop                 → Shop (all products, filter by category)
/product/:slug        → ProductDetail
/cart                 → Cart
/about                → About
/contact              → Contact
/admin/login          → AdminLogin (public)
/admin                → AdminDashboard (protected: redirect to /admin/login if not authed)
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

**Access:** `/admin/login` → password `admin123` → redirect to `/admin`

**Admin session:** `localStorage.setItem('lfpaperworks-admin-session', 'true')`

Features:
- **Orders tab:** List all submitted orders (from localStorage `lfpaperworks-orders`). Update status (pending → processing → shipped → delivered).
- **Products tab:** View product catalogue. "Generate Description" button calls Gemini to rewrite the product description.
- **Audit Log tab:** All admin actions logged to `lfpaperworks-audit` in localStorage.

---

## 8. Gemini AI Feature (lib/geminiService.ts)

Used in `ProductDetail.tsx`:
- Button: "✨ Regenerate Description with AI"
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
