# Deployment Guide — PlayGrow Smart Fun for Bright Minds

**Institution:** Techbridge University College (TUC)
**Last updated:** 2026-06-16

---

## Local Development

```bash
cd playgrow-smart-fun-for-bright-minds
pnpm install
pnpm run dev        # http://localhost:5173
```

```bash
pnpm run build      # TypeScript compile + Vite bundle → dist/
pnpm run preview    # preview production build locally
```

---

## Docker Deployment

### Build (from monorepo root)

```bash
docker-compose -f docker-compose-all-apps.yml build playgrow-smart-fun-for-bright-minds
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up playgrow-smart-fun-for-bright-minds
```

### All services

```bash
docker-compose -f docker-compose-all-apps.yml up
# Gateway: http://localhost:8080
```

---

## Dockerfile

Multi-stage build — compiles with Node 24, serves with nginx:

```dockerfile
FROM node:24-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
```

---

## Game Deployment Notes

PlayGrow ships with 21 fully implemented games across 7 learning zones. All games run entirely in the browser — no backend service, database, or API key is required for normal gameplay.

The only optional server-side dependency is the AI activity modal fallback, which is triggered when a game route ID is not found in the `GAME_COMPONENTS` record. That modal requires an AI API key to generate text activities. All 21 current game route IDs are registered and will never trigger this fallback.

| Zone | Games | Backend required? |
|---|---|---|
| Brainy Town | PuzzleBuilder, PatternPath, FindMatch | No |
| Art Meadow | PaintWorld, BuildItBlocks, StoryMaker | No |
| Talky Treehouse | ReadWithMe, RhymeRace, WordFinder | No |
| Move Forest | DanceTime, AnimalMoves, CatchBalance | No |
| Heart Valley | EmotionFaces, FriendFinder, CalmCorner | No |
| Explore Park | NatureQuest, TreasureHunt, SoundExplorer | No |
| Dream Garden | GoodNightStorytime, GratitudeMoments, MusicClouds | No |

The MusicClouds game uses the Web Audio API (built into all modern browsers) — no external audio library or CDN dependency.

---

## Environment Variables

PlayGrow has no required environment variables — it is a fully client-side SPA with no backend API calls.

Optional variables (if analytics is re-enabled):

```bash
VITE_GA_ID=G-FKXTELQ71R    # Google Analytics tag
```

Do not commit `.env` files to version control.

---

## Health Check

```bash
curl http://localhost:<mapped-port>/health
# → healthy
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `pnpm install` fails | `rm -rf node_modules pnpm-lock.yaml && npm install --legacy-peer-deps` |
| Vite out-of-memory during build | `NODE_OPTIONS=--max-old-space-size=4096 pnpm run build` |
| Port conflict | Change host port mapping in `docker-compose-all-apps.yml` |
| Blank page in Docker | Check `nginx.conf` — ensure `try_files $uri $uri/ /index.html` is present |
| TypeScript errors on build | Run `npx tsc --noEmit` locally first; pre-existing `node` types warning is non-blocking |
