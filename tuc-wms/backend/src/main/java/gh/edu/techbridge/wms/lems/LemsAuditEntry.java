package gh.edu.techbridge.wms.lems;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

import java.time.Instant;

/** LEMS module audit trail (separate from the WMS auth audit log). */
@Entity
@Table(name = "wms_lems_audit_log", indexes = {
        @Index(name = "idx_lems_audit_created", columnList = "createdAt")
})
public class LemsAuditEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String eventType;

    @Column(nullable = false, length = 2048)
    private String description;

    private String status;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(length = 2048)
    private String details;

    protected LemsAuditEntry() { }

    public LemsAuditEntry(String eventType, String description, String status, String details) {
        this.eventType = eventType;
        this.description = description;
        this.status = status;
        this.details = details;
    }

    public Long getId() { return id; }
    public String getEventType() { return eventType; }
    public String getDescription() { return description; }
    public String getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public String getDetails() { return details; }
}
