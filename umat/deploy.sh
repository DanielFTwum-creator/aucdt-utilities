#!/bin/bash
# UMaT Tracker Deployment Script
# Simple SCP-based deployment

REMOTE_HOST="${1:-root@66.226.72.199}"
REMOTE_PATH="${2:-/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/umat/}"

echo "=== UMAT TRACKER DEPLOYMENT ==="
echo "Remote: $REMOTE_HOST"
echo "Path: $REMOTE_PATH"
echo ""

# Check dist exists
if [ ! -d "dist" ]; then
    echo "Building..."
    pnpm build || { echo "Build failed!"; exit 1; }
fi

echo "Creating directory..."
ssh -o StrictHostKeyChecking=no "$REMOTE_HOST" "mkdir -p $REMOTE_PATH && rm -rf $REMOTE_PATH/*" 2>/dev/null

echo "Copying files..."
scp -r -o StrictHostKeyChecking=no "dist/"* "$REMOTE_HOST:$REMOTE_PATH" 2>/dev/null

echo "Creating .htaccess..."
ssh -o StrictHostKeyChecking=no "$REMOTE_HOST" "cat > $REMOTE_PATH/.htaccess" << 'EOF' 2>/dev/null
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /umat/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /umat/index.html [QSA,L]
</IfModule>
EOF

echo "Setting permissions..."
ssh -o StrictHostKeyChecking=no "$REMOTE_HOST" "chown -R techbridge.edu.gh_md:psacln $REMOTE_PATH && chmod -R 755 $REMOTE_PATH && chmod 644 $REMOTE_PATH/.htaccess 2>/dev/null; true" 2>/dev/null

echo "✅ Deployment complete!"
echo "URL: https://ai-tools.techbridge.edu.gh/umat"
echo ""
