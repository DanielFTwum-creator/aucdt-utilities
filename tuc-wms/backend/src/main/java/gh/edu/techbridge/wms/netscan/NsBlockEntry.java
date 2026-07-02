package gh.edu.techbridge.wms.netscan;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * An ICT-initiated block record for a device.
 * Includes the generated iptables firewall script to be applied on the campus gateway.
 */
@Entity
@Table(name = "ns_block_entries", indexes = {
        @Index(name = "idx_ns_block_device", columnList = "deviceId"),
        @Index(name = "idx_ns_block_active",  columnList = "active")
})
public class NsBlockEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long deviceId;

    @Column(nullable = false, length = 17)
    private String mac;

    @Column(nullable = false, length = 512)
    private String reason;

    @Column(nullable = false, length = 128)
    private String blockedBy;

    @Column(nullable = false, updatable = false)
    private Instant blockedAt = Instant.now();

    private Instant unblockedAt;

    @Column(nullable = false)
    private boolean active = true;

    /** Generated iptables script — apply on campus gateway as root. */
    @Column(length = 2048)
    private String firewallScript;

    protected NsBlockEntry() {}

    public NsBlockEntry(Long deviceId, String mac, String reason, String blockedBy, String firewallScript) {
        this.deviceId       = deviceId;
        this.mac            = mac;
        this.reason         = reason;
        this.blockedBy      = blockedBy;
        this.firewallScript = firewallScript;
    }

    public Long getId()             { return id; }
    public Long getDeviceId()       { return deviceId; }
    public String getMac()          { return mac; }
    public String getReason()       { return reason; }
    public String getBlockedBy()    { return blockedBy; }
    public Instant getBlockedAt()   { return blockedAt; }
    public Instant getUnblockedAt() { return unblockedAt; }
    public void setUnblockedAt(Instant unblockedAt) { this.unblockedAt = unblockedAt; }
    public boolean isActive()       { return active; }
    public void setActive(boolean active) { this.active = active; }
    public String getFirewallScript() { return firewallScript; }
}
