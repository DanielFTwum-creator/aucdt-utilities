# TUC-WMS Deployment Log

Chronological record of backend deployments to **wms.techbridge.edu.gh** (66.226.72.199),
systemd unit `tuc-wms`, port **8081**, JDK 21 at `/opt/jdk/jdk-21`.

---

## 2026-06-05 — OAuth login 401 fix (oauth2Login base-URI collision)

- **Commit:** `01e5de69` on `fix/tuc-wms-oauth-base-collision`
- **Artifact:** `tuc-wms-1.0.1.jar` (built `mvn -DskipTests clean package`)
- **Root cause:** `oauth2Login` `authorizationEndpoint` `baseUri("/api/auth")` made
  Spring's `OAuth2AuthorizationRequestRedirectFilter` claim the whole `/api/auth/**`
  prefix; `POST /api/auth/exchange` was parsed as registrationId=`exchange` and rejected
  with `InvalidClientRegistrationIdException` (empty-body 401) before reaching
  `AuthController`. See `incident_oauth_base_uri_collision`.
- **Fix:** OAuth login moved to Spring default `/oauth2/**`; public entry
  `GET /api/auth/google` preserved via `OAuthEntryController` (302 →
  `/oauth2/authorization/google`). Google console redirect URI unchanged
  (`/api/auth/google/callback`) — **no console change required**.

### Procedure (best practice — backup, atomic swap, verify, auto-rollback)
1. Pre-deploy prod probe confirmed empty-body 401 on `/api/auth/exchange` (the bug).
2. `cp app.jar app.jar.bak.20260605-215648` (timestamped backup).
3. `scp tuc-wms-1.0.1.jar → /opt/tuc-wms/app.jar.new`.
4. `cp app.jar app.jar.predeploy` → `mv app.jar.new app.jar` → `systemctl restart tuc-wms`.
5. Verify loop (60s): success = `POST /api/auth/exchange` returns **401 with JSON `"error"` body**
   (proves the request reaches the controller). Auto-rollback to `app.jar.predeploy` on failure.

### Result — VERIFIED
| Endpoint | Before (old jar) | After (deployed) |
|---|---|---|
| `POST /api/auth/exchange` (bad code) | 401 **empty body** | `401 {"error":"Invalid or expired code"}` ✅ |
| `POST /api/auth/refresh` (no cookie) | 401 empty body | `401 {"error":"No refresh token"}` ✅ |
| `GET /api/auth/google` | 302 → Google | 302 → Google (unchanged) ✅ |

Confirmed both server-side (`127.0.0.1:8081`) and through the public URL
(`https://wms.techbridge.edu.gh`, i.e. through nginx/WAF). Service `active`.
Rollback artifacts retained: `app.jar.predeploy`, `app.jar.bak.20260605-215648`.

### Known follow-up (not blocking)
- `DEPLOYMENT.md` line 106 expects `curl /actuator/health → 200`, but **actuator is not a
  dependency** — `/actuator/health` is not a real endpoint. Either add
  `spring-boot-starter-actuator` (and permit `/actuator/health`) or drop that check from the guide.
