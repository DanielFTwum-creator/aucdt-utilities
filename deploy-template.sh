#!/bin/bash
# TUC Project Deployment Script Template
# Reusable deployment script for any TUC React project
# Deploys built artifacts to techbridge.edu.gh via Plesk/Ubuntu

set -e

# Default values
PROJECT_NAME="${1:-project}"
SUBDOMAIN_PATH="${2:-project}"
ENVIRONMENT="${3:-production}"
REMOTE_HOST="${4:-root@66.226.72.199}"
REMOTE_PATH="/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/$SUBDOMAIN_PATH"
BUILD=false
TEST=false
DRY_RUN=false

# Parse arguments
for arg in "$@"; do
    case $arg in
        --build) BUILD=true ;;
        --test) TEST=true ;;
        --dry-run) DRY_RUN=true ;;
        --help)
            echo "Usage: $0 [PROJECT_NAME] [SUBDOMAIN_PATH] [ENVIRONMENT] [REMOTE_HOST] [OPTIONS]"
            echo ""
            echo "Examples:"
            echo "  $0 luxthumb luxthumb production root@66.226.72.199 --build"
            echo "  $0 ai-lab ai-lab production root@66.226.72.199 --build"
            echo "  $0 learnaai learnaai staging root@66.226.72.199"
            echo ""
            echo "Options:"
            echo "  --build     Build production bundle before deploying"
            echo "  --test      Test build locally (pnpm preview)"
            echo "  --dry-run   Show what would be deployed without actually deploying"
            echo "  --help      Show this message"
            exit 0
            ;;
    esac
done

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Title
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  TUC PROJECT DEPLOYMENT                                    ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Project:      $PROJECT_NAME"
echo "Subdomain:    $SUBDOMAIN_PATH"
echo "Remote Host:  $REMOTE_HOST"
echo "Remote Path:  $REMOTE_PATH"
echo "Environment:  $ENVIRONMENT"
echo "URL:          https://ai-tools.techbridge.edu.gh/$SUBDOMAIN_PATH"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}⚠️  DRY RUN MODE - No changes will be made${NC}"
    echo ""
fi

# Build if requested
if [ "$BUILD" = true ]; then
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}Building production bundle...${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    pnpm build
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Build failed!${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Build complete${NC}"
    echo ""
fi

# Test build locally if requested
if [ "$TEST" = true ]; then
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}Testing build locally...${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}Starting preview server at http://localhost:4173${NC}"
    echo -e "${CYAN}Press Ctrl+C to stop${NC}"
    echo ""
    pnpm preview
    exit 0
fi

# Check dist exists
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Error: dist/ not found. Run with --build flag first.${NC}"
    exit 1
fi

# Check SSH key
SSH_KEY="$HOME/.ssh/id_rsa"
if [ ! -f "$SSH_KEY" ]; then
    echo -e "${YELLOW}⚠️  Warning: SSH key not found at $SSH_KEY${NC}"
    echo -e "${YELLOW}Ensure you have SSH access configured for: $REMOTE_HOST${NC}"
    echo ""
fi

# Prepare deployment package
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Preparing deployment package...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
STAGING="./dist-deploy"

# Create temporary staging directory
if [ -d "$STAGING" ]; then
    rm -rf "$STAGING"
fi
mkdir -p "$STAGING"
echo "Created staging directory: $STAGING"

# Copy dist files
cp -r dist/* "$STAGING/"
echo "Copied dist files"

# Copy supporting files
if [ -f ".env.example" ]; then
    cp .env.example "$STAGING/.env.example"
    echo "Copied .env.example"
fi

# Create .htaccess for SPA routing
cat > "$STAGING/.htaccess" << EOF
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /$SUBDOMAIN_PATH/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /$SUBDOMAIN_PATH/index.html [QSA,L]
</IfModule>
EOF
echo "Created .htaccess for SPA routing"

# Create deployment manifest
cat > "$STAGING/DEPLOYMENT_MANIFEST.json" << EOF
{
  "ProjectName": "$PROJECT_NAME",
  "Deployed": "$(date '+%Y-%m-%d %H:%M:%S')",
  "DeployedBy": "$(whoami)",
  "Version": "$(grep '"version"' package.json | head -1 | sed 's/.*"\([^"]*\)".*/\1/')",
  "Branch": "$(git branch --show-current 2>/dev/null || echo 'unknown')",
  "Commit": "$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')",
  "Environment": "$ENVIRONMENT",
  "URL": "https://ai-tools.techbridge.edu.gh/$SUBDOMAIN_PATH"
}
EOF
echo "Created deployment manifest"

