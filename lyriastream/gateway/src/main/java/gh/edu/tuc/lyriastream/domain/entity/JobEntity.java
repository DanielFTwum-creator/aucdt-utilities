package gh.edu.tuc.lyriastream.domain.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ls_generation_jobs")
public class JobEntity {

    public enum Status { PENDING, PROCESSING, STREAMING, COMPLETE, FAILED }

    @Id
    @Column(length = 36)
    private String id;                      // UUID — returned to client as jobId

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.PENDING;

    @Column(name = "progress_pct")
    private int progressPct = 0;

    @Column(name = "aim_job_id", length = 36)
    private String aimJobId;

    @Column(name = "prompt", columnDefinition = "TEXT", nullable = false)
    private String prompt;

    @Column(name = "blend_recipe_json", columnDefinition = "JSON")
    private String blendRecipeJson;         // {modelId: weight, ...}

    @Column(name = "quality_mode", length = 20)
    private String qualityMode;

    @Column(name = "model_versions_json", columnDefinition = "JSON")
    private String modelVersionsJson;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public JobEntity() {}

    public JobEntity(String id, UserEntity user, Status status, int progressPct, String aimJobId, String prompt, String blendRecipeJson, String qualityMode, String modelVersionsJson, String errorMessage, LocalDateTime startedAt, LocalDateTime completedAt, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.status = status;
        this.progressPct = progressPct;
        this.aimJobId = aimJobId;
        this.prompt = prompt;
        this.blendRecipeJson = blendRecipeJson;
        this.qualityMode = qualityMode;
        this.modelVersionsJson = modelVersionsJson;
        this.errorMessage = errorMessage;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.createdAt = createdAt;
    }

    public static JobEntityBuilder builder() {
        return new JobEntityBuilder();
    }

    public static class JobEntityBuilder {
        private String id;
        private UserEntity user;
        private Status status = Status.PENDING;
        private int progressPct = 0;
        private String aimJobId;
        private String prompt;
        private String blendRecipeJson;
        private String qualityMode;
        private String modelVersionsJson;
        private String errorMessage;
        private LocalDateTime startedAt;
        private LocalDateTime completedAt;

        public JobEntityBuilder id(String id) { this.id = id; return this; }
        public JobEntityBuilder user(UserEntity user) { this.user = user; return this; }
        public JobEntityBuilder status(Status status) { this.status = status; return this; }
        public JobEntityBuilder progressPct(int progressPct) { this.progressPct = progressPct; return this; }
        public JobEntityBuilder aimJobId(String aimJobId) { this.aimJobId = aimJobId; return this; }
        public JobEntityBuilder prompt(String prompt) { this.prompt = prompt; return this; }
        public JobEntityBuilder blendRecipeJson(String blendRecipeJson) { this.blendRecipeJson = blendRecipeJson; return this; }
        public JobEntityBuilder qualityMode(String qualityMode) { this.qualityMode = qualityMode; return this; }
        public JobEntityBuilder modelVersionsJson(String modelVersionsJson) { this.modelVersionsJson = modelVersionsJson; return this; }
        public JobEntityBuilder errorMessage(String errorMessage) { this.errorMessage = errorMessage; return this; }
        public JobEntityBuilder startedAt(LocalDateTime startedAt) { this.startedAt = startedAt; return this; }
        public JobEntityBuilder completedAt(LocalDateTime completedAt) { this.completedAt = completedAt; return this; }

        public JobEntity build() {
            return new JobEntity(id, user, status, progressPct, aimJobId, prompt, blendRecipeJson, qualityMode, modelVersionsJson, errorMessage, startedAt, completedAt, null);
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public int getProgressPct() { return progressPct; }
    public void setProgressPct(int progressPct) { this.progressPct = progressPct; }
    public String getAimJobId() { return aimJobId; }
    public void setAimJobId(String aimJobId) { this.aimJobId = aimJobId; }
    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
    public String getBlendRecipeJson() { return blendRecipeJson; }
    public void setBlendRecipeJson(String blendRecipeJson) { this.blendRecipeJson = blendRecipeJson; }
    public String getQualityMode() { return qualityMode; }
    public void setQualityMode(String qualityMode) { this.qualityMode = qualityMode; }
    public String getModelVersionsJson() { return modelVersionsJson; }
    public void setModelVersionsJson(String modelVersionsJson) { this.modelVersionsJson = modelVersionsJson; }
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
