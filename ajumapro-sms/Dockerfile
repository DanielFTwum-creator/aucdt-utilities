# ── Stage 1: Build React frontend ────────────────────────────────────────────
FROM node:24-alpine AS frontend-build
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
ARG VITE_API_URL=""
RUN npm run build

# ── Stage 2: Build backend ────────────────────────────────────────────────────
FROM node:24-alpine AS backend-build
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install --legacy-peer-deps

COPY backend/ .
RUN npm run build

# ── Stage 3: Production image ─────────────────────────────────────────────────
FROM node:24-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Backend production deps
COPY backend/package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Backend compiled output
COPY --from=backend-build /app/backend/dist ./dist

# React frontend build (served as static files by Express)
COPY --from=frontend-build /app/dist ./dist/public

# Patch server to serve from /app/dist/public
ENV STATIC_PATH=dist/public

# Persistent DB volume
VOLUME ["/app/data"]

EXPOSE 3001
CMD ["node", "dist/server.js"]
