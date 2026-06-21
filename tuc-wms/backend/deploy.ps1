# ============================================================
# TUC-WMS Backend — Deploy Script
# Remote : root@66.226.72.199 (mail.aucdt.edu.gh / techbridge.edu.gh)
# Service: tuc-wms.service  (systemd, Spring Boot 3, Java 21)
# Jar    : /opt/tuc-wms/app.jar   (ExecStart in /etc/systemd/system/tuc-wms.service)
# Env    : /opt/tuc-wms/.env      (EnvironmentFile — holds GEMINI_API_KEY etc.)
# URL    : https://wms.techbridge.edu.gh/
# Usage  : .\deploy.ps1            (build local jar -> scp -> restart -> verify)
#          .\deploy.ps1 -NoBuild   (skip mvn; ship the existing target jar)
#
# Builds the jar locally with Maven (Java 21 dev box), backs up the current
# remote jar, scps the new one to /opt/tuc-wms/app.jar, restarts the systemd
# service, and verifies via the PUBLIC health probe /api/gemini/health.
# The .env on the server is NEVER touched here — secrets stay server-side.
# Frontend + nginx /api proxy are deployed separately (frontend/deploy.ps1).
# ============================================================

param([switch]$NoBuild)

$ErrorActionPreference = 'Stop'

$REMOTE     = 'root@66.226.72.199'
$REMOTE_JAR = '/opt/tuc-wms/app.jar'
$SERVICE    = 'tuc-wms'
$POM        = Join-Path $PSScriptRoot 'pom.xml'
$LOCAL_JAR  = Join-Path $PSScriptRoot 'target\tuc-wms-1.0.1.jar'
$HEALTH_URL = 'https://wms.techbridge.edu.gh/api/gemini/health'
$SSH_OPTS   = @('-o', 'StrictHostKeyChecking=no', '-o', 'ServerAliveInterval=30', '-o', 'ServerAliveCountMax=3')
$START      = Get-Date

function Log($lvl, $msg, $color = 'White') {
    Write-Host ("[{0}][{1}] {2}" -f (Get-Date).ToString('HH:mm:ss'), $lvl, $msg) -ForegroundColor $color
}

Log 'INFO' '========================================' Cyan
Log 'INFO' 'TUC-WMS BACKEND DEPLOYMENT' Cyan
Log 'INFO' "Service: $SERVICE  ->  $REMOTE_JAR" Cyan

# ---- [1/5] Build the jar locally (unless -NoBuild) ----
if ($NoBuild) {
    Log 'INFO' '[1/5] Skipping build (-NoBuild); using existing jar.' Yellow
} else {
    Log 'INFO' '[1/5] Building jar (mvn -DskipTests package)...' Yellow
    mvn -f $POM -q -DskipTests package
    if ($LASTEXITCODE -ne 0) { Log 'ERROR' "Maven build failed ($LASTEXITCODE)" Red; exit 1 }
}
if (-not (Test-Path $LOCAL_JAR)) { Log 'ERROR' "Jar not found: $LOCAL_JAR" Red; exit 1 }
$sizeMB = [math]::Round((Get-Item $LOCAL_JAR).Length / 1MB, 1)
Log 'OK' "Local jar ready ($sizeMB MB)" Green

# ---- [2/5] Back up the current remote jar (timestamped) ----
Log 'INFO' '[2/5] Backing up current remote jar...' Yellow
ssh @SSH_OPTS $REMOTE "test -f $REMOTE_JAR && cp $REMOTE_JAR ${REMOTE_JAR}.bak.`$(date +%s) && echo backed-up || echo no-existing-jar"
if ($LASTEXITCODE -ne 0) { Log 'ERROR' 'Could not reach server / back up jar.' Red; exit 1 }

# ---- [3/5] Copy the new jar up ----
Log 'INFO' '[3/5] Uploading new jar (scp)...' Yellow
scp @SSH_OPTS $LOCAL_JAR "${REMOTE}:${REMOTE_JAR}"
if ($LASTEXITCODE -ne 0) { Log 'ERROR' "scp failed ($LASTEXITCODE)" Red; exit 1 }

# ---- [4/5] Restart the systemd service ----
Log 'INFO' '[4/5] Restarting service...' Yellow
ssh @SSH_OPTS $REMOTE "systemctl restart $SERVICE && sleep 4 && systemctl is-active $SERVICE"
if ($LASTEXITCODE -ne 0) {
    Log 'ERROR' 'Service did not come back active. Rolling back to latest backup...' Red
    ssh @SSH_OPTS $REMOTE "ls -t ${REMOTE_JAR}.bak.* 2>/dev/null | head -1 | xargs -r -I{} cp {} $REMOTE_JAR && systemctl restart $SERVICE && sleep 4 && systemctl is-active $SERVICE"
    Log 'WARN' 'Rolled back to previous jar. Investigate the build before retrying.' Yellow
    exit 1
}
Log 'OK' 'Service active.' Green

# ---- [5/5] Verify via the public health probe ----
Log 'INFO' '[5/5] Health check (public, no token)...' Yellow
$health = ssh @SSH_OPTS $REMOTE "curl -s -m 15 $HEALTH_URL"
Log 'INFO' "GET /api/gemini/health -> $health"
if ($health -match '"ready"\s*:\s*true') {
    Log 'SUCCESS' 'Gemini proxy READY — key is loaded.' Green
} elseif ($health -match '"ready"\s*:\s*false') {
    Log 'WARN' 'Endpoint live but key NOT loaded — check GEMINI_API_KEY in /opt/tuc-wms/.env, then restart.' Yellow
} else {
    Log 'WARN' "Unexpected health response (old jar still running?): $health" Yellow
}

$elapsed = [math]::Round(((Get-Date) - $START).TotalSeconds, 1)
Log 'SUCCESS' '========================================' Green
Log 'SUCCESS' "BACKEND DEPLOYMENT COMPLETE in ${elapsed}s" Green
Log 'SUCCESS' "Verify in browser: $HEALTH_URL" Green
Log 'SUCCESS' '========================================' Green
