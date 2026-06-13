package gh.edu.techbridge.wms.lems;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * A student's evaluation of a lecturer for a course. Stored ANONYMOUSLY:
 * the verified WMS identity is used only to derive {@link #dedupeHash}
 * (one submission per student per lecturer+course) and is never persisted.
 */
@Entity
@Table(name = "wms_lems_evaluations")
public class LemsEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lecturer_id", nullable = false)
    @JsonIgnoreProperties({"courses"})
    private LemsLecturer lecturer;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    @JsonIgnoreProperties({"lecturers", "programme"})
    private LemsCourse course;

    @Column(length = 4096)
    private String studentFeedback;

    /** Which semester the course was taken in (part of the per-semester dedupe scope). */
    private Integer semester;

    /** RECOMMEND / NEUTRAL / NOT_RECOMMEND — stored as varchar (H2 has no extensible ENUM). */
    @Column(length = 16)
    private String recommend;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    /** Salted SHA-256 of (email|lecturer|course) — eligibility proof without identity. */
    @JsonIgnore
    @Column(name = "dedupe_hash", length = 64, unique = true)
    private String dedupeHash;

    @OneToMany(mappedBy = "evaluation", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("evaluation")
    private List<LemsEvaluationRating> ratings = new ArrayList<>();

    public Long getId() { return id; }
    public LemsLecturer getLecturer() { return lecturer; }
    public void setLecturer(LemsLecturer v) { this.lecturer = v; }
    public LemsCourse getCourse() { return course; }
    public void setCourse(LemsCourse v) { this.course = v; }
    public String getStudentFeedback() { return studentFeedback; }
    public void setStudentFeedback(String v) { this.studentFeedback = v; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer v) { this.semester = v; }
    public String getRecommend() { return recommend; }
    public void setRecommend(String v) { this.recommend = v; }
    public Instant getCreatedAt() { return createdAt; }
    public String getDedupeHash() { return dedupeHash; }
    public void setDedupeHash(String v) { this.dedupeHash = v; }
    public List<LemsEvaluationRating> getRatings() { return ratings; }
}
