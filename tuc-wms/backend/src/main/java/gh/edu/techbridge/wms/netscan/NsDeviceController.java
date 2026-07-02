package gh.edu.techbridge.wms.netscan;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/netscan/devices")
public class NsDeviceController {

    private final NetScanService svc;

    public NsDeviceController(NetScanService svc) { this.svc = svc; }

    public record DeviceDto(Long id, String mac, String ip, String hostname,
                            String manufacturer, String label, String status,
                            boolean inAdr, Instant firstSeen, Instant lastSeen) {
        static DeviceDto from(NsDevice d) {
            return new DeviceDto(d.getId(), d.getMac(), d.getIp(), d.getHostname(),
                    d.getManufacturer(), d.getLabel(), d.getStatus().name(),
                    d.isInAdr(), d.getFirstSeen(), d.getLastSeen());
        }
    }

    public record AnnotateRequest(@NotBlank String label) {}

    @GetMapping
    public ResponseEntity<List<DeviceDto>> list(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(
            svc.getAllDevices().stream()
                .filter(d -> status == null || d.getStatus().name().equalsIgnoreCase(status))
                .filter(d -> search == null || search.isBlank()
                        || d.getMac().contains(search)
                        || (d.getIp() != null && d.getIp().contains(search))
                        || (d.getHostname() != null && d.getHostname().toLowerCase().contains(search.toLowerCase()))
                        || (d.getLabel() != null && d.getLabel().toLowerCase().contains(search.toLowerCase())))
                .map(DeviceDto::from)
                .toList()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeviceDto> get(@PathVariable Long id) {
        return svc.getDevice(id)
                .map(d -> ResponseEntity.ok(DeviceDto.from(d)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/annotate")
    public ResponseEntity<DeviceDto> annotate(@PathVariable Long id,
                                               @Valid @RequestBody AnnotateRequest req,
                                               Authentication auth) {
        try {
            NsDevice updated = svc.annotateDevice(id, req.label());
            return ResponseEntity.ok(DeviceDto.from(updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
