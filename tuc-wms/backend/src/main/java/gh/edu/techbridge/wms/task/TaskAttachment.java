package gh.edu.techbridge.wms.task;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "wms_task_attachments", indexes = {
        @Index(name = "idx_attachment_task", columnList = "taskId")
})
public class TaskAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long taskId;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String contentType;

    @Column(nullable = false)
    private Long fileSize;

    @Lob
    @Column(columnDefinition = "MEDIUMBLOB", nullable = false)
    private byte[] fileData;

    @Column(nullable = false)
    private Long uploadedById;

    @Column(nullable = false, updatable = false)
    private Instant uploadedAt = Instant.now();

    protected TaskAttachment() { }

    public TaskAttachment(Long taskId, String fileName, String contentType, Long fileSize, byte[] fileData, Long uploadedById) {
        this.taskId = taskId;
        this.fileName = fileName;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.fileData = fileData;
        this.uploadedById = uploadedById;
    }

    public Long getId() { return id; }
    public Long getTaskId() { return taskId; }
    public String getFileName() { return fileName; }
    public String getContentType() { return contentType; }
    public Long getFileSize() { return fileSize; }
    public byte[] getFileData() { return fileData; }
    public Long getUploadedById() { return uploadedById; }
    public Instant getUploadedAt() { return uploadedAt; }
}
