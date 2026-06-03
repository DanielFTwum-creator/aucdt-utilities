package edu.techbridge.netscan.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity @Table(name = "block_entry")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BlockEntry {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "device_id", nullable = false) private Device device;
    @Column(nullable = false, columnDefinition = "TEXT") private String reason;
    @Column(name = "blocked_by", nullable = false) private String blockedBy;
    @Column(name = "blocked_at", nullable = false) @Builder.Default private Instant blockedAt = Instant.now();
    @Column(name = "unblocked_at") private Instant unblockedAt;
    @Column(nullable = false) @Builder.Default private Boolean active = true;
    @Column(name = "script_text", columnDefinition = "TEXT") private String scriptText;
}
