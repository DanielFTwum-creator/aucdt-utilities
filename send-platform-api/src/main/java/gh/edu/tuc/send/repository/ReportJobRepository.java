package gh.edu.tuc.send.repository;

import gh.edu.tuc.send.entity.ReportJob;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ReportJobRepository extends JpaRepository<ReportJob, Long> {
    Optional<ReportJob> findByUuid(String uuid);

    Page<ReportJob> findByStatusNot(ReportJob.JobStatus status, Pageable pageable);

    @Query("SELECT j FROM ReportJob j WHERE j.status = 'ACTIVE' AND j.schedule IS NOT NULL AND j.schedule.active = true")
    List<ReportJob> findActiveScheduledJobs();
}
