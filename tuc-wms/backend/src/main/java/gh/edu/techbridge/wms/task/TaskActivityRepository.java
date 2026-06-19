package gh.edu.techbridge.wms.task;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskActivityRepository extends JpaRepository<TaskActivity, Long> {
    List<TaskActivity> findByTaskIdOrderByOccurredAtDesc(Long taskId);
}
