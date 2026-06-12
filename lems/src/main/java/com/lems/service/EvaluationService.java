package com.lems.service;

import com.lems.model.*;
import com.lems.model.dto.EvaluationSubmissionDTO;
import com.lems.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EvaluationService {
    private final LecturerEvaluationRepository evaluationRepository;
    private final LecturerRepository lecturerRepository;
    private final CourseRepository courseRepository;
    private final AuditLogRepository auditLogRepository;

    /** Server-side salt for the anonymising dedupe hash — set LEMS_DEDUPE_SALT in prod. */
    @Value("${lems.dedupe-salt:change-me-in-prod}")
    private String dedupeSalt;

    /**
     * @param submitterEmail verified @techbridge.edu.gh identity from WMS SSO — used ONLY
     *                       to derive the anonymous dedupe hash; never persisted.
     */
    @Transactional
    public LecturerEvaluation submitEvaluation(EvaluationSubmissionDTO dto, String submitterEmail) {
        Lecturer lecturer = lecturerRepository.findById(dto.getLecturerId())
                .orElseThrow(() -> new RuntimeException("Lecturer not found"));
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        String dedupeHash = sha256(submitterEmail.toLowerCase().trim()
                + "|" + dto.getLecturerId() + "|" + dto.getCourseId() + "|" + dedupeSalt);
        if (evaluationRepository.existsByDedupeHash(dedupeHash)) {
            throw new RuntimeException("You have already submitted an evaluation for this lecturer and course.");
        }

        LecturerEvaluation evaluation = new LecturerEvaluation();
        evaluation.setLecturer(lecturer);
        evaluation.setCourse(course);
        evaluation.setStudentFeedback(dto.getStudentFeedback());
        evaluation.setDedupeHash(dedupeHash);

        LecturerEvaluation saved = evaluationRepository.save(evaluation);

        // Save ratings
        if (dto.getRatings() != null) {
            for (Map.Entry<Integer, Integer> entry : dto.getRatings().entrySet()) {
                EvaluationRating rating = new EvaluationRating();
                rating.setEvaluation(saved);
                rating.setCriteriaNumber(entry.getKey());
                rating.setRating(entry.getValue());
                saved.getRatings().add(rating);
            }
            evaluationRepository.save(saved);
        }

        // Log the event
        AuditLog log = new AuditLog();
        log.setEventType("EVALUATION_SUBMITTED");
        log.setDescription("New evaluation submitted for " + lecturer.getFullName());
        log.setStatus("SUCCESS");
        log.setDetails("Lecturer: " + lecturer.getFullName() + ", Course: " + course.getName());
        auditLogRepository.save(log);

        return saved;
    }

    private static String sha256(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(md.digest(input.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }

    public List<LecturerEvaluation> getEvaluationsByLecturer(Long lecturerId) {
        return evaluationRepository.findByLecturerId(lecturerId);
    }

    public List<LecturerEvaluation> getEvaluationsByCourse(Long courseId) {
        return evaluationRepository.findByCourseId(courseId);
    }

    public List<LecturerEvaluation> getAllEvaluations() {
        return evaluationRepository.findAll();
    }
}

