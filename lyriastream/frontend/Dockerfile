# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:24-alpine AS builder
WORKDIR /app

# Use npm for a flat node_modules — avoids pnpm virtual-store shim issues
COPY package.json ./
RUN npm install --include=dev

COPY . .
ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# ── Serve stage ───────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
