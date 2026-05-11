#!/bin/bash
# Build script for Docker/production deployment
# This builds the app WITH the base path for nginx reverse proxy

PROJECT_DIR="${1:-.}"

if [ ! -f "$PROJECT_DIR/package.json" ]; then
    echo "Error: No package.json found in $PROJECT_DIR"
    echo "Usage: bash build-docker.sh <project-directory>"
    exit 1
fi

cd "$PROJECT_DIR"
PROJECT_NAME=$(basename "$(pwd)")

# Try to determine base path from vite.config
BASE_PATH=$(grep -oP "base: useBasePath \? '\K[^']+(?=')" vite.config.ts 2>/dev/null || echo "unknown")

echo "=================================================="
echo "Building $PROJECT_NAME for DOCKER/PRODUCTION"
echo "=================================================="
echo ""
echo "This build will:"
echo "  - Use base path: $BASE_PATH"
echo "  - Use React Router basename: ${BASE_PATH%/}"
echo "  - Work with: Docker + Nginx"
echo ""

# Build for production (no flag or explicitly false)
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "To deploy with Docker:"
    echo "  cd .."
    echo "  docker-compose -f docker-compose-all-apps.yml build $PROJECT_NAME"
    echo "  docker-compose -f docker-compose-all-apps.yml up -d $PROJECT_NAME"
    echo ""
    echo "Then access at: http://localhost:8080$BASE_PATH"
    echo ""
    echo "⚠️  NOTE: This build is for DOCKER DEPLOYMENT ONLY"
    echo "   For local testing with serve, use: bash build-local.sh"
else
    echo ""
    echo "❌ Build failed!"
    exit 1
fi
