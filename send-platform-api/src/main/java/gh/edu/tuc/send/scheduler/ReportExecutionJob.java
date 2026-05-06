package gh.edu.tuc.send.scheduler;

import gh.edu.tuc.send.entity.ExecutionInstance;
import gh.edu.tuc.send.entity.ReportJob;
import gh.edu.tuc.send.repository.ExecutionInstanceRepository;
import gh.edu.tuc.send.repository.ReportJobRepository;
import gh.edu.tuc.send.service.AuditService;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Instant;

/**
 * Quartz job fired for each scheduled ReportJob.
 * Simulates report execution — replace executeReport() with real engine calls.
 */
@Component
@Slf4j
public class ReportExecutionJob implements Job {

    @Autowired private ReportJobRepository jobRepo;
    @Autowired private ExecutionInstanceRepository execRepo;
    @Autowired private AuditService auditService;

    @Override
    public void execute(JobExecutionContext context) {
        JobDataMap data = context.getMergedJobDataMap();
        Long jobId = data.getLong("jobId");

        ReportJob reportJob = jobRepo.findById(jobId).orElse(null);
        if (reportJob == null || reportJob.getStatus() != ReportJob.JobStatus.ACTIVE) {
            log.warn("Skipping scheduled execution for job {}: not active", jobId);
            return;
        }

        var exec = new ExecutionInstance();
        exec.setJob(reportJob);
        exec.setStatus(ExecutionInstance.ExecutionStatus.RUNNING);
        exec = execRepo.save(exec);

        long start = System.currentTimeMillis();
        try {
            executeReport(reportJob);
            exec.setStatus(ExecutionInstance.ExecutionStatus.COMPLETED);
            exec.setDurationMs(System.currentTimeMillis() - start);
            auditService.log("scheduler", "SCHEDULED_RUN", "Job #" + jobId);
            log.info("Scheduled execution completed for job {} in {}ms", jobId, exec.getDurationMs());
        } catch (Exception e) {
            exec.setStatus(ExecutionInstance.ExecutionStatus.FAILED);
            exec.setErrorMessage(e.getMessage());
            exec.setDurationMs(System.currentTimeMillis() - start);
            auditService.log("scheduler", "SCHEDULED_RUN_FAILED", "Job #" + jobId,
                    gh.edu.tuc.send.entity.AuditLog.AuditStatus.FAILURE, e.getMessage());
            log.error("Scheduled execution failed for job {}: {}", jobId, e.getMessage());
        } finally {
            exec.setCompletedAt(Instant.now());
            execRepo.save(exec);

            // Update schedule.lastRunAt
            if (reportJob.getSchedule() != null) {
                reportJob.getSchedule().setLastRunAt(Instant.now());
                jobRepo.save(reportJob);
            }
        }
    }

    /**
     * Core report generation logic.
     * Replace with integration to your report engine (JasperReports, Apache POI, etc.).
     */
    private void executeReport(ReportJob job) throws Exception {
        log.info("Executing report '{}' (format: {}, definition: {}chars)",
                job.getName(),
                job.getOutputFormat(),
                job.getJsonDefinition() != null ? job.getJsonDefinition().length() : 0);
        // Simulate processing time
        Thread.sleep(500);
    }
}
