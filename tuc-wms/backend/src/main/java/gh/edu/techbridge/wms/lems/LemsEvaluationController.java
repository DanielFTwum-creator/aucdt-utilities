package gh.edu.techbridge.wms.lems;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;

/**
 * Student evaluation submission (any authenticated TUC account) and admin
 * results access. Submissions are stored anonymously — the submitter's email
 * (JWT subject) is used ONLY for the salted one-per-student dedupe hash.
 */
@RestController
@RequestMapping("/api/lems/evaluations")
public class LemsEvaluationController {

    private final LemsEvaluationRepository evaluations;
    private final LemsLecturerRepository lecturers;
    private final LemsCourseRepository courses;
    private final LemsAuditRepository audit;

    /** Set LEMS_DEDUPE_SALT in /opt/tuc-wms/.env — never committed. */
    @Value("${LEMS_DEDUPE_SALT:change-me-in-prod}")
    private String dedupeSalt;

    public LemsEvaluationController(LemsEvaluationRepository evaluations, LemsLecturerRepository lecturers,
                                    LemsCourseRepository courses, LemsAuditRepository audit) {
        this.evaluations = evaluations;
        this.lecturers = lecturers;
        this.courses = courses;
        this.audit = audit;
    }

    public record SubmissionRequest(Long lecturerId, Long courseId, String studentFeedback,
                                    Map<Integer, Integer> ratings) { }

    @PostMapping("/submit")
    @Transactional
    public LemsEvaluation submit(@RequestBody SubmissionRequest req, Authentication auth) {
        LemsLecturer lecturer = lecturers.findById(req.lecturerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lecturer not found"));
        LemsCourse course = courses.findById(req.courseId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Course not found"));

        String hash = sha256(auth.getName().toLowerCase().trim()
                + "|" + req.lecturerId() + "|" + req.courseId() + "|" + dedupeSalt);
        if (evaluations.existsByDedupeHash(hash)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "You have already submitted an evaluation for this lecturer and course.");
        }

        LemsEvaluation e = new LemsEvaluation();
        e.setLecturer(lecturer);
        e.setCourse(course);
        e.setStudentFeedback(req.studentFeedback());
        e.setDedupeHash(hash);
        LemsEvaluation saved = evaluations.save(e);

        if (req.ratings() != null) {
            for (Map.Entry<Integer, Integer> entry : req.ratings().entrySet()) {
                LemsEvaluationRating r = new LemsEvaluationRating();
                r.setEvaluation(saved);
                r.setCriteriaNumber(entry.getKey());
                r.setRating(entry.getValue());
                saved.getRatings().add(r);
            }
            saved = evaluations.save(saved);
        }

        // Audit carries NO submitter identity — anonymity by design.
        audit.save(new LemsAuditEntry("EVALUATION_SUBMITTED",
                "Evaluation submitted for " + lecturer.getFullName(), "SUCCESS",
                "Lecturer: " + lecturer.getFullName() + ", Course: " + course.getName()));
        return saved;
    }

    @GetMapping("/all")
    public List<LemsEvaluation> all(Authentication auth) {
        LemsAccess.requireAdmin(auth);
        return evaluations.findAll();
    }

    @GetMapping("/lecturer/{lecturerId}")
    public List<LemsEvaluation> byLecturer(@PathVariable Long lecturerId, Authentication auth) {
        LemsAccess.requireAdmin(auth);
        return evaluations.findByLecturerId(lecturerId);
    }

    @GetMapping("/course/{courseId}")
    public List<LemsEvaluation> byCourse(@PathVariable Long courseId, Authentication auth) {
        LemsAccess.requireAdmin(auth);
        return evaluations.findByCourseId(courseId);
    }

    private static String sha256(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(md.digest(input.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }
}
