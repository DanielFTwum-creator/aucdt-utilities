package gh.edu.techbridge.wms.automation;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AutomationHistoryRepository extends JpaRepository<AutomationHistory, Long> {
    List<AutomationHistory> findByProjectIdOrderByRunAtDesc(Long projectId, Pageable pageable);
}
