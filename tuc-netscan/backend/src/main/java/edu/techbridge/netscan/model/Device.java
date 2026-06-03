package edu.techbridge.netscan.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "device")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Device {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mac_address", nullable = false, unique = true, length = 17)
    private String macAddress;

    @Column(name = "ip_address", nullable = false, length = 45)
    private String ipAddress;

    @Column(name = "hostname")
    private String hostname;

    @Column(name = "manufacturer")
    private String manufacturer;

    @Column(name = "custom_label")
    private String customLabel;

    @Column(name = "os_fingerprint")
    private String osFingerprint;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private DeviceStatus status = DeviceStatus.ACTIVE;

    @Column(name = "in_adr", nullable = false)
    @Builder.Default
    private Boolean inAdr = false;

    @Column(name = "first_seen_at", nullable = false)
    private Instant firstSeenAt;

    @Column(name = "last_seen_at", nullable = false)
    private Instant lastSeenAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private Instant updatedAt = Instant.now();

    @PreUpdate
    public void preUpdate() { this.updatedAt = Instant.now(); }

    public enum DeviceStatus { ACTIVE, INACTIVE, BLOCKED, ROGUE }
}
