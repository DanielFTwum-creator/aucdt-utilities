# TUC-WMS Deployment Log

Chronological record of backend deployments to **wms.techbridge.edu.gh** (66.226.72.199),
systemd unit `tuc-wms`, port **8081**, JDK 21 at `/opt/jdk/jdk-21`.

---

## 2026-06-06 — Frontend feature build (Projects → Tasks → MFA → Kanban → Timeline)

Built the missing SPA on top of the existing backend APIs, deployed slice-by-slice
(`frontend/deploy.ps1 -Build` = server-side pnpm build from `main`). Backend redeploys used
backup → swap → verify (302 to Google + exchange reaches controller) → auto-rollback, 120s wait.

| Slice | Commit | What | FR |
|---|---|---|---|
| 1 Projects | `0ae41cba` | create form, detail tabs, members, settings/stages | FR-PROJ-001/002/004/005/006/007 |
| 2 Tasks | `8807ada2` | Tiptap modal, task fields, sub-tasks, deps, duplicate/delete | FR-TASK-001..004/008 |
| 2.5 MFA enrol | `0ee68ddd` | enroll/begin+confirm endpoints, MfaPage QR wizard (qrcode) | FR-AUTH-008 |
| — otpauth fix | `7bc3d1cf` | correct otpauth label encoding (was %40/%3A) so QR scans | FR-AUTH-008 |
| 3 Kanban | `9e36d326` | @dnd-kit board, WIP, filters, SSE (+JwtAuthFilter ?access_token for stream) | FR-KB-001..008 |
| 4 Timeline | `7cbe077b` | Gantt bars, milestones, dependency conflicts, zoom, groupBy | FR-TL-001..007 |

**First SYSTEM_ADMIN bootstrap (2026-06-06):** elevated exactly
`daniel.twum@techbridge.edu.gh` (id=1) STUDENT→SYSTEM_ADMIN via one-row H2 UPDATE on
`wms_users` (stop service → H2 Shell `UPDATE … WHERE LOWER(email)=LOWER('…')` → restart).
Table is `wms_users` (not `users`). `enrolled=FALSE` so first login triggers the MFA wizard.

## 2026-06-06 (cont.) — MFA enrol bugfix, lazy-init fix, Admin UI

- **otpauth QR / audit ENUM:** `7bc3d1cf` fixed otpauth label encoding; the "rejected MFA code"
  was actually an H2 native-ENUM `WMS_AUDIT_LOG.EVENT` rejecting the new `MFA_ENROLLED` value
  (rolled back enrolment). Fixed by `ALTER … VARCHAR(32)` on prod + `columnDefinition="varchar(32)"`
  in `AuditLog` (`07a26207`). **MFA login now works end-to-end (user confirmed).**
- **Lazy-init fix (`f572c57a`):** clicking a project failed — `GET /projects/{id}`, board, timeline,
  and task list/get serialized lazy `@ElementCollection`s (`stages`, task assignees/tags/blockedBy)
  after the session closed (`open-in-view=false`) → `LazyInitializationException`. Added
  `@Transactional(readOnly=true)` to the four reads; made Kanban `setWipLimits` `@Transactional`.
- **Admin UI (`ad5d707c`):** `AdminUsersPage` at `/admin/users` (SYSTEM_ADMIN only) — list users,
  change role, activate/deactivate; self-lockout guards; admin-only nav link. **No more DB surgery
  to grant roles** (FR-AUTH-004 fully usable).
- **Deploy hardening:** deploy script now verifies the uploaded jar's SHA-256 and polls the real
  endpoint for 302 (≤150s) instead of racing the ~8s cold start (a good jar was once false-rolled-back).

### ⚠️ Outstanding deploy gate — SSE nginx buffering (NOT yet applied)
Kanban live updates need `proxy_buffering off` on the `/stream` location in the Plesk nginx
vhost (see `PROJECTS_TASKS_API.md` §SSE). Until applied, the board still works (drag reloads it)
but cross-client updates may lag. Requires Plesk → Additional nginx directives.

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

### Frontend follow-up — login loop (same session)

After the backend fix, the exchange 401 was gone but login **looped back to `/login`**.
Cause: the **deployed frontend bundle was stale** (`index-CXLzvBwS.js`) — it predated the
AuthContext startup-refresh-race fix, so after a successful exchange the startup
`/api/auth/refresh` failure still called `clear()` and wiped the just-set session.

- **Fix already in source** (main `35110925`): AuthContext startup catch no longer `clear()`s —
  it only `setAccessToken(null)`, leaving a session the CallbackPage exchange may have set.
- **Action:** pushed main to origin, ran `tuc-wms/frontend/deploy.ps1 -Build` (server-side
  git clone of main → pnpm build → rsync → perms → SPA .htaccess).
- **Result:** new bundle `index-BFceEegR.js` deployed; health checks `/`, `/login`,
  `/auth/callback` → 200, `/api/auth/google` → 302. AuthContext code path confirmed present
  in the bundle (`/api/auth/refresh`, `/api/me`, `/api/auth/logout` strings; `setOnAuthLost`
  is minified/renamed so the literal won't grep — expected).
- **Lesson:** a backend-only deploy is not enough — the SPA bundle must be rebuilt from the
  same commit. Always check the deployed bundle hash vs. the intended build, and hard-refresh
  (Ctrl+Shift+R) to bust the old hashed bundle when re-testing.

### Third issue (same session) — loop BEFORE Google, nginx didn't proxy /oauth2/

After the frontend redeploy, login still looped — and the user **never reached Google's
account picker**. Cause: the first backend fix put OAuth login on a bare `/oauth2/**`
namespace, but the Plesk nginx vhost only proxies **`/api/`** to the backend.
`/oauth2/authorization/google` fell through to the static SPA (200 index.html → router
rendered `/login`) → loop before consent.

- **Fix** (commit `af96cf37`): `authorizationEndpoint.baseUri("/api/oauth2/authorization")`
  + `OAuthEntryController` redirects there; permitAll updated. Under `/api/` (nginx-proxied)
  yet off the `/api/auth/{registrationId}` path → avoids both the SPA fall-through and the
  original registration-id collision. Google console redirect URI unchanged.
- **Deploy note:** prod cold-start is ~37–40s (not ~5s local). First deploy verify failed on a
  70s timeout that was actually just too tight (curl returned `000` = connection refused during
  boot); re-deployed with a 120s wait keyed on the `Started TucWmsApplication` journal line.
- **Verified in prod (public URL, through nginx):**
  `GET /api/auth/google` → 302 `/api/oauth2/authorization/google` → 302 `accounts.google.com`
  (`redirect_uri=.../api/auth/google/callback`).
- **✅ END-TO-END CONFIRMED:** live Google sign-in completed — landed in the app as
  "Daniel Twum · STUDENT" (auto-provisioned, FR-AUTH-010), Projects page rendered. Loop gone.

### Known follow-up (not blocking)
- `DEPLOYMENT.md` line 106 expects `curl /actuator/health → 200`, but **actuator is not a
  dependency** — `/actuator/health` is not a real endpoint. Either add
  `spring-boot-starter-actuator` (and permit `/actuator/health`) or drop that check from the guide.
- WMS `.htaccess` (written by `frontend/deploy.ps1`) has **no `mod_expires`/`Cache-Control`
  block for `index.html`**, so stale SPA entry points can be cached — the reason hard refreshes
  were needed mid-debug. Add a `no-cache` header for `index.html` to make plain reloads reliable.
