package gh.edu.techbridge.wms.automation;

import gh.edu.techbridge.wms.project.Project;
import gh.edu.techbridge.wms.project.ProjectRepository;
import gh.edu.techbridge.wms.task.ProjectEventService;
import gh.edu.techbridge.wms.task.Task;
import gh.edu.techbridge.wms.task.TaskRepository;
import gh.edu.techbridge.wms.task.TaskPriority;
import gh.edu.techbridge.wms.user.User;
import gh.edu.techbridge.wms.user.UserRepository;
import gh.edu.techbridge.wms.notify.NotificationService;
import gh.edu.techbridge.wms.notify.TaskMailService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AutomationService {

    private final AutomationRuleRepository ruleRepo;
    private final AutomationHistoryRepository historyRepo;
    private final TaskRepository taskRepo;
    private final ProjectRepository projectRepo;
    private final UserRepository userRepo;
    private final NotificationService notifications;
    private final TaskMailService taskMail;
    private final ProjectEventService sseEvents;

    private static final ThreadLocal<Boolean> runningAutomation = ThreadLocal.withInitial(() -> false);

    public AutomationService(AutomationRuleRepository ruleRepo, AutomationHistoryRepository historyRepo,
                             TaskRepository taskRepo, ProjectRepository projectRepo, UserRepository userRepo,
                             NotificationService notifications, TaskMailService taskMail,
                             ProjectEventService sseEvents) {
        this.ruleRepo = ruleRepo;
        this.historyRepo = historyRepo;
        this.taskRepo = taskRepo;
        this.projectRepo = projectRepo;
        this.userRepo = userRepo;
        this.notifications = notifications;
        this.taskMail = taskMail;
        this.sseEvents = sseEvents;
    }

    @Transactional
    public void trigger(Long projectId, String eventType, Task task, User actor, String oldStatus, String newStatus) {
        if (runningAutomation.get()) {
            return; // Prevent recursive loops
        }

        List<AutomationRule> rules = ruleRepo.findByProjectId(projectId);
        if (rules.isEmpty()) {
            return;
        }

        Project project = projectRepo.findById(projectId).orElse(null);
        if (project == null) {
            return;
        }

        try {
            runningAutomation.set(true);
            boolean taskMutated = false;

            for (AutomationRule rule : rules) {
                if (!rule.isActive()) {
                    continue;
                }

                // Check Trigger
                boolean triggered = false;
                if (rule.getTriggerType().equals("TASK_CREATED") && eventType.equals("TASK_CREATED")) {
                    triggered = true;
                } else if (rule.getTriggerType().equals("STATUS_CHANGED") && eventType.equals("STATUS_CHANGED")) {
                    String targetStatus = rule.getTriggerConfig();
                    if (targetStatus == null || targetStatus.isBlank() || targetStatus.equalsIgnoreCase("ANY")) {
                        triggered = oldStatus != null && !oldStatus.equals(newStatus);
                    } else {
                        triggered = targetStatus.equalsIgnoreCase(newStatus) && (oldStatus == null || !oldStatus.equalsIgnoreCase(newStatus));
                    }
                }

                if (!triggered) {
                    continue;
                }

                // Check Condition
                boolean conditionMet = false;
                String condType = rule.getConditionType();
                String condConfig = rule.getConditionConfig();

                if (condType == null || condType.equals("NONE")) {
                    conditionMet = true;
                } else if (condType.equals("PRIORITY_IS")) {
                    conditionMet = task.getPriority() != null && task.getPriority().name().equalsIgnoreCase(condConfig);
                } else if (condType.equals("IS_MILESTONE")) {
                    conditionMet = task.isMilestone();
                } else if (condType.equals("HAS_TAG")) {
                    conditionMet = task.getTags() != null && task.getTags().stream().anyMatch(t -> t.equalsIgnoreCase(condConfig));
                }

                if (!conditionMet) {
                    historyRepo.save(new AutomationHistory(projectId, rule.getId(), rule.getName(),
                            task.getId(), task.getTitle(), "SKIPPED", "Condition not met: " + condType + " = " + condConfig));
                    continue;
                }

                // Execute Action
                String actType = rule.getActionType();
                String actConfig = rule.getActionConfig();
                String runMessage = "";
                boolean success = false;

                try {
                    if (actType.equals("ASSIGN_TO_USER")) {
                        Long targetUserId = Long.parseLong(actConfig);
                        User targetUser = userRepo.findById(targetUserId).orElse(null);
                        if (targetUser != null) {
                            Set<Long> assignees = new HashSet<>(task.getAssigneeIds());
                            if (!assignees.contains(targetUserId)) {
                                assignees.add(targetUserId);
                                task.setAssigneeIds(assignees);
                                taskMutated = true;
                                notifications.notifyTaskAssigned(targetUser, task, project, actor);
                                taskMail.notifyAssigned(targetUser, task, project, actor);
                                runMessage = "Assigned task to user: " + targetUser.getFullName();
                                success = true;
                            } else {
                                runMessage = "User " + targetUser.getFullName() + " is already assigned.";
                                success = true;
                            }
                        } else {
                            runMessage = "Target user not found (ID: " + actConfig + ")";
                        }
                    } else if (actType.equals("SET_PRIORITY")) {
                        TaskPriority priority = TaskPriority.valueOf(actConfig.toUpperCase());
                        if (task.getPriority() != priority) {
                            task.setPriority(priority);
                            taskMutated = true;
                            runMessage = "Set task priority to " + priority;
                        } else {
                            runMessage = "Priority was already " + priority;
                        }
                        success = true;
                    } else if (actType.equals("MOVE_TO_STATUS")) {
                        if (project.getStages().contains(actConfig)) {
                            if (!actConfig.equals(task.getStatus())) {
                                String prevStatus = task.getStatus();
                                task.setStatus(actConfig);
                                taskMutated = true;
                                runMessage = "Moved task from '" + prevStatus + "' to '" + actConfig + "'";
                            } else {
                                runMessage = "Task is already in status '" + actConfig + "'";
                            }
                            success = true;
                        } else {
                            runMessage = "Target stage '" + actConfig + "' is not a valid workflow stage for this project.";
                        }
                    } else if (actType.equals("SEND_NOTIFICATION_TO_OWNER")) {
                        User owner = userRepo.findById(project.getOwnerId()).orElse(null);
                        if (owner != null) {
                            notifications.notifyTaskAssigned(owner, task, project, actor);
                            taskMail.notifyAssigned(owner, task, project, actor);
                            runMessage = "Sent notification to project owner: " + owner.getFullName();
                            success = true;
                        } else {
                            runMessage = "Project owner not found (ID: " + project.getOwnerId() + ")";
                        }
                    } else {
                        runMessage = "Unknown action type: " + actType;
                    }
                } catch (Exception e) {
                    runMessage = "Error executing action: " + e.getMessage();
                }

                historyRepo.save(new AutomationHistory(projectId, rule.getId(), rule.getName(),
                        task.getId(), task.getTitle(), success ? "SUCCESS" : "FAILED", runMessage));
            }

            if (taskMutated) {
                Task savedTask = taskRepo.save(task);
                Map<String, Object> dto = dto(savedTask);
                sseEvents.publish(projectId, "task.updated", dto);
            }

        } finally {
            runningAutomation.remove();
        }
    }

    private Map<String, Object> dto(Task t) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", t.getId());
        m.put("projectId", t.getProjectId());
        m.put("title", t.getTitle());
        m.put("description", t.getDescription());
        m.put("assigneeIds", new ArrayList<>(t.getAssigneeIds()));
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
