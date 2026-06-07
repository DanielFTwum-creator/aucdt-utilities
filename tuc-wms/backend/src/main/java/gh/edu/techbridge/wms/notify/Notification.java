package gh.edu.techbridge.wms.notify;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * In-app notification for a single recipient (FR-NOTIF-001/002/003/006).
 * The persistent, readable-later counterpart to the assignment email — created by the
 * same task events. Scoped strictly per recipient; the API only ever returns a user's own rows.
 */
@Entity
@Table(name = "wms_notifications", indexes = {
        @Index(name = "idx_notif_recipient", columnList = "recipientId,readFlag,createdAt"),
        @Index(name = "idx_notif_created", columnList = "createdAt")
})
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The user this notification belongs to (wms_users.id). */
    @Column(nullable = false)
    private Long recipientId;

    /** Event type, e.g. TASK_ASSIGNED. Plain varchar (not a DB enum — see AuditLog note). */
    @Column(nullable = false, length = 40)
    private String type;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 500)
    private String body;

    /** Deep-link context (nullable): /projects/{projectId}?task={taskId}. */
    private Long projectId;
    private Long taskId;

    @Column(nullable = false)
    private boolean readFlag = false;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected Notification() { }

    public Notification(Long recipientId, String type, String title, String body, Long projectId, Long taskId) {
        this.recipientId = recipientId;
        this.type = type;
        this.title = title;
        this.body = body;
        this.projectId = projectId;
        this.taskId = taskId;
    }

    public Long getId() { return id; }
    public Long getRecipientId() { return recipientId; }
    public String getType() { return type; }
    public String getTitle() { return title; }
    public String getBody() { return body; }
    public Long getProjectId() { return projectId; }
    public Long getTaskId() { return taskId; }
    public boolean isReadFlag() { return readFlag; }
    public void setReadFlag(boolean readFlag) { this.readFlag = readFlag; }
    public Instant getCreatedAt() { return createdAt; }
}
