package com.lems.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationSubmissionDTO {
    private Long lecturerId;
    private Long courseId;
    private String studentFeedback;
    private Map<Integer, Integer> ratings; // criteriaNumber -> rating
}

