package gh.edu.techbridge.wms.auth;

import gh.edu.techbridge.wms.audit.AuditEvent;
import gh.edu.techbridge.wms.audit.AuditService;
import gh.edu.techbridge.wms.config.AuthProperties;
import gh.edu.techbridge.wms.user.Role;
import gh.edu.techbridge.wms.user.User;
import gh.edu.techbridge.wms.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Resolves a Google-authenticated profile to a TUC-WMS user:
 *  - FR-AUTH-009: reject any non-@techbridge.edu.gh account (caller returns 403).
 *  - FR-AUTH-010: first-login provisioning with default role STUDENT.
 *  - FR-AUTH-004: a deactivated TUC-WMS account is denied even if Google is active.
 */
@Service
public class GoogleOAuthService {

    /** Thrown for a non-domain account — the callback maps this to HTTP 403 (FR-AUTH-009). */
    public static class DomainRejectedException extends RuntimeException {
        public DomainRejectedException(String email) { super(email); }
    }

    /** Thrown when a matched TUC-WMS account has been deactivated (FR-AUTH-004). */
    public static class AccountDeactivatedException extends RuntimeException {
        public AccountDeactivatedException(String email) { super(email); }
    }

    private final UserRepository users;
    private final AuditService audit;
    private final String allowedDomain;

    public GoogleOAuthService(UserRepository users, AuditService audit, AuthProperties props) {
        this.users = users;
        this.audit = audit;
        this.allowedDomain = props.getAllowedDomain().toLowerCase();
    }

    @Transactional
    public User resolveOrProvision(String email, String fullName, String photoUrl, String sourceIp) {
        String normalized = email == null ? "" : email.trim().toLowerCase();

        // FR-AUTH-009 — domain enforcement (before any record lookup).
        if (!normalized.endsWith(allowedDomain)) {
            audit.record(AuditEvent.OAUTH_DOMAIN_REJECTED, normalized, "domain not " + allowedDomain, sourceIp);
            throw new DomainRejectedException(normalized);
        }

        User user = users.findByEmail(normalized).orElse(null);

        // FR-AUTH-010 — first-login provisioning (default role STUDENT).
        if (user == null) {
            user = users.save(new User(normalized, fullName, photoUrl, Role.STUDENT));
            audit.record(AuditEvent.USER_PROVISIONED, normalized, "role=STUDENT", sourceIp);
        } else {
            // Refresh mutable profile fields from Google on each login.
            user.setFullName(fullName);
            user.setPhotoUrl(photoUrl);
        }

        // FR-AUTH-004 — deactivated TUC-WMS users lose access immediately.
        if (!user.isActive()) {
            audit.record(AuditEvent.OAUTH_CALLBACK_FAILURE, normalized, "account deactivated", sourceIp);
            throw new AccountDeactivatedException(normalized);
        }

        user.setLastLoginAt(Instant.now());
        audit.record(AuditEvent.OAUTH_CALLBACK_SUCCESS, normalized, "role=" + user.getRole(), sourceIp);
        return user;
    }
}
