package gh.edu.tuc.lyriastream.domain.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ls_tracks")
public class TrackEntity {

    public enum Format { MP3, WAV, OGG }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 36)
    private String uuid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "job_id", nullable = false, length = 36)
    private String jobId;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String prompt;

    @Column(length = 50)
    private String genre;

    @Column(columnDefinition = "JSON")
    private String mood;

    @Column(name = "tempo_bpm")
    private Integer tempoBpm;

    @Column(name = "key_signature", length = 10)
    private String keySignature;

    @Column(name = "duration_seconds", nullable = false)
    private int durationSeconds;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Enumerated(EnumType.STRING)
    @Column(name = "file_format", nullable = false, length = 5)
    private Format fileFormat;

    @Column(name = "file_size_bytes")
    private long fileSizeBytes;

    @Column(name = "sha256_hash", length = 64, nullable = false)
    private String sha256Hash;

    @Column(name = "blend_recipe_json", columnDefinition = "JSON")
    private String blendRecipeJson;

    @Column(name = "quality_mode", length = 20)
    private String qualityMode;

    @Column(name = "seed")
    private Long seed;

    @Column(name = "is_public")
    private boolean isPublic = false;

    @Column(name = "is_deleted")
    private boolean deleted = false;

    @Column(name = "tags", columnDefinition = "JSON")
    private String tags;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public TrackEntity() {}

    public TrackEntity(Long id, String uuid, UserEntity user, String jobId, String title, String prompt, String genre, String mood, Integer tempoBpm, String keySignature, int durationSeconds, String filePath, Format fileFormat, long fileSizeBytes, String sha256Hash, String blendRecipeJson, String qualityMode, Long seed, boolean isPublic, boolean deleted, String tags, LocalDateTime createdAt) {
        this.id = id;
        this.uuid = uuid;
        this.user = user;
        this.jobId = jobId;
        this.title = title;
        this.prompt = prompt;
        this.genre = genre;
        this.mood = mood;
        this.tempoBpm = tempoBpm;
        this.keySignature = keySignature;
        this.durationSeconds = durationSeconds;
        this.filePath = filePath;
        this.fileFormat = fileFormat;
        this.fileSizeBytes = fileSizeBytes;
        this.sha256Hash = sha256Hash;
        this.blendRecipeJson = blendRecipeJson;
        this.qualityMode = qualityMode;
        this.seed = seed;
        this.isPublic = isPublic;
        this.deleted = deleted;
        this.tags = tags;
        this.createdAt = createdAt;
    }

    public static TrackEntityBuilder builder() {
        return new TrackEntityBuilder();
    }

    public static class TrackEntityBuilder {
        private Long id;
        private String uuid;
        private UserEntity user;
        private String jobId;
        private String title;
        private String prompt;
        private String genre;
        private String mood;
        private Integer tempoBpm;
        private String keySignature;
        private int durationSeconds;
        private String filePath;
        private Format fileFormat;
        private long fileSizeBytes;
        private String sha256Hash;
        private String blendRecipeJson;
        private String qualityMode;
        private Long seed;
        private boolean isPublic = false;
        private boolean deleted = false;
        private String tags;

        public TrackEntityBuilder id(Long id) { this.id = id; return this; }
        public TrackEntityBuilder uuid(String uuid) { this.uuid = uuid; return this; }
        public TrackEntityBuilder user(UserEntity user) { this.user = user; return this; }
        public TrackEntityBuilder jobId(String jobId) { this.jobId = jobId; return this; }
        public TrackEntityBuilder title(String title) { this.title = title; return this; }
        public TrackEntityBuilder prompt(String prompt) { this.prompt = prompt; return this; }
        public TrackEntityBuilder genre(String genre) { this.genre = genre; return this; }
        public TrackEntityBuilder mood(String mood) { this.mood = mood; return this; }
        public TrackEntityBuilder tempoBpm(Integer tempoBpm) { this.tempoBpm = tempoBpm; return this; }
        public TrackEntityBuilder keySignature(String keySignature) { this.keySignature = keySignature; return this; }
        public TrackEntityBuilder durationSeconds(int durationSeconds) { this.durationSeconds = durationSeconds; return this; }
        public TrackEntityBuilder filePath(String filePath) { this.filePath = filePath; return this; }
        public TrackEntityBuilder fileFormat(Format fileFormat) { this.fileFormat = fileFormat; return this; }
        public TrackEntityBuilder fileSizeBytes(long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; return this; }
        public TrackEntityBuilder sha256Hash(String sha256Hash) { this.sha256Hash = sha256Hash; return this; }
        public TrackEntityBuilder blendRecipeJson(String blendRecipeJson) { this.blendRecipeJson = blendRecipeJson; return this; }
        public TrackEntityBuilder qualityMode(String qualityMode) { this.qualityMode = qualityMode; return this; }
        public TrackEntityBuilder seed(Long seed) { this.seed = seed; return this; }
        public TrackEntityBuilder isPublic(boolean isPublic) { this.isPublic = isPublic; return this; }
        public TrackEntityBuilder deleted(boolean deleted) { this.deleted = deleted; return this; }
        public TrackEntityBuilder tags(String tags) { this.tags = tags; return this; }

        public TrackEntity build() {
            return new TrackEntity(id, uuid, user, jobId, title, prompt, genre, mood, tempoBpm, keySignature, durationSeconds, filePath, fileFormat, fileSizeBytes, sha256Hash, blendRecipeJson, qualityMode, seed, isPublic, deleted, tags, null);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUuid() { return uuid; }
    public void setUuid(String uuid) { this.uuid = uuid; }
    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }
    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
    public String getMood() { return mood; }
    public void setMood(String mood) { this.mood = mood; }
    public Integer getTempoBpm() { return tempoBpm; }
    public void setTempoBpm(Integer tempoBpm) { this.tempoBpm = tempoBpm; }
    public String getKeySignature() { return keySignature; }
    public void setKeySignature(String keySignature) { this.keySignature = keySignature; }
    public int getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(int dur) { this.durationSeconds = dur; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public Format getFileFormat() { return fileFormat; }
    public void setFileFormat(Format format) { this.fileFormat = format; }
    public long getFileSizeBytes() { return fileSizeBytes; }
    public void setFileSizeBytes(long size) { this.fileSizeBytes = size; }
    public String getSha256Hash() { return sha256Hash; }
    public void setSha256Hash(String hash) { this.sha256Hash = hash; }
    public String getBlendRecipeJson() { return blendRecipeJson; }
    public void setBlendRecipeJson(String json) { this.blendRecipeJson = json; }
    public String getQualityMode() { return qualityMode; }
    public void setQualityMode(String mode) { this.qualityMode = mode; }
    public Long getSeed() { return seed; }
    public void setSeed(Long seed) { this.seed = seed; }
    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }
    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
