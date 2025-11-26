# 📦 pnpm Migration Guide - ThesisAI

## Overview

ThesisAI now uses **pnpm** (Performant NPM) as the package manager for the frontend. pnpm is faster, more efficient, and uses less disk space than npm.

---

## Why pnpm?

✅ **Fast** - Up to 2x faster than npm  
✅ **Efficient** - Saves disk space with content-addressable storage  
✅ **Strict** - Better dependency resolution  
✅ **Compatible** - Works with all npm packages  
✅ **Monorepo-friendly** - Built-in workspace support  

---

## Installation

### Install pnpm globally

```bash
# Using npm (one-time)
npm install -g pnpm

# Or using Corepack (Node.js 16.13+)
corepack enable
corepack prepare pnpm@8.15.0 --activate

# Verify installation
pnpm --version
```

---

## Quick Start

### Frontend Development

```bash
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Clean installation
pnpm clean && pnpm install
```

---

## Command Comparison

| Task | npm | pnpm |
|------|-----|------|
| Install | `npm install` | `pnpm install` |
| Add package | `npm install <pkg>` | `pnpm add <pkg>` |
| Remove package | `npm uninstall <pkg>` | `pnpm remove <pkg>` |
| Run script | `npm run dev` | `pnpm dev` |
| Update packages | `npm update` | `pnpm update` |
| List packages | `npm list` | `pnpm list` |

---

## Project Configuration

### package.json

```json
{
  "name": "thesisai-frontend",
  "packageManager": "pnpm@8.15.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "clean": "rm -rf node_modules dist"
  }
}
```

### Files Generated

- `pnpm-lock.yaml` - Lock file (commit to git)
- `node_modules/` - Dependencies (ignore in git)
- `.pnpm-store/` - Global store (ignore in git)

---

## Docker Integration

### Dockerfile (Updated)

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build
RUN pnpm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Workspace Features (Future)

pnpm supports workspaces for monorepos:

```yaml
# pnpm-workspace.yaml
packages:
  - 'frontend'
  - 'admin-panel'
  - 'mobile-app'
```

---

## Common Tasks

### Installing Dependencies

```bash
# Install all dependencies
pnpm install

# Install specific package
pnpm add react-query

# Install dev dependency
pnpm add -D @types/node

# Install globally
pnpm add -g typescript
```

### Updating Dependencies

```bash
# Update all packages
pnpm update

# Update specific package
pnpm update react

# Update to latest
pnpm update --latest

# Interactive update
pnpm update -i
```

### Cleaning Up

```bash
# Remove node_modules
pnpm clean  # (if script exists)
rm -rf node_modules

# Clear pnpm store
pnpm store prune

# Reinstall everything
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## Troubleshooting

### Issue: pnpm not found

**Solution:**
```bash
npm install -g pnpm
# or
corepack enable
```

### Issue: Lock file out of sync

**Solution:**
```bash
rm pnpm-lock.yaml
pnpm install
```

### Issue: Peer dependency warnings

**Solution:**
```bash
pnpm install --strict-peer-dependencies=false
```

### Issue: Disk space issues

**Solution:**
```bash
# Clean old packages
pnpm store prune

# Clear cache
pnpm cache clean
```

---

## Performance Comparison

### Installation Speed (example project)

| Package Manager | Cold Install | Warm Install |
|----------------|--------------|--------------|
| npm | 45s | 12s |
| pnpm | 23s | 6s |
| Speedup | **~2x faster** | **~2x faster** |

### Disk Usage

| Manager | Space Used |
|---------|------------|
| npm | 500 MB |
| pnpm | 150 MB |
| Savings | **~70% less** |

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Build
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8.15.0
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
```

---

## Best Practices

1. **Always commit `pnpm-lock.yaml`** - Ensures consistent installs
2. **Use `pnpm install --frozen-lockfile`** in CI/CD
3. **Don't mix package managers** - Stick to pnpm once migrated
4. **Clean store periodically** - `pnpm store prune`
5. **Update regularly** - `pnpm update -i`

---

## Migration Checklist

- [x] Install pnpm globally
- [x] Update package.json with packageManager field
- [x] Update Dockerfile to use pnpm
- [x] Update .gitignore for pnpm files
- [x] Generate pnpm-lock.yaml
- [x] Update documentation
- [x] Update CI/CD pipelines
- [x] Test build process
- [x] Update team documentation

---

## Resources

- **Official Site:** https://pnpm.io
- **Documentation:** https://pnpm.io/motivation
- **GitHub:** https://github.com/pnpm/pnpm
- **Migration Guide:** https://pnpm.io/migration

---

## Support

If you encounter issues:

1. Check pnpm version: `pnpm --version`
2. Clear cache: `pnpm cache clean`
3. Reinstall: `rm -rf node_modules && pnpm install`
4. Review logs: Check console output for errors

---

**Migration Date:** November 23, 2025  
**pnpm Version:** 8.15.0  
**Status:** ✅ Complete
