package gh.edu.techbridge.wms.notify;

import gh.edu.techbridge.wms.user.User;
import gh.edu.techbridge.wms.user.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

/**
 * In-app notification inbox (FR-NOTIF-002/003/006). Every endpoint is scoped strictly to the
 * current authenticated user — a user can only ever read or mark their OWN notifications.
 */
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository repo;
    private final UserRepository users;

    public NotificationController(NotificationRepository repo, UserRepository users) {
        this.repo = repo;
        this.users = users;
    }

    private User me(Authentication auth) {
        return users.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unknown user"));
    }

    /** Inbox list (own, reverse-chronological) + the current unread count. FR-NOTIF-002. */
    @GetMapping
    public Map<String, Object> list(@RequestParam(defaultValue = "false") boolean unread,
                                    @RequestParam(defaultValue = "30") int limit,
                                    Authentication auth) {
        User u = me(auth);
        int capped = Math.min(Math.max(limit, 1), 100);
        var page = PageRequest.of(0, capped);
        List<Notification> items = unread
                ? repo.findByRecipientIdAndReadFlagFalseOrderByCreatedAtDesc(u.getId(), page)
                : repo.findByRecipientIdOrderByCreatedAtDesc(u.getId(), page);
        long unreadCount = repo.countByRecipientIdAndReadFlagFalse(u.getId());
        return Map.of("items", items.stream().map(this::dto).toList(), "unreadCount", unreadCount);
    }

    /** Lightweight unread-count for the nav badge poll (FR-NOTIF-006). */
    @GetMapping("/unread-count")
    public Map<String, Long> unreadCount(Authentication auth) {
        return Map.of("count", repo.countByRecipientIdAndReadFlagFalse(me(auth).getId()));
    }

    /** Mark one of the caller's own notifications read (FR-NOTIF-003). */
    @PutMapping("/{id}/read")
    @Transactional
    public ResponseEntity<?> markRead(@PathVariable Long id, Authentication auth) {
        Long uid = me(auth).getId();
        return repo.findByIdAndRecipientId(id, uid).<ResponseEntity<?>>map(n -> {
            n.setReadFlag(true);
            repo.save(n);
            return ResponseEntity.ok(Map.of("id", n.getId(), "read", true));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Not found")));
    }

    /** Mark all of the caller's notifications read (FR-NOTIF-003). */
    @PutMapping("/read-all")
    @Transactional
    public Map<String, Object> markAllRead(Authentication auth) {
        int updated = repo.markAllRead(me(auth).getId());
        return Map.of("markedRead", updated);
    }

    private Map<String, Object> dto(Notification n) {
        var m = new java.util.HashMap<String, Object>();
        m.put("id", n.getId());
        m.put("type", n.getType());
        m.put("title", n.getTitle());
        m.put("body", n.getBody());
        m.put("projectId", n.getProjectId());
        m.put("taskId", n.getTaskId());
        m.put("read", n.isReadFlag());
        m.put("createdAt", n.getCreatedAt());
        return m;
    }
}
