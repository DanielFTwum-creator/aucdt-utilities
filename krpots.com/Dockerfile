# ── Stage 1: Build frontend ───────────────────────────────────────────────────
FROM node:24-alpine AS frontend
WORKDIR /app
COPY package*.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && CI=true pnpm install --no-frozen-lockfile
COPY . .
RUN pnpm run build

# ── Stage 2: Build backend ────────────────────────────────────────────────────
FROM node:24-alpine AS backend-build
WORKDIR /backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build

# ── Stage 3: Production ───────────────────────────────────────────────────────
FROM node:24-alpine
WORKDIR /app
COPY --from=backend-build /backend/dist ./dist
COPY --from=backend-build /backend/node_modules ./node_modules
COPY --from=frontend /app/dist ./dist/public
ENV STATIC_PATH=dist/public
ENV PORT=4049
EXPOSE 4049
CMD ["node", "dist/server.js"]
