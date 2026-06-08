package gh.edu.techbridge.wms.user;

import gh.edu.techbridge.wms.audit.AuditEvent;
import gh.edu.techbridge.wms.audit.AuditService;
import gh.edu.techbridge.wms.config.AuthProperties;
import org.springframework.http.HttpStatus;
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
    private final String allowedDomain;

    public AdminUserController(UserRepository users, AuditService audit, AuthProperties props) {
        this.users = users;
        this.audit = audit;
        this.allowedDomain = props.getAllowedDomain().toLowerCase();
    }

    @GetMapping
    public List<Map<String, Object>> list() {
        return users.findAll().stream().map(u -> Map.<String, Object>of(
                "id", u.getId(), "email", u.getEmail(), "name", u.getFullName(),
                "role", u.getRole().name(), "active", u.isActive(),
                "mfaRequired", u.isMfaRequired())).toList();
    }

    /**
     * Pre-provision a user before their first login so admins can build teams and assign
     * work ahead of time. The user is created with no TOTP secret; when they later sign in
     * via Google, the OAuth flow matches this existing record (by email) instead of
     * creating a new STUDENT. Domain-restricted to @techbridge.edu.gh (FR-AUTH-009).
     */
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, String> body, Authentication actor) {
        String email = body.getOrDefault("email", "").trim().toLowerCase();
        String name = body.getOrDefault("name", "").trim();
        if (email.isEmpty() || !email.endsWith(allowedDomain))
            return ResponseEntity.badRequest().body(Map.of("error", "Email must be a " + allowedDomain + " address"));
        if (users.findByEmail(email).isPresent())
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "A user with that email already exists"));
        Role role;
        try { role = body.get("role") == null ? Role.STUDENT : Role.valueOf(body.get("role")); }
        catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error", "Invalid role")); }

        User u = new User(email, name.isEmpty() ? email : name, null, role);
        // Per-user MFA override (decouples MFA from elevated WMS role; see SSO pass-through design).
        u.setMfaRequired(Boolean.parseBoolean(body.getOrDefault("mfaRequired", "false")));
        u = users.save(u);
        audit.record(AuditEvent.USER_PROVISIONED, email,
                "pre-provisioned as " + role + (u.isMfaRequired() ? " (mfaRequired)" : "") + " by " + actor.getName(), null);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", u.getId(), "email", u.getEmail(), "name", u.getFullName(),
                "role", u.getRole().name(), "active", u.isActive(), "mfaRequired", u.isMfaRequired()));
    }

    /** Toggle the per-user MFA override (force TOTP without granting an MFA-bearing role). */
    @PutMapping("/{id}/mfa-required")
    public ResponseEntity<?> setMfaRequired(@PathVariable Long id, @RequestBody Map<String, Boolean> body, Authentication actor) {
        boolean required = Boolean.TRUE.equals(body.get("mfaRequired"));
        return users.findById(id).<ResponseEntity<?>>map(u -> {
            u.setMfaRequired(required);
            users.save(u);
            audit.record(AuditEvent.USER_PROVISIONED, u.getEmail(),
                    "mfaRequired=" + required + " by " + actor.getName(), null);
            return ResponseEntity.ok(Map.of("id", u.getId(), "mfaRequired", required));
        }).orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "User not found")));
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

    /**
     * Edit a user's display name. Useful for pre-provisioned accounts (created with no name).
     * Note: once the user signs in with Google, their name is refreshed from Google on each login.
     */
    @PutMapping("/{id}/name")
    public ResponseEntity<?> setName(@PathVariable Long id, @RequestBody Map<String, String> body, Authentication actor) {
        String name = body.getOrDefault("name", "").trim();
        if (name.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "Name cannot be empty"));
        return users.findById(id).<ResponseEntity<?>>map(u -> {
            u.setFullName(name);
            users.save(u);
            audit.record(AuditEvent.USER_PROVISIONED, u.getEmail(), "name set by " + actor.getName(), null);
            return ResponseEntity.ok(Map.of("id", u.getId(), "name", u.getFullName()));
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
