package gh.edu.tuc.send.scheduler;

import gh.edu.tuc.send.entity.ReportJob;
import gh.edu.tuc.send.entity.Schedule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.TimeZone;

/**
 * Manages Quartz triggers for ReportJob schedules.
 * Call scheduleJob() when a job is created/updated, unscheduleJob() when paused/deleted.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SchedulerService {

    private final Scheduler scheduler;

    private static final String GROUP = "report-jobs";

    public void scheduleJob(ReportJob job) throws SchedulerException {
        Schedule s = job.getSchedule();
        if (s == null || !s.isActive()) return;

        JobKey jobKey = new JobKey("job-" + job.getId(), GROUP);
        TriggerKey triggerKey = new TriggerKey("trigger-" + job.getId(), GROUP);

        // Remove existing trigger if present
        if (scheduler.checkExists(triggerKey)) {
            scheduler.unscheduleJob(triggerKey);
        }

        JobDetail detail = JobBuilder.newJob(ReportExecutionJob.class)
                .withIdentity(jobKey)
                .usingJobData("jobId", job.getId())
                .storeDurably()
                .build();

        TimeZone tz = TimeZone.getTimeZone(
                ZoneId.of(s.getTimezone() != null ? s.getTimezone() : "Africa/Accra"));

        CronTrigger trigger = TriggerBuilder.newTrigger()
                .withIdentity(triggerKey)
                .forJob(jobKey)
                .withSchedule(CronScheduleBuilder.cronSchedule(s.getCronExpression())
                        .inTimeZone(tz))
                .build();

        scheduler.addJob(detail, true);
        scheduler.scheduleJob(trigger);
        log.info("Scheduled job #{} with cron '{}' ({})", job.getId(), s.getCronExpression(), s.getTimezone());
    }

    public void unscheduleJob(Long jobId) throws SchedulerException {
        TriggerKey triggerKey = new TriggerKey("trigger-" + jobId, GROUP);
        if (scheduler.checkExists(triggerKey)) {
            scheduler.unscheduleJob(triggerKey);
            log.info("Unscheduled job #{}", jobId);
        }
    }
}
