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

# Copy dist build, server runtime, package.json, lockfile, db migrations, and documentation
scp -r "$APP_DIR\dist\*" "${Server}:${REMOTE_DIR}/"
scp -r "$APP_DIR\docs" "${Server}:${REMOTE_DIR}/"
scp -r "$APP_DIR\db" "${Server}:${REMOTE_DIR}/"
scp "$APP_DIR\server.ts" "${Server}:${REMOTE_DIR}/"
scp "$APP_DIR\package.json" "${Server}:${REMOTE_DIR}/"
# ship whichever lockfile exists (repo carries package-lock.json; pnpm-lock.yaml may be local/gitignored)
if (Test-Path "$APP_DIR\pnpm-lock.yaml") { scp "$APP_DIR\pnpm-lock.yaml" "${Server}:${REMOTE_DIR}/" }
elseif (Test-Path "$APP_DIR\package-lock.json") { scp "$APP_DIR\package-lock.json" "${Server}:${REMOTE_DIR}/" }

Write-Host "Configuring remote environment and restarting PM2 process..." -ForegroundColor Yellow
$deployScript = @"
export NVM_DIR="`$HOME/.nvm"
[ -s "`$NVM_DIR/nvm.sh" ] && . "`$NVM_DIR/nvm.sh"
nvm use --lts >/dev/null 2>&1 || true

cd $REMOTE_DIR

# Install dependencies cleanly
pnpm install --silent 2>/dev/null || npm install --silent

# .env: preserve existing secrets across deploys (DB creds set once via nano persist — Pattern 37).
# Only write a template on the FIRST deploy; never clobber an existing .env (that would wipe DB_PASS).
if [ ! -f .env ]; then
  cat <<'EOF' > .env
PORT=$PORT
NODE_ENV=production
BASE_PATH=/sickbay
DB_HOST=localhost
DB_PORT=3306
DB_USER=sickbay_app
DB_PASS=
DB_NAME=tuc_sickbay
WMS_BASE=https://wms.techbridge.edu.gh
EOF
  echo '[.env] template created — set DB_PASS via nano before the DB routes will work'
else
  echo '[.env] existing file preserved (DB credentials kept)'
fi

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
