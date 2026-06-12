package gh.edu.techbridge.wms.lems;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * LEMS reference data: programmes, courses, lecturers. Reads are open to any
 * authenticated TUC account (the evaluation form needs the lists); mutations
 * are admin-only (LemsAccess).
 */
@RestController
@RequestMapping("/api/lems")
public class LemsCatalogController {

    private final LemsProgrammeRepository programmes;
    private final LemsCourseRepository courses;
    private final LemsLecturerRepository lecturers;
    private final LemsAuditRepository audit;

    public LemsCatalogController(LemsProgrammeRepository programmes, LemsCourseRepository courses,
                                 LemsLecturerRepository lecturers, LemsAuditRepository audit) {
        this.programmes = programmes;
        this.courses = courses;
        this.lecturers = lecturers;
        this.audit = audit;
    }

    // ---- Programmes ----
    public record ProgrammeRequest(String name, String code, String description) { }

    @GetMapping("/programmes")
    public List<LemsProgramme> allProgrammes() { return programmes.findAll(); }

    @PostMapping("/programmes")
    public LemsProgramme createProgramme(@RequestBody ProgrammeRequest req, Authentication auth) {
        LemsAccess.requireAdmin(auth);
        LemsProgramme p = new LemsProgramme();
        applyProgramme(p, req);
        audit.save(new LemsAuditEntry("PROGRAMME_CREATED", "Programme created: " + req.name(), "SUCCESS", "by " + auth.getName()));
        return programmes.save(p);
    }

    @PutMapping("/programmes/{id}")
    public LemsProgramme updateProgramme(@PathVariable Long id, @RequestBody ProgrammeRequest req, Authentication auth) {
        LemsAccess.requireAdmin(auth);
        LemsProgramme p = programmes.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Programme not found"));
        applyProgramme(p, req);
        audit.save(new LemsAuditEntry("PROGRAMME_UPDATED", "Programme updated: " + req.name(), "SUCCESS", "by " + auth.getName()));
        return programmes.save(p);
    }

    @DeleteMapping("/programmes/{id}")
    public void deleteProgramme(@PathVariable Long id, Authentication auth) {
        LemsAccess.requireAdmin(auth);
        programmes.deleteById(id);
        audit.save(new LemsAuditEntry("PROGRAMME_DELETED", "Programme deleted: id " + id, "SUCCESS", "by " + auth.getName()));
    }

    private void applyProgramme(LemsProgramme p, ProgrammeRequest req) {
        p.setName(req.name());
        p.setCode(req.code());
        p.setDescription(req.description());
    }

    // ---- Lecturers ----
    public record LecturerRequest(String firstName, String lastName, String email, String department) { }

    @GetMapping("/lecturers")
    public List<LemsLecturer> allLecturers() { return lecturers.findAll(); }

    @PostMapping("/lecturers")
    public LemsLecturer createLecturer(@RequestBody LecturerRequest req, Authentication auth) {
        LemsAccess.requireAdmin(auth);
        LemsLecturer l = new LemsLecturer();
        applyLecturer(l, req);
        audit.save(new LemsAuditEntry("LECTURER_CREATED", "Lecturer created: " + l.getFullName(), "SUCCESS", "by " + auth.getName()));
        return lecturers.save(l);
    }

    @PutMapping("/lecturers/{id}")
    public LemsLecturer updateLecturer(@PathVariable Long id, @RequestBody LecturerRequest req, Authentication auth) {
        LemsAccess.requireAdmin(auth);
        LemsLecturer l = lecturers.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lecturer not found"));
        applyLecturer(l, req);
        audit.save(new LemsAuditEntry("LECTURER_UPDATED", "Lecturer updated: " + l.getFullName(), "SUCCESS", "by " + auth.getName()));
        return lecturers.save(l);
    }

    @DeleteMapping("/lecturers/{id}")
    public void deleteLecturer(@PathVariable Long id, Authentication auth) {
        LemsAccess.requireAdmin(auth);
        lecturers.deleteById(id);
        audit.save(new LemsAuditEntry("LECTURER_DELETED", "Lecturer deleted: id " + id, "SUCCESS", "by " + auth.getName()));
    }

    private void applyLecturer(LemsLecturer l, LecturerRequest req) {
        l.setFirstName(req.firstName());
        l.setLastName(req.lastName());
        l.setEmail(req.email());
        l.setDepartment(req.department());
    }

    // ---- Courses ----
    public record CourseRequest(String name, String code, String description, Integer semester,
                                Long programmeId, List<Long> lecturerIds) { }

    @GetMapping("/courses")
    public List<LemsCourse> allCourses() { return courses.findAll(); }

    @PostMapping("/courses")
    public LemsCourse createCourse(@RequestBody CourseRequest req, Authentication auth) {
        LemsAccess.requireAdmin(auth);
        LemsCourse c = new LemsCourse();
        applyCourse(c, req);
        audit.save(new LemsAuditEntry("COURSE_CREATED", "Course created: " + req.name(), "SUCCESS", "by " + auth.getName()));
        return courses.save(c);
    }

    @PutMapping("/courses/{id}")
    public LemsCourse updateCourse(@PathVariable Long id, @RequestBody CourseRequest req, Authentication auth) {
        LemsAccess.requireAdmin(auth);
        LemsCourse c = courses.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
        applyCourse(c, req);
        audit.save(new LemsAuditEntry("COURSE_UPDATED", "Course updated: " + req.name(), "SUCCESS", "by " + auth.getName()));
        return courses.save(c);
    }

    @DeleteMapping("/courses/{id}")
    public void deleteCourse(@PathVariable Long id, Authentication auth) {
        LemsAccess.requireAdmin(auth);
        courses.deleteById(id);
        audit.save(new LemsAuditEntry("COURSE_DELETED", "Course deleted: id " + id, "SUCCESS", "by " + auth.getName()));
    }

    private void applyCourse(LemsCourse c, CourseRequest req) {
        c.setName(req.name());
        c.setCode(req.code());
        c.setDescription(req.description());
        c.setSemester(req.semester());
        if (req.programmeId() != null) {
            c.setProgramme(programmes.findById(req.programmeId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Programme not found")));
        }
        if (req.lecturerIds() != null) {
            c.setLecturers(lecturers.findAllById(req.lecturerIds()));
        }
    }
}
