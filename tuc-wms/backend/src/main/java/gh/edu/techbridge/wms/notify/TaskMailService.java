package gh.edu.techbridge.wms.notify;

import gh.edu.techbridge.wms.config.AuthProperties;
import gh.edu.techbridge.wms.project.Project;
import gh.edu.techbridge.wms.task.Task;
import gh.edu.techbridge.wms.user.User;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Builds and sends the rich "you've been assigned a task" email (FR-NOTIF / FR-TASK-005),
 * styled to match the institutional TUC email standard (rotating campus-video header frame +
 * maroon #6b0020 / gold #f5a800 overlay + TUC crest, table-based for email-client safety).
 * Sent async via the hosted gateway so task assignment never waits on email I/O.
 */
@Service
public class TaskMailService {

    // Shared institutional crest, 120px/17KB (scaled from the 5334px/1.1MB original) —
    // Gmail's image proxy renders it reliably; usable by all TUC apps.
    private static final String LOGO = "https://techbridge.edu.gh/static/TUC_LOGO_small.png";
    // 12 frames extracted from the campus tour video — the signature TUC rotating header.
    private static final String CAMPUS_BASE = "https://techbridge.edu.gh/static/campus_frame_";
    private static final int CAMPUS_FRAME_COUNT = 12;
    private static final AtomicInteger frameCounter = new AtomicInteger(0);

    private final MailGatewayClient gateway;
    private final String frontendBase;

    public TaskMailService(MailGatewayClient gateway, AuthProperties authProps) {
        this.gateway = gateway;
        this.frontendBase = authProps.getFrontendBase();
    }

    private static String nextCampusFrame() {
        int n = Math.floorMod(frameCounter.getAndIncrement(), CAMPUS_FRAME_COUNT) + 1;
        return CAMPUS_BASE + n + ".jpg";
    }

    @Async
    public void notifyAssigned(User recipient, Task task, Project project, User assigner) {
        if (recipient == null || !recipient.isActive()) return;
        String subject = "You've been assigned: " + task.getTitle();
        // Deep-link to the task on its project board (CallbackPage/ProjectDetail opens ?task=).
        String link = frontendBase + "/projects/" + project.getId() + "?task=" + task.getId();
        gateway.send(recipient.getEmail(), recipient.getFullName(), subject,
                html(recipient, task, project, assigner, link));
    }

    private String html(User to, Task task, Project project, User assigner, String link) {
        String campusImg = nextCampusFrame();
        String priority = task.getPriority() == null ? "—" : cap(task.getPriority().name());
        String due = task.getDueDate() == null ? "No due date" : task.getDueDate().toString();
        String assignerName = assigner == null ? "A project owner" : esc(assigner.getFullName());
        String firstName = to.getFullName() == null ? "there" : esc(to.getFullName().split(" ")[0]);

        return "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\">"
            + "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"></head>"
            + "<body style=\"margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;\">"
            + "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#f4f4f4;padding:32px 0;\"><tr><td align=\"center\">"
            + "<table width=\"560\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);\">"
            // Header — rotating campus-video frame behind a maroon overlay (institutional TUC look)
            + "<tr><td style=\"padding:0;background:#3d0010;background-image:url('" + campusImg + "');background-size:cover;background-position:center;text-align:center;height:200px;\" background=\"" + campusImg + "\">"
            + "<!--[if gte mso 9]><v:rect xmlns:v=\"urn:schemas-microsoft-com:vml\" fill=\"true\" stroke=\"false\" style=\"width:560px;height:200px;\"><v:fill type=\"frame\" src=\"" + campusImg + "\" color=\"#3d0010\"/><v:textbox inset=\"0,0,0,0\"><![endif]-->"
            + "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:rgba(63,0,16,0.68);\"><tr><td style=\"padding:28px 32px;text-align:center;height:200px;vertical-align:middle;\">"
            + "<img src=\"" + LOGO + "\" alt=\"Techbridge University College\" width=\"60\" height=\"60\" style=\"display:block;margin:0 auto 10px;border-radius:50%;background:#fff;padding:4px;\" />"
            + "<div style=\"color:#f5a800;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:5px;\">Techbridge University College</div>"
            + "<div style=\"color:#ffffff;font-size:18px;font-weight:700;letter-spacing:1px;\">Work Management System</div>"
            + "</td></tr></table>"
            + "<!--[if gte mso 9]></v:textbox></v:rect><![endif]-->"
            + "</td></tr>"
            // Body
            + "<tr><td style=\"padding:40px 32px;\">"
            + "<p style=\"margin:0 0 8px;font-size:15px;color:#444;\">Hi <strong>" + firstName + "</strong>,</p>"
            + "<p style=\"margin:0 0 24px;font-size:14px;color:#666;line-height:1.6;\">"
            + assignerName + " assigned you a task in <strong>" + esc(project.getName()) + "</strong>.</p>"
            // Task card
            + "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#f9f9f9;border:1px solid #eee;border-radius:8px;margin-bottom:28px;\">"
            + "<tr><td style=\"padding:18px 20px;\">"
            + "<div style=\"font-size:16px;font-weight:700;color:#1c1612;margin-bottom:10px;\">" + esc(task.getTitle()) + "</div>"
            + "<div style=\"font-size:13px;color:#666;line-height:1.8;\">"
            + "<span style=\"display:inline-block;background:#6b0020;color:#fff;border-radius:999px;padding:2px 10px;font-size:11px;font-weight:700;margin-right:8px;\">" + priority + " priority</span>"
            + "Due: <strong>" + esc(due) + "</strong></div>"
            + "</td></tr></table>"
            // CTA
            + "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tr><td align=\"center\" style=\"padding:0 0 28px;\">"
            + "<a href=\"" + link + "\" style=\"display:inline-block;background:#6b0020;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:15px 38px;border-radius:8px;letter-spacing:0.5px;\">View in WMS &rarr;</a>"
            + "</td></tr></table>"
            + "<p style=\"margin:0;font-size:11px;color:#aaa;word-break:break-all;line-height:1.6;\">Or open: <a href=\"" + link + "\" style=\"color:#6b0020;\">" + link + "</a></p>"
            + "</td></tr>"
            // Footer
            + "<tr><td style=\"background:#f9f9f9;border-top:1px solid #eee;padding:16px 32px;text-align:center;\">"
            + "<p style=\"margin:0;font-size:11px;color:#bbb;\">&copy; " + Year.now() + " Techbridge University College &middot; Oyibi, Greater Accra, Ghana</p>"
            + "</td></tr>"
            + "</table></td></tr></table></body></html>";
    }

    private static String cap(String s) { return s.isEmpty() ? s : s.charAt(0) + s.substring(1).toLowerCase(); }

    private static String esc(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
