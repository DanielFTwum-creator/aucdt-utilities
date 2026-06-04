# TUC-WMS Deployment Guide (Phase 1 — OAuth backend)

Target: **wms.techbridge.edu.gh** on the shared Plesk/Ubuntu server (66.226.72.199).
Backend: Spring Boot 3 (Java 21). UI delivered separately (static SPA at the vhost root).

---

## ⚠️ JVM safety — JDK 21 alongside the existing Java 8 (Tomcat / api.techbridge.edu.gh)

The server runs an existing Java 8 service: **Tomcat** at `/opt/tomcat`, launched with a
**hardcoded absolute path** `/opt/jdk/jdk1.8.0_291/bin/java`. It does NOT use the PATH `java`
or `update-alternatives`.

**Therefore installing JDK 21 side-by-side is safe IF you follow these rules:**
1. Install JDK 21 to its **own directory** (`/opt/jdk/jdk-21`).
2. **Do NOT** run `update-alternatives --set java …` or change the global default
   (`update-alternatives` must stay `Status: auto` → Java 8). Verify with:
   `update-alternatives --query java | grep Value`  → must still show `…jdk1.8.0_291…`.
3. Point **only** the tuc-wms systemd unit at JDK 21 via an explicit `JAVA_HOME`/absolute path.

Result: Tomcat/api.techbridge.edu.gh keeps using its pinned Java 8, untouched.

### Install JDK 21 (Temurin) side-by-side
```bash
cd /opt/jdk
curl -fsSL -o jdk21.tar.gz https://github.com/adoptium/temurin21-binaries/releases/latest/download/OpenJDK21U-jdk_x64_linux_hotspot.tar.gz
tar xzf jdk21.tar.gz && mv jdk-21* jdk-21 && rm jdk21.tar.gz
/opt/jdk/jdk-21/bin/java -version   # expect 21.x
update-alternatives --query java | grep Value   # MUST still be jdk1.8.0_291 (default unchanged)
```

---

## Build & run

### Build the jar (locally or on a JDK 21 box)
```bash
cd tuc-wms/backend
mvn -DskipTests clean package
# -> target/tuc-wms-1.0.1.jar
```

### Deploy + systemd unit (port 8081 example — confirm a free port)
```bash
mkdir -p /opt/tuc-wms
scp target/tuc-wms-1.0.1.jar root@66.226.72.199:/opt/tuc-wms/app.jar
# copy the production .env to /opt/tuc-wms/.env (never commit; SRS §3.3)
```
`/etc/systemd/system/tuc-wms.service`:
```ini
[Unit]
Description=TUC-WMS (Spring Boot)
After=network.target

[Service]
WorkingDirectory=/opt/tuc-wms
EnvironmentFile=/opt/tuc-wms/.env
ExecStart=/opt/jdk/jdk-21/bin/java -jar /opt/tuc-wms/app.jar
SuccessExitStatus=143
Restart=on-failure
User=root

[Install]
WantedBy=multi-user.target
```
```bash
systemctl daemon-reload && systemctl enable --now tuc-wms
systemctl status tuc-wms          # confirm running on $PORT
curl -s localhost:8081/actuator/health
```

---

## Reverse proxy (best practice) — Plesk nginx/Apache

Serve the SPA statically at the vhost root; proxy API + OAuth to the Spring Boot port.
Add to the wms.techbridge.edu.gh vhost (Plesk → Apache & nginx → Additional nginx directives),
NOT .htaccess (see [[nginx_proxy_layer_plesk]] convention):

```nginx
# API + OAuth dance -> Spring Boot backend
location /api/ {
    proxy_pass http://127.0.0.1:8081;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
# SPA fallback for client-side routes (served from the vhost docroot)
location / {
    try_files $uri $uri/ /index.html;
}
```

## Google OAuth console
- Authorised redirect URI (must be byte-identical to `GOOGLE_REDIRECT_URI`):
  `https://wms.techbridge.edu.gh/api/auth/google/callback`
- Authorised JavaScript origin: `https://wms.techbridge.edu.gh`
- WAF: if Comodo/ModSecurity rule 210580 blocks the OAuth `scope` param on the callback,
  exempt `/api/auth/google/callback` (Plesk panel → Additional HTTPS directives) — same
  fix used for other ai-tools OAuth callbacks.

## Verify (SRS acceptance)
- Non-@techbridge.edu.gh Google account → redirected with `?error=domain` (FR-AUTH-009).
- First @techbridge.edu.gh login → auto-provisioned, role=STUDENT (FR-AUTH-010).
- HOD/SystemAdmin → MFA ticket path before JWT (FR-AUTH-008).
- `curl localhost:8081/actuator/health` → 200.
