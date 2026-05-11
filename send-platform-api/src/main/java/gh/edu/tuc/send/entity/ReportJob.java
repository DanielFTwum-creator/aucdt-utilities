package gh.edu.tuc.send.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "report_jobs")
@Getter @Setter
public class ReportJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, updatable = false, columnDefinition = "VARCHAR(36)")
    private String uuid = UUID.randomUUID().toString();

    @NotBlank
    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Expose only safe owner fields — not the full User entity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonIgnoreProperties({"passwordHash", "authorities", "password",
                           "accountNonExpired", "accountNonLocked", "credentialsNonExpired"})
    private User owner;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String jsonDefinition;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OutputFormat outputFormat = OutputFormat.PDF;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private JobStatus status = JobStatus.ACTIVE;

    @Min(1) @Max(10)
    @Column(nullable = false)
    private int priority = 5;

    @Column(nullable = false)
    private int maxRetries = 3;

    @Column(nullable = false)
    private int timeoutSeconds = 300;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    @OneToOne(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("job-schedule")
    private Schedule schedule;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("job-delivery")
    private List<DeliveryTarget> deliveryTargets = new ArrayList<>();

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("startedAt DESC")
    @JsonManagedReference("job-executions")
    private List<ExecutionInstance> executions = new ArrayList<>();

    @PreUpdate
    void onUpdate() { this.updatedAt = Instant.now(); }

    public enum OutputFormat { PDF, XLSX, CSV, DOCX, HTML, JSON }
    public enum JobStatus    { ACTIVE, PAUSED, ARCHIVED, DELETED }
}
