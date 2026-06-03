package edu.techbridge.netscan.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity @Table(name = "latency_sample")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class LatencySample {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "device_id", nullable = false) private Device device;
    @Column(name = "rtt_ms", precision = 10, scale = 3) private BigDecimal rttMs;
    @Column(name = "packet_loss", nullable = false, precision = 5, scale = 2) @Builder.Default private BigDecimal packetLoss = BigDecimal.ZERO;
    @Column(name = "sampled_at", nullable = false) private Instant sampledAt;
}
