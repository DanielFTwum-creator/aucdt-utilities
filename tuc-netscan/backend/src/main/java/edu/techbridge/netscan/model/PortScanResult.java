package edu.techbridge.netscan.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity @Table(name = "port_scan_result")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PortScanResult {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "device_id", nullable = false) private Device device;
    @Column(nullable = false) private Integer port;
    @Column(nullable = false, length = 5) @Builder.Default private String protocol = "tcp";
    @Column(nullable = false) private String state;
    @Column(name = "service_name") private String serviceName;
    private String version;
    @Column(name = "is_new", nullable = false) @Builder.Default private Boolean isNew = false;
    @Column(name = "scanned_at", nullable = false) private Instant scannedAt;
}
