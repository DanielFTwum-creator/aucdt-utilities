package gh.edu.techbridge.wms.netscan;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * A network device seen on the TUC campus network.
 * Status transitions: ACTIVE <-> INACTIVE (scan results), ACTIVE -> BLOCKED (ICT action),
 * ROGUE (unknown device not in the Authorised Device Register).
 */
@Entity
@Table(name = "ns_devices", indexes = {
        @Index(name = "idx_ns_dev_mac",    columnList = "mac",    unique = true),
        @Index(name = "idx_ns_dev_status", columnList = "status")
})
public class NsDevice {

    public enum Status { ACTIVE, INACTIVE, BLOCKED, ROGUE }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 17)
    private String mac;

    @Column(length = 45)
    private String ip;

    @Column(length = 128)
    private String hostname;

    @Column(length = 128)
    private String manufacturer;

    /** ICT-assigned human label, e.g. "Cisco ISR 4321 Router". */
    @Column(length = 128)
    private String label;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16, columnDefinition = "varchar(16)")
    private Status status = Status.ACTIVE;

    /** True = in the Authorised Device Register (ADR); false = guest / unknown. */
    @Column(nullable = false)
    private boolean inAdr = false;

    @Column(nullable = false, updatable = false)
    private Instant firstSeen = Instant.now();

    @Column(nullable = false)
    private Instant lastSeen = Instant.now();

    protected NsDevice() {}

    public NsDevice(String mac, String ip, String hostname, String manufacturer,
                    String label, Status status, boolean inAdr) {
        this.mac = mac;
        this.ip = ip;
        this.hostname = hostname;
        this.manufacturer = manufacturer;
        this.label = label;
        this.status = status;
        this.inAdr = inAdr;
    }

    public Long getId()           { return id; }
    public String getMac()        { return mac; }
    public String getIp()         { return ip; }
    public void setIp(String ip)  { this.ip = ip; }
    public String getHostname()   { return hostname; }
    public String getManufacturer() { return manufacturer; }
    public String getLabel()      { return label; }
    public void setLabel(String label) { this.label = label; }
    public Status getStatus()     { return status; }
    public void setStatus(Status status) { this.status = status; }
    public boolean isInAdr()      { return inAdr; }
    public Instant getFirstSeen() { return firstSeen; }
    public Instant getLastSeen()  { return lastSeen; }
    public void setLastSeen(Instant lastSeen) { this.lastSeen = lastSeen; }
}
