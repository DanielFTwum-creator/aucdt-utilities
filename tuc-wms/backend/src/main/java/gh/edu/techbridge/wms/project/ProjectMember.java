package gh.edu.techbridge.wms.project;

import jakarta.persistence.*;

/**
 * Membership of a user in a project with a per-project role (FR-PROJ-006).
 * Unique per (project, user).
 */
@Entity
@Table(name = "wms_project_members",
       uniqueConstraints = @UniqueConstraint(name = "uq_project_user", columnNames = {"project_id", "user_id"}),
       indexes = { @Index(name = "idx_pm_project", columnList = "project_id"),
                   @Index(name = "idx_pm_user", columnList = "user_id") })
public class ProjectMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private ProjectRole projectRole;

    protected ProjectMember() { }

    public ProjectMember(Long projectId, Long userId, ProjectRole projectRole) {
        this.projectId = projectId;
        this.userId = userId;
        this.projectRole = projectRole;
    }

    public Long getId() { return id; }
    public Long getProjectId() { return projectId; }
    public Long getUserId() { return userId; }
    public ProjectRole getProjectRole() { return projectRole; }
    public void setProjectRole(ProjectRole projectRole) { this.projectRole = projectRole; }
}
