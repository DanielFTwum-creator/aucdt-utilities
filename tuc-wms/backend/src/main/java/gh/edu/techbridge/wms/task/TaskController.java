package gh.edu.techbridge.wms.task;

import gh.edu.techbridge.wms.project.Project;
import gh.edu.techbridge.wms.project.ProjectRepository;
import gh.edu.techbridge.wms.project.ProjectPermissionService;
import gh.edu.techbridge.wms.project.ProjectRole;
import gh.edu.techbridge.wms.notify.NotificationService;
import gh.edu.techbridge.wms.notify.TaskMailService;
import gh.edu.techbridge.wms.user.User;
import gh.edu.techbridge.wms.user.UserRepository;
import gh.edu.techbridge.wms.automation.AutomationService;
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
    private final ProjectEventService events;
    private final UserRepository users;
    private final TaskMailService taskMail;
    private final NotificationService notifications;
    private final AutomationService automation;
    private final TaskActivityRepository activities;
    private final TaskCommentRepository comments;
    private final TaskAttachmentRepository attachments;

    public TaskController(TaskRepository tasks, ProjectRepository projects, ProjectPermissionService perms,
                          ProjectEventService events, UserRepository users, TaskMailService taskMail,
                          NotificationService notifications, AutomationService automation,
                          TaskActivityRepository activities, TaskCommentRepository comments,
                          TaskAttachmentRepository attachments) {
        this.tasks = tasks;
        this.projects = projects;
        this.perms = perms;
        this.events = events;
        this.users = users;
        this.taskMail = taskMail;
        this.notifications = notifications;
        this.automation = automation;
        this.activities = activities;
        this.comments = comments;
        this.attachments = attachments;
    }

    /** Notify each given assignee (except the actor): in-app notification + email. */
    private void notifyAssignees(java.util.Collection<Long> assigneeIds, Task t, Project p, User actor) {
        for (Long uid : assigneeIds) {
            if (uid == null || uid.equals(actor.getId())) continue;   // no self-notification
            users.findById(uid).ifPresent(recipient -> {
                notifications.notifyTaskAssigned(recipient, t, p, actor);   // FR-NOTIF in-app
                taskMail.notifyAssigned(recipient, t, p, actor);            // FR-NOTIF-004 email
            });
        }
    }

    public record TaskRequest(@NotBlank String title, String description, Set<Long> assigneeIds,
                              LocalDate startDate, LocalDate dueDate, Boolean milestone, TaskPriority priority,
                              String status, Set<String> tags, Long parentTaskId, Set<Long> blockedByTaskIds) { }

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
        Task saved = tasks.save(t);
        activities.save(new TaskActivity(saved.getId(), user.getId(), "CREATED", "Task created by " + user.getFullName()));
        Map<String, Object> body = dto(saved);
        events.publish(projectId, "task.created", body);   // FR-KB real-time
        notifyAssignees(saved.getAssigneeIds(), saved, p, user);   // FR-NOTIF: email new assignees
        automation.trigger(projectId, "TASK_CREATED", saved, user, null, saved.getStatus());
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @GetMapping
    @Transactional(readOnly = true)   // dto() reads lazy task collections (assignees/tags/blockedBy)
    public List<Map<String, Object>> list(@PathVariable Long projectId, Authentication auth) {
        User user = perms.currentUser(auth);
        perms.requireView(user, project(projectId));
        return tasks.findByProjectId(projectId).stream().map(this::dto).toList();
    }

    @GetMapping("/{taskId}")
    @Transactional(readOnly = true)
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
        Set<Long> before = new HashSet<>(t.getAssigneeIds());   // capture before apply() overwrites
        String oldTitle = t.getTitle();
        String oldStatus = t.getStatus();
        TaskPriority oldPriority = t.getPriority();
        LocalDate oldStart = t.getStartDate();
        LocalDate oldDue = t.getDueDate();
        boolean oldMilestone = t.isMilestone();

        if (req.title() != null) t.setTitle(req.title());
        apply(t, req, p);
        Task saved = tasks.save(t);
        
        // Compare changes and log activity
        List<TaskActivity> logs = new ArrayList<>();
        if (!Objects.equals(oldTitle, saved.getTitle())) {
            logs.add(new TaskActivity(taskId, user.getId(), "UPDATED", "Renamed task to \"" + saved.getTitle() + "\""));
        }
        if (!Objects.equals(oldStatus, saved.getStatus())) {
            logs.add(new TaskActivity(taskId, user.getId(), "STATUS_CHANGED", "Moved status from \"" + oldStatus + "\" to \"" + saved.getStatus() + "\""));
        }
        if (!Objects.equals(oldPriority, saved.getPriority())) {
            logs.add(new TaskActivity(taskId, user.getId(), "PRIORITY_CHANGED", "Changed priority from " + oldPriority + " to " + saved.getPriority()));
        }
        if (!Objects.equals(oldStart, saved.getStartDate())) {
            logs.add(new TaskActivity(taskId, user.getId(), "DUE_DATE_CHANGED", "Changed start date to " + saved.getStartDate()));
        }
        if (!Objects.equals(oldDue, saved.getDueDate())) {
            logs.add(new TaskActivity(taskId, user.getId(), "DUE_DATE_CHANGED", "Changed due date to " + saved.getDueDate()));
        }
        if (oldMilestone != saved.isMilestone()) {
            logs.add(new TaskActivity(taskId, user.getId(), "UPDATED", saved.isMilestone() ? "Marked as milestone" : "Removed milestone marker"));
        }

        Set<Long> after = saved.getAssigneeIds();
        if (!before.equals(after)) {
            Set<Long> added = new HashSet<>(after);
            added.removeAll(before);
            Set<Long> removed = new HashSet<>(before);
            removed.removeAll(after);
            for (Long uid : added) {
                users.findById(uid).ifPresent(u -> logs.add(new TaskActivity(taskId, user.getId(), "ASSIGNEE_CHANGED", "Assigned task to " + u.getFullName())));
            }
            for (Long uid : removed) {
                users.findById(uid).ifPresent(u -> logs.add(new TaskActivity(taskId, user.getId(), "ASSIGNEE_CHANGED", "Removed assignee " + u.getFullName())));
            }
        }
        if (!logs.isEmpty()) {
            activities.saveAll(logs);
        }

        Map<String, Object> body = dto(saved);
        events.publish(projectId, "task.updated", body);   // incl. status change (drag-drop) — FR-KB
        // FR-NOTIF: email only assignees newly added by this update (no spam on unrelated edits).
        Set<Long> added = new HashSet<>(saved.getAssigneeIds());
        added.removeAll(before);
        notifyAssignees(added, saved, p, user);
        
        if (oldStatus != null && !oldStatus.equals(saved.getStatus())) {
            automation.trigger(projectId, "STATUS_CHANGED", saved, user, oldStatus, saved.getStatus());
        }
        
        return body;
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
        Task saved = tasks.save(copy);
        
        activities.save(new TaskActivity(saved.getId(), user.getId(), "DUPLICATED", "Task duplicated from \"" + src.getTitle() + "\" by " + user.getFullName()));
        
        Map<String, Object> body = dto(saved);
        events.publish(projectId, "task.created", body);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @DeleteMapping("/{taskId}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable Long projectId, @PathVariable Long taskId, Authentication auth) {
        User user = perms.currentUser(auth);
        Project p = project(projectId);
        perms.require(user, p, ProjectRole.EDITOR);
        perms.requireWritable(p);
        Task t = task(projectId, taskId);
        
        tasks.findByParentTaskId(t.getId()).forEach(sub -> {
            cleanupCollaborationData(sub.getId());
            tasks.delete(sub);
        });   // cascade sub-tasks
        
        cleanupCollaborationData(t.getId());
        tasks.delete(t);
        
        events.publish(projectId, "task.deleted", Map.of("id", taskId));
        return ResponseEntity.noContent().build();
    }

    public record BulkUpdateRequest(
        List<Long> taskIds,
        String status,
        TaskPriority priority,
        Set<Long> assigneeIds,
        Boolean milestone,
        List<String> tagsToAdd,
        List<String> tagsToRemove
    ) { }

    @PostMapping("/bulk-update")
    @Transactional
    public ResponseEntity<?> bulkUpdate(@PathVariable Long projectId,
                                        @RequestBody BulkUpdateRequest req,
                                        Authentication auth) {
        User user = perms.currentUser(auth);
        Project p = project(projectId);
        perms.require(user, p, ProjectRole.EDITOR);
        perms.requireWritable(p);

        if (req.taskIds() == null || req.taskIds().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No task ids provided");
        }

        List<Task> targetTasks = tasks.findAllById(req.taskIds()).stream()
                .filter(t -> t.getProjectId().equals(projectId))
                .toList();

        if (targetTasks.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No matching tasks found in this project");
        }

        for (Task t : targetTasks) {
            Set<Long> beforeAssignees = new HashSet<>(t.getAssigneeIds());
            String oldStatus = t.getStatus();
            TaskPriority oldPriority = t.getPriority();
            boolean oldMilestone = t.isMilestone();

            List<TaskActivity> logs = new ArrayList<>();

            if (req.status() != null) {
                if (!p.getStages().contains(req.status())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid stage status");
                }
                t.setStatus(req.status());
                if (!req.status().equals(oldStatus)) {
                    logs.add(new TaskActivity(t.getId(), user.getId(), "STATUS_CHANGED", "Moved status from \"" + oldStatus + "\" to \"" + req.status() + "\""));
                }
            }
            if (req.priority() != null) {
                t.setPriority(req.priority());
                if (!req.priority().equals(oldPriority)) {
                    logs.add(new TaskActivity(t.getId(), user.getId(), "PRIORITY_CHANGED", "Changed priority from " + oldPriority + " to " + req.priority()));
                }
            }
            if (req.milestone() != null) {
                t.setMilestone(req.milestone());
                if (req.milestone() != oldMilestone) {
                    logs.add(new TaskActivity(t.getId(), user.getId(), "UPDATED", req.milestone() ? "Marked as milestone" : "Removed milestone marker"));
                }
            }
            if (req.assigneeIds() != null) {
                t.setAssigneeIds(new HashSet<>(req.assigneeIds()));
                if (!beforeAssignees.equals(req.assigneeIds())) {
                    Set<Long> added = new HashSet<>(req.assigneeIds());
                    added.removeAll(beforeAssignees);
                    Set<Long> removed = new HashSet<>(beforeAssignees);
                    removed.removeAll(req.assigneeIds());
                    for (Long uid : added) {
                        users.findById(uid).ifPresent(u -> logs.add(new TaskActivity(t.getId(), user.getId(), "ASSIGNEE_CHANGED", "Assigned task to " + u.getFullName())));
                    }
                    for (Long uid : removed) {
                        users.findById(uid).ifPresent(u -> logs.add(new TaskActivity(t.getId(), user.getId(), "ASSIGNEE_CHANGED", "Removed assignee " + u.getFullName())));
                    }
                    notifyAssignees(added, t, p, user);
                }
            }
            if (req.tagsToAdd() != null && !req.tagsToAdd().isEmpty()) {
                t.getTags().addAll(req.tagsToAdd());
                logs.add(new TaskActivity(t.getId(), user.getId(), "UPDATED", "Added tags: " + String.join(", ", req.tagsToAdd())));
            }
            if (req.tagsToRemove() != null && !req.tagsToRemove().isEmpty()) {
                t.getTags().removeAll(req.tagsToRemove());
                logs.add(new TaskActivity(t.getId(), user.getId(), "UPDATED", "Removed tags: " + String.join(", ", req.tagsToRemove())));
            }

            Task saved = tasks.save(t);
            if (!logs.isEmpty()) {
                activities.saveAll(logs);
            }

            Map<String, Object> body = dto(saved);
            events.publish(projectId, "task.updated", body);

            if (oldStatus != null && !oldStatus.equals(saved.getStatus())) {
                automation.trigger(projectId, "STATUS_CHANGED", saved, user, oldStatus, saved.getStatus());
            }
        }

        return ResponseEntity.ok(Map.of("count", targetTasks.size()));
    }

    @PostMapping("/bulk-delete")
    @Transactional
    public ResponseEntity<?> bulkDelete(@PathVariable Long projectId,
                                        @RequestBody Map<String, List<Long>> req,
                                        Authentication auth) {
        User user = perms.currentUser(auth);
        Project p = project(projectId);
        perms.require(user, p, ProjectRole.EDITOR);
        perms.requireWritable(p);

        List<Long> ids = req.get("taskIds");
        if (ids == null || ids.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No task ids provided");
        }

        List<Task> targetTasks = tasks.findAllById(ids).stream()
                .filter(t -> t.getProjectId().equals(projectId))
                .toList();

        for (Task t : targetTasks) {
            tasks.findByParentTaskId(t.getId()).forEach(sub -> {
                cleanupCollaborationData(sub.getId());
                tasks.delete(sub);
            });
            cleanupCollaborationData(t.getId());
            tasks.delete(t);
            events.publish(projectId, "task.deleted", Map.of("id", t.getId()));
        }

        return ResponseEntity.noContent().build();
    }

    private void cleanupCollaborationData(Long taskId) {
        comments.findByTaskIdOrderByCreatedAtAsc(taskId).forEach(comments::delete);
        activities.findByTaskIdOrderByOccurredAtDesc(taskId).forEach(activities::delete);
        attachments.findByTaskIdOrderByUploadedAtDesc(taskId).forEach(attachments::delete);
    }

    // --- helpers ---
    private void apply(Task t, TaskRequest req, Project project) {
        if (req.description() != null) t.setDescription(req.description());
        if (req.assigneeIds() != null) t.setAssigneeIds(new HashSet<>(req.assigneeIds()));
        if (req.startDate() != null) t.setStartDate(req.startDate());
        if (req.dueDate() != null) t.setDueDate(req.dueDate());
        if (req.milestone() != null) t.setMilestone(req.milestone());
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
        m.put("assigneeIds", new ArrayList<>(t.getAssigneeIds()));   // materialise lazy collections
        m.put("startDate", t.getStartDate());
        m.put("dueDate", t.getDueDate());
        m.put("milestone", t.isMilestone());
        m.put("priority", t.getPriority() == null ? null : t.getPriority().name());
        m.put("status", t.getStatus());
        m.put("tags", new ArrayList<>(t.getTags()));
        m.put("parentTaskId", t.getParentTaskId());
        m.put("blockedByTaskIds", new ArrayList<>(t.getBlockedByTaskIds()));
        m.put("createdByUserId", t.getCreatedByUserId());
        m.put("createdAt", t.getCreatedAt());
        m.put("updatedAt", t.getUpdatedAt());
        return m;
    }
}
