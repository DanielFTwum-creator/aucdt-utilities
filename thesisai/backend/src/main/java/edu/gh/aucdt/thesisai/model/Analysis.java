package edu.gh.aucdt.thesisai.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "analyses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Analysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @Column(name = "analysis_type", length = 50)
    private String analysisType = "COMPREHENSIVE";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AnalysisStatus status = AnalysisStatus.PENDING;

    @Column(name = "structure_score", precision = 5, scale = 2)
    private BigDecimal structureScore;

    @Column(name = "argumentation_score", precision = 5, scale = 2)
    private BigDecimal argumentationScore;

    @Column(name = "methodology_score", precision = 5, scale = 2)
    private BigDecimal methodologyScore;

    @Column(name = "writing_quality_score", precision = 5, scale = 2)
    private BigDecimal writingQualityScore;

    @Column(name = "examinability_score", precision = 5, scale = 2)
    private BigDecimal examinabilityScore;

    @Column(name = "overall_score", precision = 5, scale = 2)
    private BigDecimal overallScore;

    @Column(name = "processing_time")
    private Integer processingTime;

    @Column(name = "tokens_used")
    private Integer tokensUsed;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public enum AnalysisStatus {
        PENDING, IN_PROGRESS, COMPLETED, FAILED
    }
}
