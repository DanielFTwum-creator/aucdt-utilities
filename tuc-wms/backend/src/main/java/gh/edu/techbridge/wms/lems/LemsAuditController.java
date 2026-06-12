package gh.edu.techbridge.wms.lems;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** LEMS module audit trail — admin-only, newest first (capped at 200). */
@RestController
@RequestMapping("/api/lems/audit")
public class LemsAuditController {

    private final LemsAuditRepository audit;

    public LemsAuditController(LemsAuditRepository audit) {
        this.audit = audit;
    }

    @GetMapping
    public List<LemsAuditEntry> recent(Authentication auth) {
        LemsAccess.requireAdmin(auth);
        return audit.findTop200ByOrderByCreatedAtDesc();
    }
}
