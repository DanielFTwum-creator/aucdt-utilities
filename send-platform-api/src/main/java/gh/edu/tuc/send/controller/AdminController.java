package gh.edu.tuc.send.controller;

import gh.edu.tuc.send.entity.AuditLog;
import gh.edu.tuc.send.entity.ExecutionInstance;
import gh.edu.tuc.send.repository.ExecutionInstanceRepository;
import gh.edu.tuc.send.repository.ReportJobRepository;
import gh.edu.tuc.send.repository.UserRepository;
import gh.edu.tuc.send.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AuditService auditService;
    private final ReportJobRepository jobRepo;
    private final ExecutionInstanceRepository execRepo;
    private final UserRepository userRepo;

    @GetMapping("/audit-logs")
    public Page<AuditLog> getAuditLogs(@PageableDefault(size = 50) Pageable pageable,
                                       @RequestParam(required = false) String actor) {
        return actor != null
                ? auditService.getLogsByActor(actor, pageable)
                : auditService.getLogs(pageable);
    }

    @GetMapping("/metrics")
    public Map<String, Object> getMetrics() {
        long totalJobs = jobRepo.count();
        long totalUsers = userRepo.count();
        long completedExecs = execRepo.countByStatus(ExecutionInstance.ExecutionStatus.COMPLETED);
        long failedExecs = execRepo.countByStatus(ExecutionInstance.ExecutionStatus.FAILED);
        long runningExecs = execRepo.countByStatus(ExecutionInstance.ExecutionStatus.RUNNING);

        return Map.of(
                "totalJobs", totalJobs,
                "totalUsers", totalUsers,
                "executions", Map.of(
                        "completed", completedExecs,
                        "failed", failedExecs,
                        "running", runningExecs
                )
        );
    }
}
