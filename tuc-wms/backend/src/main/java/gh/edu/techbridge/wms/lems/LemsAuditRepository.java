package gh.edu.techbridge.wms.lems;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LemsAuditRepository extends JpaRepository<LemsAuditEntry, Long> {
    List<LemsAuditEntry> findTop200ByOrderByCreatedAtDesc();
}
