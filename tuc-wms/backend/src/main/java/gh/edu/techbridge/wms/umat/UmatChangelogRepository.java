package gh.edu.techbridge.wms.umat;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UmatChangelogRepository extends JpaRepository<UmatChangelogEntry, Long> {
    List<UmatChangelogEntry> findByItemIdOrderByTimestampAsc(Integer itemId);
}
