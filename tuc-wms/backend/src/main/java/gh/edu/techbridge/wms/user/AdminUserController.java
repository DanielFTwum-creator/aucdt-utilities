package gh.edu.techbridge.wms.user;

import gh.edu.techbridge.wms.audit.AuditEvent;
import gh.edu.techbridge.wms.audit.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * SystemAdmin user management (FR-AUTH-004). Locked to ROLE_SYSTEM_ADMIN by
 * SecurityConfig (/api/admin/**). Deactivating a TUC-WMS account revokes access
 * immediately even if the Google account stays active.
 */
@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserRepository users;
    private final AuditService audit;

    public AdminUserController(UserRepository users, AuditService audit) {
        this.users = users;
        this.audit = audit;
    }

    @GetMapping
    public List<Map<String, Object>> list() {
        return users.findAll().stream().map(u -> Map.<String, Object>of(
                "id", u.getId(), "email", u.getEmail(), "name", u.getFullName(),
                "role", u.getRole().name(), "active", u.isActive())).toList();
    }

    /** Reassign a user's role (FR-AUTH-003/010 — HOD/SystemAdmin elevated only here, never auto-assigned). */
    @PutMapping("/{id}/role")
    public ResponseEntity<?> setRole(@PathVariable Long id, @RequestBody Map<String, String> body, Authentication actor) {
        Role role;
        try { role = Role.valueOf(body.get("role")); }
        catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error", "Invalid role")); }
        return users.findById(id).<ResponseEntity<?>>map(u -> {
            u.setRole(role);
            users.save(u);
            audit.record(AuditEvent.USER_PROVISIONED, u.getEmail(), "role set to " + role + " by " + actor.getName(), null);
            return ResponseEntity.ok(Map.of("id", u.getId(), "role", role.name()));
        }).orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }

    /** Deactivate / reactivate (FR-AUTH-004). */
    @PutMapping("/{id}/active")
    public ResponseEntity<?> setActive(@PathVariable Long id, @RequestBody Map<String, Boolean> body, Authentication actor) {
        boolean active = Boolean.TRUE.equals(body.get("active"));
        return users.findById(id).<ResponseEntity<?>>map(u -> {
            u.setActive(active);
            users.save(u);
            audit.record(AuditEvent.USER_PROVISIONED, u.getEmail(),
                    (active ? "reactivated" : "deactivated") + " by " + actor.getName(), null);
            return ResponseEntity.ok(Map.of("id", u.getId(), "active", active));
        }).orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }
}
