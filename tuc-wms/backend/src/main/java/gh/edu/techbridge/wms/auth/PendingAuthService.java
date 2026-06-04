package gh.edu.techbridge.wms.auth;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Short-lived, single-use tokens used to bridge the server-side OAuth callback
 * to the separately-delivered SPA (best-practice handoff — keeps JWTs out of
 * the redirect URL/history):
 *
 *  - AUTH CODE: issued after a fully-authenticated callback (or after MFA). The
 *    SPA exchanges it once at POST /api/auth/exchange for the JWT + refresh cookie.
 *  - MFA TICKET: issued when the resolved role requires MFA (FR-AUTH-008). The SPA
 *    presents it with the TOTP code at POST /api/auth/mfa/verify.
 *
 * In-memory for Phase 1 (single instance). Move to Redis if horizontally scaled.
 */
@Service
public class PendingAuthService {

    private static final Duration TTL = Duration.ofMinutes(5);
    private static final SecureRandom RNG = new SecureRandom();

    private record Entry(Long userId, Instant expiresAt) { }

    private final Map<String, Entry> authCodes = new ConcurrentHashMap<>();
    private final Map<String, Entry> mfaTickets = new ConcurrentHashMap<>();

    public String issueAuthCode(Long userId) { return put(authCodes, userId); }
    public String issueMfaTicket(Long userId) { return put(mfaTickets, userId); }

    /** Consume an auth code (single-use). Returns the userId if valid+unexpired. */
    public Optional<Long> consumeAuthCode(String code) { return consume(authCodes, code); }

    /** Consume an MFA ticket (single-use). Returns the userId if valid+unexpired. */
    public Optional<Long> consumeMfaTicket(String ticket) { return consume(mfaTickets, ticket); }

    private String put(Map<String, Entry> store, Long userId) {
        byte[] b = new byte[32];
        RNG.nextBytes(b);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(b);
        store.put(token, new Entry(userId, Instant.now().plus(TTL)));
        return token;
    }

    private Optional<Long> consume(Map<String, Entry> store, String token) {
        if (token == null) return Optional.empty();
        Entry e = store.remove(token);   // single-use
        if (e == null || Instant.now().isAfter(e.expiresAt())) return Optional.empty();
        return Optional.of(e.userId());
    }
}
