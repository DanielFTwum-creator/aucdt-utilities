package com.lems.service;

import com.lems.model.Course;
import com.lems.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    public List<Course> getCoursesByProgramme(Long programmeId) {
        return courseRepository.findByProgrammeId(programmeId);
    }

    public List<Course> getCoursesByProgrammeAndSemester(Long programmeId, Integer semester) {
        return courseRepository.findByProgrammeIdAndSemester(programmeId, semester);
    }

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public Course updateCourse(Long id, Course course) {
        return courseRepository.findById(id)
                .map(existing -> {
                    existing.setName(course.getName());
                    existing.setCode(course.getCode());
                    existing.setDescription(course.getDescription());
                    existing.setSemester(course.getSemester());
                    return courseRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }
}

