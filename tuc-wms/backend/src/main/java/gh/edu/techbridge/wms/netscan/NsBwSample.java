package gh.edu.techbridge.wms.netscan;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * A point-in-time bandwidth sample for a network interface.
 * Collected every ~30 seconds. Retention: keep last 24 hours in prod
 * (prune via scheduled task; not implemented in Phase 1).
 */
@Entity
@Table(name = "ns_bw_samples", indexes = {
        @Index(name = "idx_ns_bw_iface_time", columnList = "interfaceName, sampledAt")
})
public class NsBwSample {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 64)
    private String interfaceName;

    @Column(nullable = false)
    private long bytesIn;

    @Column(nullable = false)
    private long bytesOut;

    @Column(nullable = false)
    private double utilisationPct;

    @Column(nullable = false, updatable = false)
    private Instant sampledAt = Instant.now();

    protected NsBwSample() {}

    public NsBwSample(String interfaceName, long bytesIn, long bytesOut, double utilisationPct) {
        this.interfaceName  = interfaceName;
        this.bytesIn        = bytesIn;
        this.bytesOut       = bytesOut;
        this.utilisationPct = utilisationPct;
    }

    public Long getId()              { return id; }
    public String getInterfaceName() { return interfaceName; }
    public long getBytesIn()         { return bytesIn; }
    public long getBytesOut()        { return bytesOut; }
    public double getUtilisationPct() { return utilisationPct; }
    public Instant getSampledAt()    { return sampledAt; }
}
