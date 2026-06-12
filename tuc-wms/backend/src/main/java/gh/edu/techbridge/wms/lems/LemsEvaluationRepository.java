package gh.edu.techbridge.wms.lems;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LemsEvaluationRepository extends JpaRepository<LemsEvaluation, Long> {
    List<LemsEvaluation> findByLecturerId(Long lecturerId);
    List<LemsEvaluation> findByCourseId(Long courseId);
    boolean existsByDedupeHash(String dedupeHash);
}
