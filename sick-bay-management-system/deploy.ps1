param(
    [switch]$Build,
    [string]$Server = "root@techbridge.edu.gh"
)

$ErrorActionPreference = "Stop"
$APP_DIR = "C:\Development\github\aucdt-utilities\sick-bay-management-system"
$REMOTE_DIR = "/var/www/vhosts/system/ai-tools.techbridge.edu.gh/sickbay"
$PM2_APP = "sickbay"
$PORT = 3046

Write-Host "=== Deploying SickBay Management System to TUC AI-Lab ===" -ForegroundColor Green

if ($Build) {
    Write-Host "Building production frontend bundle..." -ForegroundColor Yellow
    Set-Location $APP_DIR
    pnpm build
}

Write-Host "Syncing build files and server to remote host..." -ForegroundColor Yellow
ssh $Server "mkdir -p $REMOTE_DIR"

# Copy dist build, server runtime, package.json, pnpm-lock.yaml, and documentation
scp -r "$APP_DIR\dist\*" "${Server}:${REMOTE_DIR}/"
scp -r "$APP_DIR\docs" "${Server}:${REMOTE_DIR}/"
scp "$APP_DIR\server.ts" "${Server}:${REMOTE_DIR}/"
scp "$APP_DIR\package.json" "${Server}:${REMOTE_DIR}/"
scp "$APP_DIR\pnpm-lock.yaml" "${Server}:${REMOTE_DIR}/"

Write-Host "Configuring remote environment and restarting PM2 process..." -ForegroundColor Yellow
$deployScript = @"
export NVM_DIR="`$HOME/.nvm"
[ -s "`$NVM_DIR/nvm.sh" ] && . "`$NVM_DIR/nvm.sh"
nvm use --lts >/dev/null 2>&1 || true

cd $REMOTE_DIR

# Install dependencies cleanly
pnpm install --silent 2>/dev/null || npm install --silent

# Configure .env
cat <<'EOF' > .env
PORT=$PORT
NODE_ENV=production
BASE_PATH=/sickbay
EOF

# Ensure PM2 hard restart
if pm2 describe $PM2_APP > /dev/null 2>&1; then
    pm2 delete $PM2_APP
fi

pm2 start server.ts --name "$PM2_APP" --interpreter npx --interpreter-args tsx --cwd "$REMOTE_DIR" --max-memory-restart 1G
pm2 save
"@

$encodedScript = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($deployScript))
ssh $Server "echo $encodedScript | base64 -d | bash"

Write-Host "=== SickBay Management System Deployed Successfully on Port $PORT ===" -ForegroundColor Green
