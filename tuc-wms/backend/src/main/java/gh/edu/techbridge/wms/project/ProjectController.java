package gh.edu.techbridge.wms.project;

import gh.edu.techbridge.wms.user.User;
import gh.edu.techbridge.wms.user.UserRepository;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.*;

/** Project CRUD + membership (FR-PROJ-001..007). */
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private static final List<String> DEFAULT_STAGES = List.of("To Do", "In Progress", "Review", "Done");

    private final ProjectRepository projects;
    private final ProjectMemberRepository members;
    private final ProjectPermissionService perms;
    private final UserRepository users;

    public ProjectController(ProjectRepository projects, ProjectMemberRepository members,
                             ProjectPermissionService perms, UserRepository users) {
        this.projects = projects;
        this.members = members;
        this.perms = perms;
        this.users = users;
    }

    public record CreateProjectRequest(@NotBlank String name, String description, String department,
                                       LocalDate startDate, LocalDate endDate, Visibility visibility,
                                       List<String> stages) { }

    @PostMapping
    @Transactional
    public ResponseEntity<?> create(@RequestBody CreateProjectRequest req, Authentication auth) {
        User user = perms.currentUser(auth);
        perms.requireCanCreateProject(user);   // FR-PROJ-001

        Project p = new Project(req.name(), req.description(), req.department(),
                req.startDate(), req.endDate(), req.visibility(), user.getId());
        p.setStages(req.stages() != null && !req.stages().isEmpty()
                ? new ArrayList<>(req.stages()) : new ArrayList<>(DEFAULT_STAGES));   // FR-PROJ-003
        p = projects.save(p);
        // Creator becomes OWNER member (FR-PROJ-006).
        members.save(new ProjectMember(p.getId(), user.getId(), ProjectRole.OWNER));
        return ResponseEntity.status(HttpStatus.CREATED).body(summary(p));
    }

    /** List projects the user may view (FR-PROJ-007 summary cards). */
    @GetMapping
    public List<Map<String, Object>> list(Authentication auth) {
        User user = perms.currentUser(auth);
        return projects.findByArchivedFalse().stream()
                .filter(p -> perms.canView(user, p))
                .map(this::summary)
                .toList();
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)   // keep the session open: detail() reads the lazy `stages` collection
    public Map<String, Object> get(@PathVariable Long id, Authentication auth) {
        User user = perms.currentUser(auth);
        Project p = load(id);
        perms.requireView(user, p);
        return detail(p);
    }

    public record UpdateProjectRequest(String name, String description, String department,
                                       LocalDate startDate, LocalDate endDate, Visibility visibility,
                                       List<String> stages) { }

    @PutMapping("/{id}")
    @Transactional
    public Map<String, Object> update(@PathVariable Long id, @RequestBody UpdateProjectRequest req, Authentication auth) {
        User user = perms.currentUser(auth);
        Project p = load(id);
        perms.require(user, p, ProjectRole.EDITOR);
        perms.requireWritable(p);
        if (req.name() != null) p.setName(req.name());
        if (req.description() != null) p.setDescription(req.description());
        if (req.department() != null) p.setDepartment(req.department());
        if (req.startDate() != null) p.setStartDate(req.startDate());
        if (req.endDate() != null) p.setEndDate(req.endDate());
        if (req.visibility() != null) p.setVisibility(req.visibility());      // FR-PROJ-005
        if (req.stages() != null) p.setStages(new ArrayList<>(req.stages())); // FR-PROJ-003
        return detail(projects.save(p));
    }

    /** Archive (soft delete, FR-PROJ-004) — owner/SystemAdmin only. */
    @PostMapping("/{id}/archive")
    @Transactional
    public Map<String, Object> archive(@PathVariable Long id, @RequestParam(defaultValue = "true") boolean archived,
                                       Authentication auth) {
        User user = perms.currentUser(auth);
        Project p = load(id);
        perms.require(user, p, ProjectRole.OWNER);
        p.setArchived(archived);
        return summary(projects.save(p));
    }

    // --- Members (FR-PROJ-006) ---
    public record MemberRequest(@NotBlank String email, @NotBlank String projectRole) { }

    @GetMapping("/{id}/members")
    public List<Map<String, Object>> listMembers(@PathVariable Long id, Authentication auth) {
        User user = perms.currentUser(auth);
        Project p = load(id);
        perms.requireView(user, p);
        return members.findByProjectId(id).stream().map(m -> {
            User u = users.findById(m.getUserId()).orElse(null);
            Map<String, Object> map = new HashMap<>();
            map.put("userId", m.getUserId());
            map.put("email", u == null ? null : u.getEmail());
            map.put("name", u == null ? null : u.getFullName());
            map.put("projectRole", m.getProjectRole().name());
            return map;
        }).toList();
    }

    @PostMapping("/{id}/members")
    @Transactional
    public ResponseEntity<?> addMember(@PathVariable Long id, @RequestBody MemberRequest req, Authentication auth) {
        User actor = perms.currentUser(auth);
        Project p = load(id);
        perms.require(actor, p, ProjectRole.OWNER);
        perms.requireWritable(p);
        ProjectRole role;
        try { role = ProjectRole.valueOf(req.projectRole()); }
        catch (Exception e) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid projectRole"); }
        User target = users.findByEmail(req.email().trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No TUC-WMS user with that email"));
        ProjectMember m = members.findByProjectIdAndUserId(id, target.getId())
                .orElseGet(() -> new ProjectMember(id, target.getId(), role));
        m.setProjectRole(role);
        members.save(m);
        return ResponseEntity.ok(Map.of("userId", target.getId(), "projectRole", role.name()));
    }

    @DeleteMapping("/{id}/members/{userId}")
    @Transactional
    public ResponseEntity<?> removeMember(@PathVariable Long id, @PathVariable Long userId, Authentication auth) {
        User actor = perms.currentUser(auth);
        Project p = load(id);
        perms.require(actor, p, ProjectRole.OWNER);
        if (userId.equals(p.getOwnerId()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot remove the project owner");
        members.deleteByProjectIdAndUserId(id, userId);
        return ResponseEntity.noContent().build();
    }

    // --- helpers ---
    private Project load(Long id) {
        return projects.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
    }

    private Map<String, Object> summary(Project p) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", p.getId());
        m.put("name", p.getName());
        m.put("ownerId", p.getOwnerId());
        m.put("dueDate", p.getEndDate());
        m.put("memberCount", members.countByProjectId(p.getId()));
        m.put("visibility", p.getVisibility().name());
        m.put("archived", p.isArchived());
        return m;
    }

    private Map<String, Object> detail(Project p) {
        Map<String, Object> m = summary(p);
        m.put("description", p.getDescription());
        m.put("department", p.getDepartment());
        m.put("startDate", p.getStartDate());
        // Materialise the lazy @ElementCollection into a concrete list NOW, inside the
        // transaction. Putting p.getStages() directly stores a lazy proxy that Jackson
        // would serialize AFTER the session closed (open-in-view=false) → LazyInitException.
        m.put("stages", new ArrayList<>(p.getStages()));
        return m;
    }
}