# Copy privacy policy if it exists
if [ -f "public/privacy.html" ]; then
    cp public/privacy.html "$STAGING/privacy.html"
    echo "Copied privacy.html"
fi

# Copy APPSTORE_READY.md if it exists
if [ -f "APPSTORE_READY.md" ]; then
    cp APPSTORE_READY.md "$STAGING/APPSTORE_READY.md"
    echo "Copied APPSTORE_READY.md"
fi

echo -e "${GREEN}✅ Package ready${NC}"
echo ""

# Deploy via SSH
if [ "$DRY_RUN" = false ]; then
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}Deploying to remote server...${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    echo "Creating directory structure..."
    ssh -o StrictHostKeyChecking=no "$REMOTE_HOST" "mkdir -p $REMOTE_PATH" 2>&1 | grep -v "already exists" || true

    echo "Clearing old deployment..."
    ssh -o StrictHostKeyChecking=no "$REMOTE_HOST" "rm -rf $REMOTE_PATH/* $REMOTE_PATH/.htaccess 2>/dev/null || true"

    echo "Deploying files via SCP..."
    scp -r -o StrictHostKeyChecking=no "$STAGING"/* "$REMOTE_HOST:$REMOTE_PATH/" 2>&1 | head -20 || true

    echo "Setting permissions..."
    ssh -o StrictHostKeyChecking=no "$REMOTE_HOST" "chmod -R 755 $REMOTE_PATH && chmod 644 $REMOTE_PATH/.htaccess"

    echo -e "${GREEN}✅ Deployment complete${NC}"
else
    echo -e "${CYAN}🔍 DRY RUN: Would deploy to:${NC}"
    echo "  Host: $REMOTE_HOST"
    echo "  Path: $REMOTE_PATH"
    echo "  Files: $(find $STAGING -type f | wc -l) files"
    echo ""
fi

# Cleanup
echo "Cleaning up..."
rm -rf "$STAGING"
echo -e "${GREEN}✅ Cleanup complete${NC}"
echo ""

# Summary
FILE_COUNT=$(find dist -type f | wc -l)
SIZE_BYTES=$(du -sb dist | cut -f1)
SIZE_MB=$(echo "scale=2; $SIZE_BYTES / 1048576" | bc)

echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ DEPLOYMENT COMPLETE                                    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Project:        $PROJECT_NAME"
echo "URL:            https://ai-tools.techbridge.edu.gh/$SUBDOMAIN_PATH"
echo "Files deployed: $FILE_COUNT"
echo "Size:           $SIZE_MB MB"
echo "Deployed at:    $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Verification:${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  1. Browser:"
echo "     https://ai-tools.techbridge.edu.gh/$SUBDOMAIN_PATH"
echo ""
echo "  2. Curl:"
echo "     curl -I https://ai-tools.techbridge.edu.gh/$SUBDOMAIN_PATH"
echo ""
echo "  3. Server logs:"
echo "     ssh $REMOTE_HOST 'tail -f /var/log/apache2/ai-tools.techbridge.edu.gh-access.log'"
echo ""
echo "  4. Clear cache (if needed):"
echo "     Ctrl+Shift+Delete in browser → Clear cached images and files"
echo ""
