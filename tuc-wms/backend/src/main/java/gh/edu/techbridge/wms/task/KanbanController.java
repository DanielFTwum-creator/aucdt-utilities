package gh.edu.techbridge.wms.task;

import gh.edu.techbridge.wms.project.Project;
import gh.edu.techbridge.wms.project.ProjectPermissionService;
import gh.edu.techbridge.wms.project.ProjectRepository;
import gh.edu.techbridge.wms.project.ProjectRole;
import gh.edu.techbridge.wms.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Kanban board view (FR-KB). Returns tasks grouped into stage columns with
 * per-column WIP state and card-level fields, plus server-side filtering.
 * Drag-drop/reorder/quick-add are existing Task/Project endpoints (the UI uses
 * those); WIP-limit config is set via PUT below (owner only, FR-KB-005).
 */
@RestController
@RequestMapping("/api/projects/{projectId}/board")
public class KanbanController {

    private final TaskRepository tasks;
    private final ProjectRepository projects;
    private final ProjectPermissionService perms;

    public KanbanController(TaskRepository tasks, ProjectRepository projects, ProjectPermissionService perms) {
        this.tasks = tasks;
        this.projects = projects;
        this.perms = perms;
    }

    @GetMapping
    @Transactional(readOnly = true)   // reads lazy project.stages + task collections while session is open
    public Map<String, Object> board(@PathVariable Long projectId,
                                     @RequestParam(required = false) Long assignee,
                                     @RequestParam(required = false) TaskPriority priority,
                                     @RequestParam(required = false) String label,
                                     @RequestParam(required = false) LocalDate dueFrom,
                                     @RequestParam(required = false) LocalDate dueTo,
                                     Authentication auth) {
        User user = perms.currentUser(auth);
        Project p = projects.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        perms.requireView(user, p);

        // Sub-task counts: count tasks whose parentTaskId == card id (top-level cards only on the board).
        List<Task> all = tasks.findByProjectId(projectId);
        Map<Long, Long> subtaskCounts = all.stream()
                .filter(t -> t.getParentTaskId() != null)
                .collect(Collectors.groupingBy(Task::getParentTaskId, Collectors.counting()));

        // Top-level cards passing the filters (FR-KB-006).
        List<Task> cards = all.stream()
                .filter(t -> t.getParentTaskId() == null)
                .filter(t -> assignee == null || t.getAssigneeIds().contains(assignee))
                .filter(t -> priority == null || t.getPriority() == priority)
                .filter(t -> label == null || t.getTags().contains(label))
                .filter(t -> dueFrom == null || (t.getDueDate() != null && !t.getDueDate().isBefore(dueFrom)))
                .filter(t -> dueTo == null || (t.getDueDate() != null && !t.getDueDate().isAfter(dueTo)))
                .toList();

        Map<String, List<Task>> byStage = cards.stream()
                .collect(Collectors.groupingBy(t -> t.getStatus() == null ? "" : t.getStatus()));

        List<Map<String, Object>> columns = new ArrayList<>();
        for (String stage : p.getStages()) {
            List<Task> col = byStage.getOrDefault(stage, List.of());
            Integer wip = p.getWipLimits().get(stage);   // null = no limit
            Map<String, Object> column = new LinkedHashMap<>();
            column.put("stage", stage);
            column.put("count", col.size());
            column.put("wipLimit", wip);
            column.put("overWip", wip != null && col.size() > wip);   // FR-KB-005 visual warning
            column.put("cards", col.stream().map(t -> card(t, subtaskCounts)).toList());
            columns.add(column);
        }

        Map<String, Object> board = new LinkedHashMap<>();
        board.put("projectId", projectId);
        board.put("stages", p.getStages());
        board.put("columns", columns);
        return board;
    }

    /** Set per-column WIP limits (FR-KB-005) — owner only. Body: { "In Progress": 5, ... }. null/absent clears. */
    @PutMapping("/wip-limits")
    @Transactional   // reads lazy stages + persists wipLimits
    public Map<String, Integer> setWipLimits(@PathVariable Long projectId,
                                             @RequestBody Map<String, Integer> limits, Authentication auth) {
        User user = perms.currentUser(auth);
        Project p = projects.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        perms.require(user, p, ProjectRole.OWNER);
        perms.requireWritable(p);
        Map<String, Integer> clean = new HashMap<>();
        limits.forEach((stage, lim) -> { if (lim != null && lim > 0 && p.getStages().contains(stage)) clean.put(stage, lim); });
        p.setWipLimits(clean);
        projects.save(p);
        return clean;
    }

    /** FR-KB-004 card: title, assignee avatar(s), due date, priority, sub-task count. */
    private Map<String, Object> card(Task t, Map<Long, Long> subtaskCounts) {
        Map<String, Object> c = new LinkedHashMap<>();
        c.put("id", t.getId());
        c.put("title", t.getTitle());
        c.put("assigneeIds", t.getAssigneeIds());
        c.put("dueDate", t.getDueDate());
        c.put("priority", t.getPriority() == null ? null : t.getPriority().name());
        c.put("subtaskCount", subtaskCounts.getOrDefault(t.getId(), 0L));
        c.put("status", t.getStatus());
        return c;
    }
}
