# Deployment Guide — Impact Ventures Dashboard

## Prerequisites

- Node.js 24.x
- pnpm 10.30+
- Docker (for containerised deployment)
- `GEMINI_API_KEY` environment variable

## Local Development

```bash
cd impact-ventures-dashboard
pnpm install
GEMINI_API_KEY=your_key pnpm run dev
# Opens at http://localhost:5173
```

## Production Build

```bash
GEMINI_API_KEY=your_key pnpm run build
# Output: dist/
```

## Docker Deployment

```bash
docker build -t impact-ventures-dashboard .
docker run -p 80:80 -e GEMINI_API_KEY=your_key impact-ventures-dashboard
```

### Docker Compose (monorepo)

The service is defined in `docker-compose-all-apps.yml`. Start with:

```bash
docker-compose -f ../docker-compose-all-apps.yml up impact-ventures-dashboard
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes (for AI briefs) | Google Gemini API key |

## Nginx Gateway

The app is proxied via the monorepo NGINX gateway at `http://localhost:8080/impact-ventures-dashboard/`.

To regenerate the nginx config after adding new services:

```bash
node scripts/generate_nginx_conf.js
```

## Health Check

The Docker container exposes the app on port 80 (nginx static serving). No `/health` endpoint is needed for a purely static SPA.
