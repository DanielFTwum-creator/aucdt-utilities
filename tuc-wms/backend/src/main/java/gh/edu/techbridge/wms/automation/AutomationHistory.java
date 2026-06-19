package gh.edu.techbridge.wms.automation;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Run logs for Automation Rules (FR-AUTO-007).
 * Records each time a rule triggers, whether it succeeded, and what action occurred.
 */
@Entity
@Table(name = "wms_automation_history", indexes = {
        @Index(name = "idx_history_project", columnList = "projectId,runAt")
})
public class AutomationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long projectId;

    @Column(nullable = false)
    private Long ruleId;

    @Column(nullable = false, length = 100)
    private String ruleName;

    @Column(nullable = false)
    private Long taskId;

    @Column(nullable = false, length = 200)
    private String taskTitle;

    @Column(nullable = false, length = 20)
    private String status; // SUCCESS, FAILED, SKIPPED

    @Column(length = 1000)
    private String message;

    @Column(nullable = false)
    private Instant runAt = Instant.now();

    protected AutomationHistory() { }

    public AutomationHistory(Long projectId, Long ruleId, String ruleName, Long taskId, String taskTitle,
                             String status, String message) {
        this.projectId = projectId;
        this.ruleId = ruleId;
        this.ruleName = ruleName;
        this.taskId = taskId;
        this.taskTitle = taskTitle;
        this.status = status;
        this.message = message;
    }

    public Long getId() { return id; }
    public Long getProjectId() { return projectId; }
    public Long getRuleId() { return ruleId; }
    public String getRuleName() { return ruleName; }
    public Long getTaskId() { return taskId; }
    public String getTaskTitle() { return taskTitle; }
    public String getStatus() { return status; }
    public String getMessage() { return message; }
    public Instant getRunAt() { return runAt; }
}
