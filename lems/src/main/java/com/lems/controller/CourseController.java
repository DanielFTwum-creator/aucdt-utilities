package com.lems.controller;

import com.lems.model.Course;
import com.lems.model.dto.ApiResponse;
import com.lems.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
public class CourseController {
    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Course>>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(ApiResponse.success(courses, "Courses retrieved"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Course>> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id)
                .map(c -> ResponseEntity.ok(ApiResponse.success(c, "Course retrieved")))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Not found", "Course not found")));
    }

    @GetMapping("/programme/{programmeId}")
    public ResponseEntity<ApiResponse<List<Course>>> getCoursesByProgramme(@PathVariable Long programmeId) {
        List<Course> courses = courseService.getCoursesByProgramme(programmeId);
        return ResponseEntity.ok(ApiResponse.success(courses, "Courses retrieved"));
    }

    @GetMapping("/programme/{programmeId}/semester/{semester}")
    public ResponseEntity<ApiResponse<List<Course>>> getCoursesByProgrammeAndSemester(
            @PathVariable Long programmeId, @PathVariable Integer semester) {
        List<Course> courses = courseService.getCoursesByProgrammeAndSemester(programmeId, semester);
        return ResponseEntity.ok(ApiResponse.success(courses, "Courses retrieved"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Course>> createCourse(@RequestBody Course course) {
        Course created = courseService.createCourse(course);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Course created"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Course>> updateCourse(
            @PathVariable Long id, @RequestBody Course course) {
        try {
            Course updated = courseService.updateCourse(id, course);
            return ResponseEntity.ok(ApiResponse.success(updated, "Course updated"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), "Failed to update course"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Course deleted"));
    }
}

