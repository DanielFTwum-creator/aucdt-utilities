package com.lems.controller;

import com.lems.model.LecturerEvaluation;
import com.lems.model.dto.ApiResponse;
import com.lems.model.dto.EvaluationSubmissionDTO;
import com.lems.security.WmsAuthFilter;
import com.lems.security.WmsIdentity;
import com.lems.service.EvaluationService;
import jakarta.servlet.http.HttpServletRequest;
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
            @RequestBody EvaluationSubmissionDTO dto, HttpServletRequest request) {
        try {
            WmsIdentity identity = (WmsIdentity) request.getAttribute(WmsAuthFilter.IDENTITY_ATTR);
            LecturerEvaluation evaluation = evaluationService.submitEvaluation(dto, identity.email());
            return ResponseEntity.ok(ApiResponse.success(evaluation, "Evaluation submitted successfully"));
        } catch (EvaluationService.DuplicateEvaluationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage(), "Duplicate submission"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
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
