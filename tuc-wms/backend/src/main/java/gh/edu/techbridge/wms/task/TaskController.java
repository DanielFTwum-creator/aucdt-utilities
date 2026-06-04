package gh.edu.techbridge.wms.task;

import gh.edu.techbridge.wms.project.Project;
import gh.edu.techbridge.wms.project.ProjectRepository;
import gh.edu.techbridge.wms.project.ProjectPermissionService;
import gh.edu.techbridge.wms.project.ProjectRole;
import gh.edu.techbridge.wms.user.User;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.*;

/** Task CRUD within a project (FR-TASK-001..004, 008). Mutations require EDITOR+. */
@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
public class TaskController {

    private final TaskRepository tasks;
    private final ProjectRepository projects;
    private final ProjectPermissionService perms;

    public TaskController(TaskRepository tasks, ProjectRepository projects, ProjectPermissionService perms) {
        this.tasks = tasks;
        this.projects = projects;
        this.perms = perms;
    }

    public record TaskRequest(@NotBlank String title, String description, Set<Long> assigneeIds,
                              LocalDate dueDate, TaskPriority priority, String status,
                              Set<String> tags, Long parentTaskId, Set<Long> blockedByTaskIds) { }

    @PostMapping
    @Transactional
    public ResponseEntity<?> create(@PathVariable Long projectId, @RequestBody TaskRequest req, Authentication auth) {
        User user = perms.currentUser(auth);
        Project p = project(projectId);
        perms.require(user, p, ProjectRole.EDITOR);     // FR-TASK-001
        perms.requireWritable(p);

        Task t = new Task(projectId, req.title(), user.getId());
        apply(t, req, p);
        // Sub-task: parent must be a top-level task in the same project (one level deep — FR-TASK-003).
        if (req.parentTaskId() != null) {
            Task parent = tasks.findById(req.parentTaskId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parent task not found"));
            if (!parent.getProjectId().equals(projectId))
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parent task is in another project");
            if (parent.getParentTaskId() != null)
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sub-tasks are one level deep only");
            t.setParentTaskId(parent.getId());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(dto(tasks.save(t)));
    }

    @GetMapping
    public List<Map<String, Object>> list(@PathVariable Long projectId, Authentication auth) {
        User user = perms.currentUser(auth);
        perms.requireView(user, project(projectId));
        return tasks.findByProjectId(projectId).stream().map(this::dto).toList();
    }

    @GetMapping("/{taskId}")
    public Map<String, Object> get(@PathVariable Long projectId, @PathVariable Long taskId, Authentication auth) {
        User user = perms.currentUser(auth);
        perms.requireView(user, project(projectId));
        return dto(task(projectId, taskId));
    }

    @PutMapping("/{taskId}")
    @Transactional
    public Map<String, Object> update(@PathVariable Long projectId, @PathVariable Long taskId,
                                      @RequestBody TaskRequest req, Authentication auth) {
        User user = perms.currentUser(auth);
        Project p = project(projectId);
        perms.require(user, p, ProjectRole.EDITOR);
        perms.requireWritable(p);
        Task t = task(projectId, taskId);
        if (req.title() != null) t.setTitle(req.title());
        apply(t, req, p);
        return dto(tasks.save(t));
    }

    /** Duplicate a task within the same project (FR-TASK-008). */
    @PostMapping("/{taskId}/duplicate")
    @Transactional
    public ResponseEntity<?> duplicate(@PathVariable Long projectId, @PathVariable Long taskId, Authentication auth) {
        User user = perms.currentUser(auth);
        Project p = project(projectId);
        perms.require(user, p, ProjectRole.EDITOR);
        perms.requireWritable(p);
        Task src = task(projectId, taskId);
        Task copy = new Task(projectId, src.getTitle() + " (copy)", user.getId());
        copy.setDescription(src.getDescription());
        copy.setAssigneeIds(new HashSet<>(src.getAssigneeIds()));
        copy.setDueDate(src.getDueDate());
        copy.setPriority(src.getPriority());
        copy.setStatus(src.getStatus());
        copy.setTags(new HashSet<>(src.getTags()));
        copy.setParentTaskId(src.getParentTaskId());
        return ResponseEntity.status(HttpStatus.CREATED).body(dto(tasks.save(copy)));
    }

    @DeleteMapping("/{taskId}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable Long projectId, @PathVariable Long taskId, Authentication auth) {
        User user = perms.currentUser(auth);
        Project p = project(projectId);
        perms.require(user, p, ProjectRole.EDITOR);
        perms.requireWritable(p);
        Task t = task(projectId, taskId);
        tasks.findByParentTaskId(t.getId()).forEach(tasks::delete);   // cascade sub-tasks
        tasks.delete(t);
        return ResponseEntity.noContent().build();
    }

    // --- helpers ---
    private void apply(Task t, TaskRequest req, Project project) {
        if (req.description() != null) t.setDescription(req.description());
        if (req.assigneeIds() != null) t.setAssigneeIds(new HashSet<>(req.assigneeIds()));
        if (req.dueDate() != null) t.setDueDate(req.dueDate());
        if (req.priority() != null) t.setPriority(req.priority());
        if (req.tags() != null) t.setTags(new HashSet<>(req.tags()));
        if (req.blockedByTaskIds() != null) t.setBlockedByTaskIds(new HashSet<>(req.blockedByTaskIds()));
        if (req.status() != null) {
            // Status must be one of the project's workflow stages (FR-TASK-002).
            if (!project.getStages().contains(req.status()))
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Status must be one of the project stages: " + project.getStages());
            t.setStatus(req.status());
        } else if (t.getStatus() == null && !project.getStages().isEmpty()) {
            t.setStatus(project.getStages().get(0));   // default to first stage
        }
    }

    private Project project(Long projectId) {
        return projects.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
    }

    private Task task(Long projectId, Long taskId) {
        Task t = tasks.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
        if (!t.getProjectId().equals(projectId))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not in this project");
        return t;
    }

    private Map<String, Object> dto(Task t) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", t.getId());
        m.put("projectId", t.getProjectId());
        m.put("title", t.getTitle());
        m.put("description", t.getDescription());
        m.put("assigneeIds", t.getAssigneeIds());
        m.put("dueDate", t.getDueDate());
        m.put("priority", t.getPriority() == null ? null : t.getPriority().name());
        m.put("status", t.getStatus());
        m.put("tags", t.getTags());
        m.put("parentTaskId", t.getParentTaskId());
        m.put("blockedByTaskIds", t.getBlockedByTaskIds());
        m.put("createdByUserId", t.getCreatedByUserId());
        m.put("createdAt", t.getCreatedAt());
        m.put("updatedAt", t.getUpdatedAt());
        return m;
    }
}
