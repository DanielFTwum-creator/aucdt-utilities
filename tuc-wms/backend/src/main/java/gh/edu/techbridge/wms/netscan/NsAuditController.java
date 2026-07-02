package gh.edu.techbridge.wms.netscan;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/netscan/audit")
public class NsAuditController {

    private final NetScanService svc;

    public NsAuditController(NetScanService svc) { this.svc = svc; }

    public record AuditEntryDto(Long id, String actor, String actionType,
                                 String targetId, String reason, Instant createdAt) {
        static AuditEntryDto from(NsAuditEntry e) {
            return new AuditEntryDto(e.getId(), e.getActor(), e.getActionType(),
                    e.getTargetId(), e.getReason(), e.getCreatedAt());
        }
    }

    @GetMapping
    public ResponseEntity<List<AuditEntryDto>> list(
            @RequestParam(required = false) String actionType,
            @RequestParam(required = false) String actor) {
        List<NsAuditEntry> entries;
        if (actionType != null) {
            entries = svc.getAuditLog().stream()
                    .filter(e -> e.getActionType().equalsIgnoreCase(actionType)).toList();
        } else if (actor != null) {
            entries = svc.getAuditLog().stream()
                    .filter(e -> e.getActor().equalsIgnoreCase(actor)).toList();
        } else {
            entries = svc.getAuditLog();
        }
        return ResponseEntity.ok(entries.stream().map(AuditEntryDto::from).toList());
    }
}
