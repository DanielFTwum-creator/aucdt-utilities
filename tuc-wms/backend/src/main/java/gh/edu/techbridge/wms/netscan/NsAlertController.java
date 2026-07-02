package gh.edu.techbridge.wms.netscan;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/netscan/alerts")
public class NsAlertController {

    private final NetScanService svc;

    public NsAlertController(NetScanService svc) { this.svc = svc; }

    public record AlertDto(Long id, String alertType, String severity, String title,
                           String message, Long deviceId, String status,
                           String ackNote, String ackedBy, Instant ackedAt, Instant createdAt) {
        static AlertDto from(NsAlert a) {
            return new AlertDto(a.getId(), a.getAlertType(), a.getSeverity(), a.getTitle(),
                    a.getMessage(), a.getDeviceId(), a.getStatus().name(),
                    a.getAckNote(), a.getAckedBy(), a.getAckedAt(), a.getCreatedAt());
        }
    }

    public record AckRequest(@NotBlank String note) {}

    @GetMapping
    public ResponseEntity<List<AlertDto>> list(
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(
            svc.getAllAlerts().stream()
                .filter(a -> severity == null || a.getSeverity().equalsIgnoreCase(severity))
                .filter(a -> status == null  || a.getStatus().name().equalsIgnoreCase(status))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(AlertDto::from)
                .toList()
        );
    }

    @PostMapping("/{id}/ack")
    public ResponseEntity<Void> ack(@PathVariable Long id,
                                     @Valid @RequestBody AckRequest req,
                                     Authentication auth) {
        boolean ok = svc.ackAlert(id, req.note(), auth.getName());
        return ok ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
