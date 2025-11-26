package edu.gh.aucdt.thesisai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * ThesisAI - AI-Powered Thesis Assessment Platform
 * Main Application Entry Point
 * 
 * @author AUCDT Development Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
public class ThesisAiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ThesisAiApplication.class, args);
        System.out.println("""
            
            ╔═══════════════════════════════════════════════════════════╗
            ║                                                           ║
            ║   ████████╗██╗  ██╗███████╗███████╗██╗███████╗          ║
            ║   ╚══██╔══╝██║  ██║██╔════╝██╔════╝██║██╔════╝          ║
            ║      ██║   ███████║█████╗  ███████╗██║███████╗          ║
            ║      ██║   ██╔══██║██╔══╝  ╚════██║██║╚════██║          ║
            ║      ██║   ██║  ██║███████╗███████║██║███████║          ║
            ║      ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝╚══════╝          ║
            ║                                                           ║
            ║              AI-Powered Thesis Assessment                ║
            ║                    Version 1.0.0                          ║
            ║                                                           ║
            ║   Status: ✓ Running                                      ║
            ║   Port: 8080                                              ║
            ║   Docs: http://localhost:8080/api/v1/swagger-ui.html     ║
            ║                                                           ║
            ╚═══════════════════════════════════════════════════════════╝
            
            """);
    }
}
