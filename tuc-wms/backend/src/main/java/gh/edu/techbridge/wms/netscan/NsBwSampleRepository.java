package gh.edu.techbridge.wms.netscan;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface NsBwSampleRepository extends JpaRepository<NsBwSample, Long> {

    List<NsBwSample> findByInterfaceNameOrderBySampledAtDesc(String interfaceName);

    List<NsBwSample> findBySampledAtAfterOrderBySampledAtAsc(Instant since);

    @Query("SELECT s FROM NsBwSample s WHERE s.interfaceName = :name ORDER BY s.sampledAt DESC LIMIT 1")
    Optional<NsBwSample> findLatestByInterfaceName(String name);
}
