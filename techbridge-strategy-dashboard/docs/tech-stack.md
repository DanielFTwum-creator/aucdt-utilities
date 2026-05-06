# Technology Stack Documentation

## 1. Frontend Architecture
The TechBridge Strategic Dashboard is built as a **Single Page Application (SPA)** using a lightweight, no-build-step architecture for maximum portability and ease of editing.

### Core Framework
-   **Library**: **React v19.2.4**
-   **Runtime**: Browser-native ES Modules (ESM).
-   **Language**: **TypeScript** (transpiled on-the-fly or pre-typed for robust development).

## 2. Dependencies & Libraries

| Category | Library | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **UI Framework** | **React** | ^19.2.4 | Component-based view layer. |
| **DOM Manipulation** | **ReactDOM** | ^19.2.4 | Rendering React components to the DOM. |
| **Styling** | **Tailwind CSS** | v3.4 (CDN) | Utility-first CSS framework for rapid UI development. |
| **Data Visualization** | **Recharts** | ^3.7.0 | Composable charting library based on React components. |
| **Icons** | **Lucide React** | ^0.563.0 | Consistent, lightweight SVG icons. |

## 3. Infrastructure & Deployment

### Module Loading
-   **ESM.sh**: Used as the Content Delivery Network (CDN) to import NPM packages directly into the browser as ES Modules. This eliminates the need for complex bundlers (Webpack/Vite) for this specific dashboard iteration.

### Hosting Requirements
-   Any static file server (Nginx, Apache, GitHub Pages, Netlify, Vercel).
-   No server-side runtime (Node.js/Python) required for the dashboard visualization itself.

## 4. Design System
-   **Typography**: Inter (Google Fonts).
-   **Color Palette**:
    -   *Primary*: Slate (900/800 for sidebars, 50-200 for backgrounds).
    -   *Accents*: Indigo (Strategic), Blue (Primary Actions), Emerald (Success/Profit), Red (Risk/Loss), Amber (Warning/Investment).

## 5. Development Environment
-   **Entry Point**: `index.html` loads `index.tsx`.
-   **Type Safety**: Interfaces defined in `types.ts` ensure data consistency across views.
