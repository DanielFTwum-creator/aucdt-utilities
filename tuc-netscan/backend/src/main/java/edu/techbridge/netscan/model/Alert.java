package edu.techbridge.netscan.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity @Table(name = "alert")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Alert {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "alert_type", nullable = false) private String alertType;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private Severity severity;
    @Column(nullable = false) private String title;
    @Column(nullable = false, columnDefinition = "TEXT") private String message;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "device_id") private Device device;
    @Enumerated(EnumType.STRING) @Column(nullable = false) @Builder.Default private AlertStatus status = AlertStatus.ACTIVE;
    @Column(name = "ack_note", columnDefinition = "TEXT") private String ackNote;
    @Column(name = "acked_by") private String ackedBy;
    @Column(name = "acked_at") private Instant ackedAt;
    @Column(name = "created_at", nullable = false, updatable = false) @Builder.Default private Instant createdAt = Instant.now();

    public enum Severity { CRITICAL, WARNING, INFO }
    public enum AlertStatus { ACTIVE, ACKNOWLEDGED }
}
