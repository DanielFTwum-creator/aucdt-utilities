package gh.edu.techbridge.wms.automation;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Automation Rule entity (FR-AUTO-001..006). Scoped to a project.
 * Contains configuration for Trigger -> Condition -> Action evaluation.
 */
@Entity
@Table(name = "wms_automation_rules", indexes = {
        @Index(name = "idx_rule_project", columnList = "projectId,active")
})
public class AutomationRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long projectId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private boolean active = true;

    // Trigger configuration
    @Column(nullable = false, length = 40)
    private String triggerType; // TASK_CREATED, STATUS_CHANGED

    @Column(length = 100)
    private String triggerConfig; // e.g. target status

    // Condition configuration
    @Column(nullable = false, length = 40)
    private String conditionType; // NONE, PRIORITY_IS, HAS_TAG, IS_MILESTONE

    @Column(length = 100)
    private String conditionConfig; // e.g. CRITICAL, urgent

    // Action configuration
    @Column(nullable = false, length = 40)
    private String actionType; // ASSIGN_TO_USER, SET_PRIORITY, MOVE_TO_STATUS, SEND_NOTIFICATION_TO_OWNER

    @Column(length = 200)
    private String actionConfig; // e.g. user ID, priority name, status name

    @Column(nullable = false)
    private Long createdBy;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected AutomationRule() { }

    public AutomationRule(Long projectId, String name, String triggerType, String triggerConfig,
                          String conditionType, String conditionConfig, String actionType, String actionConfig,
                          Long createdBy) {
        this.projectId = projectId;
        this.name = name;
        this.triggerType = triggerType;
        this.triggerConfig = triggerConfig;
        this.conditionType = conditionType;
        this.conditionConfig = conditionConfig;
        this.actionType = actionType;
        this.actionConfig = actionConfig;
        this.createdBy = createdBy;
    }

    public Long getId() { return id; }
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public String getTriggerType() { return triggerType; }
    public void setTriggerType(String triggerType) { this.triggerType = triggerType; }
    public String getTriggerConfig() { return triggerConfig; }
    public void setTriggerConfig(String triggerConfig) { this.triggerConfig = triggerConfig; }
    public String getConditionType() { return conditionType; }
    public void setConditionType(String conditionType) { this.conditionType = conditionType; }
    public String getConditionConfig() { return conditionConfig; }
    public void setConditionConfig(String conditionConfig) { this.conditionConfig = conditionConfig; }
    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }
    public String getActionConfig() { return actionConfig; }
    public void setActionConfig(String actionConfig) { this.actionConfig = actionConfig; }
    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
    public Instant getCreatedAt() { return createdAt; }
}
