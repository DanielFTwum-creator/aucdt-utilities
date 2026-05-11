package gh.edu.tuc.send.config;

import gh.edu.tuc.send.entity.User;
import gh.edu.tuc.send.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds a default admin and demo user on first startup.
 * Remove or disable in production once real users are created.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        if (!userRepo.existsByUsername("admin")) {
            var admin = new User();
            admin.setUsername("admin");
            admin.setPasswordHash(encoder.encode("tuc-admin-2026"));
            admin.setName("System Administrator");
            admin.setEmail("admin@tuc.edu.gh");
            admin.setRole(User.Role.ADMIN);
            userRepo.save(admin);
            log.info("Created default admin user (change password immediately in production)");
        }

        if (!userRepo.existsByUsername("daniel.admin")) {
            var user = new User();
            user.setUsername("daniel.admin");
            user.setPasswordHash(encoder.encode("tuc-demo-2026"));
            user.setName("Daniel Owusu");
            user.setEmail("daniel@tuc.edu.gh");
            user.setRole(User.Role.ADMIN);
            userRepo.save(user);
            log.info("Created demo user: daniel.admin");
        }
    }
}
