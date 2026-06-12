package gh.edu.techbridge.wms.lems;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LemsCourseRepository extends JpaRepository<LemsCourse, Long> {
    List<LemsCourse> findByProgrammeId(Long programmeId);
}
