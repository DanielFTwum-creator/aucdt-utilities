package gh.edu.techbridge.wms.netscan;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/netscan/bandwidth")
public class NsBwController {

    private final NetScanService svc;

    public NsBwController(NetScanService svc) { this.svc = svc; }

    public record InterfaceStatus(Long id, String name, String description, String ip,
                                   int capacityMbps, double utilisationPct,
                                   long bytesIn, long bytesOut) {}

    public record BwSampleDto(String interfaceName, long bytesIn, long bytesOut,
                               double utilisationPct, Instant sampledAt) {
        static BwSampleDto from(NsBwSample s) {
            return new BwSampleDto(s.getInterfaceName(), s.getBytesIn(), s.getBytesOut(),
                    s.getUtilisationPct(), s.getSampledAt());
        }
    }

    @GetMapping("/interfaces")
    public ResponseEntity<List<InterfaceStatus>> interfaces() {
        List<InterfaceStatus> result = svc.getInterfaces().stream().map(iface -> {
            NsBwSample latest = svc.getLatestBwSample(iface.getName()).orElse(null);
            return new InterfaceStatus(
                    iface.getId(), iface.getName(), iface.getDescription(), iface.getIpAddress(),
                    iface.getCapacityMbps(),
                    latest != null ? latest.getUtilisationPct() : 0.0,
                    latest != null ? latest.getBytesIn()        : 0L,
                    latest != null ? latest.getBytesOut()       : 0L);
        }).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/history")
    public ResponseEntity<List<BwSampleDto>> history() {
        return ResponseEntity.ok(svc.getBwHistory().stream().map(BwSampleDto::from).toList());
    }

    @GetMapping("/interfaces/{name}/history")
    public ResponseEntity<List<BwSampleDto>> interfaceHistory(@PathVariable String name) {
        return ResponseEntity.ok(svc.getBwByInterface(name).stream().map(BwSampleDto::from).toList());
    }
}
