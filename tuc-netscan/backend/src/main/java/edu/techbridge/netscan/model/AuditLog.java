package edu.techbridge.netscan.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity @Table(name = "audit_log")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuditLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "actor_username", nullable = false) private String actorUsername;
    @Column(name = "action_type", nullable = false) private String actionType;
    @Column(name = "target_id") private String targetId;
    @Column(nullable = false, columnDefinition = "TEXT") private String reason;
    @Column(name = "metadata_json", columnDefinition = "TEXT") private String metadataJson;
    @Column(name = "created_at", nullable = false, updatable = false) @Builder.Default private Instant createdAt = Instant.now();
}
