package edu.techbridge.netscan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.cache.annotation.EnableCaching;

/**
 * TUC NetScan — Campus Network Scanner & Monitor
 * Document: TUC-ICT-SRS-2026-012
 * Author: Daniel Frempong Twum, Head of ICT, Techbridge University College
 */
@SpringBootApplication
@EnableScheduling
@EnableCaching
public class NetScanApplication {
    public static void main(String[] args) {
        SpringApplication.run(NetScanApplication.class, args);
    }
}
