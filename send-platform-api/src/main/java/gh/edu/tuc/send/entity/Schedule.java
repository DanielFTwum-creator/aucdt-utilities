package gh.edu.tuc.send.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "schedules")
@Getter @Setter
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference("job-schedule")
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false, unique = true)
    private ReportJob job;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String cronExpression;

    @Column(nullable = false, length = 60)
    private String timezone = "Africa/Accra";

    @Column(nullable = false)
    private boolean active = true;

    private Instant nextRunAt;

    private Instant lastRunAt;
}
