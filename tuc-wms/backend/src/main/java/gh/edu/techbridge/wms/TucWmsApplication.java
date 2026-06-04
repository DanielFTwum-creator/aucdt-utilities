package gh.edu.techbridge.wms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * TUC Work Management System — entry point.
 * Auth is Google Workspace OAuth 2.0 / OIDC (SRS TUC-ICT-SRS-2026-004 v1.0.1).
 */
@SpringBootApplication
public class TucWmsApplication {
    public static void main(String[] args) {
        SpringApplication.run(TucWmsApplication.class, args);
    }
}
