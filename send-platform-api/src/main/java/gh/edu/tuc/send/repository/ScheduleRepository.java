package gh.edu.tuc.send.repository;

import gh.edu.tuc.send.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    Optional<Schedule> findByJobId(Long jobId);
}
