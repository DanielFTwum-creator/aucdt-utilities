package edu.techbridge.netscan.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity @Table(name = "ict_user")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class IctUser {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, unique = true) private String username;
    @Column(nullable = false) private String password;
    @Column(name = "display_name") private String displayName;
    @Enumerated(EnumType.STRING) @Column(nullable = false) @Builder.Default private Role role = Role.ENGINEER;
    @Column(nullable = false) @Builder.Default private Boolean active = true;
    @Column(name = "created_at", nullable = false, updatable = false) @Builder.Default private Instant createdAt = Instant.now();

    public enum Role { ENGINEER, ADMIN }
}
