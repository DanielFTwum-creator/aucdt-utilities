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
                .orElseThrow(() -> new RuntimeException("Lecturer not found: " + dto.getLecturerId()));
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found: " + dto.getCourseId()));

        String dedupeHash = sha256(submitterEmail.toLowerCase().trim()
                + "|" + dto.getLecturerId() + "|" + dto.getCourseId() + "|" + dedupeSalt);
        if (evaluationRepository.existsByDedupeHash(dedupeHash)) {
            throw new DuplicateEvaluationException(
                    "You have already submitted an evaluation for this lecturer and course.");
        }

        LecturerEvaluation evaluation = new LecturerEvaluation();
        evaluation.setLecturer(lecturer);
        evaluation.setCourse(course);
        evaluation.setStudentFeedback(dto.getStudentFeedback());
        evaluation.setSemester(dto.getSemester());
        evaluation.setRecommend(dto.getRecommend());
        evaluation.setDedupeHash(dedupeHash);

        LecturerEvaluation saved = evaluationRepository.save(evaluation);

        if (dto.getRatings() != null) {
            for (EvaluationSubmissionDTO.RatingDTO r : dto.getRatings()) {
                EvaluationRating rating = new EvaluationRating();
                rating.setEvaluation(saved);
                rating.setCriteriaNumber(r.getCriteriaNumber());
                rating.setCriteriaName(r.getCriteriaName());
                rating.setSection(r.getSection());
                rating.setRating(r.getRating());
                saved.getRatings().add(rating);
            }
            evaluationRepository.save(saved);
        }

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

    /** Thrown when the dedupe hash matches an existing record. */
    public static class DuplicateEvaluationException extends RuntimeException {
        public DuplicateEvaluationException(String msg) { super(msg); }
    }
}
