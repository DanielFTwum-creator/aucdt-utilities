package gh.edu.techbridge.wms.task;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * A task within a project (FR-TASK-001..004).
 * Fields: title, rich-text description, assignees, due date, priority, status
 * (a project workflow-stage name), tags. Sub-tasks are one level deep
 * (parentTaskId set, and a sub-task may not itself have children). Dependencies
 * are modelled as "blocked by" task ids.
 */
@Entity
@Table(name = "wms_tasks", indexes = {
        @Index(name = "idx_task_project", columnList = "projectId"),
        @Index(name = "idx_task_parent", columnList = "parentTaskId")
})
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long projectId;

    @Column(nullable = false, length = 500)
    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;   // rich text (HTML from Tiptap/Quill)

    /** Assignee user ids (FR-AUTH users). */
    @ElementCollection
    @CollectionTable(name = "wms_task_assignees", joinColumns = @JoinColumn(name = "task_id"))
    @Column(name = "user_id")
    private Set<Long> assigneeIds = new HashSet<>();

    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 16)
    private TaskPriority priority = TaskPriority.MEDIUM;

    /** Status = one of the parent project's workflow stage names (FR-TASK-002). */
    private String status;

    @ElementCollection
    @CollectionTable(name = "wms_task_tags", joinColumns = @JoinColumn(name = "task_id"))
    @Column(name = "tag")
    private Set<String> tags = new HashSet<>();

    /** Sub-task parent (one level deep only — FR-TASK-003). Null for top-level tasks. */
    private Long parentTaskId;

    /** Task ids this task is blocked by (FR-TASK-004). */
    @ElementCollection
    @CollectionTable(name = "wms_task_blocked_by", joinColumns = @JoinColumn(name = "task_id"))
    @Column(name = "blocking_task_id")
    private Set<Long> blockedByTaskIds = new HashSet<>();

    @Column(nullable = false)
    private Long createdByUserId;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    protected Task() { }

    public Task(Long projectId, String title, Long createdByUserId) {
        this.projectId = projectId;
        this.title = title;
        this.createdByUserId = createdByUserId;
    }

    @PreUpdate void touch() { this.updatedAt = Instant.now(); }

    public Long getId() { return id; }
    public Long getProjectId() { return projectId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Set<Long> getAssigneeIds() { return assigneeIds; }
    public void setAssigneeIds(Set<Long> v) { this.assigneeIds = v; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate v) { this.dueDate = v; }
    public TaskPriority getPriority() { return priority; }
    public void setPriority(TaskPriority v) { this.priority = v; }
    public String getStatus() { return status; }
    public void setStatus(String v) { this.status = v; }
    public Set<String> getTags() { return tags; }
    public void setTags(Set<String> v) { this.tags = v; }
    public Long getParentTaskId() { return parentTaskId; }
    public void setParentTaskId(Long v) { this.parentTaskId = v; }
    public Set<Long> getBlockedByTaskIds() { return blockedByTaskIds; }
    public void setBlockedByTaskIds(Set<Long> v) { this.blockedByTaskIds = v; }
    public Long getCreatedByUserId() { return createdByUserId; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
