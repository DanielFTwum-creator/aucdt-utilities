package gh.edu.techbridge.wms.auth;

import gh.edu.techbridge.wms.audit.AuditEvent;
import gh.edu.techbridge.wms.audit.AuditService;
import gh.edu.techbridge.wms.config.AuthProperties;
import gh.edu.techbridge.wms.user.User;
import gh.edu.techbridge.wms.user.UserRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * SPA-facing auth endpoints (the server-side OAuth dance is handled by Spring
 * Security + OAuthSuccessHandler). Implements the post-callback steps of SRS §3.2
 * and FR-AUTH-002/006/008. The SPA is delivered separately; see AUTH_API.md.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository users;
    private final JwtService jwt;
    private final TotpService totp;
    private final AuditService audit;
    private final AuthProperties props;

    public AuthController(UserRepository users, JwtService jwt, TotpService totp,
                          AuditService audit, AuthProperties props) {
        this.users = users;
        this.jwt = jwt;
        this.totp = totp;
        this.audit = audit;
        this.props = props;
    }

    /** Exchange a short-lived signed auth code (from the OAuth redirect) for a JWT + refresh cookie. */
    @PostMapping("/exchange")
    public ResponseEntity<?> exchange(@RequestBody Map<String, String> body, HttpServletRequest req) {
        Optional<Long> uid = jwt.verifyHandoffToken(body.get("code"), "code");
        if (uid.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err("Invalid or expired code"));
        User user = users.findById(uid.get()).orElse(null);
        if (user == null || !user.isActive()) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(err("Account unavailable"));
        return issueSession(user, ip(req));
    }

    /** FR-AUTH-008 — verify TOTP for an MFA-pending session (HOD/SystemAdmin), then issue the JWT. */
    @PostMapping("/mfa/verify")
    public ResponseEntity<?> verifyMfa(@RequestBody Map<String, String> body, HttpServletRequest req) {
        String ticket = body.get("mfa_ticket");
        String code = body.get("code");
        Optional<Long> uid = jwt.verifyHandoffToken(ticket, "mfa");
        if (uid.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err("Invalid or expired MFA session"));
        User user = users.findById(uid.get()).orElse(null);
        if (user == null || !user.isActive()) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(err("Account unavailable"));

        if (!user.isMfaEnrolled() || !totp.verify(user.getTotpSecret(), code == null ? "" : code)) {
            audit.record(AuditEvent.MFA_FAILED, user.getEmail(), null, ip(req));
            // Re-issue a fresh ticket so the user can retry without restarting OAuth.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid code", "mfa_ticket", jwt.issueHandoffToken(user.getId(), "mfa", jwt.mfaTtl())));
        }
        audit.record(AuditEvent.MFA_VERIFIED, user.getEmail(), null, ip(req));
        return issueSession(user, ip(req));
    }

    /**
     * FR-AUTH-008 — begin first-time TOTP enrolment. Accepts the same short-lived
     * {@code mfa_ticket} the OAuth callback hands an MFA-required user, so a not-yet-enrolled
     * user can set up their authenticator BEFORE any JWT is issued (no chicken-and-egg).
     * Returns a fresh secret + otpauth URI; the secret is NOT persisted until confirm.
     */
    @PostMapping("/mfa/enroll/begin")
    public ResponseEntity<?> beginMfaEnrollment(@RequestBody Map<String, String> body) {
        String ticket = body.get("mfa_ticket");
        Optional<Long> uid = jwt.verifyHandoffToken(ticket, "mfa");
        if (uid.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err("Invalid or expired MFA session"));
        User user = users.findById(uid.get()).orElse(null);
        if (user == null || !user.isActive()) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(err("Account unavailable"));
        try {
            String secret = totp.generateSecret();
            String otpauthUri = totp.provisioningUri(user.getEmail(), secret);
            return ResponseEntity.ok(Map.of("secret", secret, "otpauthUri", otpauthUri));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err("Could not start enrolment"));
        }
    }

    /**
     * FR-AUTH-008 — confirm enrolment: verify the first TOTP code against the pending secret,
     * persist it (the user is now enrolled), and issue the session — same handoff as /mfa/verify.
     */
    @PostMapping("/mfa/enroll/confirm")
    public ResponseEntity<?> confirmMfaEnrollment(@RequestBody Map<String, String> body, HttpServletRequest req) {
        String ticket = body.get("mfa_ticket");
        String secret = body.get("secret");
        String code = body.get("code");
        Optional<Long> uid = jwt.verifyHandoffToken(ticket, "mfa");
        if (uid.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err("Invalid or expired MFA session"));
        User user = users.findById(uid.get()).orElse(null);
        if (user == null || !user.isActive()) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(err("Account unavailable"));

        if (secret == null || secret.isBlank() || !totp.verify(secret, code == null ? "" : code)) {
            audit.record(AuditEvent.MFA_FAILED, user.getEmail(), "enrolment", ip(req));
            // Re-issue a fresh ticket so the user can retry without restarting OAuth.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid code", "mfa_ticket", jwt.issueHandoffToken(user.getId(), "mfa", jwt.mfaTtl())));
        }
        user.setTotpSecret(secret);
        users.save(user);
        audit.record(AuditEvent.MFA_ENROLLED, user.getEmail(), "role=" + user.getRole(), ip(req));
        return issueSession(user, ip(req));
    }

    /** Silent re-auth: mint a new access token from the HttpOnly refresh cookie (FR-AUTH-002). */
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(name = "wms_refresh", required = false) String refresh,
                                     HttpServletRequest req) {
        if (refresh == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err("No refresh token"));
        try {
            Claims claims = jwt.parse(refresh);
            if (!jwt.isRefresh(claims)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err("Not a refresh token"));
            User user = users.findByEmail(claims.getSubject()).orElse(null);
            if (user == null || !user.isActive()) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(err("Account unavailable"));
            audit.record(AuditEvent.JWT_REFRESHED, user.getEmail(), null, ip(req));
            return ResponseEntity.ok(Map.of("access_token", jwt.issueAccessToken(user), "user", profile(user)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err("Invalid or expired refresh token"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest req) {
        ResponseCookie cleared = refreshCookie("", 0);
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cleared.toString()).body(Map.of("ok", true));
    }

    /** Issue access token (body) + refresh token (HttpOnly cookie) and audit it. */
    private ResponseEntity<?> issueSession(User user, String ip) {
        String access = jwt.issueAccessToken(user);
        String refresh = jwt.issueRefreshToken(user);
        audit.record(AuditEvent.JWT_ISSUED, user.getEmail(), "role=" + user.getRole(), ip);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie(refresh, jwt.refreshMaxAgeSeconds()).toString())
                .body(Map.of("access_token", access, "user", profile(user)));
    }

    private ResponseCookie refreshCookie(String value, long maxAgeSeconds) {
        return ResponseCookie.from("wms_refresh", value)
                .httpOnly(true).secure(true).sameSite("Lax").path("/api/auth").maxAge(maxAgeSeconds).build();
    }

    private Map<String, Object> profile(User u) {
        return Map.of("email", u.getEmail(), "name", u.getFullName(),
                "role", u.getRole().name(), "photoUrl", u.getPhotoUrl() == null ? "" : u.getPhotoUrl());
    }

    private Map<String, String> err(String msg) { return Map.of("error", msg); }

    private static String ip(HttpServletRequest req) {
        String xff = req.getHeader("X-Forwarded-For");
        return (xff != null && !xff.isBlank()) ? xff.split(",")[0].trim() : req.getRemoteAddr();
    }
}
