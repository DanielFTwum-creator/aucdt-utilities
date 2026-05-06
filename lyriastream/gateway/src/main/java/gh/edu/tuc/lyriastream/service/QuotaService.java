package gh.edu.tuc.lyriastream.service;

import gh.edu.tuc.lyriastream.domain.entity.UserEntity;
import gh.edu.tuc.lyriastream.domain.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Service
public class QuotaService {

    private static final Logger log = LoggerFactory.getLogger(QuotaService.class);

    public static class QuotaExceededException extends RuntimeException {
        public QuotaExceededException(int limit) {
            super("Daily generation limit of " + limit + " reached. Upgrade to Pro for more.");
        }
    }

    private final UserRepository userRepository;

    public QuotaService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public Mono<Boolean> checkAndDeduct(UserEntity user) {
        return Mono.fromCallable(() -> {
            UserEntity fresh = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            if (!fresh.hasQuotaRemaining()) {
                throw new QuotaExceededException(fresh.getDailyQuota());
            }
            fresh.incrementQuota();
            userRepository.save(fresh);
            return true;
        });
    }

    public int remaining(UserEntity user) {
        return Math.max(0, user.getDailyQuota() - user.getQuotaUsedToday());
    }
}
