package gh.edu.techbridge.wms.netscan;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NsBlockEntryRepository extends JpaRepository<NsBlockEntry, Long> {
    List<NsBlockEntry> findByActiveTrue();
    Optional<NsBlockEntry> findByDeviceIdAndActiveTrue(Long deviceId);
}
