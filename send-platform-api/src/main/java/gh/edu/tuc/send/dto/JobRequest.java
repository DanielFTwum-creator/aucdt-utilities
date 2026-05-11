package gh.edu.tuc.send.dto;

import gh.edu.tuc.send.entity.ReportJob;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record JobRequest(
        @NotBlank String name,
        String description,
        String jsonDefinition,
        @NotNull ReportJob.OutputFormat outputFormat,
        @Min(1) @Max(10) int priority,
        int maxRetries,
        int timeoutSeconds,
        ScheduleRequest schedule
) {}
