package gh.edu.techbridge.wms.project;

import gh.edu.techbridge.wms.user.Role;
import gh.edu.techbridge.wms.user.User;
import gh.edu.techbridge.wms.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * Per-project RBAC guard (FR-PROJ-006), layered on top of the global FR-AUTH
 * role/JWT security. SYSTEM_ADMIN is treated as project OWNER everywhere.
 *
 * Usage in controllers/services:
 *   var user = perms.currentUser(auth);
 *   perms.require(user, project, ProjectRole.EDITOR);   // 403 if insufficient
 */
@Service
public class ProjectPermissionService {

    private final UserRepository users;
    private final ProjectMemberRepository members;

    public ProjectPermissionService(UserRepository users, ProjectMemberRepository members) {
        this.users = users;
        this.members = members;
    }

    public User currentUser(org.springframework.security.core.Authentication auth) {
        return users.findByEmail(auth.getName())
                .filter(User::isActive)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unknown or inactive user"));
    }

    /** The user's effective role on a project (SYSTEM_ADMIN => OWNER; else their membership). */
    public ProjectRole effectiveRole(User user, Project project) {
        if (user.getRole() == Role.SYSTEM_ADMIN) return ProjectRole.OWNER;
        if (project.getOwnerId().equals(user.getId())) return ProjectRole.OWNER;
        return members.findByProjectIdAndUserId(project.getId(), user.getId())
                .map(ProjectMember::getProjectRole)
                .orElse(null);
    }

    /** Throw 403 unless the user has at least `required` on the project. */
    public void require(User user, Project project, ProjectRole required) {
        ProjectRole role = effectiveRole(user, project);
        if (role == null || !role.atLeast(required)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Requires project role " + required + " or higher");
        }
    }

    /** Can this user even see the project? (visibility-aware read check, FR-PROJ-005). */
    public boolean canView(User user, Project project) {
        if (user.getRole() == Role.SYSTEM_ADMIN) return true;
        if (effectiveRole(user, project) != null) return true;   // any member
        return switch (project.getVisibility()) {
            case PUBLIC -> true;
            case DEPARTMENT -> project.getDepartment() != null
                    && project.getDepartment().equalsIgnoreCase(deptOf(user));
            case MEMBERS, PRIVATE -> false;
        };
    }

    public void requireView(User user, Project project) {
        if (!canView(user, project)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not permitted to view this project");
        }
    }

    /** Global-role gate for project creation (FR-PROJ-001: Lecturer/HOD/AdminStaff/SystemAdmin). */
    public void requireCanCreateProject(User user) {
        switch (user.getRole()) {
            case LECTURER, ADMIN_STAFF, HOD, SYSTEM_ADMIN -> { /* allowed */ }
            default -> throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Your role may not create projects");
        }
    }

    /** Archived projects are read-only (FR-PROJ-004) — block mutations. */
    public void requireWritable(Project project) {
        if (project.isArchived()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Project is archived (read-only)");
        }
    }

    // Department isn't on User in Phase 1; placeholder hook for when it's added.
    private String deptOf(User user) { return null; }
}
