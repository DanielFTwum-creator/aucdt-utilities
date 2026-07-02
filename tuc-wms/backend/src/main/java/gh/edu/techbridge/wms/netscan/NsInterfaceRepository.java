package gh.edu.techbridge.wms.netscan;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NsInterfaceRepository extends JpaRepository<NsInterface, Long> {
    Optional<NsInterface> findByName(String name);
}
