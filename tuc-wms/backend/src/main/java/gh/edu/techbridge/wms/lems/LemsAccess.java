package gh.edu.techbridge.wms.lems;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;

import java.util.Set;

/**
 * LEMS access policy. Every /api/lems/** request is already authenticated
 * (WMS JWT — staff and students alike, all @techbridge.edu.gh). Admin
 * operations additionally require one of the staff-admin roles.
 */
public final class LemsAccess {

    private static final Set<String> ADMIN_AUTHORITIES =
            Set.of("ROLE_SYSTEM_ADMIN", "ROLE_HOD", "ROLE_ADMIN_STAFF");

    private LemsAccess() { }

    public static boolean isAdmin(Authentication auth) {
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> ADMIN_AUTHORITIES.contains(a.getAuthority()));
    }

    public static void requireAdmin(Authentication auth) {
        if (!isAdmin(auth)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "This area is restricted to LEMS administrators.");
        }
    }
}
