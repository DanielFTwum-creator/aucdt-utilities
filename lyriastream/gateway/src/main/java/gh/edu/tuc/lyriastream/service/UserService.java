package gh.edu.tuc.lyriastream.service;

import gh.edu.tuc.lyriastream.config.AppProperties;
import gh.edu.tuc.lyriastream.domain.entity.UserEntity;
import gh.edu.tuc.lyriastream.domain.repository.UserRepository;
import gh.edu.tuc.lyriastream.security.TotpService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    public static class AuthException extends RuntimeException {
        public AuthException(String msg) { super(msg); }
    }

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TotpService totpService;
    private final AppProperties props;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, TotpService totpService, AppProperties props) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.totpService = totpService;
        this.props = props;
    }

    @Transactional
    public UserEntity register(String email, String password, String displayName) {
        if (userRepository.existsByEmail(email.toLowerCase())) {
            throw new AuthException("Email already registered");
        }
        UserEntity user = UserEntity.builder()
            .uuid(UUID.randomUUID().toString())
            .email(email.toLowerCase())
            .passwordHash(passwordEncoder.encode(password))
            .displayName(displayName != null ? displayName : email.split("@")[0])
            .role(UserEntity.Role.FREE)
            .dailyQuota(props.quotas().free())
            .build();
        return userRepository.save(user);
    }

    @Transactional
    public UserEntity authenticate(String email, String password, String totpCode) {
        UserEntity user = userRepository.findByEmail(email.toLowerCase())
            .orElseThrow(() -> new AuthException("Invalid credentials"));

        if (!user.isActive()) throw new AuthException("Account suspended");
        if (user.isLocked()) throw new AuthException("Account locked — try again in 15 minutes");

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            user.recordFailedLogin();
            userRepository.save(user);
            throw new AuthException("Invalid credentials");
        }

        // Admin accounts require TOTP
        if (user.getRole() == UserEntity.Role.ADMIN) {
            if (totpCode == null || !totpService.verify(user.getTotpSecret(), totpCode)) {
                throw new AuthException("Invalid or missing 2FA code");
            }
        }

        user.recordSuccessfulLogin();
        return userRepository.save(user);
    }

    public UserEntity findByUuid(String uuid) {
        return userRepository.findByUuid(uuid)
            .orElseThrow(() -> new AuthException("User not found"));
    }

    /** Reset all daily quotas at midnight UTC */
    @Scheduled(cron = "0 0 0 * * *", zone = "UTC")
    @Transactional
    public void resetDailyQuotas() {
        userRepository.resetAllDailyQuotas();
        log.info("Daily quotas reset for all users");
    }
}
