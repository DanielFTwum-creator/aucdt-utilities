package gh.edu.techbridge.wms.umat;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Server-side persistence for the UMaT Tracker SPA (replaces its
 * browser-localStorage store, key "umat-tracker-v1"). All endpoints require a
 * WMS JWT (staff-only via SSO); the changelog actor is taken from the token.
 */
@RestController
@RequestMapping("/api/umat")
public class UmatController {

    /** The SPA's static recommendation ids are 1..37; reject ids outside a sane bound. */
    private static final int MAX_ITEM_ID = 200;
    private static final Set<String> FIELDS = Set.of("owner", "status", "dueDate", "notes");
    private static final Set<String> STATUSES = Set.of("not_started", "in_progress", "done", "blocked");

    private final UmatTrackingRepository tracking;
    private final UmatChangelogRepository changelog;

    public UmatController(UmatTrackingRepository tracking, UmatChangelogRepository changelog) {
        this.tracking = tracking;
        this.changelog = changelog;
    }

    public record ChangelogDto(Instant timestamp, String field, String oldValue, String newValue, String actor) { }
    public record ItemDto(String owner, String status, String dueDate, String notes, List<ChangelogDto> changelog) { }
    public record UpdateRequest(String field, String value) { }
    public record ImportItem(String owner, String status, String dueDate, String notes, List<ImportChangelogEntry> changelog) { }
    public record ImportChangelogEntry(String timestamp, String field, String oldValue, String newValue) { }

    /** Full tracking state in the SPA's localStorage shape: id → overlay + changelog. */
    @GetMapping("/tracking")
    public Map<Integer, ItemDto> all() {
        Map<Integer, List<ChangelogDto>> logs = new LinkedHashMap<>();
        for (UmatChangelogEntry e : changelog.findAll()) {
            logs.computeIfAbsent(e.getItemId(), k -> new ArrayList<>())
                .add(new ChangelogDto(e.getTimestamp(), e.getField(), e.getOldValue(), e.getNewValue(), e.getActor()));
        }
        Map<Integer, ItemDto> out = new LinkedHashMap<>();
        for (UmatTracking t : tracking.findAll()) {
            List<ChangelogDto> log = logs.getOrDefault(t.getItemId(), List.of());
            log = new ArrayList<>(log);
            log.sort((a, b) -> a.timestamp().compareTo(b.timestamp()));
            out.put(t.getItemId(), new ItemDto(t.getOwner(), t.getStatus(), t.getDueDate(), t.getNotes(), log));
        }
        return out;
    }

    /** Apply one field change; the server computes the old value and appends the audit entry. */
    @PutMapping("/items/{id}")
    @Transactional
    public ChangelogDto update(@PathVariable Integer id, @RequestBody UpdateRequest req, Authentication auth) {
        if (id == null || id < 1 || id > MAX_ITEM_ID)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown item id");
        if (req.field() == null || !FIELDS.contains(req.field()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown field");
        String value = req.value() == null ? "" : req.value();
        if (req.field().equals("status") && !STATUSES.contains(value))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown status");
        value = truncate(value, req.field().equals("notes") ? 2048 : 120);

        UmatTracking t = tracking.findById(id).orElseGet(() -> tracking.save(new UmatTracking(id)));
        String oldValue = switch (req.field()) {
            case "owner" -> t.getOwner();
            case "status" -> t.getStatus();
            case "dueDate" -> t.getDueDate();
            default -> t.getNotes();
        };
        if (oldValue == null) oldValue = "";
        if (oldValue.equals(value))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No change");

        switch (req.field()) {
            case "owner" -> t.setOwner(value);
            case "status" -> t.setStatus(value);
            case "dueDate" -> t.setDueDate(value);
            default -> t.setNotes(value);
        }
        t.setUpdatedBy(auth.getName());
        tracking.save(t);

        UmatChangelogEntry e = changelog.save(
                new UmatChangelogEntry(id, Instant.now(), req.field(), oldValue, value, auth.getName()));
        return new ChangelogDto(e.getTimestamp(), e.getField(), e.getOldValue(), e.getNewValue(), e.getActor());
    }

    /**
     * One-time migration of a browser's localStorage store. Refused once any
     * server data exists, so a second browser cannot clobber the live store.
     */
    @PostMapping("/import")
    @Transactional
    public Map<String, Integer> importStore(@RequestBody Map<Integer, ImportItem> store, Authentication auth) {
        if (tracking.count() > 0)
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Server store is not empty");
        int items = 0;
        int entries = 0;
        for (Map.Entry<Integer, ImportItem> en : store.entrySet()) {
            Integer id = en.getKey();
            ImportItem src = en.getValue();
            if (id == null || id < 1 || id > MAX_ITEM_ID || src == null) continue;
            UmatTracking t = new UmatTracking(id);
            t.setOwner(truncate(orEmpty(src.owner()), 120));
            t.setStatus(STATUSES.contains(src.status()) ? src.status() : "not_started");
            t.setDueDate(truncate(orEmpty(src.dueDate()), 10));
            t.setNotes(truncate(orEmpty(src.notes()), 2048));
            t.setUpdatedBy(auth.getName());
            tracking.save(t);
            items++;
            if (src.changelog() != null) {
                for (ImportChangelogEntry c : src.changelog()) {
                    if (c == null || c.field() == null) continue;
                    changelog.save(new UmatChangelogEntry(id, parseInstant(c.timestamp()),
                            truncate(c.field(), 20), truncate(orEmpty(c.oldValue()), 2048),
                            truncate(orEmpty(c.newValue()), 2048), ""));
                    entries++;
                }
            }
        }
        return Map.of("items", items, "changelogEntries", entries);
    }

    private static String orEmpty(String s) { return s == null ? "" : s; }

    private static String truncate(String s, int max) { return s.length() > max ? s.substring(0, max) : s; }

    private static Instant parseInstant(String iso) {
        try { return Instant.parse(iso); } catch (Exception e) { return Instant.now(); }
    }
}
