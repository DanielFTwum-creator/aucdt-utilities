package gh.edu.techbridge.wms.task;

import gh.edu.techbridge.wms.project.Project;
import gh.edu.techbridge.wms.project.ProjectPermissionService;
import gh.edu.techbridge.wms.project.ProjectRepository;
import gh.edu.techbridge.wms.notify.Notification;
import gh.edu.techbridge.wms.notify.NotificationRepository;
import gh.edu.techbridge.wms.user.User;
import gh.edu.techbridge.wms.user.UserRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.Instant;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Controller handling task comments, activity logs, and attachments (FR-TASK-005, -006, -007).
 */
@RestController
@RequestMapping("/api/projects/{projectId}/tasks/{taskId}")
public class CollaborationController {

    private final ProjectRepository projects;
    private final TaskRepository tasks;
    private final UserRepository users;
    private final ProjectPermissionService perms;
    private final TaskCommentRepository comments;
    private final TaskActivityRepository activities;
    private final TaskAttachmentRepository attachments;
    private final NotificationRepository notifications;

    public CollaborationController(ProjectRepository projects, TaskRepository tasks, UserRepository users,
                                   ProjectPermissionService perms, TaskCommentRepository comments,
                                   TaskActivityRepository activities, TaskAttachmentRepository attachments,
                                   NotificationRepository notifications) {
        this.projects = projects;
        this.tasks = tasks;
        this.users = users;
        this.perms = perms;
        this.comments = comments;
        this.activities = activities;
        this.attachments = attachments;
        this.notifications = notifications;
    }

