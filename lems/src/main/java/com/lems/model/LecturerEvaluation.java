package com.lems.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lecturer_evaluations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LecturerEvaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lecturer_id", nullable = false)
    private Lecturer lecturer;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column
    private String studentFeedback;

    @Column
    private Integer semester;

    @Column(length = 20)
    private String recommend;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /**
     * Salted SHA-256 of (submitter email | lecturer | course) — proves
     * one-submission-per-student WITHOUT storing who submitted. Never
     * serialised; reversing it would require knowing the server-side salt.
     */
    @com.fasterxml.jackson.annotation.JsonIgnore
    @Column(name = "dedupe_hash", length = 64, unique = true)
    private String dedupeHash;

    @OneToMany(mappedBy = "evaluation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EvaluationRating> ratings = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
