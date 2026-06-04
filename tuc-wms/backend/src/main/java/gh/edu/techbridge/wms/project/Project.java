package gh.edu.techbridge.wms.project;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * A project (FR-PROJ-001..007): name, description, department, dates,
 * visibility, owner, custom workflow stages, and soft-delete (archive).
 */
@Entity
@Table(name = "wms_projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 4000)
    private String description;

    private String department;
    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Visibility visibility = Visibility.MEMBERS;

    /** Owner's user id (FR-AUTH user). Project ownership is also tracked via ProjectMember(OWNER). */
    @Column(nullable = false)
    private Long ownerId;

    /** Soft delete (FR-PROJ-004): archived projects are read-only; 30-day recovery window. */
    @Column(nullable = false)
    private boolean archived = false;
    private Instant archivedAt;

    /** Custom workflow stages (FR-PROJ-003), ordered. Defaults seeded on creation. */
    @ElementCollection
    @CollectionTable(name = "wms_project_stages", joinColumns = @JoinColumn(name = "project_id"))
    @OrderColumn(name = "stage_order")
    @Column(name = "stage_name")
    private List<String> stages = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected Project() { }

    public Project(String name, String description, String department,
                   LocalDate startDate, LocalDate endDate, Visibility visibility, Long ownerId) {
        this.name = name;
        this.description = description;
        this.department = department;
        this.startDate = startDate;
        this.endDate = endDate;
        if (visibility != null) this.visibility = visibility;
        this.ownerId = ownerId;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public Visibility getVisibility() { return visibility; }
    public void setVisibility(Visibility visibility) { this.visibility = visibility; }
    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
    public boolean isArchived() { return archived; }
    public void setArchived(boolean archived) { this.archived = archived; this.archivedAt = archived ? Instant.now() : null; }
    public Instant getArchivedAt() { return archivedAt; }
    public List<String> getStages() { return stages; }
    public void setStages(List<String> stages) { this.stages = stages; }
    public Instant getCreatedAt() { return createdAt; }
}
