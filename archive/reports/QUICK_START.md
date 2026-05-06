# Quick Start Guide - Vite Migration

## For Developers Working on Migrated Projects

### Projects Migrated from Create React App to Vite

These 8 projects were migrated from CRA to Vite:
1. academic-performance-app
2. aucdt-skills-evaluation
3. drone-showcase
4. english-safari
5. kanban-app (⚠️ has .env - see below)
6. pdf-extractor-app
7. presentation-app
8. umoja-react-app

### First Time Setup (Required for Migrated Projects)

Run these commands **once** for each migrated project:

```bash
cd <project-name>

# 1. Clean old dependencies
rm -rf node_modules package-lock.json

# 2. Install new dependencies
npm install

# 3. Test dev server
npm run dev

# 4. Test production build
npm run build
```

### Environment Variables (kanban-app only)

If working on **kanban-app**, update the `.env` file:

**Before:**
```env
REACT_APP_API_KEY=your_key
```

**After:**
```env
VITE_API_KEY=your_key
```

And update your code:
```javascript
// Before
const key = process.env.REACT_APP_API_KEY;

// After
const key = import.meta.env.VITE_API_KEY;
```

### Available Commands

All projects now support these commands:

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server (fast HMR) |
| `npm start` | Same as `npm run dev` |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run serve` | Serve production build |

### Key Differences from CRA

1. **Faster!** Dev server starts in 1-3 seconds (vs 15-30s with CRA)
2. **Hot reload** updates in <100ms (vs 2-5s with CRA)
3. **index.html** is now in the root directory (not `public/`)
4. **Entry point** is now `src/index.jsx` (renamed from `src/index.js`)
5. **Environment variables** use `VITE_` prefix (not `REACT_APP_`)
6. **Access env vars** with `import.meta.env.VITE_X` (not `process.env.REACT_APP_X`)

### Troubleshooting

**Problem:** Dev server won't start
```bash
# Solution: Clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem:** "Cannot find module 'vite'"
```bash
# Solution: Install dependencies
npm install
```

**Problem:** Build fails
```bash
# Solution: Check for REACT_APP_ env vars and change to VITE_
grep -r "REACT_APP_" src/
```

### Need Help?

- See full documentation: `VITE_MIGRATION_SUMMARY.md`
- Check Vite docs: https://vitejs.dev/

---

**Migration Date:** February 19, 2026
**Vite Version:** 7.3.1
**Serve Version:** 14.2.5
