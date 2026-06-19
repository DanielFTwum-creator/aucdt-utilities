package gh.edu.techbridge.wms.task;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "wms_task_activities", indexes = {
        @Index(name = "idx_activity_task", columnList = "taskId")
})
public class TaskActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long taskId;

    @Column(nullable = false)
    private Long actorId;

    @Column(nullable = false, length = 64)
    private String actionType;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String detail;

    @Column(nullable = false, updatable = false)
    private Instant occurredAt = Instant.now();

    protected TaskActivity() { }

    public TaskActivity(Long taskId, Long actorId, String actionType, String detail) {
        this.taskId = taskId;
        this.actorId = actorId;
        this.actionType = actionType;
        this.detail = detail;
    }

    public Long getId() { return id; }
    public Long getTaskId() { return taskId; }
    public Long getActorId() { return actorId; }
    public String getActionType() { return actionType; }
    public String getDetail() { return detail; }
    public Instant getOccurredAt() { return occurredAt; }
}
