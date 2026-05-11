package gh.edu.tuc.send.controller;

import gh.edu.tuc.send.dto.JobRequest;
import gh.edu.tuc.send.entity.ExecutionInstance;
import gh.edu.tuc.send.entity.ReportJob;
import gh.edu.tuc.send.service.ReportJobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobController {

    private final ReportJobService jobService;

    @GetMapping
    public Page<ReportJob> listJobs(@PageableDefault(size = 20) Pageable pageable) {
        return jobService.listJobs(pageable);
    }

    @GetMapping("/{id}")
    public ReportJob getJob(@PathVariable Long id) {
        return jobService.getJob(id);
    }

    @SuppressWarnings("null")
    @PostMapping
    public ResponseEntity<ReportJob> createJob(@Valid @RequestBody JobRequest req,
                                               Authentication auth) {
        ReportJob created = jobService.createJob(req, auth.getName());
        return ResponseEntity
                .created(URI.create("/api/jobs/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    public ReportJob updateJob(@PathVariable Long id,
                               @Valid @RequestBody JobRequest req,
                               Authentication auth) {
        return jobService.updateJob(id, req, auth.getName());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable Long id,
                                             @RequestParam ReportJob.JobStatus status,
                                             Authentication auth) {
        jobService.updateStatus(id, status, auth.getName());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/run")
    public ExecutionInstance triggerRun(@PathVariable Long id, Authentication auth) {
        return jobService.triggerExecution(id, auth.getName());
    }

    @GetMapping("/{id}/executions")
    public Page<ExecutionInstance> getJobExecutions(@PathVariable Long id,
                                                    @PageableDefault(size = 10) Pageable pageable) {
        return jobService.getExecutions(id, pageable);
    }
}
