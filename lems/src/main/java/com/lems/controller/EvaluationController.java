package com.lems.controller;

import com.lems.model.LecturerEvaluation;
import com.lems.model.dto.ApiResponse;
import com.lems.model.dto.EvaluationSubmissionDTO;
import com.lems.service.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/evaluations")
@RequiredArgsConstructor
public class EvaluationController {
    private final EvaluationService evaluationService;

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<LecturerEvaluation>> submitEvaluation(
            @RequestBody EvaluationSubmissionDTO dto) {
        try {
            LecturerEvaluation evaluation = evaluationService.submitEvaluation(dto);
            return ResponseEntity.ok(ApiResponse.success(evaluation, "Evaluation submitted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage(), "Failed to submit evaluation"));
        }
    }

    @GetMapping("/lecturer/{lecturerId}")
    public ResponseEntity<ApiResponse<List<LecturerEvaluation>>> getEvaluationsByLecturer(
            @PathVariable Long lecturerId) {
        List<LecturerEvaluation> evaluations = evaluationService.getEvaluationsByLecturer(lecturerId);
        return ResponseEntity.ok(ApiResponse.success(evaluations, "Evaluations retrieved"));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<LecturerEvaluation>>> getEvaluationsByCourse(
            @PathVariable Long courseId) {
        List<LecturerEvaluation> evaluations = evaluationService.getEvaluationsByCourse(courseId);
        return ResponseEntity.ok(ApiResponse.success(evaluations, "Evaluations retrieved"));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<LecturerEvaluation>>> getAllEvaluations() {
        List<LecturerEvaluation> evaluations = evaluationService.getAllEvaluations();
        return ResponseEntity.ok(ApiResponse.success(evaluations, "All evaluations retrieved"));
    }
}

