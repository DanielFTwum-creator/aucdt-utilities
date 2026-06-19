package gh.edu.techbridge.wms.task;

import gh.edu.techbridge.wms.project.Project;
import gh.edu.techbridge.wms.project.ProjectPermissionService;
import gh.edu.techbridge.wms.project.ProjectRepository;
import gh.edu.techbridge.wms.user.User;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Controller for global task search across viewable projects (FR-TASK-009).
 */
@RestController
@RequestMapping("/api/tasks")
public class SearchController {

    private final ProjectRepository projects;
    private final TaskRepository tasks;
    private final ProjectPermissionService perms;

    public SearchController(ProjectRepository projects, TaskRepository tasks, ProjectPermissionService perms) {
        this.projects = projects;
        this.tasks = tasks;
        this.perms = perms;
    }

    @GetMapping("/search")
    @Transactional(readOnly = true)
    public List<Map<String, Object>> search(@RequestParam String q, Authentication auth) {
        if (q == null || q.trim().isEmpty()) {
            return Collections.emptyList();
        }
        User user = perms.currentUser(auth);
        String term = q.trim().toLowerCase();

        // Retrieve projects this user is allowed to view
        List<Project> viewableProjects = projects.findByArchivedFalse().stream()
                .filter(p -> perms.canView(user, p))
                .toList();

        if (viewableProjects.isEmpty()) {
            return Collections.emptyList();
        }

        Set<Long> projectIds = viewableProjects.stream()
                .map(Project::getId)
                .collect(Collectors.toSet());

        // Accumulate matching tasks
        List<Task> matches = new ArrayList<>();
        for (Long pid : projectIds) {
            matches.addAll(tasks.findByProjectId(pid));
        }

        return matches.stream()
                .filter(t -> t.getTitle().toLowerCase().contains(term)
                        || (t.getDescription() != null && t.getDescription().toLowerCase().contains(term))
                        || t.getTags().stream().anyMatch(tag -> tag.toLowerCase().contains(term)))
                .map(t -> {
                    Map<String, Object> dto = new LinkedHashMap<>();
                    dto.put("id", t.getId());
                    dto.put("projectId", t.getProjectId());
                    dto.put("title", t.getTitle());
                    dto.put("status", t.getStatus());
                    dto.put("priority", t.getPriority().name());
                    dto.put("dueDate", t.getDueDate());

                    // Map parent project name
                    viewableProjects.stream()
                            .filter(p -> p.getId().equals(t.getProjectId()))
                            .findFirst()
                            .ifPresent(p -> dto.put("projectName", p.getName()));

                    return dto;
                })
                .toList();
    }
}
