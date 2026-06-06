package gh.edu.techbridge.wms.task;

import gh.edu.techbridge.wms.project.Project;
import gh.edu.techbridge.wms.project.ProjectPermissionService;
import gh.edu.techbridge.wms.project.ProjectRepository;
import gh.edu.techbridge.wms.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.*;

/**
 * Timeline / Gantt view (FR-TL). Returns task bars positioned by start/due date,
 * dependency links (blocked-by), milestone markers, optional grouping, and
 * server-detected dependency conflicts (FR-TL-005). Drag-to-reschedule and zoom
 * are UI concerns; rescheduling persists via the existing task PUT (startDate/dueDate).
 * Baseline snapshot (FR-TL-008, Could-Have/post-MVP) is intentionally not implemented.
 */
@RestController
@RequestMapping("/api/projects/{projectId}/timeline")
public class TimelineController {

    private final TaskRepository tasks;
    private final ProjectRepository projects;
    private final ProjectPermissionService perms;

    public TimelineController(TaskRepository tasks, ProjectRepository projects, ProjectPermissionService perms) {
        this.tasks = tasks;
        this.projects = projects;
        this.perms = perms;
    }

    @GetMapping
    @Transactional(readOnly = true)   // reads lazy task collections (blockedBy/assignees) during serialization
    public Map<String, Object> timeline(@PathVariable Long projectId,
                                        @RequestParam(required = false) String groupBy, // "assignee" | "stage"
                                        Authentication auth) {
        User user = perms.currentUser(auth);
        Project p = projects.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        perms.requireView(user, p);

        List<Task> all = tasks.findByProjectId(projectId);
        Map<Long, Task> byId = new HashMap<>();
        all.forEach(t -> byId.put(t.getId(), t));

        List<Map<String, Object>> bars = all.stream().map(this::bar).toList();

        // FR-TL-005 — dependency conflicts: a task whose start (or due, if no start)
        // is on/before the end (dueDate) of a task it is blocked by.
        List<Map<String, Object>> conflicts = new ArrayList<>();
        for (Task t : all) {
            LocalDate tStart = t.getStartDate() != null ? t.getStartDate() : t.getDueDate();
            if (tStart == null) continue;
            for (Long blockerId : t.getBlockedByTaskIds()) {
                Task blocker = byId.get(blockerId);
                if (blocker == null || blocker.getDueDate() == null) continue;
                if (!tStart.isAfter(blocker.getDueDate())) {   // starts on/before blocker ends
                    conflicts.add(Map.of(
                            "taskId", t.getId(),
                            "blockedByTaskId", blockerId,
                            "message", "\"" + t.getTitle() + "\" is scheduled to start on/before its blocker \""
                                    + blocker.getTitle() + "\" ends (" + blocker.getDueDate() + ")"));
                }
            }
        }

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("projectId", projectId);
        out.put("bars", bars);
        out.put("dependencyConflicts", conflicts);   // FR-TL-005 warning indicators
        if ("assignee".equalsIgnoreCase(groupBy) || "stage".equalsIgnoreCase(groupBy)) {
            out.put("groupBy", groupBy.toLowerCase());
            out.put("groups", groups(all, groupBy));   // FR-TL-006
        }
        return out;
    }

    private Map<String, Object> bar(Task t) {
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("id", t.getId());
        b.put("title", t.getTitle());
        b.put("startDate", t.getStartDate());
        b.put("dueDate", t.getDueDate());
        b.put("milestone", t.isMilestone());
        b.put("status", t.getStatus());
        b.put("assigneeIds", t.getAssigneeIds());
        b.put("blockedByTaskIds", t.getBlockedByTaskIds());   // FR-TL-003 dependency links
        return b;
    }

    /** Group task ids by assignee (one entry per assignee id) or by stage (FR-TL-006). */
    private Map<String, List<Long>> groups(List<Task> all, String groupBy) {
        Map<String, List<Long>> g = new LinkedHashMap<>();
        if ("stage".equalsIgnoreCase(groupBy)) {
            for (Task t : all) g.computeIfAbsent(t.getStatus() == null ? "(none)" : t.getStatus(),
                    k -> new ArrayList<>()).add(t.getId());
        } else {
            for (Task t : all) {
                if (t.getAssigneeIds().isEmpty()) g.computeIfAbsent("(unassigned)", k -> new ArrayList<>()).add(t.getId());
                else t.getAssigneeIds().forEach(a -> g.computeIfAbsent("user:" + a, k -> new ArrayList<>()).add(t.getId()));
            }
        }
        return g;
    }
}
