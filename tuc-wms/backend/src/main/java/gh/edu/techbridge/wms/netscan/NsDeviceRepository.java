package gh.edu.techbridge.wms.netscan;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NsDeviceRepository extends JpaRepository<NsDevice, Long> {
    Optional<NsDevice> findByMacIgnoreCase(String mac);
    long countByStatus(NsDevice.Status status);
}
