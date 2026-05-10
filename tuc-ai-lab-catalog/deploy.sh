#!/bin/bash
# TUC AI Lab Catalog Deployment Script
# Deploys built artifacts to techbridge.edu.gh:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab

set -e

ENVIRONMENT="${1:-production}"
REMOTE_HOST="${2:-root@66.226.72.199}"
REMOTE_PATH="/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab"
BUILD=false
TEST=false

# Parse arguments
for arg in "$@"; do
    case $arg in
        --build) BUILD=true ;;
        --test) TEST=true ;;
        production|staging|development) ENVIRONMENT="$arg" ;;
    esac
done

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}=== TUC AI LAB CATALOG DEPLOYMENT ===${NC}"
echo "Remote Host: $REMOTE_HOST"
echo "Remote Path: $REMOTE_PATH"
echo "Environment: $ENVIRONMENT"
echo ""

# Build if requested
if [ "$BUILD" = true ]; then
    echo -e "${YELLOW}Building production bundle...${NC}"
    pnpm build
    if [ $? -ne 0 ]; then
        echo -e "${RED}Build failed!${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Build complete${NC}"
    echo ""
fi

# Test build locally if requested
if [ "$TEST" = true ]; then
    echo -e "${YELLOW}Testing build locally...${NC}"
    pnpm preview
    exit 0
fi

# Check dist exists
if [ ! -d "dist" ]; then
    echo -e "${RED}Error: dist/ not found. Run with --build flag first.${NC}"
    exit 1
fi

# Check SSH key
SSH_KEY="$HOME/.ssh/id_rsa"
if [ ! -f "$SSH_KEY" ]; then
    echo -e "${YELLOW}Warning: SSH key not found at $SSH_KEY${NC}"
    echo -e "${YELLOW}Ensure you have SSH access configured for: $REMOTE_HOST${NC}"
fi

# Prepare deployment package
echo -e "${YELLOW}Preparing deployment package...${NC}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
STAGING="./dist-deploy"

# Create temporary staging directory
if [ -d "$STAGING" ]; then
    rm -rf "$STAGING"
fi
mkdir -p "$STAGING"

# Copy dist files
cp -r dist/* "$STAGING/"

# Copy supporting files
if [ -f ".env.example" ]; then
    cp .env.example "$STAGING/.env.example"
fi

# Create .htaccess for SPA routing
cat > "$STAGING/.htaccess" << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /ai-lab/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /ai-lab/index.html [QSA,L]
</IfModule>
EOF

# Create deployment manifest
cat > "$STAGING/DEPLOYMENT_MANIFEST.json" << EOF
{
  "Deployed": "$(date '+%Y-%m-%d %H:%M:%S')",
  "Version": "$(grep '"version"' package.json | head -1 | sed 's/.*"\([^"]*\)".*/\1/')",
  "Branch": "$(git branch --show-current 2>/dev/null || echo 'unknown')",
  "Commit": "$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')",
  "Environment": "$ENVIRONMENT"
}
EOF

# Copy privacy policy if it exists
if [ -f "public/privacy.html" ]; then
    cp public/privacy.html "$STAGING/privacy.html"
fi

echo -e "${GREEN}✓ Package ready${NC}"
echo ""

# Deploy via SSH
echo -e "${YELLOW}Deploying to remote server...${NC}"
echo "Host: $REMOTE_HOST"
echo "Path: $REMOTE_PATH"
echo ""

echo "Creating directory structure..."
ssh -o StrictHostKeyChecking=no "$REMOTE_HOST" "mkdir -p $REMOTE_PATH"

echo "Clearing old deployment..."
ssh -o StrictHostKeyChecking=no "$REMOTE_HOST" "rm -rf $REMOTE_PATH/* $REMOTE_PATH/.htaccess"

echo "Deploying files via SCP..."
scp -r -o StrictHostKeyChecking=no "$STAGING"/* "$REMOTE_HOST:$REMOTE_PATH/"

echo "Setting permissions..."
ssh -o StrictHostKeyChecking=no "$REMOTE_HOST" "chmod -R 755 $REMOTE_PATH && chmod 644 $REMOTE_PATH/.htaccess"

echo -e "${GREEN}✓ Deployment complete${NC}"

# Cleanup
echo -e "${YELLOW}Cleaning up...${NC}"
rm -rf "$STAGING"
echo -e "${GREEN}✓ Cleanup complete${NC}"
echo ""

# Summary
FILE_COUNT=$(find dist -type f | wc -l)
SIZE_BYTES=$(du -sb dist | cut -f1)
SIZE_MB=$(echo "scale=2; $SIZE_BYTES / 1048576" | bc)

echo -e "${GREEN}=== DEPLOYMENT COMPLETE ===${NC}"
echo "URL: https://ai-tools.techbridge.edu.gh/ai-lab"
echo "Files deployed: $FILE_COUNT"
echo "Size: $SIZE_MB MB"
echo ""

echo -e "${CYAN}Verification:${NC}"
echo "  curl -I https://ai-tools.techbridge.edu.gh/ai-lab"
echo ""

echo -e "${CYAN}Next steps:${NC}"
echo "  1. Verify at https://ai-tools.techbridge.edu.gh/ai-lab"
echo "  2. Check server logs: ssh $REMOTE_HOST 'tail -f /var/log/apache2/ai-tools.techbridge.edu.gh-access.log'"
echo "  3. Configure .env if needed: scp .env.production $REMOTE_HOST:$REMOTE_PATH/.env"
echo "  4. Clear browser cache if needed (Ctrl+Shift+Delete)"
echo ""
