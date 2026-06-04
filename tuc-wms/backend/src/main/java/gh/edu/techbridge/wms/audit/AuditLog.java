package gh.edu.techbridge.wms.audit;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Append-only authentication audit record (FR-AUTH-006, NFR-SEC-007).
 * Retained 12 months. No update/delete is exposed — writes only.
 */
@Entity
@Table(name = "wms_audit_log", indexes = {
        @Index(name = "idx_audit_at", columnList = "occurredAt"),
        @Index(name = "idx_audit_email", columnList = "email")
})
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private AuditEvent event;

    /** Email/subject involved (may be a rejected non-domain account). */
    private String email;

    /** Optional free-text detail (e.g. rejection reason, role). */
    @Column(length = 512)
    private String detail;

    private String sourceIp;

    @Column(nullable = false, updatable = false)
    private Instant occurredAt = Instant.now();

    protected AuditLog() { }

    public AuditLog(AuditEvent event, String email, String detail, String sourceIp) {
        this.event = event;
        this.email = email;
        this.detail = detail;
        this.sourceIp = sourceIp;
    }

    public Long getId() { return id; }
    public AuditEvent getEvent() { return event; }
    public String getEmail() { return email; }
    public String getDetail() { return detail; }
    public String getSourceIp() { return sourceIp; }
    public Instant getOccurredAt() { return occurredAt; }
}
