package gh.edu.techbridge.wms.netscan;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NsAlertRepository extends JpaRepository<NsAlert, Long> {
    List<NsAlert> findByStatusOrderByCreatedAtDesc(NsAlert.Status status);
    long countByStatus(NsAlert.Status status);
}
