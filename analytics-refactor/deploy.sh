#!/bin/bash

# Advanced Analytics Dashboard - Automated Deployment Script
# Version: 2.5.1
# Author: TECHBRIDGE University College ICT Department

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="Advanced Analytics Dashboard"
VERSION="2.5.1"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
ARCHIVE_NAME="analytics-dashboard-${TIMESTAMP}.zip"

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  ${PROJECT_NAME}                  ║${NC}"
echo -e "${BLUE}║  Automated Deployment Script v${VERSION}     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Clean previous builds
echo -e "${YELLOW}[1/6]${NC} Cleaning previous builds..."
if [ -d "build" ]; then
    rm -rf build
    echo -e "${GREEN}✓${NC} Build directory cleaned"
else
    echo -e "${BLUE}ℹ${NC} No previous build found"
fi

# Step 2: Clean caches
echo -e "${YELLOW}[2/6]${NC} Cleaning caches..."
if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    echo -e "${GREEN}✓${NC} Node modules cache cleaned"
fi
if [ -d ".cache" ]; then
    rm -rf .cache
    echo -e "${GREEN}✓${NC} Project cache cleaned"
fi

# Step 3: Verify package.json configuration
echo -e "${YELLOW}[3/6]${NC} Verifying configuration..."
if grep -q '"homepage": "."' package.json; then
    echo -e "${GREEN}✓${NC} Homepage setting correct (relative paths)"
else
    echo -e "${RED}✗${NC} Warning: homepage field not found in package.json"
    echo -e "${YELLOW}  Add: \"homepage\": \".\" to package.json${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 4: Build application
echo -e "${YELLOW}[4/6]${NC} Building application..."
if command -v pnpm &> /dev/null; then
    echo -e "${BLUE}ℹ${NC} Using pnpm..."
    pnpm build
elif command -v npm &> /dev/null; then
    echo -e "${BLUE}ℹ${NC} Using npm..."
    npm run build
else
    echo -e "${RED}✗${NC} Neither pnpm nor npm found!"
    exit 1
fi
echo -e "${GREEN}✓${NC} Build completed successfully"

# Step 5: Verify build output
echo -e "${YELLOW}[5/6]${NC} Verifying build output..."
if [ ! -d "build" ]; then
    echo -e "${RED}✗${NC} Build directory not found!"
    exit 1
fi

if [ ! -f "build/index.html" ]; then
    echo -e "${RED}✗${NC} index.html not found in build!"
    exit 1
fi

# Check for relative paths
if grep -q 'src="./' build/index.html && grep -q 'href="./' build/index.html; then
    echo -e "${GREEN}✓${NC} Relative paths verified in index.html"
else
    echo -e "${RED}✗${NC} Warning: Absolute paths detected in index.html"
    echo -e "${YELLOW}  This may cause issues when deploying to subdirectories${NC}"
fi

# Calculate build size
BUILD_SIZE=$(du -sh build | cut -f1)
echo -e "${BLUE}ℹ${NC} Build size: ${BUILD_SIZE}"

# Step 6: Create deployment archive
echo -e "${YELLOW}[6/6]${NC} Creating deployment archive..."
cd build
zip -rq "../${ARCHIVE_NAME}" .
cd ..
ARCHIVE_SIZE=$(ls -lh "${ARCHIVE_NAME}" | awk '{print $5}')
echo -e "${GREEN}✓${NC} Archive created: ${ARCHIVE_NAME} (${ARCHIVE_SIZE})"

# Summary
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          DEPLOYMENT SUCCESSFUL!            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📦 Archive:${NC} ${ARCHIVE_NAME}"
echo -e "${BLUE}📏 Size:${NC} ${ARCHIVE_SIZE}"
echo -e "${BLUE}📂 Build Dir:${NC} build/"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  1. Upload ${ARCHIVE_NAME} to your server"
echo -e "  2. Extract to your web directory (e.g., /public_html/analytics/)"
echo -e "  3. Access via browser"
echo ""
echo -e "${BLUE}Example Commands:${NC}"
echo -e "  ${GREEN}# Local testing:${NC}"
echo -e "  npx serve -s build"
echo ""
echo -e "  ${GREEN}# SCP upload:${NC}"
echo -e "  scp ${ARCHIVE_NAME} user@server:/tmp/"
echo ""
echo -e "  ${GREEN}# Extract on server:${NC}"
echo -e "  unzip /tmp/${ARCHIVE_NAME} -d /public_html/analytics/"
echo ""
echo -e "${GREEN}✅ Ready for deployment!${NC}"
echo ""
echo -e "${YELLOW}📝 Deployment Note:${NC}"
echo "After uploading to your server, run:"
echo -e "  ssh user@server 'chown -R techbridge.edu.gh_md:psacln /path/to/app && chmod -R 755 /path/to/app'"
