package com.lems.service;

import com.lems.model.*;
import com.lems.model.dto.EvaluationSubmissionDTO;
import com.lems.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EvaluationService {
    private final LecturerEvaluationRepository evaluationRepository;
    private final LecturerRepository lecturerRepository;
    private final CourseRepository courseRepository;
    private final AuditLogRepository auditLogRepository;

    @Transactional
    public LecturerEvaluation submitEvaluation(EvaluationSubmissionDTO dto) {
        Lecturer lecturer = lecturerRepository.findById(dto.getLecturerId())
                .orElseThrow(() -> new RuntimeException("Lecturer not found"));
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        LecturerEvaluation evaluation = new LecturerEvaluation();
        evaluation.setLecturer(lecturer);
        evaluation.setCourse(course);
        evaluation.setStudentFeedback(dto.getStudentFeedback());

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

