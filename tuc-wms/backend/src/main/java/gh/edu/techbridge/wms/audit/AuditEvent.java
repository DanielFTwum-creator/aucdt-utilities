package gh.edu.techbridge.wms.audit;

/** Authentication audit event types (FR-AUTH-006). */
public enum AuditEvent {
    OAUTH_CALLBACK_SUCCESS,
    OAUTH_CALLBACK_FAILURE,
    OAUTH_DOMAIN_REJECTED,   // FR-AUTH-009
    USER_PROVISIONED,        // FR-AUTH-010
    JWT_ISSUED,
    JWT_REFRESHED,
    MFA_CHALLENGED,
    MFA_VERIFIED,
    MFA_FAILED,
    LOGOUT
}
