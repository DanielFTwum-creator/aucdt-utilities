package gh.edu.techbridge.wms.automation;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AutomationRuleRepository extends JpaRepository<AutomationRule, Long> {
    List<AutomationRule> findByProjectId(Long projectId);
}
