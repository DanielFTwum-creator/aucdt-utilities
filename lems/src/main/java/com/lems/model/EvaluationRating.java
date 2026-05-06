package com.lems.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "evaluation_ratings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationRating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "evaluation_id", nullable = false)
    private LecturerEvaluation evaluation;

    @Column(nullable = false)
    private Integer criteriaNumber;

    @Column(nullable = false)
    private String criteriaName;

    @Column(nullable = false)
    private Integer rating;

    @Column
    private String section;
}

