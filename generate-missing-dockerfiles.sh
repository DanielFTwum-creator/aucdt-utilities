#!/bin/bash
# ============================================================================
# Techbridge University College - Generate Missing Dockerfiles
# ============================================================================
# Purpose: Create Dockerfiles for all React/Vite apps that don't have one
# Author: TUC ICT Department
# Date: March 10, 2026
# Usage: ./generate-missing-dockerfiles.sh
# ============================================================================

echo "========================================"
echo "TUC - Dockerfile Generation Script"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Counters
TOTAL=0
GENERATED=0
SKIPPED=0
ERRORS=0

# Log file
LOG_FILE="dockerfile-generation.log"
echo "Dockerfile Generation Log - $(date)" > "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"

# Function to generate Dockerfile for Vite/React app
generate_vite_dockerfile() {
    local app_dir="$1"
    local dockerfile_path="$app_dir/Dockerfile"

    cat > "$dockerfile_path" << 'EOF'
# Multi-stage Dockerfile for Vite/React Application
# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install dependencies
RUN npm install -g pnpm@10.30.3 && \
    pnpm install --frozen-lockfile || npm ci

# Copy source files
COPY . .

# Build the application
RUN pnpm run build || npm run build

# Stage 2: Production
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration if it exists, otherwise use default
COPY nginx.conf* /etc/nginx/conf.d/default.conf 2>/dev/null || echo "server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files \$uri \$uri/ /index.html; } }" > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
EOF

    echo -e "${GREEN}✓${NC} Generated: $app_dir/Dockerfile"
    echo "[SUCCESS] Generated Dockerfile for: $app_dir" >> "$LOG_FILE"
    ((GENERATED++))
}

# Function to generate Dockerfile for backend/Node.js app
generate_node_dockerfile() {
    local app_dir="$1"
    local dockerfile_path="$app_dir/Dockerfile"

    cat > "$dockerfile_path" << 'EOF'
# Dockerfile for Node.js/Express Backend Application
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source files
COPY . .

# Build if TypeScript
RUN npm run build 2>/dev/null || echo "No build step"

# Expose port (default 3000)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

# Start application
CMD ["npm", "start"]
EOF

    echo -e "${GREEN}✓${NC} Generated: $app_dir/Dockerfile"
    echo "[SUCCESS] Generated Dockerfile for: $app_dir" >> "$LOG_FILE"
    ((GENERATED++))
}

# Main processing loop
echo "Scanning for apps without Dockerfiles..."
echo ""

for dir in */; do
    # Skip if not a directory
    [ -d "$dir" ] || continue

    # Skip special directories
    if [[ "$dir" =~ ^(node_modules|dist|build|.git|.github|docker|catalogue|scripts|tests|templates|reports|Documentation|archive|monitoring|src|gemini|genai|proof-of-concept-screenshots|project-screenshots-real|build-validation-reports)/ ]]; then
        continue
    fi

    ((TOTAL++))

    # Check if package.json exists
    if [ ! -f "$dir/package.json" ]; then
        echo -e "${YELLOW}⊘${NC} Skipped (no package.json): $dir"
        echo "[SKIP] No package.json: $dir" >> "$LOG_FILE"
        ((SKIPPED++))
        continue
    fi

    # Check if Dockerfile already exists
    if [ -f "$dir/Dockerfile" ]; then
        echo -e "${YELLOW}⊘${NC} Skipped (Dockerfile exists): $dir"
        echo "[SKIP] Dockerfile exists: $dir" >> "$LOG_FILE"
        ((SKIPPED++))
        continue
    fi

    # Determine app type and generate appropriate Dockerfile
    if grep -q '"vite"' "$dir/package.json" || grep -q '@vitejs/plugin-react' "$dir/package.json"; then
        # Vite/React app
        echo -e "${GREEN}→${NC} Generating Vite Dockerfile: $dir"
        generate_vite_dockerfile "$dir"
    elif grep -q '"express"' "$dir/package.json" && grep -q '"typescript"' "$dir/package.json"; then
        # Express backend
        echo -e "${GREEN}→${NC} Generating Node.js Dockerfile: $dir"
        generate_node_dockerfile "$dir"
    elif grep -q '"start":' "$dir/package.json" && grep -q '"react"' "$dir/package.json"; then
        # React app (might be CRA)
        echo -e "${GREEN}→${NC} Generating Vite Dockerfile: $dir"
        generate_vite_dockerfile "$dir"
    else
        echo -e "${YELLOW}?${NC} Unknown type (skipping): $dir"
        echo "[SKIP] Unknown app type: $dir" >> "$LOG_FILE"
        ((SKIPPED++))
    fi
done

echo ""
echo "========================================"
echo "Dockerfile Generation Complete"
echo "========================================"
echo ""
echo "Summary:"
echo "  Total apps scanned:    $TOTAL"
echo "  Dockerfiles generated: $GENERATED"
echo "  Skipped:               $SKIPPED"
echo "  Errors:                $ERRORS"
echo ""
echo "Log saved to: $LOG_FILE"
echo ""

# Generate docker-compose entries
if [ $GENERATED -gt 0 ]; then
    echo "Would you like to update docker-compose-all-apps.yml? (manual step)"
    echo "Run: bash generate-docker-compose.sh"
fi
