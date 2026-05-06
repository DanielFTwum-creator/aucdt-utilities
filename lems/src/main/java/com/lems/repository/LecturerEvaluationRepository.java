package com.lems.repository;

import com.lems.model.LecturerEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LecturerEvaluationRepository extends JpaRepository<LecturerEvaluation, Long> {
    List<LecturerEvaluation> findByLecturerId(Long lecturerId);
    List<LecturerEvaluation> findByCourseId(Long courseId);
    List<LecturerEvaluation> findByLecturerIdAndCourseId(Long lecturerId, Long courseId);
}

