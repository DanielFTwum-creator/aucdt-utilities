package gh.edu.techbridge.wms.netscan;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * A network security or operational alert raised by the scanner or ICT staff.
 */
@Entity
@Table(name = "ns_alerts", indexes = {
        @Index(name = "idx_ns_alert_status",   columnList = "status"),
        @Index(name = "idx_ns_alert_created",  columnList = "createdAt")
})
public class NsAlert {

    public enum Status { ACTIVE, ACKNOWLEDGED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 32)
    private String alertType;

    @Column(nullable = false, length = 16)
    private String severity;

    @Column(nullable = false, length = 128)
    private String title;

    @Column(nullable = false, length = 512)
    private String message;

    /** Optional: the device this alert relates to. */
    private Long deviceId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16, columnDefinition = "varchar(16)")
    private Status status = Status.ACTIVE;

    @Column(length = 512)
    private String ackNote;

    @Column(length = 128)
    private String ackedBy;

    private Instant ackedAt;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected NsAlert() {}

    public NsAlert(String alertType, String severity, String title, String message, Long deviceId) {
        this.alertType = alertType;
        this.severity  = severity;
        this.title     = title;
        this.message   = message;
        this.deviceId  = deviceId;
    }

    public Long getId()           { return id; }
    public String getAlertType()  { return alertType; }
    public String getSeverity()   { return severity; }
    public String getTitle()      { return title; }
    public String getMessage()    { return message; }
    public Long getDeviceId()     { return deviceId; }
    public Status getStatus()     { return status; }
    public void setStatus(Status status) { this.status = status; }
    public String getAckNote()    { return ackNote; }
    public void setAckNote(String ackNote) { this.ackNote = ackNote; }
    public String getAckedBy()    { return ackedBy; }
    public void setAckedBy(String ackedBy) { this.ackedBy = ackedBy; }
    public Instant getAckedAt()   { return ackedAt; }
    public void setAckedAt(Instant ackedAt) { this.ackedAt = ackedAt; }
    public Instant getCreatedAt() { return createdAt; }
}
