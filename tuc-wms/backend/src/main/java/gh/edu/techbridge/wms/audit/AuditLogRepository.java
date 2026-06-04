package gh.edu.techbridge.wms.audit;

import org.springframework.data.jpa.repository.JpaRepository;

/** Append-only — only save/read are used; no delete is invoked anywhere (FR-AUTH-006). */
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}
