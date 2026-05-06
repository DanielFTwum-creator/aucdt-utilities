# TechBridge Dashboard Setup Guide

## Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v10.22.0 or higher (recommended)
  ```bash
  npm install -g pnpm
  ```

## Quick Start

### 1. Installation

```bash
cd techbridge-strategy-dashboard
pnpm install
```

### 2. Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### 3. Build for Production

```bash
pnpm build
```

Output will be in the `dist/` directory.

### 4. Preview Production Build

```bash
pnpm preview
```

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.4 | UI framework |
| Vite | 7.3.1 | Build tool and dev server |
| TypeScript | 5.9.3 | Type safety |
| Recharts | 3.7.0 | Charts and data visualization |
| Lucide React | 0.563.0 | Icon library |
| Tailwind CSS | (CDN) | Utility-first CSS |
| vite-plugin-pwa | 1.2.0 | Progressive Web App support |

## Project Structure

```
techbridge-strategy-dashboard/
├── components/          # React components
│   ├── Overview.tsx        # REQ-1.x: Executive briefing
│   ├── StrategyView.tsx    # REQ-2.x: Strategic planning
│   ├── Financials.tsx      # REQ-3.x: Financial projections
│   ├── MarketingView.tsx   # REQ-4.x: Marketing & operations
│   ├── RisksView.tsx       # REQ-5.x: Risk management
│   ├── AdminView.tsx       # REQ-6.x: Admin & security
│   ├── Sidebar.tsx         # Navigation
│   └── MetricCard.tsx      # Reusable card component
├── App.tsx             # Main application
├── index.tsx           # Entry point
├── index.css           # Global styles
├── data.ts             # Static data models
├── types.ts            # TypeScript interfaces
├── vite.config.ts      # Build configuration
├── index.html          # HTML template
└── docs/               # Documentation
    ├── SRS-TechBridge-Dashboard-v1.2.md
    ├── guides/
    └── diagrams/
```

## Key Features

### Progressive Web App (PWA)
- Installable on desktop and mobile
- Offline support via service worker
- Configured in `vite.config.ts`

### SEO & Analytics
- Comprehensive meta tags (Open Graph, Twitter Card)
- Google Analytics integration (gtag.js)
- Techbridge branding

### Performance
- Vendor/app code splitting
- Font preconnect optimization
- Lazy loading support

## Configuration

### Theme & Branding
- Theme colors defined in `index.html` (Tailwind config)
- Brand color: `#630f12` (Techbridge maroon)
- Dark mode gradient: `#0f172a` to `#1e293b`

### Admin Access
- Default password: `admin`
- Configured in `App.tsx` (line 32)

## Deployment

### Static Hosting (Recommended)
```bash
pnpm build
# Deploy dist/ folder to:
# - Vercel, Netlify, GitHub Pages, etc.
```

### PWA Installation
After deployment, users can:
1. Visit the URL in Chrome/Edge/Safari
2. Click "Install" in address bar
3. Use as standalone app

## Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules dist
pnpm install
pnpm build
```

### PWA Not Installing
- Ensure HTTPS (required for PWA)
- Check browser console for service worker errors
- Verify `manifest.webmanifest` is served correctly

## Development Workflows

### Adding New Features
1. Create component in `components/`
2. Import in `App.tsx`
3. Add to navigation in `Sidebar.tsx`
4. Update types in `types.ts` if needed

### Updating Data
- Edit `data.ts` for metrics and visualizations
- All data is static (no API calls)

## License
Proprietary - Techbridge University College