    private Task loadTask(Long projectId, Long taskId) {
        Project p = projects.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        Task t = tasks.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
        if (!t.getProjectId().equals(projectId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Task is not in the specified project");
        }
        return t;
    }

    // --- Comments (FR-TASK-005) ---

    public record CommentResponse(Long id, Long taskId, Long authorId, String authorName, String content, Instant createdAt) { }

    @GetMapping("/comments")
    @Transactional(readOnly = true)
    public List<CommentResponse> getComments(@PathVariable Long projectId, @PathVariable Long taskId, Authentication auth) {
        User user = perms.currentUser(auth);
        Project project = projects.findById(projectId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        perms.requireView(user, project);
        loadTask(projectId, taskId);

        List<TaskComment> commentList = comments.findByTaskIdOrderByCreatedAtAsc(taskId);
        
        // Load authors map
        Set<Long> authorIds = new HashSet<>();
        commentList.forEach(c -> authorIds.add(c.getAuthorId()));
        List<User> authors = users.findAllById(authorIds);
        Map<Long, String> authorNames = new HashMap<>();
        authors.forEach(u -> authorNames.put(u.getId(), u.getFullName()));

        return commentList.stream()
                .map(c -> new CommentResponse(
                        c.getId(),
                        c.getTaskId(),
                        c.getAuthorId(),
                        authorNames.getOrDefault(c.getAuthorId(), "Unknown User"),
                        c.getContent(),
                        c.getCreatedAt()
                ))
                .toList();
    }

    public record CreateCommentRequest(String content) { }

    @PostMapping("/comments")
    @Transactional
    public CommentResponse addComment(@PathVariable Long projectId, @PathVariable Long taskId,
                                      @RequestBody CreateCommentRequest req, Authentication auth) {
        User user = perms.currentUser(auth);
        Project project = projects.findById(projectId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        perms.requireView(user, project);
        perms.requireWritable(project);
        Task task = loadTask(projectId, taskId);

        if (req.content() == null || req.content().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment content cannot be empty");
        }

        TaskComment c = comments.save(new TaskComment(taskId, user.getId(), req.content().trim()));

        // Log task activity
        activities.save(new TaskActivity(taskId, user.getId(), "COMMENT_ADDED", "Added a comment."));

        // Scan for @mentions in comment content
        // Mentions look like @username or @username@domain.com
        Set<User> mentionedUsers = scanMentions(req.content());
        for (User recipient : mentionedUsers) {
            if (recipient.getId().equals(user.getId())) continue; // Skip self-mention
            notifications.save(new Notification(
                    recipient.getId(),
                    "TASK_MENTIONED",
                    "Mentioned in: " + task.getTitle(),
                    user.getFullName() + " mentioned you in a comment on task \"" + task.getTitle() + "\".",
                    projectId,
                    taskId
            ));
        }

        return new CommentResponse(c.getId(), c.getTaskId(), c.getAuthorId(), user.getFullName(), c.getContent(), c.getCreatedAt());
    }

    private Set<User> scanMentions(String text) {
        Set<User> found = new HashSet<>();
        if (text == null) return found;

        // Matches @ followed by username characters
        Pattern pattern = Pattern.compile("@([a-zA-Z0-9._-]+(?:@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4})?)");
        Matcher matcher = pattern.matcher(text);
        while (matcher.find()) {
            String mention = matcher.group(1).trim().toLowerCase();
            Optional<User> mentionedUserOpt = users.findByEmail(mention);
            if (!mentionedUserOpt.isPresent() && !mention.contains("@")) {
                mentionedUserOpt = users.findByEmail(mention + "@techbridge.edu.gh");
            }
            mentionedUserOpt.ifPresent(found::add);
        }
        return found;
    }

    // --- Activities (FR-TASK-006) ---

    public record ActivityResponse(Long id, Long taskId, Long actorId, String actorName, String actionType, String detail, Instant occurredAt) { }

    @GetMapping("/activity")
    @Transactional(readOnly = true)
    public List<ActivityResponse> getActivity(@PathVariable Long projectId, @PathVariable Long taskId, Authentication auth) {
        User user = perms.currentUser(auth);
        Project project = projects.findById(projectId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        perms.requireView(user, project);
        loadTask(projectId, taskId);

        List<TaskActivity> activityList = activities.findByTaskIdOrderByOccurredAtDesc(taskId);

        // Load actors map
        Set<Long> actorIds = new HashSet<>();
        activityList.forEach(a -> actorIds.add(a.getActorId()));
        List<User> actors = users.findAllById(actorIds);
        Map<Long, String> actorNames = new HashMap<>();
        actors.forEach(u -> actorNames.put(u.getId(), u.getFullName()));

        return activityList.stream()
                .map(a -> new ActivityResponse(
                        a.getId(),
                        a.getTaskId(),
                        a.getActorId(),
                        actorNames.getOrDefault(a.getActorId(), "Unknown User"),
                        a.getActionType(),
                        a.getDetail(),
                        a.getOccurredAt()
                ))
                .toList();
    }

    // --- Attachments (FR-TASK-007) ---

    public record AttachmentResponse(Long id, Long taskId, String fileName, String contentType, Long fileSize, Long uploadedById, String uploadedByName, Instant uploadedAt) { }

    @GetMapping("/attachments")
    @Transactional(readOnly = true)
    public List<AttachmentResponse> getAttachments(@PathVariable Long projectId, @PathVariable Long taskId, Authentication auth) {
        User user = perms.currentUser(auth);
        Project project = projects.findById(projectId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        perms.requireView(user, project);
        loadTask(projectId, taskId);

        List<TaskAttachment> attList = attachments.findByTaskIdOrderByUploadedAtDesc(taskId);

        // Load uploaders map
        Set<Long> uploaderIds = new HashSet<>();
        attList.forEach(a -> uploaderIds.add(a.getUploadedById()));
        List<User> uploaders = users.findAllById(uploaderIds);
        Map<Long, String> uploaderNames = new HashMap<>();
        uploaders.forEach(u -> uploaderNames.put(u.getId(), u.getFullName()));

        return attList.stream()
                .map(a -> new AttachmentResponse(
                        a.getId(),
                        a.getTaskId(),
                        a.getFileName(),
                        a.getContentType(),
                        a.getFileSize(),
                        a.getUploadedById(),
                        uploaderNames.getOrDefault(a.getUploadedById(), "Unknown User"),
                        a.getUploadedAt()
                ))
                .toList();
    }

    @PostMapping("/attachments")
    @Transactional
    public AttachmentResponse uploadAttachment(@PathVariable Long projectId, @PathVariable Long taskId,
                                               @RequestParam("file") MultipartFile file, Authentication auth) {
        User user = perms.currentUser(auth);
        Project project = projects.findById(projectId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        perms.requireView(user, project);
        perms.requireWritable(project);
        loadTask(projectId, taskId);

        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot upload empty file");
        }

        // Programmatically enforce 10MB limit (10 * 1024 * 1024 bytes)
        if (file.getSize() > 10L * 1024 * 1024) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File exceeds the 10MB size limit");
        }

        try {
            byte[] fileData = file.getBytes();
            String fileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "unnamed-file";
            String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";

            TaskAttachment attachment = attachments.save(new TaskAttachment(
                    taskId,
                    fileName,
                    contentType,
                    file.getSize(),
                    fileData,
                    user.getId()
            ));

            // Log activity
            activities.save(new TaskActivity(taskId, user.getId(), "ATTACHMENT_ADDED", "Uploaded file: " + fileName));

            return new AttachmentResponse(
                    attachment.getId(),
                    attachment.getTaskId(),
                    attachment.getFileName(),
                    attachment.getContentType(),
                    attachment.getFileSize(),
                    attachment.getUploadedById(),
                    user.getFullName(),
                    attachment.getUploadedAt()
            );

        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store file upload", e);
        }
    }

    @GetMapping("/attachments/{attachmentId}")
    @Transactional(readOnly = true)
    public ResponseEntity<byte[]> downloadAttachment(@PathVariable Long projectId, @PathVariable Long taskId,
                                                     @PathVariable Long attachmentId, Authentication auth) {
        User user = perms.currentUser(auth);
        Project project = projects.findById(projectId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        perms.requireView(user, project);
        loadTask(projectId, taskId);

        TaskAttachment att = attachments.findById(attachmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Attachment not found"));

        if (!att.getTaskId().equals(taskId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Attachment is not linked to this task");
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(att.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + att.getFileName() + "\"")
                .body(att.getFileData());
    }

    @DeleteMapping("/attachments/{attachmentId}")
    @Transactional
    public ResponseEntity<?> deleteAttachment(@PathVariable Long projectId, @PathVariable Long taskId,
                                              @PathVariable Long attachmentId, Authentication auth) {
        User user = perms.currentUser(auth);
        Project project = projects.findById(projectId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        perms.requireView(user, project);
        perms.requireWritable(project);
        loadTask(projectId, taskId);

        TaskAttachment att = attachments.findById(attachmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Attachment not found"));

        if (!att.getTaskId().equals(taskId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Attachment is not linked to this task");
        }

        attachments.delete(att);

        // Log activity
        activities.save(new TaskActivity(taskId, user.getId(), "ATTACHMENT_REMOVED", "Deleted file: " + att.getFileName()));

        return ResponseEntity.noContent().build();
    }
}
