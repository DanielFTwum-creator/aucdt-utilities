package gh.edu.techbridge.wms.user;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * TUC-WMS user record. Identity is owned by Google Workspace; this record holds
 * the TUC-WMS-side role, active flag, and (for HOD/SystemAdmin) the TOTP secret.
 * Provisioned on first OAuth callback for a verified domain account (FR-AUTH-010).
 */
@Entity
@Table(name = "wms_users", indexes = @Index(name = "idx_users_email", columnList = "email", unique = true))
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String fullName;

    @Column(length = 1024)
    private String photoUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private Role role = Role.STUDENT;

    /** Deactivated TUC-WMS users lose access immediately even if their Google account is active (FR-AUTH-004). */
    @Column(nullable = false)
    private boolean active = true;

    /** Base32 TOTP secret, encrypted at rest. Null until MFA is enrolled (FR-AUTH-008). */
    @Column(length = 512)
    private String totpSecret;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    private Instant lastLoginAt;

    protected User() { }

    public User(String email, String fullName, String photoUrl, Role role) {
        this.email = email;
        this.fullName = fullName;
        this.photoUrl = photoUrl;
        this.role = role;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public String getTotpSecret() { return totpSecret; }
    public void setTotpSecret(String totpSecret) { this.totpSecret = totpSecret; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(Instant lastLoginAt) { this.lastLoginAt = lastLoginAt; }

    public boolean isMfaEnrolled() { return totpSecret != null && !totpSecret.isBlank(); }
}
