package gh.edu.tuc.send.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "execution_instances",
       indexes = @Index(name = "idx_exec_job_id", columnList = "job_id"))
@Getter @Setter
public class ExecutionInstance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference("job-executions")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private ReportJob job;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ExecutionStatus status = ExecutionStatus.QUEUED;

    @Column(nullable = false, updatable = false)
    private Instant startedAt = Instant.now();

    private Instant completedAt;

    private Long durationMs;

    @Column(length = 500)
    private String outputPath;

    private Long outputSizeBytes;

    private Integer rowCount;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    private int retryCount = 0;

    public enum ExecutionStatus { QUEUED, RUNNING, COMPLETED, FAILED, TIMEOUT, CANCELLED }
}
