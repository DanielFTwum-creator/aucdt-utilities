package gh.edu.techbridge.wms.user;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/** Current authenticated user (from the access JWT). For the WMS UI. */
@RestController
@RequestMapping("/api")
public class MeController {

    private final UserRepository users;

    public MeController(UserRepository users) {
        this.users = users;
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        return users.findByEmail(auth.getName())
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(Map.of(
                        "email", u.getEmail(),
                        "name", u.getFullName(),
                        "role", u.getRole().name(),
                        "photoUrl", u.getPhotoUrl() == null ? "" : u.getPhotoUrl(),
                        "mfaEnrolled", u.isMfaEnrolled())))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }

    /**
     * Minimal active-user directory for member pickers (any authenticated user, not just admin):
     * just id/email/name so project Owners can select existing users to add. Roles, status and
     * MFA state stay admin-only via /api/admin/users.
     */
    @GetMapping("/users")
    public List<Map<String, Object>> directory() {
        return users.findAll().stream()
                .filter(User::isActive)
                .map(u -> Map.<String, Object>of(
                        "userId", u.getId(), "email", u.getEmail(), "name", u.getFullName()))
                .toList();
    }
}
