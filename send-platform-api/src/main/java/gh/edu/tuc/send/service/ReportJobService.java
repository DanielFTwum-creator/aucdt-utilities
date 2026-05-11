package gh.edu.tuc.send.service;

import gh.edu.tuc.send.dto.JobRequest;
import gh.edu.tuc.send.entity.*;
import gh.edu.tuc.send.repository.ExecutionInstanceRepository;
import gh.edu.tuc.send.repository.ReportJobRepository;
import gh.edu.tuc.send.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportJobService {

    private final ReportJobRepository jobRepo;
    private final ExecutionInstanceRepository execRepo;
    private final UserRepository userRepo;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public Page<ReportJob> listJobs(Pageable pageable) {
        return jobRepo.findByStatusNot(ReportJob.JobStatus.DELETED, pageable);
    }

    @SuppressWarnings("null")
    @Transactional(readOnly = true)
    public ReportJob getJob(Long id) {
        return jobRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Job not found: " + id));
    }

    public ReportJob createJob(JobRequest req, String ownerUsername) {
        User owner = userRepo.findByUsername(ownerUsername)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + ownerUsername));

        var job = new ReportJob();
        applyRequest(job, req);
        job.setOwner(owner);

        if (req.schedule() != null) {
            job.setSchedule(buildSchedule(req, job));
        }

        ReportJob saved = jobRepo.save(job);
        auditService.log(ownerUsername, "CREATE_JOB", "Job #" + saved.getId());
        return saved;
    }

    @SuppressWarnings("null")
    public ReportJob updateJob(Long id, JobRequest req, String actor) {
        ReportJob job = getJob(id);
        applyRequest(job, req);

        if (req.schedule() != null) {
            Schedule sched = job.getSchedule() != null ? job.getSchedule() : buildSchedule(req, job);
            sched.setCronExpression(req.schedule().cronExpression());
            sched.setTimezone(req.schedule().timezone() != null ? req.schedule().timezone() : "Africa/Accra");
            sched.setActive(req.schedule().active());
            job.setSchedule(sched);
        }

        ReportJob saved = jobRepo.save(job);
        auditService.log(actor, "UPDATE_JOB", "Job #" + id);
        return saved;
    }

    public void updateStatus(Long id, ReportJob.JobStatus status, String actor) {
        ReportJob job = getJob(id);
        job.setStatus(status);
        jobRepo.save(job);
        auditService.log(actor, "STATUS_CHANGE_" + status.name(), "Job #" + id);
    }

    public ExecutionInstance triggerExecution(Long jobId, String actor) {
        ReportJob job = getJob(jobId);
        if (job.getStatus() != ReportJob.JobStatus.ACTIVE) {
            throw new IllegalStateException("Cannot run job with status: " + job.getStatus());
        }

        var exec = new ExecutionInstance();
        exec.setJob(job);
        exec.setStatus(ExecutionInstance.ExecutionStatus.QUEUED);
        ExecutionInstance saved = execRepo.save(exec);

        auditService.log(actor, "RUN_JOB", "Job #" + jobId);
        return saved;
    }

    @Transactional(readOnly = true)
    public Page<ExecutionInstance> getExecutions(Long jobId, Pageable pageable) {
        return execRepo.findByJobId(jobId, pageable);
    }

    @SuppressWarnings("null")
    @Transactional(readOnly = true)
    public Page<ExecutionInstance> getAllExecutions(Pageable pageable) {
        return execRepo.findAll(pageable);
    }

    private void applyRequest(ReportJob job, JobRequest req) {
        job.setName(req.name());
        job.setDescription(req.description());
        job.setJsonDefinition(req.jsonDefinition());
        job.setOutputFormat(req.outputFormat());
        job.setPriority(req.priority());
        job.setMaxRetries(req.maxRetries() > 0 ? req.maxRetries() : 3);
        job.setTimeoutSeconds(req.timeoutSeconds() > 0 ? req.timeoutSeconds() : 300);
    }

    private Schedule buildSchedule(JobRequest req, ReportJob job) {
        var s = new Schedule();
        s.setJob(job);
        s.setCronExpression(req.schedule().cronExpression());
        s.setTimezone(req.schedule().timezone() != null ? req.schedule().timezone() : "Africa/Accra");
        s.setActive(req.schedule().active());
        return s;
    }
}
