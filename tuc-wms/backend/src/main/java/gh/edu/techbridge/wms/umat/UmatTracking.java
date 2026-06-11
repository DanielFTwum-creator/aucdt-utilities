package gh.edu.techbridge.wms.umat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;

/**
 * Per-recommendation tracking state for the UMaT Tracker
 * (ai-tools.techbridge.edu.gh/umat). The 37 recommendation texts are static in
 * the SPA; only this overlay (owner/status/dueDate/notes) is persisted. The id
 * is the SPA's fixed recommendation id, not generated.
 */
@Entity
@Table(name = "wms_umat_tracking")
public class UmatTracking {

    @Id
    private Integer itemId;

    @Column(length = 120)
    private String owner = "";

    @Column(length = 20, nullable = false)
    private String status = "not_started";

    /** ISO date string from the SPA's <input type="date"> (empty when unset). */
    @Column(length = 10)
    private String dueDate = "";

    @Column(length = 2048)
    private String notes = "";

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    @Column(length = 190)
    private String updatedBy = "";

    protected UmatTracking() { }

    public UmatTracking(Integer itemId) { this.itemId = itemId; }

    @PreUpdate void touch() { this.updatedAt = Instant.now(); }

    public Integer getItemId() { return itemId; }
    public String getOwner() { return owner; }
    public void setOwner(String v) { this.owner = v; }
    public String getStatus() { return status; }
    public void setStatus(String v) { this.status = v; }
    public String getDueDate() { return dueDate; }
    public void setDueDate(String v) { this.dueDate = v; }
    public String getNotes() { return notes; }
    public void setNotes(String v) { this.notes = v; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String v) { this.updatedBy = v; }
}
