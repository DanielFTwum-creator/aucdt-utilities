package gh.edu.techbridge.wms.user;

/**
 * RBAC roles (FR-AUTH-003). Assigned server-side on JWT issuance — never chosen
 * by the user at login. New accounts default to STUDENT (FR-AUTH-010); HOD and
 * SYSTEM_ADMIN must be elevated manually and require TOTP MFA (FR-AUTH-008).
 */
public enum Role {
    STUDENT,
    LECTURER,
    ADMIN_STAFF,
    HOD,
    SYSTEM_ADMIN;

    /** Roles that must complete TOTP MFA after OAuth before a JWT is issued. */
    public boolean requiresMfa() {
        return this == HOD || this == SYSTEM_ADMIN;
    }

    /** Spring Security authority name, e.g. ROLE_SYSTEM_ADMIN. */
    public String authority() {
        return "ROLE_" + name();
    }
}
