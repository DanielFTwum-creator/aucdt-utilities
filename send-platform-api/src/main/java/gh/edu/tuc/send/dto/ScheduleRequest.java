package gh.edu.tuc.send.dto;

import jakarta.validation.constraints.NotBlank;

public record ScheduleRequest(
        @NotBlank String cronExpression,
        String timezone,
        boolean active
) {}
