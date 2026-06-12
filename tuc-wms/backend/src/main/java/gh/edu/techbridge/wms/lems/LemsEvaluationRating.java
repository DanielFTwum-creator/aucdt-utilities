package gh.edu.techbridge.wms.lems;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/** A single criterion score within a LEMS evaluation. */
@Entity
@Table(name = "wms_lems_evaluation_ratings")
public class LemsEvaluationRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "evaluation_id", nullable = false)
    private LemsEvaluation evaluation;

    @Column(nullable = false)
    private Integer criteriaNumber;

    private String criteriaName;

    @Column(nullable = false)
    private Integer rating;

    private String section;

    public Long getId() { return id; }
    public LemsEvaluation getEvaluation() { return evaluation; }
    public void setEvaluation(LemsEvaluation v) { this.evaluation = v; }
    public Integer getCriteriaNumber() { return criteriaNumber; }
    public void setCriteriaNumber(Integer v) { this.criteriaNumber = v; }
    public String getCriteriaName() { return criteriaName; }
    public void setCriteriaName(String v) { this.criteriaName = v; }
    public Integer getRating() { return rating; }
    public void setRating(Integer v) { this.rating = v; }
    public String getSection() { return section; }
    public void setSection(String v) { this.section = v; }
}
