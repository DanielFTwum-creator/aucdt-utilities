package com.lems.security;

import java.util.Set;

/**
 * Identity resolved from the TUC-WMS IdP (/api/me relay — SSO ecosystem
 * archetype C, TUC-ICT-SRS-2026-013 §5.1). All TUC accounts — staff and
 * students — are @techbridge.edu.gh, so any resolved identity proves
 * eligibility; the role decides admin access.
 */
public record WmsIdentity(String email, String name, String role) {

    private static final Set<String> ADMIN_ROLES = Set.of("SYSTEM_ADMIN", "HOD", "ADMIN_STAFF");

    public boolean isAdmin() {
        return role != null && ADMIN_ROLES.contains(role);
    }
}
