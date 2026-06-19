package gh.edu.techbridge.wms.task;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "wms_task_comments", indexes = {
        @Index(name = "idx_comment_task", columnList = "taskId")
})
public class TaskComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long taskId;

    @Column(nullable = false)
    private Long authorId;

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected TaskComment() { }

    public TaskComment(Long taskId, Long authorId, String content) {
        this.taskId = taskId;
        this.authorId = authorId;
        this.content = content;
    }

    public Long getId() { return id; }
    public Long getTaskId() { return taskId; }
    public Long getAuthorId() { return authorId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Instant getCreatedAt() { return createdAt; }
}
