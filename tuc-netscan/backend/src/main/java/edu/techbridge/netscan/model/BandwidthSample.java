package edu.techbridge.netscan.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity @Table(name = "bandwidth_sample")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BandwidthSample {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "interface_id", nullable = false) private Long interfaceId;
    @Column(name = "bytes_in", nullable = false) @Builder.Default private Long bytesIn = 0L;
    @Column(name = "bytes_out", nullable = false) @Builder.Default private Long bytesOut = 0L;
    @Column(name = "utilisation_pct", nullable = false, precision = 5, scale = 2) @Builder.Default private BigDecimal utilisationPct = BigDecimal.ZERO;
    @Column(name = "sampled_at", nullable = false) private Instant sampledAt;
}
