# Deployment Guide

## Prerequisites

- Node.js >= 18.0.0
- pnpm (preferred) or npm

---

## Local Development

```bash
cd analytics-refactor
pnpm install
pnpm run dev
# → http://localhost:3000
```

Hot Module Replacement is active. Changes appear in < 100ms.

---

## Production Build (Vite)

```bash
pnpm run build
# Output: build/
```

The build is optimised, minified, and tree-shaken. Assets include content hashes for cache-busting.

Preview the production build locally:

```bash
pnpm run preview
# → http://localhost:4173
```

---

## Docker Deployment

Uses the root `Dockerfile.vite` (multi-stage build):

```bash
# From the repo root
docker build -f Dockerfile.vite \
  --build-arg PROJECT_DIR=analytics-refactor \
  -t tuc-analytics-refactor .

docker run -p 3001:80 tuc-analytics-refactor
# → http://localhost:3001
```

Via docker-compose (recommended):

```bash
docker-compose up analytics-refactor
# Access via gateway: http://localhost:8080/analytics-refactor/
```

Dev mode with hot reload:

```bash
docker-compose --profile dev up analytics-refactor-dev
# → http://localhost:3001 (source mounted as volume)
```

---

## Tomcat / WAR Deployment

```bash
pnpm run build

mkdir -p build/WEB-INF
cp -r WEB-INF/* build/WEB-INF/

cd build && zip -r analytics-refactor.war *

scp analytics-refactor.war root@66.226.72.199:/opt/tomcat/webapps/
```

Access: `https://[domain]/analytics-refactor/`

---

## Environment Variables

Create a `.env` file in the project root before building:

```bash
# .env
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=your_secure_password
VITE_DATA_URL=/data/analytics.json
VITE_ENV=production
```

Vite bakes these values into the bundle at build time. Do not store secrets here that should remain server-side.

---

## CI/CD (Bitbucket Pipelines)

The project is included in the `build-all-projects` custom pipeline. To trigger a standalone build:

1. Go to Bitbucket → Pipelines → Run Pipeline
2. Select: **custom: build-all-projects**

Or add a changeset-triggered step in `bitbucket-pipelines.yml`:

```yaml
- step:
    name: Build analytics-refactor
    caches: [pnpm]
    script:
      - cd analytics-refactor
      - corepack enable && corepack prepare pnpm@latest --activate
      - pnpm install --frozen-lockfile
      - pnpm run build
    changesets:
      includePaths:
        - 'analytics-refactor/**'
```
