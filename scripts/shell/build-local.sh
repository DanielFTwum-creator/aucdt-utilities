#!/bin/bash
# Build script for local development with 'serve -s dist'
# This builds the app WITHOUT the base path so it works with serve from root

PROJECT_DIR="${1:-.}"

if [ ! -f "$PROJECT_DIR/package.json" ]; then
    echo "Error: No package.json found in $PROJECT_DIR"
    echo "Usage: bash build-local.sh <project-directory>"
    exit 1
fi

cd "$PROJECT_DIR"
PROJECT_NAME=$(basename "$(pwd)")

echo "=================================================="
echo "Building $PROJECT_NAME for LOCAL DEVELOPMENT"
echo "=================================================="
echo ""
echo "This build will:"
echo "  - Use base path: /"
echo "  - Use React Router basename: '' (empty)"
echo "  - Work with: serve -s dist"
echo ""

# Build with local dev flag
VITE_LOCAL_DEV=true npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "To run locally:"
    echo "  cd $PROJECT_NAME"
    echo "  npx serve -s dist -p 3000"
    echo ""
    echo "Then access at: http://localhost:3000"
    echo ""
    echo "⚠️  NOTE: This build is for LOCAL DEVELOPMENT ONLY"
    echo "   For Docker/production deployment, use: npm run build"
else
    echo ""
    echo "❌ Build failed!"
    exit 1
fi
