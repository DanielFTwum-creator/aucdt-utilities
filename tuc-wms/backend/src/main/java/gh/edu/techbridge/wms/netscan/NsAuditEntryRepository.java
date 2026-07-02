package gh.edu.techbridge.wms.netscan;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NsAuditEntryRepository extends JpaRepository<NsAuditEntry, Long> {
    List<NsAuditEntry> findByOrderByCreatedAtDesc();
    List<NsAuditEntry> findByActionTypeIgnoreCaseOrderByCreatedAtDesc(String actionType);
    List<NsAuditEntry> findByActorIgnoreCaseOrderByCreatedAtDesc(String actor);
}
