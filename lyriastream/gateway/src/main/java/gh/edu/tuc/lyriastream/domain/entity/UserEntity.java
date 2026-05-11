package gh.edu.tuc.lyriastream.domain.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ls_users")
public class UserEntity {

    public enum Role { GUEST, FREE, PRO, ADMIN }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 36)
    private String uuid;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "display_name", length = 100)
    private String displayName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Role role = Role.FREE;

    @Column(name = "daily_quota")
    private int dailyQuota = 20;

    @Column(name = "quota_used_today")
    private int quotaUsedToday = 0;

    @Column(name = "email_verified")
    private boolean emailVerified = false;

    @Column(name = "totp_secret", length = 255)
    private String totpSecret;

    @Column(name = "is_active")
    private boolean active = true;

    @Column(name = "failed_login_attempts")
    private int failedLoginAttempts = 0;

    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public UserEntity() {}

    public UserEntity(Long id, String uuid, String email, String passwordHash, String displayName, Role role, int dailyQuota, int quotaUsedToday, boolean emailVerified, String totpSecret, boolean active, int failedLoginAttempts, LocalDateTime lockedUntil, LocalDateTime lastLoginAt, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.uuid = uuid;
        this.email = email;
        this.passwordHash = passwordHash;
        this.displayName = displayName;
        this.role = role;
        this.dailyQuota = dailyQuota;
        this.quotaUsedToday = quotaUsedToday;
        this.emailVerified = emailVerified;
        this.totpSecret = totpSecret;
        this.active = active;
        this.failedLoginAttempts = failedLoginAttempts;
        this.lockedUntil = lockedUntil;
        this.lastLoginAt = lastLoginAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Builder manual implementation
    public static UserEntityBuilder builder() {
        return new UserEntityBuilder();
    }

    public static class UserEntityBuilder {
        private Long id;
        private String uuid;
        private String email;
        private String passwordHash;
        private String displayName;
        private Role role = Role.FREE;
        private int dailyQuota = 20;
        private int quotaUsedToday = 0;
        private boolean emailVerified = false;
        private String totpSecret;
        private boolean active = true;
        private int failedLoginAttempts = 0;
        private LocalDateTime lockedUntil;
        private LocalDateTime lastLoginAt;

        public UserEntityBuilder id(Long id) { this.id = id; return this; }
        public UserEntityBuilder uuid(String uuid) { this.uuid = uuid; return this; }
        public UserEntityBuilder email(String email) { this.email = email; return this; }
        public UserEntityBuilder passwordHash(String passwordHash) { this.passwordHash = passwordHash; return this; }
        public UserEntityBuilder displayName(String displayName) { this.displayName = displayName; return this; }
        public UserEntityBuilder role(Role role) { this.role = role; return this; }
        public UserEntityBuilder dailyQuota(int dailyQuota) { this.dailyQuota = dailyQuota; return this; }
        public UserEntityBuilder quotaUsedToday(int quotaUsedToday) { this.quotaUsedToday = quotaUsedToday; return this; }
        public UserEntityBuilder emailVerified(boolean emailVerified) { this.emailVerified = emailVerified; return this; }
        public UserEntityBuilder totpSecret(String totpSecret) { this.totpSecret = totpSecret; return this; }
        public UserEntityBuilder active(boolean active) { this.active = active; return this; }
        public UserEntityBuilder failedLoginAttempts(int failedLoginAttempts) { this.failedLoginAttempts = failedLoginAttempts; return this; }
        public UserEntityBuilder lockedUntil(LocalDateTime lockedUntil) { this.lockedUntil = lockedUntil; return this; }
        public UserEntityBuilder lastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; return this; }

        public UserEntity build() {
            return new UserEntity(id, uuid, email, passwordHash, displayName, role, dailyQuota, quotaUsedToday, emailVerified, totpSecret, active, failedLoginAttempts, lockedUntil, lastLoginAt, null, null);
        }
    }

    // Getters / Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUuid() { return uuid; }
    public void setUuid(String uuid) { this.uuid = uuid; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String hash) { this.passwordHash = hash; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String name) { this.displayName = name; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public int getDailyQuota() { return dailyQuota; }
    public void setDailyQuota(int dq) { this.dailyQuota = dq; }
    public int getQuotaUsedToday() { return quotaUsedToday; }
    public void setQuotaUsedToday(int qu) { this.quotaUsedToday = qu; }
    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean ev) { this.emailVerified = ev; }
    public String getTotpSecret() { return totpSecret; }
    public void setTotpSecret(String ts) { this.totpSecret = ts; }
    public boolean isActive() { return active; }
    public void setActive(boolean act) { this.active = act; }
    public int getFailedLoginAttempts() { return failedLoginAttempts; }
    public void setFailedLoginAttempts(int fla) { this.failedLoginAttempts = fla; }
    public LocalDateTime getLockedUntil() { return lockedUntil; }
    public void setLockedUntil(LocalDateTime lu) { this.lockedUntil = lu; }
    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lla) { this.lastLoginAt = lla; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // ── Business helpers ──────────────────────────────────────────────────────
    public boolean isLocked() {
        return lockedUntil != null && lockedUntil.isAfter(LocalDateTime.now());
    }

    public boolean hasQuotaRemaining() {
        return quotaUsedToday < dailyQuota;
    }

    public void incrementQuota() {
        this.quotaUsedToday++;
    }

    public void resetDailyQuota() {
        this.quotaUsedToday = 0;
    }

    public void recordFailedLogin() {
        this.failedLoginAttempts++;
        if (this.failedLoginAttempts >= 5) {
            this.lockedUntil = LocalDateTime.now().plusMinutes(15);
        }
    }

    public void recordSuccessfulLogin() {
        this.failedLoginAttempts = 0;
        this.lockedUntil = null;
        this.lastLoginAt = LocalDateTime.now();
    }
}
