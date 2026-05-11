package gh.edu.tuc.lyriastream.security;

import gh.edu.tuc.lyriastream.config.AppProperties;
import gh.edu.tuc.lyriastream.domain.entity.UserEntity;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    private final AppProperties props;

    public JwtService(AppProperties props) {
        this.props = props;
    }

    // ── Token generation ──────────────────────────────────────────────────────

    public String generateAccessToken(UserEntity user) {
        return buildToken(user, props.jwt().accessExpiryMs(), Map.of(
            "role", user.getRole().name(),
            "type", "access"
        ));
    }

    public String generateRefreshToken(UserEntity user) {
        return buildToken(user, props.jwt().refreshExpiryMs(), Map.of(
            "type", "refresh"
        ));
    }

    private String buildToken(UserEntity user, long expiryMs, Map<String, Object> claimsSpec) {
        Date now = new Date();
        return Jwts.builder()
            .subject(user.getUuid())
            .issuedAt(now)
            .expiration(new Date(now.getTime() + expiryMs))
            .claims(claimsSpec)
            .signWith(signingKey(), Jwts.SIG.HS512)
            .compact();
    }

    // ── Token validation ──────────────────────────────────────────────────────

    public boolean isValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.debug("Invalid JWT: {}", e.getMessage());
            return false;
        }
    }

    public String extractSubject(String token) {
        return parseClaims(token).getPayload().getSubject();
    }

    public String extractRole(String token) {
        return parseClaims(token).getPayload().get("role", String.class);
    }

    public String extractType(String token) {
        return parseClaims(token).getPayload().get("type", String.class);
    }

    public boolean isAccessToken(String token) {
        return "access".equals(extractType(token));
    }

    // ── Private ───────────────────────────────────────────────────────────────

    private Jws<Claims> parseClaims(String token) {
        return Jwts.parser()
            .verifyWith(signingKey())
            .build()
            .parseSignedClaims(token);
    }

    private SecretKey signingKey() {
        byte[] keyBytes = props.jwt().secret().getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
