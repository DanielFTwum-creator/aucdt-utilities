package gh.edu.techbridge.wms.netscan;

import jakarta.persistence.*;

/**
 * A monitored network interface (WAN uplink, core switch trunk, wireless APs, VLANs).
 * Seeded once from campus topology; updated via network admin tooling.
 */
@Entity
@Table(name = "ns_interfaces")
public class NsInterface {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String name;

    @Column(length = 128)
    private String description;

    @Column(length = 45)
    private String ipAddress;

    /** Rated link capacity in Mbit/s. Used to compute utilisation percentage. */
    @Column(nullable = false)
    private int capacityMbps;

    protected NsInterface() {}

    public NsInterface(String name, String description, String ipAddress, int capacityMbps) {
        this.name        = name;
        this.description = description;
        this.ipAddress   = ipAddress;
        this.capacityMbps = capacityMbps;
    }

    public Long getId()          { return id; }
    public String getName()      { return name; }
    public String getDescription() { return description; }
    public String getIpAddress() { return ipAddress; }
    public int getCapacityMbps() { return capacityMbps; }
}
