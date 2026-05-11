package gh.edu.tuc.lyriastream.domain.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ls_audit_logs")
public class AuditLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_user_id")
    private UserEntity actor;

    @Column(nullable = false, length = 100)
    private String action;                  // e.g. USER_SUSPENDED, QUOTA_OVERRIDE

    @Column(name = "entity_type", length = 50)
    private String entityType;

    @Column(name = "entity_id", length = 100)
    private String entityId;

    @Column(name = "detail_json", columnDefinition = "JSON")
    private String detailJson;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public AuditLogEntity() {}

    public AuditLogEntity(Long id, UserEntity actor, String action, String entityType, String entityId, String detailJson, String ipAddress, LocalDateTime createdAt) {
        this.id = id;
        this.actor = actor;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.detailJson = detailJson;
        this.ipAddress = ipAddress;
        this.createdAt = createdAt;
    }

    public static AuditLogEntityBuilder builder() {
        return new AuditLogEntityBuilder();
    }

    public static class AuditLogEntityBuilder {
        private Long id;
        private UserEntity actor;
        private String action;
        private String entityType;
        private String entityId;
        private String detailJson;
        private String ipAddress;

        public AuditLogEntityBuilder id(Long id) { this.id = id; return this; }
        public AuditLogEntityBuilder actor(UserEntity actor) { this.actor = actor; return this; }
        public AuditLogEntityBuilder action(String action) { this.action = action; return this; }
        public AuditLogEntityBuilder entityType(String entityType) { this.entityType = entityType; return this; }
        public AuditLogEntityBuilder entityId(String entityId) { this.entityId = entityId; return this; }
        public AuditLogEntityBuilder detailJson(String detailJson) { this.detailJson = detailJson; return this; }
        public AuditLogEntityBuilder ipAddress(String ipAddress) { this.ipAddress = ipAddress; return this; }

        public AuditLogEntity build() {
            return new AuditLogEntity(id, actor, action, entityType, entityId, detailJson, ipAddress, null);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UserEntity getActor() { return actor; }
    public void setActor(UserEntity actor) { this.actor = actor; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getEntityType() { return entityType; }
    public void setEntityType(String type) { this.entityType = type; }
    public String getEntityId() { return entityId; }
    public void setEntityId(String id) { this.entityId = id; }
    public String getDetailJson() { return detailJson; }
    public void setDetailJson(String json) { this.detailJson = json; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ip) { this.ipAddress = ip; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
