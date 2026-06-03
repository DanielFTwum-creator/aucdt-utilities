package edu.techbridge.netscan.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity @Table(name = "network_interface")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class NetworkInterface {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String name;
    private String description;
    @Column(name = "ip_address") private String ipAddress;
    @Column(name = "link_capacity_mbps", nullable = false) @Builder.Default private Integer linkCapacityMbps = 100;
    @Column(name = "snmp_oid") private String snmpOid;
    @Column(nullable = false) @Builder.Default private Boolean active = true;
    @Column(name = "created_at", nullable = false, updatable = false) @Builder.Default private Instant createdAt = Instant.now();
}
