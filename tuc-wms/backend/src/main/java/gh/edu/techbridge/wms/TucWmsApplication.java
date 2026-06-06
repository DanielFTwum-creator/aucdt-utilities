package gh.edu.techbridge.wms;

import gh.edu.techbridge.wms.config.MailProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * TUC Work Management System — entry point.
 * Auth is Google Workspace OAuth 2.0 / OIDC (SRS TUC-ICT-SRS-2026-004 v1.0.1).
 */
@SpringBootApplication
@EnableAsync                                       // async notification email (TaskMailService)
@EnableConfigurationProperties(MailProperties.class)
public class TucWmsApplication {
    public static void main(String[] args) {
        SpringApplication.run(TucWmsApplication.class, args);
    }
}
