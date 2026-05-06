#!/bin/bash

# UMaT Tracker Deployment Script
# Usage: ./deploy.sh [user@host] [remote-path]
# Example: ./deploy.sh root@66.226.72.199 /var/www/vhosts/ai-tools.techbridge.edu.gh/umat

set -e

# Configuration
SERVER_HOST="${1:-root@66.226.72.199}"
REMOTE_PATH="${2:-/var/www/vhosts/ai-tools.techbridge.edu.gh/umat}"
LOCAL_BUILD_DIR="./dist"

echo "======================================"
echo "UMaT Tracker Deployment"
echo "======================================"
echo "Server: $SERVER_HOST"
echo "Remote path: $REMOTE_PATH"
echo ""

# Check if dist directory exists
if [ ! -d "$LOCAL_BUILD_DIR" ]; then
    echo "❌ Build directory not found: $LOCAL_BUILD_DIR"
    echo "Building the application..."
    pnpm build
fi

echo ""
echo "📦 Uploading to server..."
echo ""

# Use rsync for better performance and resume capability
rsync -avz --delete "$LOCAL_BUILD_DIR/" "$SERVER_HOST:$REMOTE_PATH/" || {
    echo ""
    echo "⚠️  rsync failed. Trying with scp as fallback..."
    scp -r "$LOCAL_BUILD_DIR"/* "$SERVER_HOST:$REMOTE_PATH/"
}

echo ""
echo "======================================"
echo "✅ Deployment Complete!"
echo "======================================"
echo ""
echo "Access the app at:"
echo "  https://ai-tools.techbridge.edu.gh/umat/"
echo ""
echo "To verify deployment, run:"
echo "  ssh $SERVER_HOST 'ls -lh $REMOTE_PATH/'"
echo ""
