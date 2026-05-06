package gh.edu.tuc.lyriastream.domain.repository;

import gh.edu.tuc.lyriastream.domain.entity.TrackEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrackRepository extends JpaRepository<TrackEntity, Long> {

    Page<TrackEntity> findByUserIdAndDeletedFalse(Long userId, Pageable pageable);

    Optional<TrackEntity> findByUuidAndUserIdAndDeletedFalse(String uuid, Long userId);

    Optional<TrackEntity> findByJobId(String jobId);

    boolean existsByJobId(String jobId);

    @Modifying
    @Query("UPDATE TrackEntity t SET t.deleted = true WHERE t.uuid = :uuid AND t.user.id = :userId AND t.deleted = false")
    int softDeleteByUuidAndUserId(String uuid, Long userId);
}
