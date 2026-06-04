package gh.edu.techbridge.wms.audit;

import org.springframework.stereotype.Service;

/** Append-only audit writer (FR-AUTH-006). */
@Service
public class AuditService {

    private final AuditLogRepository repo;

    public AuditService(AuditLogRepository repo) {
        this.repo = repo;
    }

    public void record(AuditEvent event, String email, String detail, String sourceIp) {
        repo.save(new AuditLog(event, email, detail, sourceIp));
    }
}
