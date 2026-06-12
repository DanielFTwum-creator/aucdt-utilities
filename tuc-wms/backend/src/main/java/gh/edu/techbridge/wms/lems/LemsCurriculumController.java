package gh.edu.techbridge.wms.lems;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Admin curriculum import (the SPA extracts lecturers/courses from an uploaded
 * programme PDF via the WMS Gemini relay, then posts the reviewed result here).
 * Strictly ADDITIVE: lecturers are matched by full name and courses by name
 * within the programme — existing rows are updated, never deleted, and
 * evaluations are never touched. Every import is audited.
 */
@RestController
@RequestMapping("/api/lems/curriculum")
public class LemsCurriculumController {

    private final LemsProgrammeRepository programmes;
    private final LemsLecturerRepository lecturers;
    private final LemsCourseRepository courses;
    private final LemsAuditRepository audit;

    public LemsCurriculumController(LemsProgrammeRepository programmes, LemsLecturerRepository lecturers,
                                    LemsCourseRepository courses, LemsAuditRepository audit) {
        this.programmes = programmes;
        this.lecturers = lecturers;
        this.courses = courses;
        this.audit = audit;
    }

    public record LecturerImport(String name) { }
    public record CourseImport(String name, Integer year, Integer semester) { }
    public record ImportRequest(Long programmeId, List<LecturerImport> lecturers, List<CourseImport> courses) { }
    public record ImportSummary(int lecturersAdded, int coursesAdded, int coursesUpdated) { }

    @PostMapping("/import")
    @Transactional
    public ImportSummary importCurriculum(@RequestBody ImportRequest req, Authentication auth) {
        LemsAccess.requireAdmin(auth);
        LemsProgramme programme = programmes.findById(req.programmeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Programme not found"));

        int lecturersAdded = 0;
        List<LemsLecturer> allLecturers = lecturers.findAll();
        for (LecturerImport li : req.lecturers() == null ? List.<LecturerImport>of() : req.lecturers()) {
            String name = li.name() == null ? "" : li.name().trim();
            if (name.isEmpty()) continue;
            String finalName = name;
            boolean exists = allLecturers.stream().anyMatch(l -> l.getFullName().equalsIgnoreCase(finalName));
            if (exists) continue;
            LemsLecturer l = new LemsLecturer();
            int split = name.lastIndexOf(' ');
            l.setFirstName(split > 0 ? name.substring(0, split) : name);
            l.setLastName(split > 0 ? name.substring(split + 1) : "-");
            allLecturers.add(lecturers.save(l));
            lecturersAdded++;
        }

        int coursesAdded = 0;
        int coursesUpdated = 0;
        List<LemsCourse> programmeCourses = courses.findAll().stream()
                .filter(c -> c.getProgramme() != null && c.getProgramme().getId().equals(programme.getId()))
                .toList();
        for (CourseImport ci : req.courses() == null ? List.<CourseImport>of() : req.courses()) {
            String name = ci.name() == null ? "" : ci.name().trim();
            if (name.isEmpty()) continue;
            String finalName = name;
            LemsCourse existing = programmeCourses.stream()
                    .filter(c -> c.getName().equalsIgnoreCase(finalName))
                    .findFirst().orElse(null);
            if (existing != null) {
                if (ci.semester() != null) existing.setSemester(ci.semester());
                courses.save(existing);
                coursesUpdated++;
            } else {
                LemsCourse c = new LemsCourse();
                c.setName(name);
                c.setProgramme(programme);
                c.setSemester(ci.semester());
                if (ci.year() != null) c.setDescription("Year " + ci.year());
                courses.save(c);
                coursesAdded++;
            }
        }

        audit.save(new LemsAuditEntry("CURRICULUM_IMPORTED",
                "Curriculum imported for " + programme.getName(), "SUCCESS",
                "by " + auth.getName() + " — lecturers added: " + lecturersAdded
                        + ", courses added: " + coursesAdded + ", courses updated: " + coursesUpdated));
        return new ImportSummary(lecturersAdded, coursesAdded, coursesUpdated);
    }
}
