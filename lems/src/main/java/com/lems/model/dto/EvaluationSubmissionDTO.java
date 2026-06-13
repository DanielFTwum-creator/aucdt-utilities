package com.lems.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationSubmissionDTO {
    private Long lecturerId;
    private Long courseId;
    private String studentFeedback;
    private Integer semester;
    private String recommend;
    private List<RatingDTO> ratings;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RatingDTO {
        private Integer criteriaNumber;
        private String criteriaName;
        private String section;
        private Integer rating;
    }
}
