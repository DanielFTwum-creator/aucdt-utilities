package gh.edu.techbridge.wms.task;

import gh.edu.techbridge.wms.project.Project;
import gh.edu.techbridge.wms.project.ProjectPermissionService;
import gh.edu.techbridge.wms.project.ProjectRepository;
import gh.edu.techbridge.wms.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * SSE stream of board changes for a project (FR-KB real-time). Clients (the WMS
 * UI) open EventSource on this endpoint and refresh affected cards on each event.
 */
@RestController
@RequestMapping("/api/projects/{projectId}/stream")
public class ProjectStreamController {

    private final ProjectEventService events;
    private final ProjectRepository projects;
    private final ProjectPermissionService perms;

    public ProjectStreamController(ProjectEventService events, ProjectRepository projects,
                                   ProjectPermissionService perms) {
        this.events = events;
        this.projects = projects;
        this.perms = perms;
    }

    @GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@PathVariable Long projectId, Authentication auth) {
        User user = perms.currentUser(auth);
        Project p = projects.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        perms.requireView(user, p);   // only project-visible users may subscribe
        return events.subscribe(projectId);
    }
}
