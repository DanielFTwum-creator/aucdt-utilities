package gh.edu.techbridge.wms.auth;

import gh.edu.techbridge.wms.config.AuthProperties;
import gh.edu.techbridge.wms.user.Role;
import gh.edu.techbridge.wms.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

/**
 * Issues and validates TUC-WMS JWTs (FR-AUTH-002): a 15-min access token and a
 * 7-day refresh token. Tokens are signed with HS256 over the configured secret.
 */
@Service
public class JwtService {

    private final SecretKey key;
    private final long accessMinutes;
    private final long refreshDays;

    public JwtService(AuthProperties props) {
        byte[] secret = props.getJwtSecret().getBytes(StandardCharsets.UTF_8);
        if (secret.length < 32) {
            throw new IllegalStateException("JWT_SECRET must be at least 256 bits (32 bytes). Generate: openssl rand -hex 32");
        }
        this.key = Keys.hmacShaKeyFor(secret);
        this.accessMinutes = props.getJwtExpiryMinutes();
        this.refreshDays = props.getJwtRefreshExpiryDays();
    }

    public String issueAccessToken(User user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("uid", user.getId())
                .claim("role", user.getRole().name())
                .claim("name", user.getFullName())
                .claim("typ", "access")
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(Duration.ofMinutes(accessMinutes))))
                .signWith(key)
                .compact();
    }

    public String issueRefreshToken(User user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("uid", user.getId())
                .claim("typ", "refresh")
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(Duration.ofDays(refreshDays))))
                .signWith(key)
                .compact();
    }

    /**
     * Short-lived, self-contained handoff token bridging the server-side OAuth
     * callback to the separately-delivered SPA. Replaces the former in-memory
     * PendingAuthService map so the handoff survives a backend restart and works
     * across instances (no shared store, no Redis — honours the dev zero-dependency
     * contract). The narrow TTL is the single-use bound:
     *   - "code" (5m) : exchanged once at POST /api/auth/exchange for the JWT pair.
     *   - "mfa"  (5m) : presented with the TOTP code at POST /api/auth/mfa/verify.
     */
    public String issueHandoffToken(Long userId, String type, Duration ttl) {
        Instant now = Instant.now();
        return Jwts.builder()
                .claim("uid", userId)
                .claim("typ", type)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(ttl)))
                .signWith(key)
                .compact();
    }

    /** Verify a handoff token of the given type and return its userId, or empty if invalid/expired/wrong-type. */
    public java.util.Optional<Long> verifyHandoffToken(String token, String type) {
        if (token == null) return java.util.Optional.empty();
        try {
            Claims c = parse(token);
            if (!type.equals(c.get("typ", String.class))) return java.util.Optional.empty();
            Number uid = c.get("uid", Number.class);
            return uid == null ? java.util.Optional.empty() : java.util.Optional.of(uid.longValue());
        } catch (Exception e) {
            return java.util.Optional.empty();
        }
    }

    public Duration codeTtl() { return Duration.ofMinutes(5); }  // AUTH_API.md: "expires in 5 minutes"
    public Duration mfaTtl()  { return Duration.ofMinutes(5); }

    public Claims parse(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    public boolean isRefresh(Claims claims) {
        return "refresh".equals(claims.get("typ", String.class));
    }

    public Role roleOf(Claims claims) {
        return Role.valueOf(claims.get("role", String.class));
    }

    public long refreshMaxAgeSeconds() {
        return Duration.ofDays(refreshDays).toSeconds();
    }
}
