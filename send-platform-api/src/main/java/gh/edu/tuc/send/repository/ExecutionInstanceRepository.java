package gh.edu.tuc.send.repository;

import gh.edu.tuc.send.entity.ExecutionInstance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExecutionInstanceRepository extends JpaRepository<ExecutionInstance, Long> {
    Page<ExecutionInstance> findByJobId(Long jobId, Pageable pageable);
    List<ExecutionInstance> findTop1ByJobIdOrderByStartedAtDesc(Long jobId);
    long countByStatus(ExecutionInstance.ExecutionStatus status);
}
