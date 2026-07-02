package gh.edu.techbridge.wms.netscan;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * NetScan-domain audit entry (device scans, blocks, unblocks, alert acknowledgements).
 * Separate from the WMS auth audit log (wms_audit_log) — different domain, different retention.
 */
@Entity
@Table(name = "ns_audit_entries", indexes = {
        @Index(name = "idx_ns_audit_actor",   columnList = "actor"),
        @Index(name = "idx_ns_audit_created", columnList = "createdAt")
})
public class NsAuditEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 128)
    private String actor;

    @Column(nullable = false, length = 32)
    private String actionType;

    /** The subject of the action: MAC, IP, subnet, alert ID, etc. */
    @Column(nullable = false, length = 128)
    private String targetId;

    @Column(length = 512)
    private String reason;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected NsAuditEntry() {}

    public NsAuditEntry(String actor, String actionType, String targetId, String reason) {
        this.actor      = actor;
        this.actionType = actionType;
        this.targetId   = targetId;
        this.reason     = reason;
    }

    public Long getId()           { return id; }
    public String getActor()      { return actor; }
    public String getActionType() { return actionType; }
    public String getTargetId()   { return targetId; }
    public String getReason()     { return reason; }
    public Instant getCreatedAt() { return createdAt; }
}
