package gh.edu.techbridge.wms.netscan;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/netscan/control")
public class NsControlController {

    private final NetScanService svc;

    public NsControlController(NetScanService svc) { this.svc = svc; }

    public record BlockRequest(@NotBlank String targetMac, @NotBlank String reason) {}
    public record BlockResponse(Long blockId, String script, String message) {}
    public record BlockEntryDto(Long id, Long deviceId, String mac, String reason,
                                 String blockedBy, Instant blockedAt, boolean active) {
        static BlockEntryDto from(NsBlockEntry e) {
            return new BlockEntryDto(e.getId(), e.getDeviceId(), e.getMac(), e.getReason(),
                    e.getBlockedBy(), e.getBlockedAt(), e.isActive());
        }
    }

    @PostMapping("/block")
    public ResponseEntity<BlockResponse> block(@Valid @RequestBody BlockRequest req,
                                                Authentication auth) {
        NsDevice device = svc.getDeviceByMac(req.targetMac()).orElse(null);
        if (device == null) return ResponseEntity.notFound().build();

        NsBlockEntry entry = svc.blockDevice(device.getId(), req.reason(), auth.getName());
        return ResponseEntity.ok(new BlockResponse(
                entry.getId(), entry.getFirewallScript(),
                "Device " + req.targetMac() + " blocked. Apply the firewall script on the gateway."));
    }

    @DeleteMapping("/unblock/{blockId}")
    public ResponseEntity<Void> unblock(@PathVariable Long blockId, Authentication auth) {
        boolean ok = svc.unblockDevice(blockId, auth.getName());
        return ok ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/blocklist")
    public ResponseEntity<List<BlockEntryDto>> blocklist() {
        return ResponseEntity.ok(svc.getBlockList().stream().map(BlockEntryDto::from).toList());
    }
}
