package gh.edu.tuc.lyriastream.domain.repository;

import gh.edu.tuc.lyriastream.domain.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findByUuid(String uuid);
    boolean existsByEmail(String email);

    @Modifying
    @Query("UPDATE UserEntity u SET u.quotaUsedToday = 0")
    void resetAllDailyQuotas();
}
