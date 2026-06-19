package gh.edu.techbridge.wms.project;

import gh.edu.techbridge.wms.task.Task;
import gh.edu.techbridge.wms.task.TaskRepository;
import gh.edu.techbridge.wms.user.User;
import gh.edu.techbridge.wms.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * REST controller for project reports and analytics (FR-RPT).
 */
@RestController
@RequestMapping("/api/projects/{projectId}/reports")
public class ReportController {

    private final ProjectRepository projects;
    private final ProjectMemberRepository members;
    private final TaskRepository tasks;
    private final UserRepository users;
    private final ProjectPermissionService perms;

    public ReportController(ProjectRepository projects, ProjectMemberRepository members,
                            TaskRepository tasks, UserRepository users, ProjectPermissionService perms) {
        this.projects = projects;
        this.members = members;
        this.tasks = tasks;
        this.users = users;
        this.perms = perms;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public Map<String, Object> getProjectReport(@PathVariable Long projectId, Authentication auth) {
        User currentUser = perms.currentUser(auth);
        Project p = projects.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        perms.requireView(currentUser, p);

        List<Task> allTasks = tasks.findByProjectId(projectId);

        // Determine the completed stage
        final String completedStage = (p.getStages() != null && !p.getStages().isEmpty())
                ? p.getStages().get(p.getStages().size() - 1)
                : "Done";

        // Completion metrics
        long totalTasks = allTasks.size();
        long completedTasks = allTasks.stream()
                .filter(t -> isCompleted(t, completedStage))
                .count();
        double completionRatePercentage = totalTasks > 0
                ? Math.round((completedTasks * 100.0 / totalTasks) * 100.0) / 100.0
                : 0.0;

        long totalMilestones = allTasks.stream()
                .filter(Task::isMilestone)
                .count();
        long completedMilestones = allTasks.stream()
                .filter(Task::isMilestone)
                .filter(t -> isCompleted(t, completedStage))
                .count();

        Map<String, Object> completionRate = new LinkedHashMap<>();
        completionRate.put("totalTasks", totalTasks);
        completionRate.put("completedTasks", completedTasks);
        completionRate.put("completionRatePercentage", completionRatePercentage);
        completionRate.put("totalMilestones", totalMilestones);
        completionRate.put("completedMilestones", completedMilestones);

        // Status Distribution
        Map<String, Long> statusDistribution = new LinkedHashMap<>();
        if (p.getStages() != null) {
            for (String stage : p.getStages()) {
                statusDistribution.put(stage, 0L);
            }
        }
        for (Task t : allTasks) {
            String status = t.getStatus();
            if (status != null) {
                statusDistribution.put(status, statusDistribution.getOrDefault(status, 0L) + 1);
            }
        }

        // Fetch user mappings for workload and assignees list
        Set<Long> assigneeIds = allTasks.stream()
                .flatMap(t -> t.getAssigneeIds().stream())
                .collect(Collectors.toSet());

        List<ProjectMember> memberList = members.findByProjectId(projectId);
        Set<Long> memberIds = memberList.stream()
                .map(ProjectMember::getUserId)
                .collect(Collectors.toSet());

        Set<Long> fetchIds = new HashSet<>();
        fetchIds.addAll(assigneeIds);
        fetchIds.addAll(memberIds);

        List<User> projectUsers = users.findAllById(fetchIds);
        Map<Long, User> userMap = projectUsers.stream()
                .collect(Collectors.toMap(User::getId, u -> u));

        // Workload Summary
        List<Map<String, Object>> workloadSummary = new ArrayList<>();
        for (User u : projectUsers) {
            Long uid = u.getId();
            List<Task> userTasks = allTasks.stream()
                    .filter(t -> t.getAssigneeIds().contains(uid))
                    .toList();

            long total = userTasks.size();
            long completed = userTasks.stream()
                    .filter(t -> isCompleted(t, completedStage))
                    .count();
            long uncompleted = total - completed;
            long overdue = userTasks.stream()
                    .filter(t -> isOverdue(t, completedStage))
                    .count();

            Map<String, Object> w = new LinkedHashMap<>();
            w.put("userId", uid);
            w.put("userName", u.getFullName());
            w.put("userEmail", u.getEmail());
            w.put("totalTasks", total);
            w.put("completedTasks", completed);
            w.put("uncompletedTasks", uncompleted);
            w.put("overdueTasks", overdue);
            workloadSummary.add(w);
        }

        // Overdue Tasks List
        List<Map<String, Object>> overdueTasksList = new ArrayList<>();
        for (Task t : allTasks) {
            if (isOverdue(t, completedStage)) {
                Map<String, Object> ot = new LinkedHashMap<>();
                ot.put("id", t.getId());
                ot.put("title", t.getTitle());
                ot.put("dueDate", t.getDueDate());
                ot.put("status", t.getStatus());
                ot.put("priority", t.getPriority().name());

                List<String> assignees = t.getAssigneeIds().stream()
                        .map(uid -> userMap.containsKey(uid) ? userMap.get(uid).getFullName() : "Unknown User")
                        .toList();
                ot.put("assignees", assignees);
                overdueTasksList.add(ot);
            }
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("completionRate", completionRate);
        response.put("statusDistribution", statusDistribution);
        response.put("workloadSummary", workloadSummary);
        response.put("overdueTasks", overdueTasksList);

        return response;
    }

    private boolean isCompleted(Task t, String completedStage) {
        if (t.getStatus() == null || completedStage == null) return false;
        return t.getStatus().equalsIgnoreCase(completedStage);
    }

    private boolean isOverdue(Task t, String completedStage) {
        if (isCompleted(t, completedStage)) return false;
        if (t.getDueDate() == null) return false;
        return t.getDueDate().isBefore(LocalDate.now());
    }
}
