package gh.edu.techbridge.wms.umat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.Instant;

/**
 * One field change on a UMaT Tracker recommendation — the compliance audit
 * trail shown in the SPA. Server-appended on every update so the actor is
 * taken from the JWT, never from the client.
 */
@Entity
@Table(name = "wms_umat_changelog", indexes = {
        @Index(name = "idx_umat_changelog_item", columnList = "itemId")
})
public class UmatChangelogEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer itemId;

    @Column(nullable = false)
    private Instant timestamp = Instant.now();

    @Column(length = 20, nullable = false)
    private String field;

    @Column(length = 2048)
    private String oldValue = "";

    @Column(length = 2048)
    private String newValue = "";

    /** Actor email from the JWT; empty for entries migrated from localStorage. */
    @Column(length = 190)
    private String actor = "";

    protected UmatChangelogEntry() { }

    public UmatChangelogEntry(Integer itemId, Instant timestamp, String field,
                              String oldValue, String newValue, String actor) {
        this.itemId = itemId;
        this.timestamp = timestamp;
        this.field = field;
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.actor = actor;
    }

    public Long getId() { return id; }
    public Integer getItemId() { return itemId; }
    public Instant getTimestamp() { return timestamp; }
    public String getField() { return field; }
    public String getOldValue() { return oldValue; }
    public String getNewValue() { return newValue; }
    public String getActor() { return actor; }
}
