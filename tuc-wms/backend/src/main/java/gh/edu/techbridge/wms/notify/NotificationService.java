package gh.edu.techbridge.wms.notify;

import gh.edu.techbridge.wms.project.Project;
import gh.edu.techbridge.wms.task.Task;
import gh.edu.techbridge.wms.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Creates persistent in-app notifications (FR-NOTIF) — the readable-later counterpart to the
 * assignment email. Called from the same task-event trigger as TaskMailService, so in-app and
 * email stay in lockstep. Strictly per-recipient; never notifies the actor of their own action.
 */
@Service
public class NotificationService {

    private final NotificationRepository repo;

    public NotificationService(NotificationRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public void notifyTaskAssigned(User recipient, Task task, Project project, User actor) {
        if (recipient == null || !recipient.isActive()) return;
        if (actor != null && actor.getId() != null && actor.getId().equals(recipient.getId())) return; // no self-notify
        String who = actor == null ? "A project owner" : actor.getFullName();
        String title = "Assigned: " + task.getTitle();
        String body = who + " assigned you a task in " + project.getName() + ".";
        repo.save(new Notification(recipient.getId(), "TASK_ASSIGNED", trim(title, 200), trim(body, 500),
                project.getId(), task.getId()));
    }

    private static String trim(String s, int max) {
        if (s == null) return null;
        return s.length() <= max ? s : s.substring(0, max - 1) + "…";
    }
}
