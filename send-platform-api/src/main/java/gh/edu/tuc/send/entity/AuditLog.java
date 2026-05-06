package gh.edu.tuc.send.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "audit_logs",
       indexes = @Index(name = "idx_audit_ts", columnList = "timestamp"))
@Getter @Setter
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String actor;       // username

    @Column(nullable = false, length = 100)
    private String action;      // e.g. CREATE_JOB, RUN_JOB

    @Column(nullable = false, length = 255)
    private String target;      // e.g. "Job #42"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private AuditStatus status = AuditStatus.SUCCESS;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(nullable = false, updatable = false)
    private Instant timestamp = Instant.now();

    public enum AuditStatus { SUCCESS, FAILURE }
}
